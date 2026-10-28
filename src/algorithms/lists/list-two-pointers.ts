import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import {
  ListPointers,
  pointerLabels,
  listNodes,
  nodeId,
  parseList,
  walkState,
  MAX_LIST,
} from "./common";

export type ListOp =
  { kind: "palindrome" } | { kind: "remove"; n: number } | { kind: "rotate"; k: number };

export interface TwoPointerInput {
  values: number[];
  op: ListOp;
}

export interface TwoPointerOutput {
  /** The list afterwards, head to tail (unchanged for the palindrome check). */
  values: number[];
  /** For the palindrome check. */
  palindrome: boolean | null;
}

const HEAD = -1;
const id = (i: number) => (i === HEAD ? "H" : nodeId(i));

const showOp = (op: ListOp) =>
  op.kind === "palindrome"
    ? "palindrome"
    : op.kind === "remove"
      ? `remove ${op.n}`
      : `rotate ${op.k}`;

const input: InputSpec<TwoPointerInput> = {
  fields: [
    { name: "values", label: "List (head first)", placeholder: "e.g. 1, 2, 3, 2, 1" },
    {
      name: "op",
      label: "Operation: palindrome, remove n (n-th from the end), or rotate k (right by k)",
      placeholder: "e.g. remove 2",
    },
  ],
  constraints: `1–${MAX_LIST} whole numbers from −99 to 99. "remove n" needs 1 ≤ n ≤ the list's length; "rotate k" takes 0 ≤ k ≤ 99.`,
  parse(f) {
    const values = parseList(f.values);
    const errors: string[] = typeof values === "string" ? [values] : [];
    const len = typeof values === "string" ? MAX_LIST : values.length;
    const text = (f.op ?? "").trim().toLowerCase();
    let op: ListOp | null = null;
    let m: RegExpExecArray | null;
    if (text === "palindrome") op = { kind: "palindrome" };
    else if ((m = /^remove\s+(\d+)$/.exec(text))) {
      const n = Number(m[1]);
      if (n < 1 || n > len) errors.push(`remove n needs n from 1 to ${len}`);
      op = { kind: "remove", n };
    } else if ((m = /^rotate\s+(\d+)$/.exec(text))) {
      const k = Number(m[1]);
      if (k > 99) errors.push("rotate k needs k from 0 to 99");
      op = { kind: "rotate", k };
    } else errors.push('The operation must be "palindrome", "remove n" or "rotate k"');
    return errors.length
      ? { ok: false, errors }
      : { ok: true, value: { values: values as number[], op: op! } };
  },
  format: (v) => ({ values: v.values.join(", "), op: showOp(v.op) }),
  presets: [
    {
      id: "classic",
      label: "Is 1 2 3 2 1 a palindrome?",
      value: { values: [1, 2, 3, 2, 1], op: { kind: "palindrome" } },
    },
    {
      id: "not",
      label: "1 2 3 3 1 is not",
      value: { values: [1, 2, 3, 3, 1], op: { kind: "palindrome" } },
    },
    {
      id: "remove",
      label: "Remove the 2nd node from the end",
      value: { values: [1, 2, 3, 4, 5], op: { kind: "remove", n: 2 } },
    },
    {
      id: "rotate",
      label: "Rotate right by 7 (7 mod 5 = 2)",
      value: { values: [1, 2, 3, 4, 5], op: { kind: "rotate", k: 7 } },
    },
  ],
  random(rng, size) {
    const n = Math.min(MAX_LIST, Math.max(1, size ?? 6));
    const half = Array.from({ length: Math.ceil(n / 2) }, () => rng.int(1, 9));
    const pal = [...half, ...half.slice(0, Math.floor(n / 2)).reverse()];
    const r = rng.int(0, 3);
    const values = r === 0 ? pal : Array.from({ length: n }, () => rng.int(1, 9));
    const op: ListOp =
      r <= 1
        ? { kind: "palindrome" }
        : r === 2
          ? { kind: "remove", n: rng.int(1, n) }
          : { kind: "rotate", k: rng.int(0, 12) };
    return { values, op };
  },
};

