import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { clamp, numberArrayInput } from "../inputs";

const LIMITS = { minLength: 1, maxLength: 20, min: -99, max: 99 };

/**
 * Boyer–Moore majority vote: pair each element with a different one and cancel both.
 * A value occurring more than n/2 times cannot be cancelled entirely, so it survives as
 * the candidate. A second pass counts the candidate, since without a majority the
 * survivor can be any value.
 */
export const majorityVote: AlgorithmModule<number[], number | null> = {
  id: "boyer-moore-majority",
  version: 1,
  pseudocode: [
    "count ← 0",
    "for each x in A",
    "  if count = 0: candidate ← x;  count ← 1",
    "  else if x = candidate: count ← count + 1",
    "  else: count ← count − 1   // x cancels one copy of the candidate",
    "count how often candidate occurs in A   // second pass",
    "return candidate if it occurs more than n/2 times, else none",
  ],
  input: {
    ...numberArrayInput({
      limits: LIMITS,
      presets: [
        { id: "classic", label: "A majority exists", value: [2, 2, 1, 1, 1, 2, 2] },
        { id: "none", label: "No majority", value: [3, 1, 3, 2, 1, 2] },
        { id: "late", label: "Majority at the end", value: [4, 5, 6, 7, 7, 7, 7] },
      ],
    }),
    random: (rng, size) => {
      const n = clamp(size ?? 9, 1, LIMITS.maxLength);
      const m = rng.int(1, 3);
      // About 60% of the draws are one value, so a majority is likely but not certain.
      return Array.from({ length: n }, () => (rng.next() < 0.6 ? m : rng.int(1, 5)));
    },
  },

  run(values, t) {
    const A = t.array("A", values, { label: "A", display: "cells" });
    const n = A.length;
    let candidate: number | null = null;
    let count = 0;
    t.step({ line: 1, vars: { candidate, count } });
    for (let i = 0; i < n; i++) {
      A.pointer("i", i, { line: 2 });
      const x = A.read(i, { line: 2 }) as number;
      if (count === 0) {
        candidate = x;
        count = 1;
        t.step({ line: 3, vars: { candidate, count }, note: `No candidate left: take ${x}.` });
      } else if (x === candidate) {
        count++;
        t.step({ line: 4, vars: { count }, note: `${x} supports the candidate.` });
      } else {
        count--;
        t.step({
          line: 5,
          vars: { count },
          note: `${x} cancels one ${candidate}${count === 0 ? ": the candidate is gone" : ""}.`,
        });
      }
    }
    A.pointer("i", null, { line: 6 });
    let occurrences = 0;
    for (let i = 0; i < n; i++)
      if (A.compareWith(i, candidate, { line: 6 }) === 0) {
        occurrences++;
        A.mark([i], "found", { line: 6, vars: { occurrences } });
      }
    const majority = occurrences * 2 > n ? candidate : null;
    if (majority === null)
      A.mark(
        Array.from({ length: n }, (_, i) => i),
        null,
        { line: 7 },
      );
    t.finish(values, majority, {
      line: 7,
      vars: { candidate, occurrences },
      note:
        majority === null
          ? `${candidate} occurs ${occurrences} of ${n} times, not more than half: no majority.`
          : `${majority} occurs ${occurrences} of ${n} times: the majority.`,
    });
    return majority;
  },

  check(values, out) {
    const freq = new Map<number, number>();
    for (const v of values) freq.set(v, (freq.get(v) ?? 0) + 1);
    let want: number | null = null;
    for (const [v, c] of freq) if (c * 2 > values.length) want = v;
    return out === want ? null : `returned ${out}, expected ${want}`;
  },

  fidelity(state: TraceState, out) {
    const A = state.structures.A;
    if (A?.kind !== "array") return "no array A";
    const found = A.marks.flatMap((m, i) => (m === "found" ? [i] : []));
    const want = A.values.flatMap((v, i) => (out !== null && v === out ? [i] : []));
    return found.join() === want.join() ? null : `found marks [${found}], expected [${want}]`;
  },

  describeOutput: (o) => (o === null ? "No majority element" : `Majority element: ${o}`),
};
