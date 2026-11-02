import type { TraceState } from "@/engine/state";
import { createRng } from "@/lib/random";
import { parseNumberList, randomNumbers } from "../inputs";
import type { AlgorithmModule, InputSpec } from "../types";

export interface SelectInput {
  values: number[];
  /** Find the k-th smallest, counting from 1. */
  k: number;
  /** Seed for the pivot choices, so a run can be replayed exactly. */
  seed: number;
}

export interface SelectOutput {
  value: number;
  /** Partition rounds until the k-th smallest was isolated. */
  rounds: number;
}

/** "A[i]", "A[i…j]" or "none" for an empty range. */
const cells = (from: number, to: number) =>
  from > to ? "none" : from === to ? `A[${from}]` : `A[${from}…${to}]`;

const LIMITS = { minLength: 1, maxLength: 40, min: -999, max: 999 };
const MAX_SEED = 999_999;

const input: InputSpec<SelectInput> = {
  fields: [
    { name: "values", label: "Array", placeholder: "e.g. 7, 2, 9, 4, 1, 8, 3, 6, 5" },
    { name: "k", label: "k (1 = smallest)", placeholder: "e.g. 5" },
    {
      name: "seed",
      label: "Random seed",
      placeholder: "e.g. 1",
      help: "The pivots are random; the same seed repeats the same run.",
    },
  ],
  constraints: `${LIMITS.minLength}–${LIMITS.maxLength} whole numbers from ${LIMITS.min} to ${LIMITS.max}; 1 ≤ k ≤ n; seed from 0 to ${MAX_SEED}.`,
  parse(fields) {
    const values = parseNumberList(fields.values ?? "", LIMITS);
    const [kt, st] = [(fields.k ?? "").trim(), (fields.seed ?? "").trim()];
    const errors = values.ok ? [] : [...values.errors];
    const n = values.ok ? values.value.length : LIMITS.maxLength;
    if (!/^\d+$/.test(kt) || Number(kt) < 1 || Number(kt) > n)
      errors.push(`k must be a whole number from 1 to ${n}`);
    if (!/^\d+$/.test(st) || Number(st) > MAX_SEED)
      errors.push(`The seed must be a whole number from 0 to ${MAX_SEED}`);
    return errors.length || !values.ok
      ? { ok: false, errors }
      : { ok: true, value: { values: values.value, k: Number(kt), seed: Number(st) } };
  },
  format: (v) => ({ values: v.values.join(", "), k: String(v.k), seed: String(v.seed) }),
  presets: [
    {
      id: "classic",
      label: "The median of nine",
      value: { values: [7, 2, 9, 4, 1, 8, 3, 6, 5], k: 5, seed: 1 },
    },
    {
      id: "duplicates",
      label: "Many equal values",
      value: { values: [5, 3, 5, 5, 1, 5, 5, 9], k: 4, seed: 7 },
    },
    {
      id: "large",
      label: "The 3rd smallest of twenty",
      value: {
        values: [61, 12, 88, 45, 3, 97, 34, 70, 26, 55, 18, 91, 40, 7, 83, 64, 29, 50, 76, 15],
        k: 3,
        seed: 42,
      },
    },
  ],
  random(rng, size) {
    const n = Math.max(1, Math.min(LIMITS.maxLength, size ?? 10));
    return { values: randomNumbers(rng, n, 1, 99), k: rng.int(1, n), seed: rng.int(0, MAX_SEED) };
  },
};

/**
 * Randomized quickselect (Hoare's FIND with random pivots): partition around a random
 * pivot, keep only the side holding position k − 1, and repeat. A three-way partition
 * keeps runs of equal values from slowing it down. Expected O(n) comparisons for any
 * input; O(n²) only with very unlucky pivots.
 */
