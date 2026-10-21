import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { adjacency, graphInput, graphPreset, toTraceGraph, type GraphInputValue } from "../inputs";

export interface TopoOutput {
  order: string[];
  /** True when some vertices could not be ordered because they lie on or behind a cycle. */
  hasCycle: boolean;
}

const LIMITS = { maxNodes: 20, maxEdges: 50 };
const DIRECTED = { directed: true, weighted: false, limits: LIMITS, withSource: false };

/**
 * Kahn's algorithm. There is no start vertex: every vertex with no incoming edges
 * starts in the queue (ties in id order).
 */
export const topologicalSort: AlgorithmModule<GraphInputValue, TopoOutput> = {
  id: "topological-sort",
  version: 1,
  pseudocode: [
    "procedure kahn(G)",
    "  indeg[v] ← number of edges into v, for every v",
    "  enqueue every v with indeg[v] = 0",
    "  while Q is not empty",
    "    u ← dequeue(Q);  append u to the order",
    "    for each edge u → v",
    "      indeg[v] ← indeg[v] − 1   // remove the edge",
    "      if indeg[v] = 0: enqueue v",
    "  if the order has fewer than |V| vertices: G has a cycle",
  ],
  input: graphInput({
    ...DIRECTED,
    presets: [
      {
        id: "courses",
        label: "Course prerequisites",
        value: graphPreset("A->C, B->C, B->D, C->E, D->E, E->F, D->F", "", DIRECTED),
      },
      {
        id: "chain",
        label: "A single chain",
        value: graphPreset("A->B, B->C, C->D, D->E", "", DIRECTED),
      },
      {
        id: "cycle",
        label: "Contains a cycle",
        value: graphPreset("A->B, B->C, C->D, D->B, C->E", "", DIRECTED),
      },
      {
        id: "independent",
        label: "Independent tasks",
        value: graphPreset("A->B, C->D, E", "", DIRECTED),
      },
    ],
  }),

  run(input, t) {
    const G = t.graph("G", { ...toTraceGraph(input), label: "Dependency graph" });
    const Q = t.sequence("Q", "queue", { label: "Ready queue (in-degree 0)" });
    const ids = input.nodes.map((n) => n.id);
    const O = t.array(
      "O",
      ids.map((): Scalar => null),
      { label: "Topological order", display: "cells" },
    );
    const adj = adjacency(input);
    const indeg: Record<string, number> = {};
    for (const v of ids) indeg[v] = 0;
    for (const e of input.edges) indeg[e.to]! += 1;

    for (const v of ids) G.annotate(v, `in=${indeg[v]}`, { line: 2 });
    t.step({
      line: 2,
      note: "Count the incoming edges of every vertex. A vertex is ready once nothing points into it.",
    });
    for (const v of [...ids].sort()) {
      if (indeg[v] === 0) {
        G.node(v, "frontier", { line: 3 });
        Q.push(v, { line: 3, note: `${v} has no prerequisites: enqueue it.` });
      }
    }

    const order: string[] = [];
    while (Q.size > 0) {
      const u = Q.peekAll()[0] as string;
      Q.pop({ line: 5, vars: { u, v: null } });
      G.node(u, "current", {
        line: 5,
        note: `Dequeue ${u}: everything it depends on is already placed.`,
      });
      O.write(order.length, u, { line: 5 });
      order.push(u);
      for (const { to: v, edge } of adj.get(u)!) {
        indeg[v]! -= 1;
        G.edge(edge, "rejected", {
          line: 7,
          vars: { v },
          note: `Remove ${u} → ${v}; ${v} now has ${indeg[v]} incoming edge${indeg[v] === 1 ? "" : "s"}.`,
        });
        G.annotate(v, `in=${indeg[v]}`, { line: 7 });
        if (indeg[v] === 0) {
          G.node(v, "frontier", { line: 8 });
          Q.push(v, { line: 8, note: `${v} is now ready: enqueue it.` });
        }
      }
      G.node(u, "visited", { line: 4, vars: { v: null } });
    }

    const hasCycle = order.length < ids.length;
    if (hasCycle) {
      for (const v of ids) {
        if (!order.includes(v))
          G.node(v, "unreachable", {
            line: 9,
            note: `${v} still has incoming edges: it lies on or behind a cycle.`,
          });
      }
    }
    const output: TopoOutput = { order, hasCycle };
    t.finish(input, output, {
      line: 9,
      vars: { u: null },
      note: hasCycle
        ? `Only ${order.length} of ${ids.length} vertices could be ordered: the graph has a cycle, so no topological order exists.`
        : `All ${ids.length} vertices are ordered. Every edge points from earlier to later.`,
    });
    return output;
  },

  check(input, out) {
    const ids = input.nodes.map((n) => n.id);
    // Independent cycle check: repeatedly delete sinks; a remaining vertex means a cycle.
    const remaining = new Set(ids);
    for (let changed = true; changed;) {
      changed = false;
      for (const v of [...remaining]) {
        if (!input.edges.some((e) => e.from === v && remaining.has(e.to))) {
          remaining.delete(v);
          changed = true;
        }
      }
    }
    const cyclic = remaining.size > 0;
    if (out.hasCycle !== cyclic)
      return `hasCycle = ${out.hasCycle}, but the graph ${cyclic ? "has" : "has no"} cycle`;
    if (new Set(out.order).size !== out.order.length) return "a vertex appears twice";
    const pos = new Map(out.order.map((v, i) => [v, i]));
    if (!cyclic && out.order.length !== ids.length) return "not every vertex was ordered";
    for (const e of input.edges) {
      if (pos.has(e.from) && pos.has(e.to) && pos.get(e.from)! > pos.get(e.to)!)
        return `edge ${e.from}→${e.to} points backwards`;
      if (pos.has(e.to) && !pos.has(e.from))
        return `${e.to} was ordered before its prerequisite ${e.from}`;
    }
    return null;
  },

  fidelity(state: TraceState, out) {
    const O = state.structures.O;
    if (!O || O.kind !== "array") return "no order array";
    const shown = O.values.filter((v) => v !== null);
    return JSON.stringify(shown) === JSON.stringify(out.order)
      ? null
      : `order shows ${shown}, expected ${out.order}`;
  },

  describeOutput: (out) =>
    out.hasCycle
      ? `Cycle detected; ordered only ${out.order.join(", ") || "nothing"}`
      : `Order: ${out.order.join(" → ")}`,
};