/**
 * Three classic linked-list techniques built on pointers moving at different speeds or
 * a fixed distance apart: a palindrome check (find the middle with slow and fast
 * pointers, reverse the second half, compare, and restore), removing the n-th node from
 * the end (a lead pointer n nodes ahead of a trailing one), and rotating right by k
 * (find the length, close the list into a ring, and cut it at the new tail).
 */
export const listTwoPointers: AlgorithmModule<TwoPointerInput, TwoPointerOutput> = {
  id: "list-two-pointers",
  version: 1,
  pseudocode: [
    "palindrome: slow, fast ← head;  while fast.next and fast.next.next: slow ← slow.next;  fast ← fast.next.next",
    "  reverse the list after slow;  compare it with the first half, node by node;  reverse it back",
    "remove n-th from end: lead ← trail ← the head pointer;  move lead n nodes ahead",
    "  while lead.next exists: lead ← lead.next;  trail ← trail.next",
    "  trail.next ← trail.next.next   // unlink the n-th node from the end",
    "rotate right by k: walk to the tail, counting the length L;  k ← k mod L",
    "  tail.next ← head (a ring);  walk L − k − 1 nodes to the new tail;  head ← new tail.next;  new tail.next ← null",
  ],
  input,

  run(input, t) {
    const { values, op } = input;
    const n = values.length;
    const nodes = [
      { id: "H", label: "head", x: 0.02, y: 0.5 },
      ...listNodes(values).map((p) => ({ ...p, x: Number((0.14 + 0.84 * p.x).toFixed(4)) })),
    ];
    const G = t.graph("L", { directed: true, nodes, edges: [], label: "The list" });
    const next = new ListPointers(G, id);
    next.set(HEAD, 0, { line: 1 });
    for (let i = 0; i + 1 < n; i++) next.set(i, i + 1, { line: 1 });
    const roles = pointerLabels(t, G, id);
    const val = (i: number) => (i === HEAD ? "head" : String(values[i]));
    let palindrome: boolean | null = null;

    // Reverse the list starting at `from`; returns the new first node.
    const reverse = (from: number | null, line: number) => {
      let prev: number | null = null;
      let curr = from;
      while (curr !== null) {
        const nxt = next.get(curr);
        next.set(curr, prev, { line });
        prev = curr;
        curr = nxt;
      }
      return prev;
    };

    if (op.kind === "palindrome") {
      let slow = 0;
      let fast = 0;
      roles({ slow, fast }, { line: 1, note: "Find the middle: slow moves one node, fast two." });
      while (next.get(fast) !== null && next.get(next.get(fast)!) !== null) {
        slow = next.get(slow)!;
        fast = next.get(next.get(fast)!)!;
        t.tally("moves", 3);
        roles({ slow, fast }, { line: 1, note: `slow at ${val(slow)}, fast at ${val(fast)}.` });
      }
      const secondHead = next.get(slow);
      roles({ slow }, { line: 2, note: `The first half ends at ${val(slow)}. Reverse the rest.` });
      const r = reverse(secondHead, 2);
      next.set(slow, null, { line: 2 });
      let [a, b] = [0 as number | null, r];
      palindrome = true;
      while (b !== null) {
        t.tally("comparisons");
        const same = values[a!] === values[b];
        roles({ a, b }, { line: 2, note: `${val(a!)} ${same ? "=" : "≠"} ${val(b)}.` });
        if (!same) {
          palindrome = false;
          break;
        }
        a = next.get(a!);
        b = next.get(b);
      }
      roles(
        {},
        { line: 2, note: "Restore the list: reverse the second half back and reattach it." },
      );
      next.set(slow, reverse(r, 2), { line: 2 });
      t.step({
        line: 2,
        note: palindrome
          ? "Every pair matched: a palindrome."
          : "A pair differs: not a palindrome.",
      });
    } else if (op.kind === "remove") {
      let lead = HEAD;
      let trail = HEAD;
      roles(
        { lead, trail },
        { line: 3, note: `Move lead ${op.n} node${op.n === 1 ? "" : "s"} ahead of trail.` },
      );
      for (let s = 0; s < op.n; s++) {
        lead = next.get(lead)!;
        t.tally("moves");
        roles({ lead, trail }, { line: 3 });
      }
      while (next.get(lead) !== null) {
        lead = next.get(lead)!;
        trail = next.get(trail)!;
        t.tally("moves", 2);
        roles({ lead, trail }, { line: 4 });
      }
      const gone = next.get(trail)!;
      roles(
        { trail },
        {
          line: 5,
          note: `lead is at the tail, so ${val(gone)} after trail is the ${op.n}-th node from the end.`,
        },
      );
      next.set(trail, next.get(gone), {
        line: 5,
        note: `${val(trail)}.next ← ${next.get(gone) === null ? "null" : val(next.get(gone)!)}: ${val(gone)} is unlinked.`,
      });
      next.set(gone, null, { line: 5 });
      G.node(id(gone), "unreachable", { line: 5 });
    } else {
      let tail = 0;
      let len = 1;
      while (next.get(tail) !== null) {
        tail = next.get(tail)!;
        len++;
        t.tally("moves");
      }
      const k = op.k % len;
      roles(
        { tail },
        {
          line: 6,
          note: `The length is ${len}; rotating by ${op.k} is the same as by ${op.k} mod ${len} = ${k}.`,
        },
      );
      if (k > 0) {
        next.set(tail, next.get(HEAD), {
          line: 7,
          note: `${val(tail)}.next ← head: the list becomes a ring.`,
        });
        let newTail = next.get(HEAD)!;
        for (let s = 0; s < len - k - 1; s++) {
          newTail = next.get(newTail)!;
          t.tally("moves");
        }
        const newHead = next.get(newTail)!;
        roles({ "new tail": newTail, "new head": newHead }, { line: 7 });
        next.set(HEAD, newHead, { line: 7, note: `head ← ${val(newHead)}.` });
        next.set(newTail, null, { line: 7, note: `${val(newTail)}.next ← null: the ring is cut.` });
      } else t.step({ line: 6, note: "Nothing to do." });
    }
    roles({}, { line: 1 });
    const order = next.walk(next.get(HEAD));
    const output: TwoPointerOutput = { values: order.map((i) => values[i]!), palindrome };
    t.finish(input, output, {
      note:
        op.kind === "palindrome"
          ? `${palindrome ? "A palindrome" : "Not a palindrome"}; the list is restored.`
          : `The list is now ${output.values.join(" → ") || "empty"}.`,
    });
    return output;
  },

  check(input, out) {
    const { values, op } = input;
    if (op.kind === "palindrome") {
      const want = values.join() === [...values].reverse().join();
      if (out.palindrome !== want) return `palindrome = ${out.palindrome}, expected ${want}`;
      return out.values.join() === values.join() ? null : "the list was not restored";
    }
    let want: number[];
    if (op.kind === "remove") want = values.filter((_, i) => i !== values.length - op.n);
    else {
      const k = op.k % values.length;
      want = [...values.slice(values.length - k), ...values.slice(0, values.length - k)];
    }
    return out.values.join() === want.join() ? null : `got ${out.values}, expected ${want}`;
  },

  fidelity(state: TraceState, out) {
    const chain = walkState(state, "L", "H");
    if (typeof chain === "string") return chain;
    const g = state.structures.L;
    if (g?.kind !== "graph") return "no graph";
    const shown = chain.slice(1).map((nid) => Number(g.nodes.find((x) => x.id === nid)!.label));
    return shown.join() === out.values.join() ? null : `the drawn list reads ${shown}`;
  },

  describeOutput: (o) =>
    o.palindrome === null
      ? o.values.join(" → ") || "empty"
      : o.palindrome
        ? "A palindrome"
        : "Not a palindrome",
};
