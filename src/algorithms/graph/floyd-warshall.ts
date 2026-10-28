import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import {
  clamp,
  graphInput,
  graphPreset,
  randomGraph,
  toTraceGraph,
  type GraphInputValue,
} from "../inputs";

export interface FloydWarshallOutput {
  ids: string[];
  /** dist[i][j], null for "no path". Meaningless on pairs a negative cycle affects. */
  dist: (number | null)[][];
  negativeCycle: boolean;
}

const LIMITS = { maxNodes: 8, maxEdges: 30, minWeight: -99, maxWeight: 99 };
const DIRECTED = { directed: true, weighted: true, limits: LIMITS, withSource: false };
const INF = "∞";

const spec = graphInput({
  ...DIRECTED,
  presets: [
    {
      id: "classic",
      label: "Four vertices, one negative edge",
      value: graphPreset("A->C:-2, B->A:4, B->C:3, C->D:2, D->B:-1", "", DIRECTED),
    },
    {
      id: "chain",
      label: "Paths through several vertices",
      value: graphPreset("A->B:3, B->C:4, C->D:5, A->D:20, D->A:1", "", DIRECTED),
    },
    {
      id: "cycle",
      label: "Negative cycle",
      value: graphPreset("A->B:1, B->C:-3, C->A:1, C->D:2", "", DIRECTED),
    },
  ],
});

/**
 * Floyd–Warshall all-pairs shortest paths, with vertices in id order. In round k, d[i][j] may improve by
 * routing through vertex k; rows with d[i][k] = ∞ are skipped as a whole because no
 * entry in them can improve through k.
 */
