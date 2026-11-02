import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, SORT_LIMITS, sortPresets } from "./common";

/**
 * Odd–even transposition sort (brick sort): alternately compare-and-swap all pairs
 * (1, 2), (3, 4), … and all pairs (0, 1), (2, 3), …. The pairs in one phase are
 * disjoint, so a parallel machine can do a whole phase at once; n phases always
 * suffice.
 */
export const oddEvenSort: AlgorithmModule<number[], number[]> = {
  id: "odd-even-sort",
  version: 1,
  pseudocode: [
    "procedure oddEvenSort(A)",
    "  sorted ← false",
    "  while not sorted",
    "    sorted ← true",
    "    for odd i: if A[i] > A[i + 1]: swap;  sorted ← false   // pairs (1,2), (3,4), …",
    "    for even i: if A[i] > A[i + 1]: swap;  sorted ← false   // pairs (0,1), (2,3), …",
  ],
  input: numberArrayInput({
    limits: SORT_LIMITS,
    defaultRandomLength: 10,
    presets: sortPresets([{ id: "mixed", label: "Mixed", value: [3, 2, 3, 8, 5, 6, 4, 1] }]),
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    const n = A.length;
    let sorted = false;
    let phases = 0;
    while (!sorted) {
      sorted = true;
      for (const start of [1, 0]) {
        phases++;
        const line = start === 1 ? 5 : 6;
        t.step({
          line,
          vars: { phase: phases },
          note: `${start === 1 ? "Odd" : "Even"} phase: pairs starting at ${start === 1 ? "odd" : "even"} positions — independent, so they could run in parallel.`,
        });
        for (let i = start; i + 1 < n; i += 2) {
          if (
            A.compare(i, i + 1, () => ({
              line,
              vars: { i },
              note: `Compare A[${i}] = ${A.get(i)} with A[${i + 1}] = ${A.get(i + 1)}.`,
            })) > 0
          ) {
            A.swap(i, i + 1, { line });
            sorted = false;
          }
        }
      }
    }
    A.mark(
      Array.from({ length: n }, (_, i) => i),
      "sorted",
      { line: 3, note: `Two phases in a row made no swap: sorted after ${phases} phases.` },
    );
    const output = A.toArray() as number[];
    t.finish(input, output, { vars: { phases } });
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};
