import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { adjacency, graphInput, toTraceGraph, type GraphInputValue } from "../inputs";
import { sccCheck, type SccOutput } from "./common";
import { SCC_PRESETS, describeComponents, sccFidelity } from "./kosaraju";

const LIMITS = { maxNodes: 16, maxEdges: 40 };
const DIRECTED = { directed: true, weighted: false, limits: LIMITS, withSource: false };

/**
 * Tarjan's strongly connected components: one DFS. Each vertex gets a discovery index
 * and a low-link, the smallest index reachable through its subtree and one edge to a
 * vertex still on the stack. A vertex whose low-link equals its own index is the root
 * of a component, which is popped off the stack in one piece.
 */
export const tarjanScc: AlgorithmModule<GraphInputValue, SccOutput> = {
  id: "tarjan-scc",
  version: 1,
  pseudocode: [
    "procedure Tarjan(G)",
    "  for each vertex u, in id order: if u is unvisited: connect(u)",
    "procedure connect(u)",
    "  index[u] ← low[u] ← counter;  counter ← counter + 1;  push u on S",
    "  for each edge u → v",
    "    if v is unvisited: connect(v);  low[u] ← min(low[u], low[v])",
    "    else if v is on S: low[u] ← min(low[u], index[v])",
    "  if low[u] = index[u]: pop S down to u; the popped vertices are one component",
  ],
  input: graphInput({ ...DIRECTED, presets: SCC_PRESETS }),

  run(input, t) {
    const G = t.graph("G", { ...toTraceGraph(input), label: "Graph" });
    const S = t.sequence("S", "stack", { label: "Stack S" });
    const adj = adjacency(input);
    const index = new Map<string, number>();
    const low = new Map<string, number>();
    const onStack = new Set<string>();
    const stack: string[] = [];
    const components: string[][] = [];
    let counter = 0;
    const show = (u: string, line: number) =>
      G.annotate(u, `${index.get(u)}/${low.get(u)}`, { line });

    const connect = (u: string) => {
      index.set(u, counter);
      low.set(u, counter);
      counter++;
      stack.push(u);
      onStack.add(u);
      G.node(u, "current", {
        line: 4,
        vars: { u, counter },
        note: `Visit ${u}: index ${index.get(u)}, low-link ${low.get(u)} (shown as index/low).`,
      });
      show(u, 4);
      S.push(u, { line: 4 });
      for (const { to: v, edge } of adj.get(u)!) {
        if (!index.has(v)) {
          G.edge(edge, "tree", { line: 6, vars: { v } });
          G.node(u, "frontier", { line: 6 });
          connect(v);
          G.node(u, "current", { line: 6, vars: { u, v } });
          if (low.get(v)! < low.get(u)!) {
            low.set(u, low.get(v)!);
            show(u, 6);
            t.step({
              line: 6,
              note: `${v} reaches back to index ${low.get(v)}, so ${u} does too: low[${u}] = ${low.get(u)}.`,
            });
          }
        } else if (onStack.has(v)) {
          G.edge(edge, "back", {
            line: 7,
            vars: { v },
            note: `${v} is still on the stack, so ${u} can reach it and it can reach ${u}: they share a component.`,
          });
          if (index.get(v)! < low.get(u)!) {
            low.set(u, index.get(v)!);
            show(u, 7);
          }
        } else {
          t.step({
            line: 5,
            vars: { v },
            note: `${v} already belongs to a finished component; ${u}→${v} leads out of ${u}'s component.`,
          });
        }
      }
      if (low.get(u) === index.get(u)) {
        const c: string[] = [];
        let w: string;
        do {
          w = stack.pop()!;
          onStack.delete(w);
          c.push(w);
          S.pop({ line: 8 });
          G.node(w, "visited", { line: 8 });
          G.annotate(w, `C${components.length + 1}`, { line: 8 });
        } while (w !== u);
        components.push(c);
        t.step({
          line: 8,
          vars: { u },
          note: `low[${u}] = index[${u}]: ${u} is the root of a component. C${components.length} = {${c.join(", ")}}.`,
        });
      } else {
        G.node(u, "frontier", {
          line: 8,
          note: `low[${u}] = ${low.get(u)} < ${index.get(u)}: ${u} belongs to a component rooted higher up; it stays on the stack.`,
        });
      }
    };

    for (const u of input.nodes.map((n) => n.id).sort()) {
      if (!index.has(u)) {
        t.step({ line: 2, vars: { u }, note: `${u} is unvisited: start a search.` });
        connect(u);
      }
    }
    const output: SccOutput = { components };
    t.finish(input, output, {
      vars: { u: null, v: null },
      note: `${components.length} strongly connected component${components.length === 1 ? "" : "s"}, found in reverse topological order of the component graph.`,
    });
    return output;
  },

  check: (input, out) => sccCheck(input, out, "reverse-topological"),
  fidelity: (state: TraceState, out) => sccFidelity(state, "G", out),
  describeOutput: describeComponents,
};
