import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { clamp, randomNumbers, sortedSearchInput, type SearchInput } from "../inputs";

/** Indices i < j with A[i] + A[j] = target, or null. */
export type PairOutput = [number, number] | null;

const LIMITS = { minLength: 2, maxLength: 20, min: -99, max: 99 };

const spec = sortedSearchInput({
  limits: LIMITS,
  presets: [
    {
      id: "classic",
      label: "Pair summing to 13",
      value: { values: [1, 3, 4, 6, 8, 10, 13], target: 13 },
    },
    { id: "none", label: "No pair", value: { values: [2, 4, 6, 8], target: 11 } },
    {
      id: "negatives",
      label: "With negatives",
      value: { values: [-7, -3, 0, 2, 5, 9], target: 2 },
    },
  ],
});

/**
 * Two pointers on a sorted array: find two entries summing to a target. If the sum
 * is too small the left entry cannot be part of any answer, so move it right; if it
 * is too large the right entry cannot, so move it left.
 */
export const twoPointers: AlgorithmModule<SearchInput, PairOutput> = {
  id: "two-pointers",
  version: 1,
  pseudocode: [
    "procedure pairSum(A, target)   // A is sorted",
    "  i ← 0;  j ← n − 1",
    "  while i < j",
    "    s ← A[i] + A[j]",
    "    if s = target: return (i, j)",
    "    if s < target: i ← i + 1   // A[i] is too small for any partner",
    "    else: j ← j − 1            // A[j] is too large for any partner",
    "  return none",
  ],
  input: {
    ...spec,
    constraints: "2–20 whole numbers in non-decreasing order; integer target.",
    random(rng, size) {
      const n = clamp(size ?? 8, 2, LIMITS.maxLength);
      const values = randomNumbers(rng, n, -20, 40).sort((a, b) => a - b);
      const [a, b] = [rng.int(0, n - 1), rng.int(0, n - 1)];
      const target = rng.next() < 0.6 && a !== b ? values[a]! + values[b]! : rng.int(-20, 60);
      return { values, target };
    },
  },

  run(input, t) {
    const { values, target } = input;
    const A = t.array("A", values, { label: "A (sorted)" });
    let i = 0;
    let j = values.length - 1;
    A.pointer("i", i, { line: 2, vars: { i, j, target } });
    A.pointer("j", j, { line: 2 });
    let output: PairOutput = null;
    while (i < j) {
      const a = A.read(i, { line: 4 }) as number;
      const b = A.read(j, { line: 4 }) as number;
      const s = a + b;
      t.tally("pair checks");
      if (s === target) {
        output = [i, j];
        A.mark([i, j], "found", {
          line: 5,
          vars: { s },
          note: `${a} + ${b} = ${target}: found the pair at indices ${i} and ${j}.`,
        });
        break;
      }
      if (s < target) {
        A.mark(i, "discarded", {
          line: 6,
          vars: { s },
          note: `${a} + ${b} = ${s} < ${target}. Even the largest remaining partner is not enough for A[${i}] = ${a}, so drop it.`,
        });
        i++;
        A.pointer("i", i, { line: 6, vars: { i } });
      } else {
        A.mark(j, "discarded", {
          line: 7,
          vars: { s },
          note: `${a} + ${b} = ${s} > ${target}. Even the smallest remaining partner is too much for A[${j}] = ${b}, so drop it.`,
        });
        j--;
        A.pointer("j", j, { line: 7, vars: { j } });
      }
    }
    t.finish(input, output, {
      line: output ? 5 : 8,
      note: output
        ? `Answer: A[${output[0]}] + A[${output[1]}] = ${target}.`
        : `No two entries sum to ${target}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: try every pair.
    const v = input.values;
    let exists = false;
    for (let a = 0; a < v.length && !exists; a++)
      for (let b = a + 1; b < v.length; b++) if (v[a]! + v[b]! === input.target) exists = true;
    if (out === null) return exists ? "a pair exists but none was reported" : null;
    const [i, j] = out;
    if (!(i < j) || v[i]! + v[j]! !== input.target) return `A[${i}] + A[${j}] ≠ ${input.target}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const a = state.structures.A;
    if (a?.kind !== "array") return "no array A";
    const found = a.marks.flatMap((m, i) => (m === "found" ? [i] : []));
    return JSON.stringify(found) === JSON.stringify(out ?? []) ? null : `marked ${found}`;
  },

  describeOutput: (out) =>
    out ? `Pair at indices ${out[0]} and ${out[1]}` : "No pair sums to the target.",
};
