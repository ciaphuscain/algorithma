import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { edgeId } from "../inputs";

export interface BipartiteInput {
  left: string[];
  right: string[];
  /** Edges as [left vertex, right vertex]. */
  edges: [string, string][];
}

export interface MatchingOutput {
  size: number;
  /** Matched pairs [left, right], by left vertex. */
  matching: [string, string][];
  phases: number;
}

const ID = /^[A-Za-z0-9]{1,3}$/;
const MAX_SIDE = 8;
const MAX_EDGES = 24;

const input: InputSpec<BipartiteInput> = {
  fields: [
    {
      name: "edges",
      label: "Edges (left-right)",
      placeholder: "e.g. A-1, A-2, B-1, C-2, C-3",
      multiline: true,
      help: "The first vertex of each pair is on the left side, the second on the right; no vertex may be on both sides.",
    },
  ],
  constraints: `Up to ${MAX_SIDE} vertices per side and ${MAX_EDGES} edges; ids are 1–3 letters or digits.`,
  parse(fields) {
    const errors: string[] = [];
    const edges: [string, string][] = [];
    const keys = new Set<string>();
    for (const token of (fields.edges ?? "")
      .split(/[,;\n]+/)
      .map((x) => x.trim())
      .filter(Boolean)) {
      const ends = token.split(/\s*-\s*/);
      if (ends.length !== 2 || !ID.test(ends[0]!) || !ID.test(ends[1]!)) {
        errors.push(`"${token}" is not an edge like A-1`);
        continue;
      }
      const key = `${ends[0]}-${ends[1]}`;
      if (keys.has(key)) errors.push(`Duplicate edge ${key}`);
      keys.add(key);
      edges.push([ends[0]!, ends[1]!]);
    }
    const left = [...new Set(edges.map((e) => e[0]))].sort();
    const right = [...new Set(edges.map((e) => e[1]))].sort();
    for (const v of left) if (right.includes(v)) errors.push(`"${v}" appears on both sides`);
    if (edges.length === 0) errors.push("Enter at least one edge");
    if (left.length > MAX_SIDE || right.length > MAX_SIDE)
      errors.push(`At most ${MAX_SIDE} vertices per side`);
    if (edges.length > MAX_EDGES) errors.push(`${edges.length} edges; the limit is ${MAX_EDGES}`);
    return errors.length
      ? { ok: false, errors: errors.slice(0, 5) }
      : { ok: true, value: { left, right, edges } };
  },
  format: (v) => ({ edges: v.edges.map(([a, b]) => `${a}-${b}`).join(", ") }),
  presets: [
    {
      id: "classic",
      label: "Five applicants, five jobs",
      value: {
        left: ["A", "B", "C", "D", "E"],
        right: ["1", "2", "3", "4", "5"],
        edges: [
          ["A", "1"],
          ["A", "2"],
          ["B", "1"],
          ["C", "2"],
          ["C", "3"],
          ["D", "3"],
          ["D", "4"],
          ["E", "4"],
          ["E", "5"],
        ],
      },
    },
    {
      id: "deficient",
      label: "Three compete for two (no perfect matching)",
      value: {
        left: ["A", "B", "C"],
        right: ["1", "2"],
        edges: [
          ["A", "1"],
          ["B", "1"],
          ["B", "2"],
          ["C", "1"],
          ["C", "2"],
        ],
      },
    },
    {
      id: "chain",
      label: "A long augmenting path",
      value: {
        left: ["A", "B", "C", "D"],
        right: ["1", "2", "3", "4"],
        edges: [
          ["A", "1"],
          ["A", "2"],
          ["B", "2"],
          ["B", "3"],
          ["C", "3"],
          ["C", "4"],
          ["D", "1"],
        ],
      },
    },
  ],
  random(rng, size) {
    const n = Math.max(1, Math.min(MAX_SIDE, Math.ceil((size ?? 8) / 2)));
    const left = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
    const right = Array.from({ length: n }, (_, i) => String(i + 1));
    const edges: [string, string][] = [];
    for (const l of left)
      for (const r of right) if (rng.next() < 0.35 && edges.length < MAX_EDGES) edges.push([l, r]);
    if (edges.length === 0) edges.push([left[0]!, right[0]!]);
    const used = (i: 0 | 1) => [...new Set(edges.map((e) => e[i]))].sort();
    return { left: used(0), right: used(1), edges };
  },
};

