import type { TreeStructure } from "@/engine/protocol";
import type { MetaArg, Tracer, TracedTree } from "@/engine/tracer";
import type { InputPreset, InputSpec } from "../../types";
import { parseOps, randomOps, showOps, type Op, type OpSpec } from "../../ops";

/** A multiway search tree as nested key lists. */
export interface BShape {
  keys: number[];
  children: BShape[];
}

export interface BInput {
  /** B-tree: minimum degree t (nodes hold t − 1 to 2t − 1 keys). B+ tree: the order (most keys per node). */
  size: number;
  ops: Op[];
}

export const MAX_B_OPS = 24;
export const label = (keys: number[]) => (keys.length ? keys.join("·") : "∅");

/** Parse a drawn node label back into keys. */
export const keysOf = (value: unknown) =>
  String(value) === "∅" ? [] : String(value).split("·").map(Number);

export function bInput(options: {
  sizeField: { label: string; min: number; max: number; help: string };
  spec: OpSpec;
  presets: InputPreset<BInput>[];
}): InputSpec<BInput> {
  const { min, max } = options.sizeField;
  const names = Object.keys(options.spec);
  return {
    fields: [
      {
        name: "size",
        label: options.sizeField.label,
        placeholder: `${min}–${max}`,
        help: options.sizeField.help,
      },
      {
        name: "ops",
        label: "Operations",
        placeholder: `e.g. ${names.map((n, i) => `${n} ${10 * (i + 1)}`).join(", ")}`,
        multiline: true,
      },
    ],
    constraints: `${options.sizeField.label} from ${min} to ${max}; 1–${MAX_B_OPS} operations (${names.join(", ")}) on keys 0–99.`,
    parse(f) {
      const errors: string[] = [];
      const s = (f.size ?? "").trim();
      const size = /^\d+$/.test(s) ? Number(s) : NaN;
      if (!(size >= min && size <= max))
        errors.push(`${options.sizeField.label} must be ${min} to ${max}`);
      const ops = parseOps(f.ops ?? "", options.spec, MAX_B_OPS);
      if (typeof ops[0] === "string") errors.push(...(ops as string[]));
      return errors.length
        ? { ok: false, errors: errors.slice(0, 5) }
        : { ok: true, value: { size, ops: ops as Op[] } };
    },
    format: (v) => ({ size: String(v.size), ops: showOps(v.ops) }),
    presets: options.presets,
    random(rng, n) {
      const count = Math.min(MAX_B_OPS, Math.max(4, n ?? 16));
      const others = names.filter((x) => x !== "insert");
      const ops = randomOps(rng, count, ["insert"], others, 7).map((o) => ({
        ...o,
        value: (o.value ?? rng.int(1, 99)) % 40,
      }));
      return { size: rng.int(min, max), ops };
    },
  };
}

/** Shorthand for presets: "i5 i3 d5 s3" → operations. */
export function bOps(text: string): Op[] {
  const names: Record<string, string> = { i: "insert", d: "delete", s: "search" };
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ({ name: names[w[0]!]!, value: Number(w.slice(1)) }));
}

export function shapeFromTree(T: TreeStructure): BShape | null {
  const build = (id: string): BShape => ({
    keys: keysOf(T.nodes[id]!.value),
    children: T.nodes[id]!.children.filter((c): c is string => c !== null).map(build),
  });
  return T.root === null ? null : build(T.root);
}

export const showShape = (s: BShape | null): string =>
  s
    ? `[${s.keys.join(" ")}]${s.children.length ? `(${s.children.map(showShape).join(",")})` : ""}`
    : "·";

export function allKeys(s: BShape | null): number[] {
  if (!s) return [];
  if (!s.children.length) return [...s.keys];
  const out: number[] = [];
  s.children.forEach((c, i) => {
    out.push(...allKeys(c));
    if (i < s.keys.length) out.push(s.keys[i]!);
  });
  return out;
}

export function bHeight(s: BShape | null): number {
  return s ? 1 + (s.children.length ? Math.max(...s.children.map(bHeight)) : 0) : 0;
}

/** A node of a traced multiway tree. */
export interface BNode {
  id: string;
  keys: number[];
  kids: BNode[];
}

/**
 * A multiway tree kept as plain nodes and mirrored into a general traced tree, whose
 * node labels list the keys ("10·20"). Splits and merges re-hang children with
 * tree.move, so the drawing shows nodes keep their identity.
 */
export class TracedMultiTree {
  root: BNode | null = null;
  readonly T: TracedTree;
  private touched = new Set<string>();

  constructor(
    readonly t: Tracer,
    label: string,
  ) {
    this.T = t.tree("T", { binary: false, label });
  }

  /** Redraw a node's keys. */
  show(n: BNode, meta?: MetaArg): void {
    this.T.set(n.id, label(n.keys), meta);
  }

