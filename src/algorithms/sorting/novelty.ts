import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import { createRng } from "@/lib/random";
import type { AlgorithmModule, InputSpec } from "../types";
import { numberArrayInput, parseNumberList } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, SORT_LIMITS, sortPresets } from "./common";

const range = (a: number, b: number) =>
  b < a ? [] : Array.from({ length: b - a + 1 }, (_, i) => a + i);

/**
 * In-place stable merging by block rotations (the "symmerge" of Kim and Kutzner, after
 * Dudzinski and Dydek): to merge two adjacent sorted blocks, split the shorter at its
 * middle, binary-search the matching cut in the longer one, rotate the two middle
 * blocks past each other, and recurse on both sides. No buffer is used. Bottom-up merge
 * sort built on it sorts stably in place in O(n log² n) — the building block of block
 * sorts such as WikiSort, which add internal buffers to reach O(n log n).
 */
export const blockSort: AlgorithmModule<number[], number[]> = {
  id: "block-sort",
  version: 1,
  pseudocode: [
    "for width ← 1, 2, 4, …: merge neighbouring blocks A[lo..mid) and A[mid..hi) in place",
    "merge(lo, mid, hi): if either block is empty, stop; if both have one element, swap if needed",
    "  split the longer block at its middle, and binary-search the matching cut in the other",
    "  rotate the two middle pieces past each other (three reversals)",
    "  merge the left pair and the right pair recursively",
  ],
  input: numberArrayInput({
    limits: { ...SORT_LIMITS, maxLength: 24 },
    defaultRandomLength: 10,
    presets: sortPresets([
      { id: "blocks", label: "Two sorted blocks", value: [2, 5, 7, 11, 13, 1, 3, 6, 8, 12] },
    ]),
  }),

  run(values, t) {
    const A = t.array("A", values, { label: "A (no buffer)" });
    const n = A.length;
    const reverse = (lo: number, hi: number) => {
      for (let a = lo, b = hi - 1; a < b; a++, b--) A.swap(a, b, { line: 4 });
    };
    const rotate = (lo: number, mid: number, hi: number) => {
      if (lo === mid || mid === hi) return;
      reverse(lo, mid);
      reverse(mid, hi);
      reverse(lo, hi);
      t.tally("rotations");
      t.step({ line: 4, note: `Rotate A[${lo}..${mid - 1}] past A[${mid}..${hi - 1}].` });
    };
    // First position in [lo, hi) whose value is > v (or ≥ v when strict is false).
    const bound = (lo: number, hi: number, v: number, upper: boolean) => {
      while (lo < hi) {
        const m = (lo + hi) >> 1;
        const c = A.compareWith(m, v, { line: 3 });
        if (upper ? c <= 0 : c < 0) lo = m + 1;
        else hi = m;
      }
      return lo;
    };
    const merge = (lo: number, mid: number, hi: number) => {
      if (lo >= mid || mid >= hi) return;
      if (hi - lo === 2) {
        if (A.compare(lo, mid, { line: 2 }) > 0) A.swap(lo, mid, { line: 2 });
        return;
      }
      let cut1: number;
      let cut2: number;
      if (mid - lo >= hi - mid) {
        cut1 = lo + ((mid - lo) >> 1);
        cut2 = bound(mid, hi, A.num(cut1), false);
      } else {
        cut2 = mid + ((hi - mid) >> 1);
        cut1 = bound(lo, mid, A.num(cut2), true);
      }
      rotate(cut1, mid, cut2);
      const newMid = cut1 + (cut2 - mid);
      merge(lo, cut1, newMid);
      merge(newMid, cut2, hi);
    };
    for (let width = 1; width < n; width *= 2) {
      t.step({
        line: 1,
        vars: { width },
        note: `Merge neighbouring sorted blocks of width ${width}, in place.`,
      });
      for (let lo = 0; lo + width < n; lo += 2 * width) {
        const mid = lo + width;
        const hi = Math.min(lo + 2 * width, n);
        A.mark(range(lo, hi - 1), "active", { line: 1 });
        merge(lo, mid, hi);
        A.mark(range(lo, hi - 1), null, { line: 1 });
      }
    }
    A.mark(range(0, n - 1), "sorted", { line: 1 });
    const output = A.toArray() as number[];
    t.finish(values, output);
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};

export const MAX_BEAD = 12;

/**
 * Bead sort (gravity sort; Arulanandham, Calude and Dinneen, 2002): represent each
 * positive integer as a row of beads on vertical rods and let them fall. Each rod
 * ends up with its beads stacked at the bottom, and the rows then read off the values
 * in order. Only for positive integers; in hardware the fall is "free", in software it
 * costs O(n · max).
 */
export const beadSort: AlgorithmModule<number[], number[]> = {
  id: "bead-sort",
  version: 1,
  pseudocode: [
    "row i of the frame holds A[i] beads, on rods 0 … A[i] − 1",
    "for each rod: count its beads and let them fall to the bottom rows",
    "row i (from the top) now holds the i-th smallest value: count its beads",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: MAX_BEAD, min: 1, max: MAX_BEAD },
    defaultRandomLength: 6,
    presets: [
      { id: "classic", label: "Five values", value: [3, 1, 4, 1, 5] },
      { id: "reversed", label: "Reversed", value: [6, 5, 4, 3, 2, 1] },
    ],
  }),

  run(values, t) {
    const n = values.length;
    const max = Math.max(...values);
    const G = t.grid("G", n, max, null, {
      label: "Beads on rods (rows are values, columns are rods)",
      rowHeaders: values.map((_, i) => `row ${i}`),
      colHeaders: Array.from({ length: max }, (_, j) => `rod ${j}`),
    });
    values.forEach((v, i) => {
      for (let j = 0; j < v; j++) G.write(i, j, "●", { line: 1 });
    });
    t.step({ line: 1, note: "Each row holds as many beads as its value." });
    for (let j = 0; j < max; j++) {
      let count = 0;
      for (let i = 0; i < n; i++) if (G.get(i, j) !== null) count++;
      G.read(
        range(0, n - 1).map((i): [number, number] => [i, j]),
        {
          line: 2,
          vars: { rod: j, beads: count },
          note: `Rod ${j} holds ${count} bead${count === 1 ? "" : "s"}; they fall to the bottom.`,
        },
      );
      for (let i = 0; i < n; i++) {
        const want = i >= n - count ? "●" : null;
        if (G.get(i, j) !== want) G.write(i, j, want, { line: 2 });
      }
    }
    const out = t.array(
      "A",
      values.map((): Scalar => null),
      { label: "Output", display: "cells" },
    );
    for (let i = 0; i < n; i++) {
      let count = 0;
      while (count < max && G.get(i, count) !== null) count++;
      out.write(i, count, {
        line: 3,
        note: `Row ${i} has ${count} bead${count === 1 ? "" : "s"}.`,
      });
    }
    out.mark(range(0, n - 1), "sorted", { line: 3 });
    const output = out.toArray() as number[];
    t.finish(values, output);
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};