export const floydWarshall: AlgorithmModule<GraphInputValue, FloydWarshallOutput> = {
  id: "floyd-warshall",
  version: 1,
  pseudocode: [
    "procedure FloydWarshall(G)",
    "  d[i][j] ← w(i, j) for each edge;  d[i][i] ← 0;  every other d[i][j] ← ∞",
    "  for each vertex k",
    "    for each vertex i",
    "      if d[i][k] = ∞: skip row i   // no path i ⇝ k to extend",
    "      for each vertex j",
    "        if d[i][k] + d[k][j] < d[i][j]",
    "          d[i][j] ← d[i][k] + d[k][j]   // going through k is shorter",
    "  if some d[i][i] < 0: a negative cycle exists",
    "  return d",
  ],
  input: {
    ...spec,
    random: (rng, size) => {
      const nodes = clamp(size ?? 5, 2, LIMITS.maxNodes);
      return randomGraph(rng, {
        directed: true,
        weighted: true,
        nodes,
        extraEdges: Math.min(nodes, LIMITS.maxEdges - nodes + 1),
        minWeight: -2,
        maxWeight: 9,
      });
    },
  },

  run(input, t) {
    const ids = input.nodes.map((n) => n.id).sort();
    const n = ids.length;
    const ix = new Map(ids.map((v, i) => [v, i]));
    const G = t.graph("G", { ...toTraceGraph(input), label: "Graph" });
    const D = t.grid("D", n, n, INF, {
      label: "d[i][j]: shortest known distance from row to column",
      rowHeaders: ids,
      colHeaders: ids,
    });
    const d: (number | null)[][] = ids.map(() => ids.map(() => null));
    for (let i = 0; i < n; i++) {
      d[i]![i] = 0;
      D.write(i, i, 0, { line: 2 });
    }
    for (const e of input.edges) {
      const [a, b] = [ix.get(e.from)!, ix.get(e.to)!];
      d[a]![b] = e.weight ?? 1;
      D.write(a, b, e.weight ?? 1, { line: 2 });
    }
    t.step({
      line: 2,
      note: "Start with direct edges only: d[i][j] is the edge weight, 0 on the diagonal, ∞ where there is no edge.",
    });

    const all = (k: number): [number, number][] => [
      ...ids.map((_, j): [number, number] => [k, j]),
      ...ids.map((_, i): [number, number] => [i, k]).filter(([i]) => i !== k),
    ];
    for (let k = 0; k < n; k++) {
      const via = ids[k]!;
      G.node(via, "current", { line: 3 });
      D.mark(all(k), "active", {
        line: 3,
        vars: { k: via, i: null, j: null },
        note: `Round ${k + 1}: allow paths to pass through ${via}. Only row and column ${via} (shaded) are needed.`,
      });
      for (let i = 0; i < n; i++) {
        if (i === k) continue;
        const dik = d[i]![k]!;
        if (dik === null) {
          t.step({
            line: 5,
            vars: { i: ids[i]!, j: null },
            note: `d[${ids[i]}][${via}] = ∞: no path from ${ids[i]} to ${via}, so row ${ids[i]} cannot improve.`,
          });
          continue;
        }
        for (let j = 0; j < n; j++) {
          if (j === k) continue;
          const dkj = d[k]![j]!;
          const dij = d[i]![j]!;
          t.tally("candidate checks");
          D.read(
            [
              [i, k],
              [k, j],
              [i, j],
            ],
            {
              line: 7,
              vars: { i: ids[i]!, j: ids[j]! },
              note:
                dkj === null
                  ? `d[${via}][${ids[j]}] = ∞, so going through ${via} cannot reach ${ids[j]}.`
                  : `Is ${dik} + ${dkj} = ${dik + dkj} < d[${ids[i]}][${ids[j]}] = ${dij ?? "∞"}?`,
            },
          );
          if (dkj === null) continue;
          if (dij === null || dik + dkj < dij) {
            d[i]![j] = dik + dkj;
            D.write(i, j, dik + dkj, {
              line: 8,
              note: `Yes: ${ids[i]} ⇝ ${via} ⇝ ${ids[j]} costs ${dik + dkj}.`,
            });
          }
        }
      }
      D.mark(all(k), null, { line: 3 });
      G.node(via, "visited", { line: 3 });
    }

    const negativeCycle = ids.some((_, i) => d[i]![i]! < 0);
    if (negativeCycle) {
      const cells = ids.map((_, i): [number, number] => [i, i]).filter(([i]) => d[i]![i]! < 0);
      D.mark(cells, "path", {
        line: 9,
        vars: { k: null, i: null, j: null },
        note: `A negative diagonal entry means a cycle of negative total weight passes through ${cells
          .map(([i]) => ids[i])
          .join(", ")}: shortest distances are undefined for pairs that can use it.`,
      });
    }
    const output: FloydWarshallOutput = { ids, dist: d, negativeCycle };
    t.finish(input, output, {
      line: 10,
      vars: { k: null, i: null, j: null },
      note: negativeCycle
        ? "Done, but the graph has a negative cycle."
        : "Done: every entry is a shortest-path distance.",
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: Bellman–Ford from every vertex.
    const ids = input.nodes.map((n) => n.id).sort();
    if (JSON.stringify(out.ids) !== JSON.stringify(ids)) return "vertex order differs";
    let cycle = false;
    const rows = ids.map((s) => {
      const dist = new Map<string, number>(ids.map((v) => [v, v === s ? 0 : Infinity]));
      for (let r = 0; r < ids.length - 1; r++)
        for (const e of input.edges) {
          const c = dist.get(e.from)! + (e.weight ?? 1);
          if (c < dist.get(e.to)!) dist.set(e.to, c);
        }
      for (const e of input.edges)
        if (dist.get(e.from)! + (e.weight ?? 1) < dist.get(e.to)!) cycle = true;
      return ids.map((v) => (dist.get(v) === Infinity ? null : dist.get(v)!));
    });
    if (out.negativeCycle !== cycle)
      return `negativeCycle = ${out.negativeCycle}, expected ${cycle}`;
    if (cycle) return null;
    for (let i = 0; i < ids.length; i++)
      for (let j = 0; j < ids.length; j++)
        if (out.dist[i]![j] !== rows[i]![j])
          return `d[${ids[i]}][${ids[j]}] = ${out.dist[i]![j]}, expected ${rows[i]![j]}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.D;
    if (!g || g.kind !== "grid") return "no grid D";
    for (let i = 0; i < out.ids.length; i++)
      for (let j = 0; j < out.ids.length; j++) {
        const want: Scalar = out.dist[i]![j] ?? INF;
        if (g.cells[i]![j] !== want) return `cell ${i},${j} shows ${String(g.cells[i]![j])}`;
      }
    return null;
  },

  describeOutput: (out) =>
    out.negativeCycle
      ? "The graph has a negative cycle: some shortest distances are undefined."
      : out.ids
          .map(
            (v, i) => `${v}: ${out.dist[i]!.map((x, j) => `${out.ids[j]}=${x ?? "∞"}`).join(" ")}`,
          )
          .join("; "),
};
