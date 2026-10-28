import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { ListPointers, listNodes, walkState } from "./common";

export interface MergeInput {
  /** Two to four sorted lists. */
  lists: number[][];
}

export interface MergeOutput {
  values: number[];
  /** Merged order as [list, position] pairs, to check stability. */
  from: [number, number][];
}

const MAX_LISTS = 4;
const MAX_EACH = 5;

const input: InputSpec<MergeInput> = {
  fields: [
    {
      name: "lists",
      label: "Sorted lists (one per line, or separated by |)",
      placeholder: "e.g. 1 4 5 | 1 3 4 | 2 6",
      multiline: true,
    },
  ],
  constraints: `2–${MAX_LISTS} lists, each of 1–${MAX_EACH} whole numbers from −99 to 99 in non-decreasing order.`,
  parse(f) {
    const errors: string[] = [];
    const lists = (f.lists ?? "")
      .split(/[\n|]+/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line, k) => {
        const values = line
          .split(/[\s,]+/)
          .filter(Boolean)
          .map(Number);
        if (values.some((v) => !Number.isInteger(v) || v < -99 || v > 99))
          errors.push(`List ${k + 1}: values must be whole numbers from −99 to 99`);
        if (values.length > MAX_EACH) errors.push(`List ${k + 1} has more than ${MAX_EACH} values`);
        if (values.some((v, i) => i > 0 && v < values[i - 1]!))
          errors.push(`List ${k + 1} is not sorted`);
        return values;
      });
    if (lists.length < 2 || lists.length > MAX_LISTS) errors.push(`Give 2 to ${MAX_LISTS} lists`);
    return errors.length
      ? { ok: false, errors: errors.slice(0, 5) }
      : { ok: true, value: { lists } };
  },
  format: (v) => ({ lists: v.lists.map((l) => l.join(" ")).join(" | ") }),
  presets: [
    {
      id: "classic",
      label: "Merge two sorted lists",
      value: {
        lists: [
          [1, 2, 4],
          [1, 3, 4],
        ],
      },
    },
    {
      id: "k",
      label: "Merge three lists with a priority queue",
      value: {
        lists: [
          [1, 4, 5],
          [1, 3, 4],
          [2, 6],
        ],
      },
    },
    {
      id: "uneven",
      label: "Lists of different lengths",
      value: { lists: [[5], [1, 2, 3, 8, 9], [4, 7], [6]] },
    },
  ],
  random(rng) {
    const k = rng.int(2, MAX_LISTS);
    return {
      lists: Array.from({ length: k }, () =>
        Array.from({ length: rng.int(1, MAX_EACH) }, () => rng.int(0, 30)).sort((a, b) => a - b),
      ),
    };
  },
};

/**
 * Merges sorted linked lists into one by re-pointing next fields, without copying
 * nodes. A priority queue holds the current head of each list; the smallest head is
 * appended to the merged list and replaced by its successor. With two lists this is
 * the classic merge of two sorted lists. Ties go to the earlier list, so the merge is
 * stable.
 */