export const quickselect: AlgorithmModule<SelectInput, SelectOutput> = {
  id: "quickselect",
  version: 1,
  pseudocode: [
    "procedure QuickSelect(A, k)   // the k-th smallest, k from 1",
    "  lo ← 0;  hi ← n − 1",
    "  loop",
    "    v ← A[a random index from lo to hi]",
    "    partition A[lo … hi] into  < v | = v | > v",
    "    if k − 1 falls in the '= v' block: return v",
    "    if k − 1 is left of it: hi ← (start of the block) − 1",
    "    else: lo ← (end of the block) + 1",
  ],
  input,

  run(input, t) {
    const { k, seed } = input;
    const rng = createRng(seed);
    const A = t.array("A", input.values, { label: "A" });
    const want = k - 1;
    let lo = 0;
    let hi = A.length - 1;
    let rounds = 0;
    A.pointer("lo", lo, { line: 2, vars: { k, "target index": want } });
    A.pointer("hi", hi, { line: 2 });
    for (;;) {
      rounds++;
      // Every round removes the pivot's block, so more than n rounds means a bug.
      if (rounds > A.length) throw new Error("quickselect: the range stopped shrinking");
      const p = lo + Math.floor(rng.next() * (hi - lo + 1));
      const v = A.num(p);
      // A read, not a mark: marks stay with positions, and the partition moves v.
      A.read(p, {
        line: 4,
        vars: { round: rounds, v },
        note: `Round ${rounds}: the random pivot is A[${p}] = ${v}.`,
      });
      // Dijkstra's three-way partition: [lo, lt) < v, [lt, i) = v, (gt, hi] > v.
      let lt = lo;
      let i = lo;
      let gt = hi;
      while (i <= gt) {
        const c = A.compareWith(i, v, { line: 5 });
        if (c < 0) {
          if (lt !== i) A.swap(lt, i, { line: 5 });
          lt++;
          i++;
        } else if (c > 0) {
          if (i !== gt) A.swap(i, gt, { line: 5 });
          gt--;
        } else {
          i++;
        }
      }
      const range = (from: number, to: number) =>
        Array.from({ length: to - from + 1 }, (_, j) => from + j);
      // Marks stay with positions while values move, so redraw the pivot block.
      A.mark(range(lo, hi), null);
      A.mark(range(lt, gt), "pivot", {
        line: 5,
        vars: { "= v block": lt === gt ? String(lt) : `${lt}…${gt}` },
        note: `Below ${v}: ${cells(lo, lt - 1)}. Equal: ${cells(lt, gt)}. Above: ${cells(gt + 1, hi)}.`,
      });
      if (want >= lt && want <= gt) {
        A.mark(range(lt, gt), null);
        A.mark(want, "found", {
          line: 6,
          note: `Position ${want} holds ${v}, and everything left of it is smaller: ${v} is the ${k}${k === 1 ? "st" : k === 2 ? "nd" : k === 3 ? "rd" : "th"} smallest.`,
        });
        break;
      }
      if (want < lt) {
        A.mark(range(lt, hi), "discarded", {
          line: 7,
          note: `Position ${want} is left of the block: drop ${cells(lt, hi)}.`,
        });
        hi = lt - 1;
        A.pointer("hi", hi, { line: 7 });
      } else {
        A.mark(range(lo, gt), "discarded", {
          line: 8,
          note: `Position ${want} is right of the block: drop ${cells(lo, gt)}.`,
        });
        lo = gt + 1;
        A.pointer("lo", lo, { line: 8 });
      }
    }
    const output: SelectOutput = { value: A.num(want), rounds };
    t.finish(input, output, {
      line: 6,
      vars: { "= v block": null },
      note: `Found after ${rounds} round${rounds === 1 ? "" : "s"}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: sort a copy.
    const sorted = [...input.values].sort((a, b) => a - b);
    if (out.value !== sorted[input.k - 1])
      return `value ${out.value}, expected ${sorted[input.k - 1]}`;
    // Every round removes at least the pivot's block from the range.
    return out.rounds >= 1 && out.rounds <= input.values.length
      ? null
      : `${out.rounds} rounds for ${input.values.length} values`;
  },

  fidelity(state: TraceState, out) {
    const a = state.structures.A;
    if (a?.kind !== "array") return "no array A";
    const at = a.marks.indexOf("found");
    if (at === -1) return "no element marked found";
    return a.values[at] === out.value ? null : `A[${at}] = ${a.values[at]}`;
  },

  describeOutput: (out) =>
    `${out.value} (after ${out.rounds} partition round${out.rounds === 1 ? "" : "s"})`,
};
