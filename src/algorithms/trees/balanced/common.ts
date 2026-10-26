import type { TreeStructure } from "@/engine/protocol";
import type { MetaArg, Tracer, TracedTree } from "@/engine/tracer";
import type { InputPreset, InputSpec } from "../../types";
import { compareResults, parseOps, randomOps, showOps, type Op, type OpSpec } from "../../ops";

/** What a set operation reported. */
export type SetResult = "inserted" | "present" | "deleted" | "missing" | "found";

/** A tree as nested keys, for oracles and fidelity checks. `tag` is a colour, height or priority. */
export interface Shape {
  key: number;
  tag?: string;
  left: Shape | null;
  right: Shape | null;
}

export const MAX_SET_OPS = 20;

const SPEC: OpSpec = {
  insert: { value: true, aliases: ["add", "i"] },
  delete: { value: true, aliases: ["remove", "del", "d"] },
  search: { value: true, aliases: ["find", "s"] },
};

/** "insert 5, insert 3, search 3, delete 5" — every operation takes a key 0–99. */
export function setInput<V extends Op[]>(options: {
  presets: InputPreset<V>[];
  allow?: ("insert" | "delete" | "search")[];
  maxOps?: number;
}): InputSpec<Op[]> {
  const allow = options.allow ?? ["insert", "delete", "search"];
  const spec: OpSpec = Object.fromEntries(
    Object.entries(SPEC).filter(([k]) => allow.includes(k as never)),
  );
  const maxOps = options.maxOps ?? MAX_SET_OPS;
  return {
    fields: [
      {
        name: "ops",
        label: "Operations",
        placeholder: `e.g. insert 10, insert 20, insert 30${allow.includes("delete") ? ", delete 20" : ""}`,
        multiline: true,
      },
    ],
    constraints: `1–${maxOps} operations: ${allow.map((a) => `${a} k`).join(", ")}, with keys 0–99. Inserting a key that is already present does nothing.`,
    parse(f) {
      const ops = parseOps(f.ops ?? "", spec, maxOps);
      if (typeof ops[0] === "string") return { ok: false, errors: ops as string[] };
      return { ok: true, value: ops as Op[] };
    },
    format: (ops) => ({ ops: showOps(ops) }),
    presets: options.presets,
    random(rng, size) {
      const n = Math.min(maxOps, Math.max(3, size ?? 14));
      const others = allow.filter((a) => a !== "insert");
      const ops = randomOps(rng, n, ["insert"], others.length ? others : ["insert"], 6);
      // Keys from a small range, so deletes and searches often hit.
      return ops.map((o) => ({ ...o, value: (o.value ?? rng.int(1, 99)) % 30 }));
    },
  };
}

/** Shorthand for presets: "i5 i3 d5 s3" → operations. */
export function ops(text: string): Op[] {
  const names: Record<string, string> = { i: "insert", d: "delete", s: "search" };
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ({ name: names[w[0]!]!, value: Number(w.slice(1)) }));
}

/** Reference set semantics. */
export function setModel(list: Op[]): { results: SetResult[]; keys: number[] } {
  const set = new Set<number>();
  const results = list.map((op): SetResult => {
    const k = op.value!;
    if (op.name === "insert") return set.has(k) ? "present" : (set.add(k), "inserted");
    if (op.name === "delete") return set.delete(k) ? "deleted" : "missing";
    return set.has(k) ? "found" : "missing";
  });
  return { results, keys: [...set].sort((a, b) => a - b) };
}

export function shapeKeys(s: Shape | null): number[] {
  return s ? [...shapeKeys(s.left), s.key, ...shapeKeys(s.right)] : [];
}

export function shapeHeight(s: Shape | null): number {
  return s ? 1 + Math.max(shapeHeight(s.left), shapeHeight(s.right)) : 0;
}

/** Results match the set model, and the tree holds exactly the model's keys in BST order. */
export function checkSet(list: Op[], results: SetResult[], tree: Shape | null): string | null {
  const want = setModel(list);
  const r = compareResults(list, results, want.results);
  if (r) return r;
  const keys = shapeKeys(tree);
  if (keys.join() !== want.keys.join()) return `in-order ${keys}, expected ${want.keys}`;
  return null;
}

/** Read a traced tree back as a Shape; tags come from the annotations. */
export function shapeFromState(T: TreeStructure): Shape | null {
  const build = (id: string | null): Shape | null => {
    if (id === null) return null;
    const n = T.nodes[id]!;
    const ann = T.annotations[id];
    return {
      key: n.value as number,
      ...(ann !== undefined ? { tag: ann } : {}),
      left: build(n.children[0] ?? null),
      right: build(n.children[1] ?? null),
    };
  };
  return build(T.root);
}

export const sameShape = (a: Shape | null, b: Shape | null): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