export const MAX_SLEEP = 10;

/**
 * Sleep sort, simulated: start one "thread" per value that sleeps for that many time
 * units and then appends its value to the output. The output comes out sorted because
 * smaller values wake first. It is a joke algorithm: the waiting is done by the
 * operating system's timer queue (a priority queue), equal or close values race, and
 * the running time grows with the largest value. Here time is simulated, so ties are
 * resolved in input order and there are no races.
 */
export const sleepSort: AlgorithmModule<number[], number[]> = {
  id: "sleep-sort",
  version: 1,
  pseudocode: [
    "for each x in A: start a thread that sleeps x time units, then appends x to the output",
    "wait for all threads",
    "(the scheduler wakes threads in order of their wake-up time — a priority queue)",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: MAX_SLEEP, min: 0, max: 30 },
    defaultRandomLength: 6,
    presets: [
      { id: "classic", label: "Five sleepers", value: [3, 1, 4, 1, 5] },
      { id: "spread", label: "Spread out", value: [20, 5, 12, 0, 8] },
    ],
  }),

  run(values, t) {
    const lanes = values.map((v, i) => ({ id: `t${i}`, label: `sleep(${v})` }));
    const T = t.timeline("T", {
      lanes,
      label: "Threads (simulated time)",
      horizon: Math.max(...values) + 1,
    });
    const out = t.array(
      "A",
      values.map((): Scalar => null),
      { label: "Output", display: "cells" },
    );
    lanes.forEach((l) => T.lane(l.id, "frontier", { line: 1 }));
    t.step({ line: 1, note: `Start ${values.length} threads.` });
    const order = values.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v || a.i - b.i);
    order.forEach(({ v, i }, k) => {
      T.tick(v, { line: 3, vars: { time: v } });
      T.mark(`t${i}`, `wake: ${v}`, {
        line: 1,
        note: `At time ${v}, thread ${i} wakes and appends ${v}.`,
      });
      T.lane(`t${i}`, "visited", { line: 1 });
      out.write(k, v, { line: 1 });
    });
    out.mark(range(0, values.length - 1), "sorted", { line: 2 });
    const output = out.toArray() as number[];
    t.finish(values, output, {
      vars: { time: Math.max(...values) },
      note: `Finished at time ${Math.max(...values)}, the largest value.`,
    });
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};

