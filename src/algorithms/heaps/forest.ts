import type { TreeStructure } from "@/engine/protocol";
import type { MetaArg, Tracer, TracedTree } from "@/engine/tracer";
import type { Rng } from "@/lib/random";
import type { InputPreset, InputSpec } from "../types";

/** Heap operations on distinct keys. */
export type HeapOp =
  | { name: "insert"; value: number }
  | { name: "extract" }
  | { name: "peek" }
  | { name: "decrease"; value: number; to: number };

/** What an operation reported. */
export type HeapResult = "ok" | "empty" | "present" | "missing" | "invalid" | number;

/** A heap-ordered tree as nested keys; `tag` is a mark or "min". */
export interface FShape {
  key: number;
  tag?: string;
  children: FShape[];
}

export const MAX_HEAP_OPS = 20;

export const showHeapOp = (op: HeapOp) =>
  op.name === "insert"
    ? `insert ${op.value}`
    : op.name === "decrease"
      ? `decrease ${op.value} to ${op.to}`
      : op.name;

/** "i5 i3 x p d5:1" → operations. */
export function heapOps(text: string): HeapOp[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w): HeapOp => {
      if (w === "x") return { name: "extract" };
      if (w === "p") return { name: "peek" };
      if (w[0] === "d") {
        const [a, b] = w.slice(1).split(":").map(Number);
        return { name: "decrease", value: a!, to: b! };
      }
      return { name: "insert", value: Number(w.slice(1)) };
    });
}

export function heapInput(presets: InputPreset<HeapOp[]>[]): InputSpec<HeapOp[]> {
  return {
    fields: [
      {
        name: "ops",
        label: "Operations",
        placeholder: "e.g. insert 7, insert 3, insert 9, extract, decrease 9 to 1, peek",
        multiline: true,
      },
    ],
    constraints: `1–${MAX_HEAP_OPS} operations: insert x, extract (remove the minimum), peek, decrease k to v (v < k). Keys are distinct whole numbers 0–99.`,
    parse(f) {
      const errors: string[] = [];
      const ops: HeapOp[] = [];
      for (const raw of (f.ops ?? "").split(/[,;\n]+/)) {
        const part = raw.trim().toLowerCase();
        if (!part) continue;
        let m: RegExpExecArray | null;
        if ((m = /^(?:insert|add|push|i)\s+(\d+)$/.exec(part)))
          ops.push({ name: "insert", value: Number(m[1]) });
        else if (/^(?:extract|extractmin|deletemin|pop|x)$/.test(part))
          ops.push({ name: "extract" });
        else if (/^(?:peek|min|top|p)$/.test(part)) ops.push({ name: "peek" });
        else if ((m = /^(?:decrease|decreasekey|dec|d)\s+(\d+)\s*(?:to|->|→)?\s*(\d+)$/.exec(part)))
          ops.push({ name: "decrease", value: Number(m[1]), to: Number(m[2]) });
        else errors.push(`"${raw.trim()}" should be insert x, extract, peek or decrease k to v`);
      }
      for (const op of ops)
        if (
          (op.name === "insert" || op.name === "decrease") &&
          (op.value > 99 || (op.name === "decrease" && op.to > 99))
        )
          errors.push("Keys must be 0–99");
      if (ops.length === 0 && errors.length === 0) errors.push("Give at least one operation");
      if (ops.length > MAX_HEAP_OPS) errors.push(`Give at most ${MAX_HEAP_OPS} operations`);
      return errors.length
        ? { ok: false, errors: [...new Set(errors)].slice(0, 5) }
        : { ok: true, value: ops };
    },
    format: (ops) => ({ ops: ops.map(showHeapOp).join(", ") }),
    presets,
    random(rng: Rng, size?: number) {
      const n = Math.min(MAX_HEAP_OPS, Math.max(4, size ?? 16));
      const used: number[] = [];
      return Array.from({ length: n }, (): HeapOp => {
        const r = rng.int(0, 9);
        if (r < 6 || used.length === 0) {
          const v = rng.int(10, 99);
          used.push(v);
          return { name: "insert", value: v };
        }
        if (r < 8) return { name: "extract" };
        if (r < 9) return { name: "peek" };
        const k = used[rng.int(0, used.length - 1)]!;
        return { name: "decrease", value: k, to: rng.int(0, k - 1 < 0 ? 0 : k - 1) };
      });
    },
  };
}

