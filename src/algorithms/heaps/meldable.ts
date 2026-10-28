import type { TraceState } from "@/engine/state";
import type { TracedTree } from "@/engine/tracer";
import type { AlgorithmModule, InputSpec } from "../types";
import {
  compareResults,
  parseOps,
  randomOps,
  showOps,
  type Op,
  type OpResult,
  type OpSpec,
} from "../ops";
import { sameShape, shapeFromState, type Shape } from "../trees/balanced/common";

export type Variant = "leftist" | "skew";

export interface MeldOutput {
  results: OpResult[];
  /** The heap at the end (without the merge placeholder). */
  tree: Shape | null;
  /** Nodes on the merge paths, summed over all merges. */
  pathNodes: number;
}

const MAX_OPS = 18;
const SPEC: OpSpec = {
  insert: { value: true, aliases: ["push", "add", "i"] },
  extract: { value: false, aliases: ["pop", "extractmin", "deletemin", "x"] },
  peek: { value: false, aliases: ["min", "top"] },
};

const ops = (text: string): Op[] =>
  text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) =>
      w === "x"
        ? { name: "extract" }
        : w === "p"
          ? { name: "peek" }
          : { name: "insert", value: Number(w.slice(1)) },
    );

function meldInput(presets: InputSpec<Op[]>["presets"]): InputSpec<Op[]> {
  return {
    fields: [
      {
        name: "ops",
        label: "Operations",
        placeholder: "e.g. insert 5, insert 3, insert 8, extract, peek",
        multiline: true,
      },
    ],
    constraints: `1–${MAX_OPS} operations: insert x (0–99), extract (remove the minimum), peek.`,
    parse(f) {
      const list = parseOps(f.ops ?? "", SPEC, MAX_OPS);
      if (typeof list[0] === "string") return { ok: false, errors: list as string[] };
      return { ok: true, value: list as Op[] };
    },
    format: (list) => ({ ops: showOps(list) }),
    presets,
    random: (rng, size) =>
      randomOps(
        rng,
        Math.min(MAX_OPS, Math.max(3, size ?? 14)),
        ["insert"],
        ["extract", "extract", "peek"],
      ),
  };
}

/** Independent recursive model of both heaps, on nested objects. */
export function meldModel(
  variant: Variant,
  list: Op[],
): { results: OpResult[]; tree: Shape | null } {
  type H = { key: number; rank: number; left: H | null; right: H | null } | null;
  const rank = (h: H) => (h ? h.rank : 0);
  const merge = (a: H, b: H): H => {
    if (!a) return b;
    if (!b) return a;
    if (b.key < a.key) [a, b] = [b, a];
    a.right = merge(a.right, b);
    if (variant === "skew" || rank(a.left) < rank(a.right)) [a.left, a.right] = [a.right, a.left];
    a.rank = rank(a.right) + 1;
    return a;
  };
  let root: H = null;
  const results = list.map((op): OpResult => {
    if (op.name === "insert") {
      root = merge(root, { key: op.value!, rank: 1, left: null, right: null });
      return "ok";
    }
    if (!root) return "empty";
    const k = root.key;
    if (op.name === "extract") root = merge(root.left, root.right);
    return k;
  });
  const shape = (h: H): Shape | null =>
    h
      ? {
          key: h.key,
          ...(variant === "leftist" ? { tag: `r=${h.rank}` } : {}),
          left: shape(h.left),
          right: shape(h.right),
        }
      : null;
  return { results, tree: shape(root) };
}

interface HNode {
  id: string;
  key: number;
  rank: number;
  left: HNode | null;
  right: HNode | null;
  parent: HNode | null;
}

