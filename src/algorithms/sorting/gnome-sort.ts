import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, SORT_LIMITS, sortPresets } from "./common";

/**
 * Gnome sort (Sarbazi-Azad's "stupid sort", renamed by Grune): a single position walks
 * along the array. If the pair at the position is in order it steps forward; otherwise
 * it swaps them and steps back. It is insertion sort done with adjacent swaps and no
 * nested loop.
 */
export const gnomeSort: AlgorithmModule<number[], number[]> = {
  id: "gnome-sort",
  version: 1,
  pseudocode: [
    "procedure gnomeSort(A)",
    "  pos ← 0",
    "  while pos < n",
    "    if pos = 0 or A[pos − 1] ≤ A[pos]: pos ← pos + 1",
    "    else: swap A[pos − 1] and A[pos];  pos ← pos − 1",
  ],
  input: numberArrayInput({
    limits: SORT_LIMITS,
    defaultRandomLength: 8,
    presets: sortPresets([{ id: "garden", label: "A short garden", value: [34, 2, 10, -9] }]),
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    const n = A.length;
    let pos = 0;
    while (pos < n) {
      A.pointer("pos", pos, { line: 3, vars: { pos } });
      if (pos === 0) {
        pos++;
        t.step({ line: 4, note: "At the start: step forward." });
        continue;
      }
      if (
        A.compare(pos - 1, pos, () => ({
          line: 4,
          note: `Compare A[${pos - 1}] = ${A.get(pos - 1)} with A[${pos}] = ${A.get(pos)}.`,
        })) <= 0
      ) {
        pos++;
        t.step({ line: 4, note: "In order: step forward." });
      } else {
        A.swap(pos - 1, pos, { line: 5, note: "Out of order: swap and step back." });
        pos--;
      }
    }
    A.pointer("pos", null, { line: 3 });
    A.mark(
      Array.from({ length: n }, (_, i) => i),
      "sorted",
      { line: 3, note: "The gnome walked off the end: the array is sorted." },
    );
    const output = A.toArray() as number[];
    t.finish(input, output);
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};
