import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { ListPointers, listNodes, parseList, walkState, MAX_LIST } from "./common";

export interface CopyRandomInput {
  values: number[];
  /** random[i] is the position node i's random pointer points to, or null. */
  random: (number | null)[];
}

export interface CopyRandomOutput {
  /** The copy's values and random pointers, by position in the copy. */
  values: number[];
  random: (number | null)[];
  /** Extra space used besides the copies: none in this method. */
  extraNodes: number;
}

const MAX = Math.min(MAX_LIST, 7);

const input: InputSpec<CopyRandomInput> = {
  fields: [
    { name: "values", label: "List (head first)", placeholder: "e.g. 7, 13, 11, 10, 1" },
    {
      name: "random",
      label: "Random pointers: a position for each node, or - for null",
      placeholder: "e.g. -, 0, 4, 2, 0",
    },
  ],
  constraints: `1–${MAX} whole numbers from −99 to 99, and one random pointer per node: a position 0..n − 1 or "-".`,
  parse(f) {
    const values = parseList(f.values);
    const errors: string[] = typeof values === "string" ? [values] : [];
    if (typeof values !== "string" && values.length > MAX) errors.push(`At most ${MAX} nodes`);
    const n = typeof values === "string" ? 0 : values.length;
    const tokens = (f.random ?? "").split(/[\s,;]+/).filter(Boolean);
    if (n && tokens.length !== n) errors.push(`Give exactly ${n} random pointers`);
    const random = tokens.map((x) =>
      x === "-" ? null : /^\d+$/.test(x) && Number(x) < n ? Number(x) : NaN,
    );
    if (random.some((r) => r !== null && Number.isNaN(r)))
      errors.push(`Random pointers must be positions 0–${n - 1} or "-"`);
    return errors.length
      ? { ok: false, errors }
      : { ok: true, value: { values: values as number[], random } };
  },
  format: (v) => ({
    values: v.values.join(", "),
    random: v.random.map((r) => (r === null ? "-" : String(r))).join(", "),
  }),
  presets: [
    {
      id: "classic",
      label: "Five nodes with random pointers",
      value: { values: [7, 13, 11, 10, 1], random: [null, 0, 4, 2, 0] },
    },
    { id: "self", label: "Pointers to themselves", value: { values: [1, 2], random: [1, 1] } },
  ],
  random(rng, size) {
    const n = Math.min(MAX, Math.max(1, size ?? 5));
    return {
      values: Array.from({ length: n }, () => rng.int(1, 99)),
      random: Array.from({ length: n }, () => (rng.int(0, 3) === 0 ? null : rng.int(0, n - 1))),
    };
  },
};

/**
 * Deep copy of a linked list whose nodes also have a random pointer, in O(1) extra
 * space: (1) put each node's copy right after it in the list; (2) set each copy's
 * random to the copy of its original's random, which is that node's next; (3) unweave
 * the two lists. Originals are drawn on the top row and copies on the bottom row;
 * random pointers are drawn dashed.
 */
