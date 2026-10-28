import type { GraphNode } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { TracedGraph, Tracer } from "@/engine/tracer";

export const MAX_LIST = 10;

/** Node ids n0, n1, … in input order; labels are the values. */
export const nodeId = (i: number) => `n${i}`;
export const edgeId = (from: number, to: number) => `${nodeId(from)}>${nodeId(to)}`;

/** Nodes laid out left to right on row `row` of `rows` (rows from the top). */
export function listNodes(
  values: number[],
  options: { row?: number; rows?: number; offset?: number; idOf?: (i: number) => string } = {},
): GraphNode[] {
  const { row = 0, rows = 1, offset = 0, idOf = nodeId } = options;
  const n = Math.max(values.length, 2);
  const y = rows === 1 ? 0.5 : 0.15 + (0.7 * row) / (rows - 1);
  return values.map((v, i) => ({
    id: idOf(i + offset),
    label: String(v),
    x: Number((0.05 + (0.9 * i) / (n - 1)).toFixed(4)),
    y: Number(y.toFixed(4)),
  }));
}

/** The chain of `next` pointers as an adjacency map, built by tracking link/unlink calls. */
export class ListPointers {
  private readonly next = new Map<number, number>();
  /** Pointer assignments executed, including ones that leave the pointer unchanged. */
  assignments = 0;
  constructor(
    private readonly G: TracedGraph,
    private readonly id: (i: number) => string = nodeId,
  ) {}

  get(i: number): number | null {
    return this.next.get(i) ?? null;
  }

  /** Point i's next at j (or at nothing), replacing any previous pointer. */
  set(i: number, j: number | null, meta?: Parameters<TracedGraph["link"]>[4]): void {
    this.assignments++;
    const old = this.next.get(i);
    if (old === j || (old === undefined && j === null)) return;
    if (old !== undefined) {
      this.G.unlink(`${this.id(i)}>${this.id(old)}`, j === null ? meta : undefined);
      this.next.delete(i);
    }
    if (j !== null) {
      this.G.link(`${this.id(i)}>${this.id(j)}`, this.id(i), this.id(j), "tree", meta);
      this.next.set(i, j);
    }
  }

  /** Walk from head; stops after `limit` steps (cycles). */
  walk(head: number | null, limit = 100): number[] {
    const out: number[] = [];
    for (let i = head; i !== null && out.length < limit; i = this.get(i)) out.push(i);
    return out;
  }
}

/** Follow the graph's edges from `head` in the replayed state. */
export function walkState(
  state: TraceState,
  name: string,
  head: string | null,
  limit = 100,
  isNext: (edgeId: string) => boolean = () => true,
): string[] | string {
  const g = state.structures[name];
  if (g?.kind !== "graph") return `no graph ${name}`;
  const out: string[] = [];
  for (let at = head; at !== null && out.length < limit;) {
    out.push(at);
    const next = g.edges.filter((e) => e.from === at && isNext(e.id));
    if (next.length > 1) return `node ${at} has ${next.length} next pointers`;
    at = next[0]?.to ?? null;
  }
  return out;
}

/** Parse "1, 2, 3" into a list of whole numbers −99…99, 1–MAX_LIST of them. */
export function parseList(text: string | undefined, label = "List", min = 1): number[] | string {
  const tokens = (text ?? "").split(/[\s,;]+/).filter(Boolean);
  if (tokens.length < min) return `${label} needs at least ${min} value${min === 1 ? "" : "s"}`;
  if (tokens.length > MAX_LIST) return `${label} may have at most ${MAX_LIST} values`;
  const values = tokens.map(Number);
  if (values.some((v) => !Number.isInteger(v) || v < -99 || v > 99))
    return `${label}: values must be whole numbers from −99 to 99`;
  return values;
}

/**
 * Labels under the nodes showing which variables point at them ("prev", "slow, fast").
 * Only changed labels are emitted, and they carry the line but not the note; the note,
 * if any, goes on one step event afterwards so it is narrated once.
 */
export function pointerLabels(t: Tracer, G: TracedGraph, id: (i: number) => string = nodeId) {
  const shown = new Map<string, string>();
  return (vars: Record<string, number | null>, meta: { line: number; note?: string }) => {
    const want = new Map<string, string[]>();
    for (const [name, i] of Object.entries(vars))
      if (i !== null) want.set(id(i), [...(want.get(id(i)) ?? []), name]);
    for (const node of new Set([...shown.keys(), ...want.keys()])) {
      const text = want.get(node)?.join(", ") ?? null;
      if ((shown.get(node) ?? null) !== text) {
        G.annotate(node, text, { line: meta.line });
        if (text === null) shown.delete(node);
        else shown.set(node, text);
      }
    }
    if (meta.note) t.step(meta);
  };
}