export const mergeLists: AlgorithmModule<MergeInput, MergeOutput> = {
  id: "merge-sorted-lists",
  version: 1,
  pseudocode: [
    "procedure merge(lists)",
    "  tail ← a dummy node D;  put the head of every non-empty list in a priority queue",
    "  while the queue is not empty",
    "    take the smallest head x (ties: the earlier list)",
    "    tail.next ← x;  tail ← x",
    "    if x.next exists: put x.next in the queue",
    "  return D.next",
  ],
  input,

  run(input, t) {
    const { lists } = input;
    const k = lists.length;
    // Node index: lists flattened in order; id of list j's i-th node.
    const offsets = lists.map((_, j) => lists.slice(0, j).reduce((a, l) => a + l.length, 0));
    const idx = (j: number, i: number) => offsets[j]! + i;
    const total = lists.reduce((a, l) => a + l.length, 0);
    const D = total; // dummy node index
    const id = (x: number) => (x === D ? "D" : `n${x}`);
    const listOf = (x: number) => {
      let j = 0;
      while (j + 1 < k && offsets[j + 1]! <= x) j++;
      return j;
    };
    const value = (x: number) => lists[listOf(x)]![x - offsets[listOf(x)]!]!;
    const nodes = [
      { id: "D", label: "D", x: 0.03, y: 0.08 },
      ...lists.flatMap((l, j) =>
        listNodes(l, { row: j, rows: k, offset: offsets[j], idOf: (i) => `n${i}` }).map((p) => ({
          ...p,
          x: Number((0.15 + 0.8 * p.x).toFixed(4)),
        })),
      ),
    ];
    const G = t.graph("L", { directed: true, nodes, edges: [], label: "Lists, one per row" });
    const next = new ListPointers(G, id);
    lists.forEach((l, j) =>
      l.forEach((_, i) => i + 1 < l.length && next.set(idx(j, i), idx(j, i + 1), { line: 1 })),
    );
    const Q = t.sequence("Q", "priority", { label: "Priority queue of list heads (value·list)" });
    const queue: number[] = [];
    const show = (x: number) => `${value(x)}·L${listOf(x) + 1}`;
    lists.forEach((l, j) => {
      if (l.length) {
        queue.push(idx(j, 0));
        Q.push(show(idx(j, 0)), { line: 2 });
      }
    });
    G.annotate("D", "tail", {
      line: 2,
      note: "tail starts at the dummy node D; the queue holds each list's head.",
    });
    let tail = D;
    const values: number[] = [];
    const from: [number, number][] = [];
    while (queue.length) {
      let best = 0;
      for (let q = 1; q < queue.length; q++) {
        t.tally("comparisons");
        const [a, b] = [value(queue[q]!), value(queue[best]!)];
        if (a < b || (a === b && listOf(queue[q]!) < listOf(queue[best]!))) best = q;
      }
      const x = queue.splice(best, 1)[0]!;
      Q.popAt(best, {
        line: 4,
        note: `The smallest head is ${value(x)} from list ${listOf(x) + 1}.`,
      });
      const after = next.get(x);
      next.set(tail, x, { line: 5, note: `${tail === D ? "D" : value(tail)}.next ← ${value(x)}.` });
      G.annotate(id(tail), null, { line: 5 });
      G.annotate(id(x), "tail", { line: 5 });
      G.node(id(x), "visited", { line: 5 });
      tail = x;
      values.push(value(x));
      from.push([listOf(x), x - offsets[listOf(x)]!]);
      if (after !== null) {
        queue.push(after);
        Q.push(show(after), {
          line: 6,
          note: `${value(after)} is the new head of list ${listOf(x) + 1}.`,
        });
      } else t.step({ line: 6, note: `List ${listOf(x) + 1} is used up.` });
    }
    const output: MergeOutput = { values, from };
    t.finish(input, output, { line: 7, note: `Merged: ${values.join(" → ")}.` });
    return output;
  },

  check(input, out) {
    // Independent oracle: a stable sort of (value, list, position) triples.
    const all = input.lists.flatMap((l, j) => l.map((v, i) => ({ v, j, i })));
    all.sort((a, b) => a.v - b.v || a.j - b.j || a.i - b.i);
    if (out.values.join() !== all.map((x) => x.v).join())
      return `merged ${out.values}, expected ${all.map((x) => x.v)}`;
    if (JSON.stringify(out.from) !== JSON.stringify(all.map((x) => [x.j, x.i])))
      return "equal values were not taken in list order (the merge must be stable)";
    return null;
  },

  fidelity(state: TraceState, out) {
    const chain = walkState(state, "L", "D");
    if (typeof chain === "string") return chain;
    const g = state.structures.L;
    if (g?.kind !== "graph") return "no graph";
    const shown = chain.slice(1).map((nid) => Number(g.nodes.find((x) => x.id === nid)!.label));
    return shown.join() === out.values.join() ? null : `the drawn chain reads ${shown}`;
  },

  describeOutput: (o) => o.values.join(" → "),
};