/**
 * Hopcroft–Karp: in each phase, a BFS from all free left vertices layers the graph by
 * alternating paths (unmatched edges left→right, matched edges right→left); then DFS
 * finds a maximal set of vertex-disjoint shortest augmenting paths, and all of them are
 * flipped. O(√V) phases suffice, for O(E√V) in total.
 */
export const hopcroftKarp: AlgorithmModule<BipartiteInput, MatchingOutput> = {
  id: "hopcroft-karp",
  version: 1,
  pseudocode: [
    "procedure HopcroftKarp(L, R, E)",
    "  M ← the empty matching",
    "  repeat",
    "    BFS from every free left vertex: unmatched edges L → R, matched edges R → L, up to the first layer with a free right vertex",
    "    if no free right vertex was reached: stop",
    "    for each free left vertex u: DFS along layers (dist + 1 each step) to a free right vertex in that layer",
    "      if one is found: flip the path (matched ↔ unmatched); M grows by one",
    "  return M",
  ],
  input,

  run(input, t) {
    const { left, right, edges } = input;
    const y = (i: number, n: number) => (n === 1 ? 0.5 : 0.08 + (0.84 * i) / (n - 1));
    const G = t.graph("G", {
      directed: false,
      nodes: [
        ...left.map((id, i) => ({ id, x: 0.2, y: y(i, left.length) })),
        ...right.map((id, i) => ({ id, x: 0.8, y: y(i, right.length) })),
      ],
      edges: edges.map(([a, b]) => ({ id: edgeId(a, b), from: a, to: b })),
    });
    const adj = new Map<string, string[]>(left.map((l) => [l, []]));
    for (const [a, b] of edges) adj.get(a)!.push(b);
    for (const list of adj.values()) list.sort();
    const mateL = new Map<string, string | null>(left.map((l) => [l, null]));
    const mateR = new Map<string, string | null>(right.map((r) => [r, null]));
    let phases = 0;
    let size = 0;

    const paint = (line: number) => {
      for (const [a, b] of edges)
        G.edge(edgeId(a, b), mateL.get(a) === b ? "tree" : "idle", { line });
    };

    for (;;) {
      // BFS layering.
      const dist = new Map<string, number>();
      const queue: string[] = [];
      for (const n of [...left, ...right]) G.annotate(n, null, { line: 4 });
      for (const l of left)
        if (mateL.get(l) === null) {
          dist.set(l, 0);
          queue.push(l);
          G.annotate(l, "d0", { line: 4 });
        }
      // shortest: the layer of left vertices adjacent to a free right vertex, if any.
      let shortest = Infinity;
      while (queue.length > 0) {
        const u = queue.shift()!;
        if (dist.get(u)! >= shortest) continue;
        for (const r of adj.get(u)!) {
          const m = mateR.get(r)!;
          if (m === null) shortest = Math.min(shortest, dist.get(u)!);
          else if (!dist.has(m)) {
            dist.set(m, dist.get(u)! + 1);
            G.annotate(r, `d${dist.get(u)! * 2 + 1}`, { line: 4 });
            G.annotate(m, `d${dist.get(m)! * 2}`, { line: 4 });
            queue.push(m);
          }
        }
      }
      if (shortest === Infinity) {
        t.step({
          line: 5,
          note: "No alternating path reaches a free right vertex: the matching is maximum.",
        });
        break;
      }
      phases++;
      t.tally("phases");
      t.step({
        line: 4,
        vars: { phase: phases, size },
        note: `Phase ${phases}: layers built from the free left vertices.`,
      });
      const dead = new Set<string>();
      const before = size;
      const dfs = (u: string, path: [string, string][]): boolean => {
        for (const r of adj.get(u)!) {
          const m = mateR.get(r)!;
          const ends = m === null && dist.get(u) === shortest;
          const deeper =
            m !== null && !dead.has(m) && dist.get(m) === dist.get(u)! + 1 && dfs(m, path);
          if (ends || deeper) {
            path.unshift([u, r]);
            return true;
          }
        }
        dead.add(u);
        return false;
      };
      for (const u of left) {
        if (mateL.get(u) !== null) continue;
        const path: [string, string][] = [];
        if (!dfs(u, path)) continue;
        for (const [a, b] of path) G.edge(edgeId(a, b), "path", { line: 6 });
        t.step({
          line: 6,
          note: `Augmenting path from ${u}: ${path.map(([a, b]) => `${a}–${b}`).join(", ")} (with the matched edges between them).`,
        });
        for (const [a, b] of path) {
          mateL.set(a, b);
          mateR.set(b, a);
        }
        for (const [a] of path) dead.add(a); // keep this phase's paths vertex-disjoint
        size++;
        t.tally("augmenting paths");
        paint(7);
        t.step({ line: 7, vars: { size }, note: `Flip it: the matching grows to ${size}.` });
      }
      // The BFS found a shortest augmenting path, so the DFS must find at least one.
      if (size === before) throw new Error("a phase found no augmenting path");
    }
    for (const n of [...left, ...right])
      G.node(n, (mateL.get(n) ?? mateR.get(n) ?? null) === null ? "unvisited" : "path", {
        line: 8,
      });
    const matching = left
      .filter((l) => mateL.get(l) !== null)
      .map((l): [string, string] => [l, mateL.get(l)!]);
    const output: MatchingOutput = { size, matching, phases };
    t.finish(input, output, {
      line: 8,
      vars: { phase: null },
      note: `Maximum matching of size ${size} after ${phases} phase${phases === 1 ? "" : "s"}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: Kuhn's simple augmenting-path algorithm for the size;
    // validity of the reported matching.
    const usedL = new Set<string>();
    const usedR = new Set<string>();
    const edgeSet = new Set(input.edges.map(([a, b]) => `${a}-${b}`));
    for (const [a, b] of out.matching) {
      if (!edgeSet.has(`${a}-${b}`)) return `${a}–${b} is not an edge`;
      if (usedL.has(a) || usedR.has(b)) return `${a} or ${b} is matched twice`;
      usedL.add(a);
      usedR.add(b);
    }
    if (out.matching.length !== out.size) return "size does not match the pairs";
    const mate = new Map<string, string>();
    const tryKuhn = (u: string, seen: Set<string>): boolean => {
      for (const [a, b] of input.edges) {
        if (a !== u || seen.has(b)) continue;
        seen.add(b);
        if (!mate.has(b) || tryKuhn(mate.get(b)!, seen)) {
          mate.set(b, u);
          return true;
        }
      }
      return false;
    };
    let best = 0;
    for (const u of input.left) if (tryKuhn(u, new Set())) best++;
    if (out.size !== best) return `matching of size ${out.size}, but the maximum is ${best}`;
    const V = input.left.length + input.right.length;
    if (out.phases > 2 * Math.sqrt(V) + 2) return `${out.phases} phases exceed 2√V + 2`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.G;
    if (g?.kind !== "graph") return "no graph G";
    const matched = Object.entries(g.edgeStatus)
      .filter(([, s]) => s === "tree")
      .map(([id]) => id)
      .sort();
    const want = out.matching.map(([a, b]) => edgeId(a, b)).sort();
    return JSON.stringify(matched) === JSON.stringify(want) ? null : `drawn matching ${matched}`;
  },

  describeOutput: (out) =>
    `Maximum matching ${out.size}: ${out.matching.map(([a, b]) => `${a}–${b}`).join(", ") || "none"}`,
};
