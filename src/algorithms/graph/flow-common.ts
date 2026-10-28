import type { TraceState } from "@/engine/state";
import type { InputPreset, InputSpec } from "../types";
import {
  edgeId,
  graphPreset,
  parseGraph,
  formatGraph,
  randomGraph,
  type GraphInputValue,
} from "../inputs";

export interface FlowInput extends GraphInputValue {
  sink: string;
}

export interface FlowOutput {
  maxFlow: number;
  /** Flow on each input edge, by edge id "from-to". */
  flows: Record<string, number>;
  /** Source side of a minimum cut: vertices reachable from s in the final residual graph. */
  cut: string[];
}

export const FLOW_LIMITS = { maxNodes: 10, maxEdges: 24, minWeight: 1, maxWeight: 99 };
export const FLOW_OPTIONS = { directed: true, weighted: true, limits: FLOW_LIMITS } as const;

export function flowPreset(text: string, source: string, sink: string): FlowInput {
  return { ...graphPreset(text, source, FLOW_OPTIONS), sink };
}

export const FLOW_PRESETS: InputPreset<FlowInput>[] = [
  {
    id: "classic",
    label: "Textbook network (max flow 23)",
    value: flowPreset(
      "S->A:16, S->B:13, A->C:12, B->A:4, B->D:14, C->B:9, C->T:20, D->C:7, D->T:4",
      "S",
      "T",
    ),
  },
  {
    id: "undo",
    label: "Diamond with a cross edge",
    value: flowPreset("S->A:1, S->B:1, A->B:1, A->T:1, B->T:1", "S", "T"),
  },
  {
    id: "bottleneck",
    label: "One bottleneck edge",
    value: flowPreset("S->A:9, S->B:9, A->C:9, B->C:9, C->D:5, D->T:9", "S", "T"),
  },
];

export const flowInput: InputSpec<FlowInput> = {
  fields: [
    {
      name: "edges",
      label: "Directed edges with capacities",
      placeholder: "e.g. S->A:4, A->T:3, S->T:2",
      multiline: true,
      help: "Separate edges with commas or new lines; the number after the colon is the capacity.",
    },
    { name: "source", label: "Source", placeholder: "e.g. S" },
    { name: "sink", label: "Sink", placeholder: "e.g. T" },
  ],
  constraints: `Up to ${FLOW_LIMITS.maxNodes} nodes and ${FLOW_LIMITS.maxEdges} edges; capacities ${FLOW_LIMITS.minWeight}–${FLOW_LIMITS.maxWeight}; source and sink must differ.`,
  parse(fields) {
    const g = parseGraph(fields.edges ?? "", fields.source ?? "", {
      ...FLOW_OPTIONS,
      withSource: true,
    });
    const sink = (fields.sink ?? "").trim();
    const errors = g.ok ? [] : [...g.errors];
    if (g.ok && !g.value.nodes.some((n) => n.id === sink))
      errors.push(sink ? `Sink "${sink}" is not in the graph` : "Choose a sink");
    if (g.ok && sink === g.value.source) errors.push("The sink must differ from the source");
    return errors.length || !g.ok
      ? { ok: false, errors }
      : { ok: true, value: { ...g.value, sink } };
  },
  format: (v) => ({ ...formatGraph(v), sink: v.sink }),
  presets: FLOW_PRESETS,
  random(rng, size) {
    const nodes = Math.max(3, Math.min(FLOW_LIMITS.maxNodes, size ?? 6));
    const g = randomGraph(rng, {
      directed: true,
      weighted: true,
      nodes,
      extraEdges: Math.floor(nodes / 2),
      minWeight: 1,
      maxWeight: 9,
    });
    return { ...g, source: g.nodes[0]!.id, sink: g.nodes[g.nodes.length - 1]!.id };
  },
};

/** Residual network: arc 2i is input edge i forwards, arc 2i + 1 its reverse. */
export interface Residual {
  to: string[];
  cap: number[];
  /** Arc indices leaving each vertex, ordered by target id (deterministic traces). */
  out: Map<string, number[]>;
  edges: GraphInputValue["edges"];
}

