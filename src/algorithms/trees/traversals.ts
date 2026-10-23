import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { TracedArray } from "@/engine/tracer";
import type { AlgorithmModule, InputSpec, ParseResult } from "../types";
import { clamp } from "../inputs";

/** Level-order description: null marks a missing child (LeetCode-style, nulls have no children listed). */
export type LevelOrder = (number | null)[];

export interface TraversalOutput {
  preorder: number[];
  inorder: number[];
  postorder: number[];
  levelorder: number[];
}

const MAX_NODES = 15;

export function parseLevelOrder(text: string): ParseResult<LevelOrder> {
  const tokens = text
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  const errors: string[] = [];
  const values: LevelOrder = [];
  for (const tok of tokens) {
    if (tok === "-" || tok.toLowerCase() === "null") values.push(null);
    else if (/^-?\d+$/.test(tok) && Math.abs(Number(tok)) <= 99) values.push(Number(tok));
    else errors.push(`"${tok}" is not a whole number from −99 to 99 or “-”`);
  }
  while (values.length > 0 && values[values.length - 1] === null) values.pop();
  if (values.length === 0 || values[0] === null)
    errors.push("The root (first value) must be a number");
  const count = values.filter((v) => v !== null).length;
  if (count > MAX_NODES)
    errors.push(`${count} nodes; the visualizer supports at most ${MAX_NODES}`);
  // Every listed child slot must belong to an existing node.
  let slots = values[0] === null || values.length === 0 ? 0 : 2;
  for (let i = 1; i < values.length; i++) {
    if (slots === 0) {
      errors.push("Too many values: some are children of missing nodes");
      break;
    }
    slots -= 1;
    if (values[i] !== null) slots += 2;
  }
  return errors.length ? { ok: false, errors: errors.slice(0, 5) } : { ok: true, value: values };
}

const traversalInput: InputSpec<LevelOrder> = {
  fields: [
    {
      name: "tree",
      label: "Tree in level order",
      placeholder: "e.g. 1, 2, 3, 4, 5, -, 6",
      help: "Read row by row, left to right. Write - for a missing child; missing nodes have no children listed.",
    },
  ],
  constraints: `1–${MAX_NODES} nodes, whole numbers from −99 to 99.`,
  parse: (fields) => parseLevelOrder(fields.tree ?? ""),
  format: (v) => ({ tree: v.map((x) => (x === null ? "-" : String(x))).join(", ") }),
  presets: [
    { id: "classic", label: "Six-node tree", value: [1, 2, 3, 4, 5, null, 6] },
    { id: "full", label: "Full tree", value: [8, 4, 12, 2, 6, 10, 14] },
    { id: "chain", label: "Left chain", value: [5, 4, null, 3, null, 2] },
  ],
  random(rng, size) {
    const n = clamp(size ?? 7, 1, MAX_NODES);
    const values: LevelOrder = [rng.int(1, 30)];
    let slots = 2;
    let placed = 1;
    while (placed < n && slots > 0) {
      slots--;
      if (rng.next() < 0.75) {
        values.push(rng.int(1, 30));
        placed++;
        slots += 2;
      } else values.push(null);
    }
    while (values.length > 0 && values[values.length - 1] === null) values.pop();
    return values;
  },
};