  makeRoot(keys: number[], meta?: MetaArg): BNode {
    const id = this.T.add(label(keys), null, undefined, meta);
    this.root = { id, keys, kids: [] };
    return this.root;
  }

  /** Add a new child at position `pos` of `parent`. */
  addChild(parent: BNode, pos: number, keys: number[], meta?: MetaArg): BNode {
    const id = this.T.add(label(keys), parent.id, pos, meta);
    const n: BNode = { id, keys, kids: [] };
    parent.kids.splice(pos, 0, n);
    return n;
  }

  /** Move `count` children of `from`, starting at `start`, to `to` at position `at`. */
  moveKids(from: BNode, start: number, count: number, to: BNode, at: number, meta?: MetaArg): void {
    const moving = from.kids.splice(start, count);
    moving.forEach((c, j) => {
      this.T.move(c.id, to.id, at + j, meta);
    });
    to.kids.splice(at, 0, ...moving);
  }

  /**
   * Re-hang children so that nodes[i].kids becomes groups[i] (same left-to-right order
   * overall), moving only the children whose parent or position changes.
   */
  rehang(nodes: BNode[], groups: BNode[][], meta?: MetaArg): void {
    nodes.forEach((t, i) => {
      groups[i]!.forEach((child, p) => {
        if (t.kids[p] === child) return;
        const from = nodes.find((n) => n.kids.includes(child))!;
        from.kids.splice(from.kids.indexOf(child), 1);
        t.kids.splice(p, 0, child);
        this.T.move(child.id, t.id, p, meta);
      });
    });
  }

  /** Remove a node that has no children (after a merge, or an emptied root). */
  removeLeaf(parent: BNode | null, n: BNode, meta?: MetaArg): void {
    if (parent) parent.kids.splice(parent.kids.indexOf(n), 1);
    else this.root = null;
    this.T.remove(n.id, meta);
    this.touched.delete(n.id);
  }

  /** The root has no keys and one child: the child becomes the root. */
  shrinkRoot(meta?: MetaArg): void {
    const r = this.root!;
    this.T.splice(r.id, meta);
    this.touched.delete(r.id);
    this.root = r.kids[0] ?? null;
  }

  mark(n: BNode, status: "frontier" | "path" | "current" = "frontier"): void {
    this.touched.add(n.id);
    this.T.status(n.id, status);
  }

  clear(line: number): void {
    for (const id of this.touched) if (this.T.has(id)) this.T.status(id, "unvisited", { line });
    this.touched.clear();
  }

  shape(): BShape | null {
    const build = (n: BNode): BShape => ({ keys: [...n.keys], children: n.kids.map(build) });
    return this.root ? build(this.root) : null;
  }
}

/**
 * Structural checks shared by B-tree oracles: keys sorted within nodes and across
 * separators, k keys ⇒ k + 1 children for internal nodes, all leaves at one depth,
 * and key counts within [minKeys, maxKeys] (the root may hold fewer).
 */
export function checkMultiway(
  s: BShape | null,
  minKeys: number,
  maxKeys: number,
  separatorsCopied = false,
  rootMax = maxKeys,
): string | null {
  if (!s) return null;
  let leafDepth = -1;
  const walk = (
    n: BShape,
    depth: number,
    lo: number,
    hi: number,
    isRoot: boolean,
  ): string | null => {
    for (let i = 0; i < n.keys.length; i++) {
      const k = n.keys[i]!;
      if (i > 0 && n.keys[i - 1]! >= k) return `keys out of order in [${n.keys}]`;
      // B-tree keys lie strictly between their separators; in a B+ tree a separator is
      // a copy of the smallest key to its right, so the lower bound is inclusive.
      if (!(separatorsCopied ? k >= lo : k > lo) || !(k < hi))
        return `key ${k} is outside its range`;
    }
    const most = isRoot ? rootMax : maxKeys;
    if (n.keys.length > most) return `[${n.keys}] holds more than ${most} keys`;
    if (!isRoot && n.keys.length < minKeys) return `[${n.keys}] holds fewer than ${minKeys} keys`;
    if (isRoot && n.keys.length === 0) return "the root is empty";
    if (!n.children.length) {
      if (leafDepth === -1) leafDepth = depth;
      return leafDepth === depth ? null : "leaves are at different depths";
    }
    if (n.children.length !== n.keys.length + 1)
      return `[${n.keys}] has ${n.children.length} children, not ${n.keys.length + 1}`;
    for (let i = 0; i < n.children.length; i++) {
      const a = i === 0 ? lo : n.keys[i - 1]!;
      const b = i === n.keys.length ? hi : n.keys[i]!;
      const e = walk(n.children[i]!, depth + 1, a, b, false);
      if (e) return e;
    }
    return null;
  };
  return walk(s, 0, -Infinity, Infinity, true);
}