export const copyRandom: AlgorithmModule<CopyRandomInput, CopyRandomOutput> = {
  id: "copy-random-list",
  version: 1,
  pseudocode: [
    "procedure copyRandomList(head)",
    "  for each node x:  c ← new node(x.value);  c.next ← x.next;  x.next ← c   // interleave",
    "  for each original x:  x.next.random ← (x.random = null ? null : x.random.next)",
    "  for each original x:  c ← x.next;  x.next ← c.next;  c.next ← (c.next = null ? null : c.next.next)",
    "  return the first copy",
  ],
  input,

  run(input, t) {
    const { values, random } = input;
    const n = values.length;
    // Originals 0..n-1 on the top row; copies n..2n-1 on the bottom row; head pointers.
    const O = (i: number) => i;
    const C = (i: number) => n + i;
    const id = (x: number) => (x === -1 ? "H" : x === -2 ? "H'" : x < n ? `n${x}` : `c${x - n}`);
    // Originals on an upward arch and copies on a downward one, so that random
    // pointers between non-adjacent nodes are chords that do not run through nodes.
    const arch = (x: number, up: boolean) => {
      const lift = 0.22 * Math.sin(Math.PI * ((x - 0.05) / 0.9));
      return Number((up ? 0.36 - lift : 0.64 + lift).toFixed(4));
    };
    const nodes = [
      { id: "H", label: "head", x: 0.02, y: 0.36 },
      { id: "H'", label: "copy", x: 0.02, y: 0.64 },
      ...listNodes(values).map((p) => ({
        ...p,
        y: arch(p.x, true),
        x: Number((0.14 + 0.84 * p.x).toFixed(4)),
      })),
      ...listNodes(values, { idOf: (i) => `c${i}` }).map((p) => ({
        ...p,
        y: arch(p.x, false),
        x: Number((0.14 + 0.84 * p.x).toFixed(4)),
      })),
    ];
    const G = t.graph("L", {
      directed: true,
      nodes,
      edges: [],
      label: "Originals above, copies below; random pointers dashed",
    });
    const next = new ListPointers(G, id);
    next.set(-1, O(0), { line: 1 });
    for (let i = 0; i + 1 < n; i++) next.set(O(i), O(i + 1), { line: 1 });
    random.forEach((r, i) => {
      if (r !== null) G.link(`r:${id(O(i))}`, id(O(i)), id(O(r)), "back", { line: 1 });
    });
    for (let i = 0; i < n; i++) G.node(id(C(i)), "unreachable", { line: 1 });
    t.step({ line: 1, note: "Copies are drawn faded until they are created." });

    // 1. Interleave.
    for (let i = 0; i < n; i++) {
      G.node(id(C(i)), "unvisited", { line: 2, note: `Create the copy of ${values[i]}.` });
      t.tally("copies");
      next.set(C(i), next.get(O(i)), { line: 2 });
      next.set(O(i), C(i), { line: 2, note: `${values[i]}.next ← its copy.` });
    }
    // 2. Random pointers of the copies.
    const copyRandom: (number | null)[] = new Array(n).fill(null);
    for (let i = 0; i < n; i++) {
      const r = random[i]!;
      if (r === null) {
        t.step({ line: 3, note: `${values[i]}'s random is null, so its copy's random is null.` });
        continue;
      }
      const target = next.get(O(r))!; // the copy of node r
      G.link(`r:${id(C(i))}`, id(C(i)), id(target), "back", {
        line: 3,
        note: `${values[i]}.random is ${values[r]}, whose next is its copy: point the copy's random there.`,
      });
      copyRandom[i] = target - n;
    }
    // 3. Unweave.
    next.set(-2, C(0), { line: 4 });
    for (let i = 0; i < n; i++) {
      const c = next.get(O(i))!;
      const after = next.get(c);
      next.set(O(i), after, { line: 4 });
      next.set(c, after === null ? null : next.get(after), {
        line: 4,
        note: `${values[i]} and its copy are linked back to their own lists.`,
      });
      G.node(id(O(i)), "visited", { line: 4 });
    }
    const order = next.walk(next.get(-2));
    const output: CopyRandomOutput = {
      values: order.map((x) => values[x - n]!),
      random: order.map((x) => copyRandom[x - n]!),
      extraNodes: 0,
    };
    t.finish(input, output, {
      line: 5,
      note: "The copy is complete and the original list is unchanged.",
    });
    return output;
  },

  check(input, out) {
    if (out.values.join() !== input.values.join()) return `copied values ${out.values}`;
    if (out.random.join() !== input.random.join())
      return `copied random pointers ${out.random}, expected ${input.random}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.L;
    if (g?.kind !== "graph") return "no graph";
    const isNext = (e: string) => !e.startsWith("r:");
    const orig = walkState(state, "L", "H", 100, isNext);
    const copy = walkState(state, "L", "H'", 100, isNext);
    if (typeof orig === "string" || typeof copy === "string") return "a list does not form a chain";
    if (orig.length !== out.values.length + 1 || copy.length !== out.values.length + 1)
      return "a list has the wrong length";
    if (!copy.slice(1).every((x) => x.startsWith("c"))) return "the copy contains an original node";
    if (!orig.slice(1).every((x) => x.startsWith("n"))) return "the original contains a copy";
    return null;
  },

  describeOutput: (o) =>
    `Copy: ${o.values.join(" → ")}; random pointers ${o.random.map((r) => (r === null ? "null" : r)).join(", ")}`,
};