export interface BogoInput {
  values: number[];
  seed: number;
}

export const MAX_BOGO = 6;
export const MAX_SHUFFLES = 5000;

const bogoInput: InputSpec<BogoInput> = {
  fields: [
    { name: "values", label: "Array", placeholder: "e.g. 3, 1, 2, 4" },
    { name: "seed", label: "Random seed", placeholder: "e.g. 7" },
  ],
  constraints: `1–${MAX_BOGO} whole numbers from −99 to 99, and a whole-number seed 0–9999 for the shuffles. At most ${MAX_SHUFFLES} shuffles are tried.`,
  parse(f) {
    const list = parseNumberList(f.values ?? "", {
      minLength: 1,
      maxLength: MAX_BOGO,
      min: -99,
      max: 99,
    });
    const errors = list.ok ? [] : [...list.errors];
    const s = (f.seed ?? "").trim();
    const seed = /^\d+$/.test(s) ? Number(s) : NaN;
    if (!(seed >= 0 && seed <= 9999)) errors.push("Seed must be a whole number 0–9999");
    if (errors.length || !list.ok) return { ok: false, errors };
    return { ok: true, value: { values: list.value, seed } };
  },
  format: (v) => ({ values: v.values.join(", "), seed: String(v.seed) }),
  presets: [
    { id: "four", label: "Four values", value: { values: [3, 1, 4, 2], seed: 7 } },
    { id: "three", label: "Three values", value: { values: [2, 3, 1], seed: 1 } },
    { id: "sorted", label: "Already sorted: no shuffle", value: { values: [1, 2, 3], seed: 1 } },
  ],
  random: (rng, size) => {
    const n = Math.max(1, Math.min(4, size ?? 4));
    return { values: Array.from({ length: n }, () => rng.int(1, 20)), seed: rng.int(0, 9999) };
  },
};

/**
 * Bogosort: check whether the array is sorted; if not, shuffle it at random and try
 * again. With n distinct values the expected number of shuffles is n!, so it is a
 * standard example of a hopeless algorithm. The shuffles here use a seeded generator so
 * that runs are reproducible, and the run gives up after 5,000 shuffles.
 */
export const bogoSort: AlgorithmModule<BogoInput, number[] | null> = {
  id: "bogo-sort",
  version: 1,
  pseudocode: [
    "while A is not sorted   // n − 1 comparisons at most",
    "  shuffle A uniformly at random (Fisher–Yates)",
  ],
  input: bogoInput,

  run(input, t) {
    const A = t.array("A", input.values, { label: "A" });
    const n = A.length;
    const rng = createRng(input.seed);
    let shuffles = 0;
    const isSorted = () => {
      for (let i = 1; i < n; i++) if (A.compare(i - 1, i, { line: 1 }) > 0) return false;
      return true;
    };
    while (!isSorted()) {
      if (shuffles === MAX_SHUFFLES) {
        t.finish(input, null, {
          line: 1,
          vars: { shuffles },
          note: `Gave up after ${MAX_SHUFFLES} shuffles.`,
        });
        return null;
      }
      for (let i = n - 1; i > 0; i--) {
        const j = rng.int(0, i);
        if (j !== i) A.swap(i, j, { line: 2 });
      }
      shuffles++;
      t.tally("shuffles");
      t.step({
        line: 2,
        vars: { shuffles },
        note: `Shuffle ${shuffles}: [${A.toArray().join(", ")}].`,
      });
    }
    A.mark(range(0, n - 1), "sorted", {
      line: 1,
      note: `Sorted after ${shuffles} shuffle${shuffles === 1 ? "" : "s"}.`,
    });
    const output = A.toArray() as number[];
    t.finish(input, output, { vars: { shuffles } });
    return output;
  },
  check(input, out) {
    // Replay the same seeded shuffles independently to know whether a sorted order is reached.
    const a = [...input.values];
    const rng = createRng(input.seed);
    const sorted = () => a.every((x, i) => i === 0 || a[i - 1]! <= x);
    let k = 0;
    while (!sorted() && k < MAX_SHUFFLES) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = rng.int(0, i);
        [a[i], a[j]] = [a[j]!, a[i]!];
      }
      k++;
    }
    if (!sorted()) return out === null ? null : "should have given up";
    if (out === null) return `gave up, but shuffle ${k} sorts the array`;
    return checkSorted(input.values, out);
  },
  fidelity(state: TraceState, out) {
    if (out === null) return null;
    return arrayFidelity("A")(state, out);
  },
  describeOutput: (o) =>
    o === null ? `Gave up after ${MAX_SHUFFLES} shuffles` : describeSorted(o),
};