/** Reference results: a plain set of keys (independent of any heap). */
export function heapModel(ops: HeapOp[]): { results: HeapResult[]; keys: number[] } {
  const set = new Set<number>();
  const results = ops.map((op): HeapResult => {
    if (op.name === "insert") return set.has(op.value) ? "present" : (set.add(op.value), "ok");
    if (op.name === "decrease") {
      if (!set.has(op.value)) return "missing";
      if (op.to >= op.value || set.has(op.to)) return "invalid";
      set.delete(op.value);
      set.add(op.to);
      return "ok";
    }
    if (!set.size) return "empty";
    const m = Math.min(...set);
    if (op.name === "extract") set.delete(m);
    return m;
  });
  return { results, keys: [...set].sort((a, b) => a - b) };
}

export function compareHeapResults(
  ops: HeapOp[],
  got: HeapResult[],
  want: HeapResult[],
): string | null {
  if (got.length !== want.length) return `${got.length} results for ${want.length} operations`;
  for (let i = 0; i < want.length; i++)
    if (got[i] !== want[i])
      return `operation ${i + 1} (${showHeapOp(ops[i]!)}) reported ${got[i]}, expected ${want[i]}`;
  return null;
}

export const forestKeys = (f: FShape[]): number[] =>
  f.flatMap((t) => [t.key, ...forestKeys(t.children)]).sort((a, b) => a - b);

export function heapOrder(f: FShape[]): string | null {
  for (const t of f)
    for (const c of t.children) {
      if (c.key < t.key) return `${c.key} is below the larger key ${t.key}`;
      const e = heapOrder([c]);
      if (e) return e;
    }
  return null;
}

export const showForest = (f: FShape[]): string =>
  f
    .map(
      (t) =>
        `${t.key}${t.tag ? `[${t.tag}]` : ""}${t.children.length ? `(${showForest(t.children)})` : ""}`,
    )
    .join(" ");

/** The drawn forest: the children of the placeholder root, with annotations as tags. */
export function forestFromState(T: TreeStructure): FShape[] {
  const build = (id: string): FShape => {
    const n = T.nodes[id]!;
    const tag = T.annotations[id];
    return {
      key: n.value as number,
      ...(tag !== undefined ? { tag } : {}),
      children: n.children.filter((c): c is string => c !== null).map(build),
    };
  };
  return T.root === null
    ? []
    : T.nodes[T.root]!.children.filter((c): c is string => c !== null).map(build);
}

/** A node of a traced heap forest. */
export interface FNode {
  id: string;
  key: number;
  kids: FNode[];
  parent: FNode | null;
  marked: boolean;
}

/**
 * A heap forest drawn as a general tree whose top node is a placeholder (“roots”); its
 * children are the roots of the heap's trees. Plain nodes mirror the drawing; every
 * change goes through add, move, set or remove.
 */
export class TracedForest {
  readonly T: TracedTree;
  readonly top: FNode;

  constructor(
    readonly t: Tracer,
    label: string,
  ) {
    this.T = t.tree("T", { binary: false, label });
    this.top = {
      id: this.T.add("roots", null, undefined, undefined, { view: true }),
      key: -1,
      kids: [],
      parent: null,
      marked: false,
    };
  }

  get roots(): FNode[] {
    return this.top.kids;
  }

  /** Add a new root at position `pos` of the root list. */
  addRoot(key: number, pos: number, meta?: MetaArg): FNode {
    const id = this.T.add(key, this.top.id, pos, meta);
    const n: FNode = { id, key, kids: [], parent: this.top, marked: false };
    this.top.kids.splice(pos, 0, n);
    return n;
  }

  /** Move `n` (with its subtree) to position `pos` among `parent`'s children. */
  place(n: FNode, parent: FNode, pos: number, meta?: MetaArg): void {
    const from = n.parent!;
    from.kids.splice(from.kids.indexOf(n), 1);
    parent.kids.splice(pos, 0, n);
    n.parent = parent;
    this.T.move(n.id, parent.id, pos, meta);
  }

  /** Remove a root that has no children. */
  removeRoot(n: FNode, meta?: MetaArg): void {
    this.top.kids.splice(this.top.kids.indexOf(n), 1);
    this.T.remove(n.id, meta);
  }

  setKey(n: FNode, key: number, meta?: MetaArg): void {
    n.key = key;
    this.T.set(n.id, key, meta);
  }

  isRoot(n: FNode): boolean {
    return n.parent === this.top;
  }

  find(key: number): FNode | null {
    const walk = (ns: FNode[]): FNode | null => {
      for (const n of ns) {
        if (n.key === key) return n;
        const f = walk(n.kids);
        if (f) return f;
      }
      return null;
    };
    return walk(this.top.kids);
  }

  shape(tagOf?: (n: FNode) => string | null): FShape[] {
    const build = (n: FNode): FShape => {
      const tag = tagOf?.(n) ?? null;
      return { key: n.key, ...(tag !== null ? { tag } : {}), children: n.kids.map(build) };
    };
    return this.top.kids.map(build);
  }
}
