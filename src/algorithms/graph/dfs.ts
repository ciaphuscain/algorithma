import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { adjacency, graphInput, graphPreset, toTraceGraph, type GraphInputValue } from "../inputs";

export interface DfsOutput {
  /** Discovery and finish times (1-based); null when unreachable from the source. */
  disc: Record<string, number | null>;
  fin: Record<string, number | null>;
  parent: Record<string, string | null>;
  /** Vertices in discovery order (preorder). */
  order: string[];
}

const LIMITS = { maxNodes: 26, maxEdges: 60 };
const UNDIRECTED = { directed: false, weighted: false, limits: LIMITS };

/**
 * Recursive depth-first search from one source on an undirected graph. The call
 * stack is shown explicitly as a stack structure, so recursion is visible.
 */
export const dfs: AlgorithmModule<GraphInputValue, DfsOutput> = {
  id: "dfs",
  version: 1,
  pseudocode: [
    "procedure DFS(G, s)",
    "  time ← 0;  visit(s)",
    "procedure visit(u)",
    "  time ← time + 1;  disc[u] ← time",
    "  for each neighbour v of u",
    "    if v is undiscovered",
    "      parent[v] ← u;  visit(v)",
    "    else if v is on the call stack and v ≠ parent[u]",
    "      (u, v) is a back edge: it closes a cycle",
    "  time ← time + 1;  fin[u] ← time",
  ],
  input: graphInput({
    ...UNDIRECTED,
    presets: [
      {
        id: "small",
        label: "Small graph",
        value: graphPreset("A-B, A-C, B-D, C-D, D-E, C-F", "A", UNDIRECTED),
      },
      {
        id: "tree",
        label: "Tree (no cycles)",
        value: graphPreset("A-B, A-C, B-D, B-E, C-F, C-G", "A", UNDIRECTED),
      },
      {
        id: "cycles",
        label: "Two cycles",
        value: graphPreset("A-B, B-C, C-A, C-D, D-E, E-F, F-D", "A", UNDIRECTED),
      },
      {
        id: "disconnected",
        label: "Disconnected",
        value: graphPreset("A-B, B-C, D-E", "A", UNDIRECTED),
      },
    ],
  }),

  run(input, t) {
    const G = t.graph("G", { ...toTraceGraph(input), label: "Graph" });
    const S = t.sequence("S", "stack", { label: "Call stack" });
    const adj = adjacency(input);
    const disc: Record<string, number | null> = {};
    const fin: Record<string, number | null> = {};
    const parent: Record<string, string | null> = {};
    const onStack = new Set<string>();
    const order: string[] = [];
    for (const n of input.nodes) {
      disc[n.id] = null;
      fin[n.id] = null;
      parent[n.id] = null;
    }
    let time = 0;
    t.step({ line: 2, vars: { time }, note: `Start the search at ${input.source}.` });

    const visit = (u: string) => {
      time++;
      disc[u] = time;
      onStack.add(u);
      order.push(u);
      S.push(`visit(${u})`, { line: 3, vars: { u, v: null }, note: `Call visit(${u}).` });
      if (parent[u] !== null) G.node(parent[u]!, "frontier", { line: 3 });
      G.node(u, "current", { line: 4, vars: { time }, note: `Discover ${u} at time ${time}.` });
      G.annotate(u, `${time}/–`, { line: 4 });
      for (const { to: v, edge } of adj.get(u)!) {
        if (disc[v] === null) {
          G.edge(edge, "tree", {
            line: 7,
            vars: { v },
            note: `${v} is undiscovered: go deeper along ${u}–${v}.`,
          });
          parent[v] = u;
          visit(v);
          G.node(u, "current", {
            line: 5,
            vars: { u, v: null },
            note: `Back in visit(${u}); continue with its neighbours.`,
          });
        } else if (onStack.has(v) && v !== parent[u]) {
          G.edge(edge, "back", {
            line: 9,
            vars: { v },
            note: `${v} is still on the call stack: ${u}–${v} is a back edge, so the graph has a cycle.`,
          });
        } else {
          t.step({
            line: 6,
            vars: { v },
            note:
              v === parent[u]
                ? `${v} is ${u}'s parent; skip the tree edge.`
                : `${v} is already finished; skip it.`,
          });
        }
      }
      time++;
      fin[u] = time;
      onStack.delete(u);
      G.node(u, "visited", {
        line: 10,
        vars: { time, v: null },
        note: `All neighbours of ${u} explored: finish ${u} at time ${time}.`,
      });
      G.annotate(u, `${disc[u]}/${time}`, { line: 10 });
      S.pop({ line: 10, note: `Return from visit(${u}).` });
    };

    visit(input.source);
    for (const n of input.nodes) {
      if (disc[n.id] === null) {
        G.node(n.id, "unreachable", {
          line: 2,
          note: `${n.id} is not reachable from ${input.source}.`,
        });
      }
    }
    const output: DfsOutput = { disc, fin, parent, order };
    t.finish(input, output, {
      vars: { u: null, v: null },
      note: "The call stack is empty: DFS is complete.",
    });
    return output;
  },

  check(input, out) {
    // Reachability by an independent fixpoint, then the structural theorems of DFS.
    const reach = new Set([input.source]);
    for (let changed = true; changed;) {
      changed = false;
      for (const e of input.edges) {
        for (const [a, b] of [
          [e.from, e.to],
          [e.to, e.from],
        ] as const) {
          if (reach.has(a) && !reach.has(b)) {
            reach.add(b);
            changed = true;
          }
        }
      }
    }
    const times: number[] = [];
    for (const n of input.nodes) {
      const [d, f] = [out.disc[n.id], out.fin[n.id]];
      if (reach.has(n.id) !== (d !== null))
        return `${n.id}: discovered = ${d !== null}, reachable = ${reach.has(n.id)}`;
      if (d === null) continue;
      if (f === null || f === undefined || f <= d!) return `${n.id}: invalid interval ${d}/${f}`;
      times.push(d!, f);
    }
    // All 2k timestamps are exactly 1..2k.
    times.sort((a, b) => a - b);
    if (times.some((v, i) => v !== i + 1)) return "timestamps are not 1..2k";
    const ancestor = (a: string, b: string) =>
      out.disc[a]! <= out.disc[b]! && out.fin[b]! <= out.fin[a]!;
    for (const e of input.edges) {
      if (!reach.has(e.from)) continue;
      // Parenthesis theorem + no cross edges in undirected DFS: every edge joins an ancestor and a descendant.
      if (!ancestor(e.from, e.to) && !ancestor(e.to, e.from))
        return `edge ${e.from}–${e.to} joins unrelated vertices`;
    }
    for (const n of input.nodes) {
      const p = out.parent[n.id];
      if (p === null || p === undefined) continue;
      if (
        !input.edges.some((e) => (e.from === p && e.to === n.id) || (e.to === p && e.from === n.id))
      ) {
        return `parent ${p} of ${n.id} is not a neighbour`;
      }
      if (!ancestor(p, n.id)) return `parent ${p} is not an ancestor of ${n.id}`;
    }
    return null;
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.G;
    if (!g || g.kind !== "graph") return "no graph G";
    for (const [v, d] of Object.entries(out.disc)) {
      const want = d === null ? undefined : `${d}/${out.fin[v]}`;
      if (g.annotations[v] !== want) return `node ${v} shows ${g.annotations[v]}, expected ${want}`;
    }
    const S = state.structures.S;
    if (!S || S.kind !== "sequence" || S.items.length !== 0)
      return "call stack should be empty at the end";
    return null;
  },

  describeOutput: (out) => `Discovery order: ${out.order.join(" → ")}`,
};
