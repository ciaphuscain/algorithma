import type { AlgorithmModule } from "../types";
import { edgeId, toTraceGraph } from "../inputs";
import {
  flowCheck,
  flowFidelity,
  flowInput,
  flowRowHeaders,
  flowsOf,
  reachable,
  residual,
  type FlowInput,
  type FlowOutput,
} from "./flow-common";

/**
 * Push–relabel (Goldberg–Tarjan), FIFO version: start with a preflow that saturates
 * every edge out of s, then repeatedly take an overflowing vertex and push its excess
 * downhill (to a neighbour exactly one unit lower) or, when no such edge exists, lift
 * it (relabel). Heights never decrease and stay below 2|V|, which bounds the work.
 */
export const pushRelabel: AlgorithmModule<FlowInput, FlowOutput> = {
  id: "push-relabel",
  version: 1,
  pseudocode: [
    "procedure PushRelabel(G, s, t)",
    "  h[s] ← |V|, every other h[v] ← 0;  push every edge out of s to capacity   // preflow",
    "  queue ← the vertices other than s and t that now have excess",
    "  while the queue is not empty",
    "    u ← the front of the queue",
    "    while excess[u] > 0",
    "      if a residual edge u → v has h[u] = h[v] + 1: push min(excess[u], residual) along it",
    "        if v ≠ s, t and v is not queued: add v to the queue",
    "      else: relabel u: h[u] ← 1 + the smallest h[v] over residual edges u → v",
    "    remove u from the queue",
    "  return excess[t]   // the vertices that can still be reached from s form a minimum cut",
  ],
  input: flowInput,

  run(input, t) {
    const r = residual(input);
    const G = t.graph("G", toTraceGraph(input));
    const F = t.grid("F", input.edges.length, 2, null, {
      label: "Capacity and flow of each edge",
      rowHeaders: flowRowHeaders(input),
      colHeaders: ["capacity", "flow"],
    });
    input.edges.forEach((e, i) => {
      F.write(i, 0, e.weight!, { line: 2 });
      F.write(i, 1, 0, { line: 2 });
    });
    const Q = t.sequence("Q", "queue", { label: "Overflowing vertices (FIFO)" });
    const { source: s, sink: sinkV } = input;
    const h = new Map(input.nodes.map((n) => [n.id, 0]));
    const excess = new Map(input.nodes.map((n) => [n.id, 0]));
    h.set(s, input.nodes.length);
    const show = (v: string, line: number) =>
      G.annotate(v, `h${h.get(v)} e${excess.get(v)}`, { line });
    const arcEdge = (a: number) => edgeId(r.edges[a >> 1]!.from, r.edges[a >> 1]!.to);
    const queued = new Set<string>();
    const queue: string[] = [];

    const push = (a: number, amount: number, u: string, line: number) => {
      const v = r.to[a]!;
      r.cap[a] = r.cap[a]! - amount;
      r.cap[a ^ 1] = r.cap[a ^ 1]! + amount;
      excess.set(u, excess.get(u)! - amount);
      excess.set(v, excess.get(v)! + amount);
      t.tally("pushes");
      G.edge(arcEdge(a), a % 2 === 0 ? "path" : "back", { line });
      F.write(a >> 1, 1, r.cap[(a >> 1) * 2 + 1]!, {
        line,
        note: `Push ${amount} from ${u} to ${v}${a % 2 === 1 ? " (cancelling flow on the edge back)" : ""}.`,
      });
      show(u, line);
      show(v, line);
      if (v !== s && v !== sinkV && !queued.has(v)) {
        queued.add(v);
        queue.push(v);
        Q.push(v, { line: 8 });
      }
    };

    for (const n of input.nodes) show(n.id, 2);
    for (const a of r.out.get(s)!) if (a % 2 === 0 && r.cap[a]! > 0) push(a, r.cap[a]!, s, 2);
    t.step({ line: 3, note: "Every edge out of s is full; its heads now hold excess flow." });

    const maxRelabels = 2 * input.nodes.length * input.nodes.length;
    let relabels = 0;
    while (queue.length > 0) {
      const u = queue[0]!;
      G.node(u, "current", { line: 5, vars: { u } });
      while (excess.get(u)! > 0) {
        const a = r.out.get(u)!.find((x) => r.cap[x]! > 0 && h.get(u) === h.get(r.to[x]!)! + 1);
        if (a !== undefined) {
          push(a, Math.min(excess.get(u)!, r.cap[a]!), u, 7);
        } else {
          const heights = r.out
            .get(u)!
            .filter((x) => r.cap[x]! > 0)
            .map((x) => h.get(r.to[x]!)!);
          h.set(u, 1 + Math.min(...heights));
          relabels++;
          t.tally("relabels");
          if (relabels > maxRelabels) throw new Error("push–relabel exceeded its relabel bound");
          G.annotate(u, `h${h.get(u)} e${excess.get(u)}`, {
            line: 9,
            note: `No edge goes downhill from ${u}: lift it to height ${h.get(u)}.`,
          });
        }
      }
      queue.shift();
      queued.delete(u);
      Q.pop({ line: 10 });
      G.node(u, "visited", { line: 10 });
    }
    const flow = excess.get(sinkV)!;
    const cut = reachable(r, s);
    for (const n of input.nodes)
      G.node(n.id, cut.includes(n.id) ? "path" : "unvisited", { line: 11 });
    const output: FlowOutput = { maxFlow: flow, flows: flowsOf(r), cut };
    t.finish(input, output, {
      line: 11,
      vars: { u: null },
      note: `No vertex overflows: the preflow is a flow, of value ${flow}. {${cut.join(", ")}} is the source side of a minimum cut.`,
    });
    return output;
  },

  check: flowCheck,
  fidelity: flowFidelity,
  describeOutput: (out) => `Maximum flow ${out.maxFlow}; cut {${out.cut.join(", ")}}`,
};