export function residual(input: FlowInput): Residual {
  const to: string[] = [];
  const cap: number[] = [];
  const out = new Map<string, number[]>(input.nodes.map((n) => [n.id, []]));
  for (const e of input.edges) {
    out.get(e.from)!.push(to.length);
    to.push(e.to);
    cap.push(e.weight ?? 0);
    out.get(e.to)!.push(to.length);
    to.push(e.from);
    cap.push(0);
  }
  for (const [v, arcs] of out)
    out.set(
      v,
      arcs.sort((a, b) => (to[a]! < to[b]! ? -1 : to[a]! > to[b]! ? 1 : a - b)),
    );
  return { to, cap, out, edges: input.edges };
}

/** Flow on input edge i = residual capacity of its reverse arc. */
export const flowsOf = (r: Residual) =>
  Object.fromEntries(r.edges.map((e, i) => [edgeId(e.from, e.to), r.cap[2 * i + 1]!]));

/** Vertices reachable from s through arcs with residual capacity. */
export function reachable(r: Residual, s: string): string[] {
  const seen = new Set([s]);
  const queue = [s];
  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const a of r.out.get(u)!) {
      const v = r.to[a]!;
      if (r.cap[a]! > 0 && !seen.has(v)) {
        seen.add(v);
        queue.push(v);
      }
    }
  }
  return [...seen].sort();
}

/**
 * Oracle: a feasible flow (capacities, conservation) whose value equals the capacity
 * of an s–t cut is maximum (max-flow min-cut theorem). The cut is the set reachable
 * from s in the residual graph of the reported flow, recomputed here.
 */
export function flowCheck(input: FlowInput, out: FlowOutput): string | null {
  const net = new Map<string, number>(input.nodes.map((n) => [n.id, 0]));
  for (const e of input.edges) {
    const f = out.flows[edgeId(e.from, e.to)];
    if (f === undefined || !Number.isInteger(f) || f < 0 || f > e.weight!)
      return `flow ${f} on ${e.from}→${e.to} breaks its capacity ${e.weight}`;
    net.set(e.from, net.get(e.from)! - f);
    net.set(e.to, net.get(e.to)! + f);
  }
  for (const [v, x] of net)
    if (v !== input.source && v !== input.sink && x !== 0)
      return `flow is not conserved at ${v} (net ${x})`;
  if (-net.get(input.source)! !== out.maxFlow)
    return `value ${out.maxFlow}, but ${-net.get(input.source)!} leaves the source`;
  const side = new Set([input.source]);
  for (let grew = true; grew;) {
    grew = false;
    for (const e of input.edges) {
      const f = out.flows[edgeId(e.from, e.to)]!;
      // Residual arcs: forwards where the edge has spare capacity, backwards where it carries flow.
      const forward = side.has(e.from) && !side.has(e.to) && f < e.weight!;
      const backward = side.has(e.to) && !side.has(e.from) && f > 0;
      if (forward) side.add(e.to);
      if (backward) side.add(e.from);
      if (forward || backward) grew = true;
    }
  }
  if (side.has(input.sink)) return "the residual graph still has an augmenting path";
  const capacity = input.edges
    .filter((e) => side.has(e.from) && !side.has(e.to))
    .reduce((s, e) => s + e.weight!, 0);
  if (capacity !== out.maxFlow) return `cut capacity ${capacity} ≠ flow ${out.maxFlow}`;
  if (JSON.stringify([...side].sort()) !== JSON.stringify(out.cut))
    return `cut ${out.cut}, expected ${[...side].sort()}`;
  return null;
}

/** The flow table must show the reported flows. */
export function flowFidelity(state: TraceState, out: FlowOutput): string | null {
  const g = state.structures.F;
  if (g?.kind !== "grid") return "no grid F";
  for (const [r, id] of Object.keys(out.flows).entries())
    if (g.cells[r]![1] !== out.flows[id]) return `${id} shows ${g.cells[r]![1]}`;
  return null;
}

export const flowRowHeaders = (input: FlowInput) => input.edges.map((e) => `${e.from}→${e.to}`);
