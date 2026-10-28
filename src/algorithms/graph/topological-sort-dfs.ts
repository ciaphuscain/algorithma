import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { adjacency, graphInput, graphPreset, toTraceGraph, type GraphInputValue } from "../inputs";
import type { TopoOutput } from "./topological-sort";

const LIMITS = { maxNodes: 20, maxEdges: 50 };
const DIRECTED = { directed: true, weighted: false, limits: LIMITS, withSource: false };

/**
 * Topological sort by depth-first search: a vertex is written to the order, filling
 * from the right, when it finishes, i.e. after everything reachable from it. An
 * edge to a vertex still on the call stack is a back edge and proves a cycle.
 */
export const topologicalSortDfs: AlgorithmModule<GraphInputValue, TopoOutput> = {
  id: "topological-sort-dfs",
  version: 1,
  pseudocode: [
    "procedure topo-dfs(G)",
    "  for each vertex u, in id order: if u is unvisited: visit(u)",
    "procedure visit(u)",
    "  mark u in progress   // u is on the call stack",
    "  for each edge u → v",
    "    if v is in progress: back edge, so G has a cycle",
    "    else if v is unvisited: visit(v)",
    "  mark u done;  write u in the rightmost free slot",
    "  return the slots, left to right",
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
        id: "clothes",
        label: "Getting dressed",
        value: graphPreset(
          "Sck->Sho, Und->Sho, Und->Tro, Tro->Sho, Tro->Blt, Sht->Blt, Sht->Tie, Tie->Jkt, Blt->Jkt, Wch",
          "",
          DIRECTED,
        ),
      },
      {
        id: "cycle",
        label: "Contains a cycle",
        value: graphPreset("A->B, B->C, C->D, D->B, C->E", "", DIRECTED),
      },
    ],
  }),

  run(input, t) {
    const G = t.graph("G", { ...toTraceGraph(input), label: "Dependency graph" });
    const S = t.sequence("S", "stack", { label: "Call stack" });
    const ids = input.nodes.map((n) => n.id);
    const O = t.array(
      "O",
      ids.map((): Scalar => null),
      { label: "Topological order (filled from the right)", display: "cells" },
    );
    const adj = adjacency(input);
    const state = new Map<string, "new" | "active" | "done">(ids.map((v) => [v, "new"]));
    const order: (string | null)[] = ids.map(() => null);
    let slot = ids.length - 1;
    let hasCycle = false;

    const visit = (u: string) => {
      state.set(u, "active");
      S.push(`visit(${u})`, { line: 3, vars: { u, v: null } });
      G.node(u, "current", { line: 4, note: `${u} is in progress.` });
      for (const { to: v, edge } of adj.get(u)!) {
        const sv = state.get(v)!;
        if (sv === "active") {
          hasCycle = true;
          G.edge(edge, "back", {
            line: 6,
            vars: { v },
            note: `${v} is still in progress: ${u}→${v} closes a cycle, so no topological order exists.`,
          });
        } else if (sv === "new") {
          G.edge(edge, "tree", {
            line: 7,
            vars: { v },
            note: `${v} is unvisited: everything ${v} leads to must come after ${u}. Visit it first.`,
          });
          G.node(u, "frontier", { line: 7 });
          visit(v);
          G.node(u, "current", { line: 5, vars: { u, v: null } });
        } else {
          t.step({
            line: 5,
            vars: { v },
            note: `${v} is already done and placed to the right; nothing to do.`,
          });
        }
      }
      state.set(u, "done");
      order[slot] = u;
      O.write(slot, u, {
        line: 8,
        vars: { slot },
        note: `Everything reachable from ${u} is placed, so ${u} goes in slot ${slot}, before all of it.`,
      });
      slot--;
      G.node(u, "visited", { line: 8 });
      S.pop({ line: 8 });
    };

    for (const u of [...ids].sort()) {
      if (state.get(u) !== "new") continue;
      t.step({ line: 2, vars: { u }, note: `${u} is unvisited: start a search from it.` });
      visit(u);
    }
    const output: TopoOutput = { order: order as string[], hasCycle };
    t.finish(input, output, {
      line: 9,
      vars: { u: null, v: null, slot: null },
      note: hasCycle
        ? "The graph has a cycle, so the slots do not form a valid order."
        : "Every edge points from left to right: this is a topological order.",
    });
    return output;
  },

  check(input, out) {
    // Independent oracle for cycles: Kahn's algorithm orders every vertex iff acyclic.
    const indeg = new Map(input.nodes.map((n) => [n.id, 0]));
    for (const e of input.edges) indeg.set(e.to, indeg.get(e.to)! + 1);
    const ready = [...indeg].filter(([, d]) => d === 0).map(([v]) => v);
    let seen = 0;
    while (ready.length > 0) {
      const u = ready.pop()!;
      seen++;
      for (const e of input.edges) {
        if (e.from !== u) continue;
        indeg.set(e.to, indeg.get(e.to)! - 1);
        if (indeg.get(e.to) === 0) ready.push(e.to);
      }
    }
    const cyclic = seen < input.nodes.length;
    if (out.hasCycle !== cyclic) return `hasCycle = ${out.hasCycle}, expected ${cyclic}`;
    if (new Set(out.order).size !== input.nodes.length || out.order.length !== input.nodes.length)
      return "the order is not a permutation of the vertices";
    if (cyclic) return null;
    const pos = new Map(out.order.map((v, i) => [v, i]));
    for (const e of input.edges)
      if (pos.get(e.from)! >= pos.get(e.to)!) return `${e.from} must come before ${e.to}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const o = state.structures.O;
    if (!o || o.kind !== "array") return "no array O";
    return JSON.stringify(o.values) === JSON.stringify(out.order)
      ? null
      : `shows ${o.values.join(",")}, expected ${out.order.join(",")}`;
  },

  describeOutput: (out) =>
    out.hasCycle
      ? "The graph has a cycle: no topological order exists."
      : `Order: ${out.order.join(", ")}`,
};