/** A node of a traced binary search tree; `id` is its id in the traced tree. */
export interface Node {
  id: string;
  key: number;
  left: Node | null;
  right: Node | null;
  parent: Node | null;
}

/**
 * A binary search tree kept twice: as plain nodes with parent pointers, which the
 * algorithms read, and as the traced tree, which every change is mirrored into
 * (add, set, splice, rotate), so the two can never drift apart.
 */
export class TracedBst<N extends Node> {
  root: N | null = null;
  readonly T: TracedTree;
  private touched = new Set<string>();

  constructor(
    readonly t: Tracer,
    label: string,
    private readonly tagOf?: (n: N) => string | null,
  ) {
    this.T = t.tree("T", { binary: true, label });
  }

  /** Attach a new leaf under `parent` (or as the root). */
  attach(fields: Omit<N, "id" | "left" | "right" | "parent">, parent: N | null, meta?: MetaArg): N {
    const slot = parent === null ? undefined : (fields as { key: number }).key < parent.key ? 0 : 1;
    const id = this.T.add((fields as { key: number }).key, parent?.id ?? null, slot, meta);
    const n = { ...fields, id, left: null, right: null, parent } as unknown as N;
    if (parent === null) this.root = n;
    else if (slot === 0) parent.left = n;
    else parent.right = n;
    this.tag(n);
    return n;
  }

  /** Show a node's tag (colour, height, priority) as its annotation. */
  tag(n: N, meta?: MetaArg): void {
    if (!this.tagOf) return;
    this.T.annotate(n.id, this.tagOf(n), meta);
  }

  /**
   * Rotate at x (left: x's right child moves up). Returns the node that moved up.
   */
  rotate(x: N, dir: "left" | "right", meta?: MetaArg): N {
    const y = (dir === "left" ? x.right : x.left) as N;
    const inner = dir === "left" ? y.left : y.right;
    if (dir === "left") x.right = inner;
    else x.left = inner;
    if (inner) inner.parent = x;
    y.parent = x.parent;
    if (x.parent === null) this.root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;
    if (dir === "left") y.left = x;
    else y.right = x;
    x.parent = y;
    this.T.rotate(x.id, dir, meta);
    this.t.tally("rotations");
    return y;
  }

  /** Remove a node with at most one child; the child takes its place. */
  splice(n: N, meta?: MetaArg): N | null {
    const child = (n.left ?? n.right) as N | null;
    if (child) child.parent = n.parent;
    if (n.parent === null) this.root = child;
    else if (n === n.parent.left) n.parent.left = child;
    else n.parent.right = child;
    this.T.splice(n.id, meta);
    this.touched.delete(n.id);
    return child;
  }

  /** Re-attach the subtree rooted at `n` as a child of `parent` (the slot must be empty). */
  moveUnder(n: N, parent: N, side: "left" | "right", meta?: MetaArg): void {
    const old = n.parent;
    if (old === null) throw new Error("cannot move the root");
    if (old.left === n) old.left = null;
    else old.right = null;
    n.parent = parent;
    if (side === "left") parent.left = n;
    else parent.right = n;
    this.T.move(n.id, parent.id, side === "left" ? 0 : 1, meta);
  }

  /** Overwrite a node's key (deleting by copying the successor). */
  setKey(n: N, key: number, meta?: MetaArg): void {
    n.key = key;
    this.T.set(n.id, key, meta);
  }

  /**
   * Walk down from the root looking for `key`, comparing and highlighting each node.
   * Returns the node with the key, or null and the last node visited.
   */
  find(key: number, line: number): { node: N | null; last: N | null } {
    let v = this.root;
    let last: N | null = null;
    while (v) {
      const vv = v;
      this.mark(vv);
      const c = this.T.compare(vv.id, key, { line, note: `Compare ${key} with ${vv.key}.` });
      if (c === 0) return { node: vv, last };
      last = vv;
      v = (c > 0 ? vv.left : vv.right) as N | null;
    }
    return { node: null, last };
  }

  mark(n: N, status: "frontier" | "path" | "current" = "frontier"): void {
    this.touched.add(n.id);
    this.T.status(n.id, status);
  }

  /** Clear the highlights left by the previous operation. */
  clear(line: number): void {
    for (const id of this.touched) if (this.T.has(id)) this.T.status(id, "unvisited", { line });
    this.touched.clear();
  }

  shape(): Shape | null {
    const build = (n: N | null): Shape | null => {
      if (!n) return null;
      const tag = this.tagOf?.(n) ?? null;
      return {
        key: n.key,
        ...(tag !== null ? { tag } : {}),
        left: build(n.left as N | null),
        right: build(n.right as N | null),
      };
    };
    return build(this.root);
  }
}

/** Leftmost node of a subtree. */
export function minNode<N extends Node>(n: N): N {
  while (n.left) n = n.left as N;
  return n;
}