function makeModule(
  variant: Variant,
  presets: InputSpec<Op[]>["presets"],
): AlgorithmModule<Op[], MeldOutput> {
  const leftist = variant === "leftist";
  return {
    id: leftist ? "leftist-heap" : "skew-heap",
    version: 1,
    pseudocode: leftist
      ? [
          "merge(a, b): walk down the right spines, always following the smaller root",
          "  hang the other heap where a right spine ends",
          "  back up the path: if rank(left) < rank(right), swap the children; rank ← rank(right) + 1",
          "insert x: merge the heap with the one-node heap x",
          "extract: take the root; merge its left and right subtrees",
          "peek: the root",
        ]
      : [
          "merge(a, b): walk down the right spines, always following the smaller root",
          "  hang the other heap where a right spine ends",
          "  back up the path: swap the children of every node on it",
          "insert x: merge the heap with the one-node heap x",
          "extract: take the root; merge its left and right subtrees",
          "peek: the root",
        ],
    input: meldInput(presets),

    run(list, t) {
      const T: TracedTree = t.tree("T", {
        binary: true,
        label: leftist
          ? "Leftist heap (r = rank, the length of the right spine), merged under ⋃"
          : "Skew heap, merged under ⋃",
      });
      const top: HNode = {
        id: T.add("⋃", null, undefined, undefined, { view: true }),
        key: -1,
        rank: 0,
        left: null,
        right: null,
        parent: null,
      };
      T.annotate(top.id, "left: heap · right: incoming");
      const rank = (n: HNode | null) => (n ? n.rank : 0);
      const tag = (n: HNode) => {
        if (leftist) T.annotate(n.id, `r=${n.rank}`, { line: 3 });
      };
      const side = (n: HNode): "left" | "right" => (n.parent!.left === n ? "left" : "right");
      const setChild = (p: HNode, s: "left" | "right", c: HNode | null) => {
        p[s] = c;
        if (c) c.parent = p;
      };
      /** Exchange two subtrees (neither inside the other). */
      const swapNodes = (a: HNode, b: HNode, note?: string) => {
        const [pa, sa, pb, sb] = [a.parent!, side(a), b.parent!, side(b)];
        setChild(pa, sa, b);
        setChild(pb, sb, a);
        T.swap(a.id, b.id, { line: 1, note });
      };
      const moveTo = (n: HNode, p: HNode, s: "left" | "right", line: number, note?: string) => {
        n.parent![side(n)] = null;
        setChild(p, s, n);
        T.move(n.id, p.id, s === "left" ? 0 : 1, { line, note });
      };
      const swapChildren = (n: HNode, note: string) => {
        if (n.left && n.right) swapNodes(n.left, n.right, note);
        else if (n.left) moveTo(n.left, n, "right", 3, note);
        else if (n.right) moveTo(n.right, n, "left", 3, note);
      };
      let pathNodes = 0;
      const meld = () => {
        if (!top.right) return;
        if (!top.left) {
          moveTo(
            top.right,
            top,
            "left",
            2,
            "The heap was empty: the incoming heap becomes the heap.",
          );
          return;
        }
        t.tally("comparisons");
        if (top.right.key < top.left.key)
          swapNodes(
            top.left,
            top.right,
            `${top.right.key} < ${top.left.key}: the incoming root is smaller, so it becomes the top.`,
          );
        const path: HNode[] = [];
        let cur = top.left!;
        for (;;) {
          path.push(cur);
          T.status(cur.id, "path", { line: 1 });
          const pending = top.right!;
          if (!cur.right) {
            moveTo(
              pending,
              cur,
              "right",
              2,
              `${cur.key}'s right spine ends here: hang the other heap (root ${pending.key}) as its right child.`,
            );
            break;
          }
          t.tally("comparisons");
          if (pending.key < cur.right.key)
            swapNodes(
              cur.right,
              pending,
              `${pending.key} < ${cur.right.key}: the other heap's root is smaller, so swap it into ${cur.key}'s right spine.`,
            );
          else
            t.step({
              line: 1,
              note: `${cur.right.key} ≤ ${pending.key}: follow ${cur.key}'s right child.`,
            });
          cur = cur.right!;
        }
        pathNodes += path.length;
        for (let i = path.length - 1; i >= 0; i--) {
          const n = path[i]!;
          if (leftist) {
            if (rank(n.left) < rank(n.right))
              swapChildren(
                n,
                `rank(left) = ${rank(n.left)} < rank(right) = ${rank(n.right)} at ${n.key}: swap its children.`,
              );
            n.rank = rank(n.right) + 1;
            tag(n);
          } else swapChildren(n, `Swap the children of ${n.key}.`);
          T.status(n.id, "unvisited", { line: 3 });
        }
      };

      const results: OpResult[] = [];
      for (const op of list) {
        if (op.name === "insert") {
          const id = T.add(op.value!, top.id, 1, {
            line: 4,
            note: `Insert ${op.value}: merge the heap with a one-node heap.`,
          });
          setChild(top, "right", {
            id,
            key: op.value!,
            rank: 1,
            left: null,
            right: null,
            parent: null,
          });
          tag(top.right!);
          meld();
          results.push("ok");
          continue;
        }
        const root = top.left;
        if (!root) {
          t.step({ line: op.name === "peek" ? 6 : 5, note: `${op.name}: the heap is empty.` });
          results.push("empty");
          continue;
        }
        if (op.name === "peek") {
          T.status(root.id, "current", {
            line: 6,
            note: `The minimum is ${root.key}, at the root.`,
          });
          T.status(root.id, "unvisited", { line: 6 });
          results.push(root.key);
          continue;
        }
        const k = root.key;
        if (root.right) moveTo(root.right, top, "right", 5);
        if (root.left) {
          const l = root.left;
          T.splice(root.id, { line: 5, note: `Extract ${k}; merge its two subtrees.` });
          setChild(top, "left", l);
        } else {
          T.remove(root.id, { line: 5, note: `Extract ${k}.` });
          top.left = null;
        }
        meld();
        results.push(k);
      }
      const shape = (n: HNode | null): Shape | null =>
        n
          ? {
              key: n.key,
              ...(leftist ? { tag: `r=${n.rank}` } : {}),
              left: shape(n.left),
              right: shape(n.right),
            }
          : null;
      const output: MeldOutput = { results, tree: shape(top.left), pathNodes };
      t.finish(list, output, {
        line: 6,
        note: top.left
          ? `The minimum is ${top.left.key}; ${pathNodes} nodes were on merge paths in all.`
          : "The heap is empty.",
      });
      return output;
    },

    check(list, out) {
      const model = meldModel(variant, list);
      const r = compareResults(list, out.results, model.results);
      if (r) return r;
      // Independent property checks on the final shape.
      const walk = (s: Shape | null, parent: number): string | null => {
        if (!s) return null;
        if (s.key < parent) return `heap order broken at ${s.key}`;
        return walk(s.left, s.key) ?? walk(s.right, s.key);
      };
      const e = walk(out.tree, -Infinity);
      if (e) return e;
      if (leftist) {
        const rank = (s: Shape | null): number => (s ? Number(s.tag!.slice(2)) : 0);
        const lp = (s: Shape | null): string | null => {
          if (!s) return null;
          if (rank(s.left) < rank(s.right)) return `leftist property broken at ${s.key}`;
          if (rank(s) !== rank(s.right) + 1) return `rank of ${s.key} is wrong`;
          return lp(s.left) ?? lp(s.right);
        };
        const e2 = lp(out.tree);
        if (e2) return e2;
      }
      return sameShape(out.tree, model.tree) ? null : "the heap differs from the recursive merge";
    },

    fidelity(state: TraceState, out) {
      const T = state.structures.T;
      if (T?.kind !== "tree") return "no tree";
      const full = shapeFromState(T);
      if (!full || full.right) return "the merge placeholder is not empty";
      return sameShape(full.left, out.tree) ? null : "the drawn heap differs from the result";
    },

    describeOutput: (o) =>
      `${o.results.filter((r) => r !== "ok").join(", ") || "no removals"}; ${o.pathNodes} nodes on merge paths`,
  };
}

export const leftistHeap = makeModule("leftist", [
  { id: "classic", label: "Inserts, then extracts", value: ops("i5 i9 i2 i7 i1 i8 i3 x x p") },
  {
    id: "ascending",
    label: "Ascending inserts stay shallow on the right",
    value: ops("i1 i2 i3 i4 i5 i6 i7 x"),
  },
  {
    id: "drain",
    label: "Extract everything (heap sort)",
    value: ops("i6 i2 i9 i4 i1 i7 x x x x x x x"),
  },
]);

export const skewHeap = makeModule("skew", [
  { id: "classic", label: "Inserts, then extracts", value: ops("i5 i9 i2 i7 i1 i8 i3 x x p") },
  { id: "ascending", label: "Ascending inserts", value: ops("i1 i2 i3 i4 i5 i6 i7 x") },
  {
    id: "drain",
    label: "Extract everything (heap sort)",
    value: ops("i6 i2 i9 i4 i1 i7 x x x x x x x"),
  },
]);
