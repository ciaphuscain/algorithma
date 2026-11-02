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

export interface ReverseInput {
  values: number[];
  /** Group size; the whole list when k equals its length. */
  k: number;
}

export interface ReverseOutput {
  /** Values from head to tail after reversal. */
  values: number[];
  /** Pointer changes made (writes to next fields, including the head pointer). */
  pointerWrites: number;
}

const HEAD = -1;
const id = (i: number) => (i === HEAD ? "H" : nodeId(i));

const input: InputSpec<ReverseInput> = {
  fields: [
    { name: "values", label: "List (head first)", placeholder: "e.g. 1, 2, 3, 4, 5" },
    {
      name: "k",
      label: "Reverse in groups of k (blank: the whole list)",
      placeholder: "e.g. 2",
    },
  ],
  constraints: `1–${MAX_LIST} whole numbers from −99 to 99; k from 1 to the list's length. A last group shorter than k is left as it is.`,
  parse(f) {
    const values = parseList(f.values);
    const errors: string[] = typeof values === "string" ? [values] : [];
    const ks = (f.k ?? "").trim();
    const n = typeof values === "string" ? MAX_LIST : values.length;
    const k = ks === "" ? n : /^\d+$/.test(ks) ? Number(ks) : NaN;
    if (!(k >= 1 && k <= n)) errors.push(`k must be a whole number from 1 to ${n}`);
    return errors.length
      ? { ok: false, errors }
      : { ok: true, value: { values: values as number[], k } };
  },
  format: (v) => ({ values: v.values.join(", "), k: v.k === v.values.length ? "" : String(v.k) }),
  presets: [
    { id: "classic", label: "Reverse a list of five", value: { values: [1, 2, 3, 4, 5], k: 5 } },
    { id: "pairs", label: "Reverse in pairs (k = 2)", value: { values: [1, 2, 3, 4, 5], k: 2 } },
    {
      id: "groups",
      label: "Groups of three; the last two stay",
      value: { values: [10, 20, 30, 40, 50, 60, 70, 80], k: 3 },
    },
  ],
  random(rng, size) {
    const n = Math.min(MAX_LIST, Math.max(1, size ?? 6));
    const values = Array.from({ length: n }, () => rng.int(1, 99));
    return { values, k: rng.int(0, 1) ? n : rng.int(1, n) };
  },
};

/**
 * Reverses a singly linked list in groups of k nodes (the whole list when k = n) by
 * re-pointing next fields: within a group, each node's next is turned to point at
 * the node before it. A sentinel "head" node holds the head pointer, so the first
 * group needs no special case.
 */
export const reverseList: AlgorithmModule<ReverseInput, ReverseOutput> = {
  id: "reverse-linked-list",
  version: 1,
  pseudocode: [
    "procedure reverseInGroups(head, k)",
    "  before ← the head pointer",
    "  while k nodes follow before",
    "    first ← before.next;  prev ← the node after the group;  curr ← first",
    "    repeat k times:  next ← curr.next;  curr.next ← prev;  prev ← curr;  curr ← next",
    "    before.next ← prev   // the group's last node becomes its first",
    "    before ← first       // and its first node becomes its last",
    "  return head",
  ],
  input,

  run(input, t) {
    const { values, k } = input;
    const n = values.length;
    const nodes = [
      { id: "H", label: "head", x: 0.02, y: 0.5 },
      ...listNodes(values).map((p) => ({ ...p, x: Number((0.14 + 0.84 * p.x).toFixed(4)) })),
    ];
    const G = t.graph("L", { directed: true, nodes, edges: [], label: "The list" });
    const next = new ListPointers(G, id);
    next.set(HEAD, 0, { line: 1, note: `The list ${values.join(" → ")}.` });
    for (let i = 0; i + 1 < n; i++) next.set(i, i + 1, { line: 1 });
    const built = next.assignments;
    // Show which nodes the variables point at, as labels under the nodes.
    const roles = pointerLabels(t, G, id);
    let before = HEAD;
    let groups = 0;
    for (;;) {
      // Check that k nodes follow `before`.
      let probe = next.get(before);
      let count = 0;
      while (probe !== null && count < k) {
        probe = next.get(probe);
        count++;
      }
      if (count < k) {
        roles(
          { before },
          {
            line: 3,
            note:
              count === 0
                ? "No nodes left: done."
                : `Only ${count} node${count === 1 ? "" : "s"} left, fewer than k = ${k}: leave them as they are.`,
          },
        );
        break;
      }
      groups++;
      const first = next.get(before)!;
      let prev: number | null = probe;
      let curr: number | null = first;
      roles(
        { before, first, prev, curr },
        {
          line: 4,
          note: `Group ${groups}: reverse the ${k} nodes starting at ${values[first]}.`,
        },
      );
      for (let s = 0; s < k; s++) {
        const nxt: number | null = next.get(curr!);
        next.set(curr!, prev, {
          line: 5,
          note: `${values[curr!]}.next ← ${prev === null ? "null" : values[prev]}.`,
        });
        prev = curr;
        curr = nxt;
        roles({ before, first, prev, curr }, { line: 5 });
      }
      next.set(before, prev, {
        line: 6,
        note: `${before === HEAD ? "head" : values[before]}.next ← ${values[prev!]}, the group's new first node.`,
      });
      before = first;
      roles({ before }, { line: 7 });
    }
    roles({}, { line: 8 });
    const order = next.walk(next.get(HEAD));
    const output: ReverseOutput = {
      values: order.map((i) => values[i]!),
      pointerWrites: next.assignments - built,
    };
    t.finish(input, output, { line: 8, note: `The list is now ${output.values.join(" → ")}.` });
    return output;
  },

  check(input, out) {
    // Independent oracle: reverse each full group of k with array slices.
    const { values, k } = input;
    const want: number[] = [];
    for (let i = 0; i < values.length; i += k) {
      const group = values.slice(i, i + k);
      want.push(...(group.length === k ? group.reverse() : group));
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

  describeOutput: (o) => o.values.join(" → "),
};
