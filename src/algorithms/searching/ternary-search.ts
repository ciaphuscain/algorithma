import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { parseNumberList } from "../inputs";
import { range } from "./common";

export interface TernaryInput {
  /** Strictly increasing, then strictly decreasing (either part may be empty). */
  values: number[];
}

const LIMITS = { minLength: 1, maxLength: 40, min: -999, max: 999 };

/** Whether the values rise strictly to one peak and then fall strictly. */
export function isUnimodal(v: number[]): boolean {
  let i = 1;
  while (i < v.length && v[i]! > v[i - 1]!) i++;
  while (i < v.length && v[i]! < v[i - 1]!) i++;
  return i === v.length;
}

const input: InputSpec<TernaryInput> = {
  fields: [
    {
      name: "values",
      label: "Unimodal array",
      placeholder: "e.g. 1, 4, 9, 15, 12, 7, 2",
      help: "Strictly increasing up to one peak, then strictly decreasing.",
    },
  ],
  constraints: `${LIMITS.minLength}–${LIMITS.maxLength} whole numbers that rise strictly to a single peak and then fall strictly.`,
  parse(f) {
    const list = parseNumberList(f.values ?? "", LIMITS, "Array");
    if (!list.ok) return list;
    if (!isUnimodal(list.value))
      return {
        ok: false,
        errors: ["The values must rise strictly to one peak and then fall strictly"],
      };
    return { ok: true, value: { values: list.value } };
  },
  format: (v) => ({ values: v.values.join(", ") }),
  presets: [
    {
      id: "peak",
      label: "A peak in the middle",
      value: { values: [1, 4, 9, 15, 22, 18, 12, 7, 2] },
    },
    {
      id: "late",
      label: "A peak near the end",
      value: { values: [2, 5, 8, 11, 14, 17, 20, 23, 26, 30, 25] },
    },
    {
      id: "rising",
      label: "Only rising: the peak is last",
      value: { values: [3, 6, 10, 15, 21, 28] },
    },
  ],
  random(rng, size) {
    const n = Math.max(1, Math.min(LIMITS.maxLength, size ?? 12));
    const peak = rng.int(0, n - 1);
    const values: number[] = [];
    let v = rng.int(-50, 0);
    for (let i = 0; i < n; i++) {
      values.push(v);
      v += (i < peak ? 1 : -1) * rng.int(1, 9);
    }
    return { values };
  },
};

/**
 * Ternary search for the maximum of a unimodal sequence: compare the values at the two
 * points that split the range into thirds and discard the third that cannot hold the
 * peak. Each step keeps two thirds, so it takes about log_{3/2} n steps (two comparisons
 * each). The same idea finds the extremum of a unimodal function of a real variable.
 */
export const ternarySearch: AlgorithmModule<TernaryInput, number> = {
  id: "ternary-search",
  version: 1,
  pseudocode: [
    "procedure ternarySearch(A)   // A rises to one peak, then falls",
    "  lo ← 0;  hi ← n − 1",
    "  while hi − lo > 2",
    "    m1 ← lo + ⌊(hi − lo) / 3⌋;  m2 ← hi − ⌊(hi − lo) / 3⌋",
    "    if A[m1] < A[m2]: lo ← m1 + 1   // the peak is right of m1",
    "    else: hi ← m2 − 1   // the peak is left of m2",
    "  return the index of the largest of A[lo..hi]",
  ],
  input,

  run(input, t) {
    const A = t.array("A", input.values, { label: "A", display: "bars" });
    let lo = 0;
    let hi = A.length - 1;
    A.pointer("lo", lo, { line: 2, vars: { lo, hi } });
    A.pointer("hi", hi, { line: 2 });
    while (hi - lo > 2) {
      const third = Math.floor((hi - lo) / 3);
      const m1 = lo + third;
      const m2 = hi - third;
      A.pointer("m1", m1, { line: 4, vars: { m1, m2 } });
      A.pointer("m2", m2, {
        line: 4,
        note: `Split [${lo}, ${hi}] into thirds at ${m1} and ${m2}.`,
      });
      const order = A.compare(m1, m2, () => ({
        line: 5,
        note: `Compare A[${m1}] = ${A.get(m1)} with A[${m2}] = ${A.get(m2)}.`,
      }));
      if (order < 0) {
        A.mark(range(lo, m1), "discarded", {
          line: 5,
          note: `A[${m1}] < A[${m2}]: the values still rise at ${m1}, so the peak is after it.`,
        });
        lo = m1 + 1;
        A.pointer("lo", lo, { line: 5, vars: { lo } });
      } else {
        A.mark(range(m2, hi), "discarded", {
          line: 6,
          note: `A[${m1}] ≥ A[${m2}]: the values already fall at ${m2}, so the peak is before it.`,
        });
        hi = m2 - 1;
        A.pointer("hi", hi, { line: 6, vars: { hi } });
      }
    }
    A.pointer("m1", null, { line: 7 });
    A.pointer("m2", null, { line: 7, note: `At most three candidates are left: ${lo} to ${hi}.` });
    let best = lo;
    for (let i = lo + 1; i <= hi; i++)
      if (
        A.compare(i, best, () => ({
          line: 7,
          note: `Compare A[${i}] with the best so far, A[${best}].`,
        })) > 0
      )
        best = i;
    A.mark(best, "found", {
      line: 7,
      vars: { result: best },
      note: `The peak is A[${best}] = ${A.get(best)}.`,
    });
    t.finish(input, best, { line: 7 });
    return best;
  },

  check(input, out) {
    const v = input.values;
    const want = v.indexOf(Math.max(...v));
    return out === want ? null : `returned ${out}, but the peak is at ${want}`;
  },

  fidelity(state: TraceState, out) {
    const A = state.structures.A;
    if (A?.kind !== "array") return "no array A";
    const found = A.marks.flatMap((m, i) => (m === "found" ? [i] : []));
    return found.join() === String(out) ? null : "the marked peak differs from the result";
  },

  describeOutput: (out) => `Peak at index ${out}`,
};