export const binaryTreeTraversals: AlgorithmModule<LevelOrder, TraversalOutput> = {
  id: "tree-traversals",
  version: 1,
  pseudocode: [
    "procedure preorder(v):  if v ≠ nil: visit v; preorder(v.left); preorder(v.right)",
    "procedure inorder(v):   if v ≠ nil: inorder(v.left); visit v; inorder(v.right)",
    "procedure postorder(v): if v ≠ nil: postorder(v.left); postorder(v.right); visit v",
    "procedure levelorder(root)",
    "  Q ← [root]",
    "  while Q is not empty: v ← dequeue(Q); visit v; enqueue v's children",
  ],
  input: traversalInput,

  run(input, t) {
    const T = t.tree("T", { binary: true, label: "Binary tree" });
    const n = input.filter((v) => v !== null).length;
    const blank = (): Scalar[] => Array.from({ length: n }, () => null);
    const arrays: Record<string, TracedArray> = {
      pre: t.array("pre", blank(), { label: "Preorder", display: "cells" }),
      in: t.array("in", blank(), { label: "Inorder", display: "cells" }),
      post: t.array("post", blank(), { label: "Postorder", display: "cells" }),
      level: t.array("level", blank(), { label: "Level order", display: "cells" }),
    };
    const S = t.sequence("S", "stack", { label: "Call stack" });

    // Build from level order (the parse step guarantees the description is consistent).
    t.step({ note: "Build the tree from its level-order description." });
    const ids: string[] = [];
    let k = 0;
    const root = T.add(input[0] as number, null, undefined, { note: `Root ${input[0]}.` });
    ids.push(root);
    const queue = [root];
    for (let i = 1; i < input.length; i++) {
      const parent = queue[Math.floor(k / 2)]!;
      const slot = (k % 2) as 0 | 1;
      k++;
      const v = input[i];
      if (v !== null && v !== undefined) {
        const id = T.add(v, parent, slot, {
          note: `${v} is the ${slot === 0 ? "left" : "right"} child of ${T.value(parent)}.`,
        });
        ids.push(id);
        queue.push(id);
      }
    }

    const reset = (line: number) => ids.forEach((id) => T.status(id, "unvisited", { line }));
    const out: Record<string, number[]> = { pre: [], in: [], post: [], level: [] };
    const visit = (key: string, id: string, line: number, name: string) => {
      const pos = out[key]!.length;
      out[key]!.push(T.num(id));
      T.status(id, "visited", { line, note: `${name}: visit ${T.value(id)}.` });
      arrays[key]!.write(pos, T.num(id), { line });
    };

    const dfs = (key: "pre" | "in" | "post", line: number, name: string) => {
      const go = (id: string | null) => {
        if (id === null) return;
        S.push(`${key}(${T.value(id)})`, { line });
        T.status(id, "current", { line });
        if (key === "pre") visit(key, id, line, name);
        go(T.child(id, 0));
        if (key === "in") visit(key, id, line, name);
        go(T.child(id, 1));
        if (key === "post") visit(key, id, line, name);
        S.pop({ line });
      };
      t.step({
        line,
        vars: { traversal: name },
        note: `${name}: ${["root, left, right", "left, root, right", "left, right, root"][line - 1]}.`,
      });
      go(T.root);
      reset(line);
    };
    dfs("pre", 1, "Preorder");
    dfs("in", 2, "Inorder");
    dfs("post", 3, "Postorder");

    const Q = t.sequence("Q", "queue", { label: "Queue" });
    t.step({
      line: 4,
      vars: { traversal: "Level order" },
      note: "Level order: visit the tree row by row with a queue.",
    });
    Q.push(T.value(T.root!), { line: 5 });
    const pending = [T.root!];
    while (pending.length > 0) {
      const id = pending.shift()!;
      Q.pop({ line: 6 });
      visit("level", id, 6, "Level order");
      for (const c of T.children(id)) {
        if (c !== null) {
          pending.push(c);
          Q.push(T.value(c), { line: 6 });
        }
      }
    }
    const output: TraversalOutput = {
      preorder: out.pre!,
      inorder: out.in!,
      postorder: out.post!,
      levelorder: out.level!,
    };
    t.finish(input, output, {
      vars: { traversal: null },
      note: "All four traversals are complete.",
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: array-index tree built separately, iterative traversals with explicit stacks.
    type N = { v: number; l: N | null; r: N | null };
    const root: N = { v: input[0] as number, l: null, r: null };
    const q: N[] = [root];
    let k = 0;
    for (let i = 1; i < input.length; i++) {
      const p = q[Math.floor(k / 2)]!;
      const isLeft = k % 2 === 0;
      k++;
      if (input[i] === null) continue;
      const node: N = { v: input[i] as number, l: null, r: null };
      if (isLeft) p.l = node;
      else p.r = node;
      q.push(node);
    }
    const pre: number[] = [];
    const ino: number[] = [];
    const post: number[] = [];
    const st: N[] = [root];
    while (st.length) {
      const n = st.pop()!;
      pre.push(n.v);
      if (n.r) st.push(n.r);
      if (n.l) st.push(n.l);
    }
    let cur: N | null = root;
    const st2: N[] = [];
    while (cur || st2.length) {
      while (cur) {
        st2.push(cur);
        cur = cur.l;
      }
      cur = st2.pop()!;
      ino.push(cur.v);
      cur = cur.r;
    }
    const st3: N[] = [root];
    while (st3.length) {
      const n = st3.pop()!;
      post.unshift(n.v);
      if (n.l) st3.push(n.l);
      if (n.r) st3.push(n.r);
    }
    const level = q.map((n) => n.v);
    const want = { preorder: pre, inorder: ino, postorder: post, levelorder: level };
    return JSON.stringify(want) === JSON.stringify(out)
      ? null
      : `expected ${JSON.stringify(want)}, got ${JSON.stringify(out)}`;
  },

  fidelity(state: TraceState, out) {
    const pairs: [string, number[]][] = [
      ["pre", out.preorder],
      ["in", out.inorder],
      ["post", out.postorder],
      ["level", out.levelorder],
    ];
    for (const [name, want] of pairs) {
      const a = state.structures[name];
      if (!a || a.kind !== "array" || JSON.stringify(a.values) !== JSON.stringify(want))
        return `${name} array differs`;
    }
    return null;
  },

  describeOutput: (o) =>
    `Pre ${o.preorder.join(" ")} · In ${o.inorder.join(" ")} · Post ${o.postorder.join(" ")} · Level ${o.levelorder.join(" ")}`,
};
