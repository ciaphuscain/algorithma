import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { adjacency, graphInput, graphPreset, toTraceGraph, type GraphInputValue } from "../inputs";
import { mstEdgesFidelity, spanningForestCheck } from "./common";
import type { MstOutput } from "./kruskal";

const LIMITS = { maxNodes: 20, maxEdges: 50, minWeight: -99, maxWeight: 99 };
const WEIGHTED = { directed: false, weighted: true, limits: LIMITS };

const entry = (v: string, k: number) => `${v}:${k}`;

/**
 * Prim's algorithm with a priority queue of "vertex:key" entries and lazy deletion,
 * the same queue discipline as the Dijkstra module, so the two can be compared:
 * Prim's key is the weight of one edge into the tree, not a path length.
 */
export const prim: AlgorithmModule<GraphInputValue, MstOutput> = {
  id: "prim",
  version: 1,
  pseudocode: [
    "procedure Prim(G, s)",
    "  key[v] ← ∞ for every v;  key[s] ← 0",
    "  insert (s, 0) into PQ",
    "  while PQ is not empty",
    "    (u, k) ← extract-min(PQ)",
    "    if u is already in the tree: continue   // stale entry",
    "    add u to the tree, joined by the edge parent[u]–u",
    "    for each edge (u, v) with weight w",
    "      if v is not in the tree and w < key[v]",
    "        key[v] ← w;  parent[v] ← u",
    "        insert (v, w) into PQ",
    "  return the tree edges",
  ],
  input: graphInput({
    ...WEIGHTED,
    presets: [
      {
        id: "classic",
        label: "Seven-vertex network",
        value: graphPreset(
          "A-B:7, A-D:5, B-C:8, B-D:9, B-E:7, C-E:5, D-E:15, D-F:6, E-F:8, E-G:9, F-G:11",
          "A",
          WEIGHTED,
        ),
      },
      {
        id: "not-dijkstra",
        label: "Not a shortest-path tree",
        value: graphPreset("S-A:2, S-B:2, A-B:1, A-C:2, B-C:2", "S", WEIGHTED),
      },
      {
        id: "disconnected",
        label: "Only the start's component",
        value: graphPreset("A-B:3, B-C:1, A-C:2, D-E:4", "A", WEIGHTED),
      },
    ],
  }),

  run(input, t) {
    const G = t.graph("G", { ...toTraceGraph(input), label: "Graph" });
    const PQ = t.sequence("PQ", "priority", { label: "Priority queue (vertex:key)" });
    const adj = adjacency(input);
    const key = new Map<string, number>();
    const parent = new Map<string, { u: string; edge: string; w: number }>();
    const inTree = new Set<string>();
    const pq: { v: string; k: number }[] = [];
    const s = input.source;
    const edges: MstOutput["edges"] = [];
    let total = 0;

    key.set(s, 0);
    G.annotate(s, "k=0", { line: 2, vars: { s }, note: `Start the tree at ${s} (key 0).` });
    pq.push({ v: s, k: 0 });
    PQ.push(entry(s, 0), { line: 3 });
    G.node(s, "frontier", { line: 3 });

    while (pq.length > 0) {
      let best = 0;
      for (let i = 1; i < pq.length; i++) {
        const a = pq[i]!;
        const b = pq[best]!;
        if (a.k < b.k || (a.k === b.k && a.v < b.v)) best = i;
      }
      const { v: u, k } = pq.splice(best, 1)[0]!;
      t.tally("extractions");
      PQ.popAt(best, {
        line: 5,
        vars: { u, k, v: null, w: null },
        note: `Extract the cheapest entry, ${entry(u, k)}.`,
      });
      if (inTree.has(u)) {
        t.step({ line: 6, note: `${u} is already in the tree; this entry is stale. Skip it.` });
        continue;
      }
      inTree.add(u);
      const via = parent.get(u);
      if (via) {
        edges.push([via.u, u, via.w]);
        total += via.w;
        G.edge(via.edge, "tree", {
          line: 7,
          vars: { total },
          note: `Add ${u} with edge ${via.u}–${u} (weight ${via.w}): the cheapest edge leaving the tree. Total ${total}.`,
        });
      }
      G.node(u, "current", {
        line: 7,
        note: via ? `${u} joins the tree.` : `${u} is the first vertex of the tree.`,
      });
      for (const { to: v, edge, weight: w } of adj.get(u)!) {
        if (inTree.has(v)) continue;
        const current = key.get(v);
        t.tally("edge checks");
        G.edge(edge, "examining", {
          line: 9,
          vars: { v, w },
          note: `Edge ${u}–${v} (weight ${w}): is ${w} < key[${v}] = ${current ?? "∞"}?`,
        });
        if (current === undefined || w < current) {
          const old = parent.get(v);
          if (old) {
            G.edge(old.edge, "rejected", {
              line: 10,
              note: `${old.u}–${v} is no longer the cheapest way to reach ${v}.`,
            });
          }
          key.set(v, w);
          parent.set(v, { u, edge, w });
          G.edge(edge, "relaxed", {
            line: 10,
            note: `Yes: key[${v}] = ${w}, parent[${v}] = ${u}.`,
          });
          G.annotate(v, `k=${w}`, { line: 10 });
          G.node(v, "frontier", { line: 11 });
          pq.push({ v, k: w });
          PQ.push(entry(v, w), { line: 11 });
        } else {
          const chosen = parent.get(v)?.edge === edge;
          G.edge(edge, chosen ? "relaxed" : "rejected", {
            line: 9,
            note: `No: ${w} ≥ ${current}. ${v} can be reached more cheaply.`,
          });
        }
      }
      G.node(u, "visited", { line: 4, vars: { v: null, w: null } });
    }

    for (const n of input.nodes) {
      if (!inTree.has(n.id))
        G.node(n.id, "unreachable", {
          line: 12,
          note: `${n.id} is not connected to ${s}, so no spanning tree from ${s} can include it.`,
        });
    }
    const output: MstOutput = { edges, total };
    t.finish(input, output, {
      line: 12,
      vars: { u: null, k: null },
      note: `The queue is empty: ${edges.length} tree edges, total weight ${total}.`,
    });
    return output;
  },

  check: (input, out) => spanningForestCheck(input, out, input.source),
  fidelity: (state: TraceState, out) => mstEdgesFidelity(state, out),
  describeOutput: (out) =>
    `Total weight ${out.total}: ${out.edges.map(([a, b, w]) => `${a}–${b} (${w})`).join(", ") || "no edges"}`,
};
