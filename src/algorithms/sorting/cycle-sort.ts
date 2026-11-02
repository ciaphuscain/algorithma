import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, SORT_LIMITS, sortPresets } from "./common";

/**
 * Cycle sort: write each element directly into its final position, found by counting
 * how many elements are smaller. The displaced element is carried on to its own final
 * position, and so on around the cycle. Every element is written at most once, so the
 * number of writes to the array is the minimum possible — useful when writes are costly
 * (for example flash memory).
 */
export const cycleSort: AlgorithmModule<number[], number[]> = {
  id: "cycle-sort",
  version: 1,
  pseudocode: [
    "procedure cycleSort(A)",
    "  for start ← 0 to n − 2",
    "    item ← A[start];  pos ← start + (number of later elements smaller than item)",
    "    if pos = start: continue   // already in place",
    "    while item = A[pos]: pos ← pos + 1   // skip equal values already placed",
    "    swap item with A[pos]   // write it; pick up the displaced value",
    "    while pos ≠ start",
    "      pos ← start + (number of later elements smaller than item); skip equals",
    "      swap item with A[pos]",
  ],
  input: numberArrayInput({
    limits: SORT_LIMITS,
    defaultRandomLength: 10,
    presets: sortPresets([
      { id: "cycles", label: "Two cycles", value: [3, 1, 2, 5, 4] },
      { id: "dups", label: "With duplicates", value: [4, 2, 4, 1, 2] },
    ]),
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    const n = A.length;
    let writes = 0;
    const findPos = (start: number, item: number, line: number) => {
      let pos = start;
      for (let i = start + 1; i < n; i++)
        if (
          A.compareWith(i, item, () => ({
            line,
            note: `Is A[${i}] = ${A.get(i)} smaller than ${item}?`,
          })) < 0
        )
          pos++;
      return pos;
    };
    for (let start = 0; start < n - 1; start++) {
      let item = A.get(start) as number;
      A.pointer("start", start, { line: 2, vars: { start, item } });
      let pos = findPos(start, item, 3);
      if (pos === start) {
        A.mark(start, "sorted", { line: 4, note: `${item} is already in place.` });
        continue;
      }
      const place = (line: number) => {
        while (
          A.compareWith(pos, item, () => ({
            line: 5,
            note: `Is A[${pos}] equal to ${item}? Then skip past it.`,
          })) === 0
        )
          pos++;
        const displaced = A.get(pos) as number;
        A.write(pos, item, {
          line,
          vars: { pos, item: displaced },
          note: `Write ${item} into position ${pos}; pick up ${displaced}.`,
        });
        A.mark(pos, "sorted", { line });
        writes++;
        item = displaced;
      };
      A.pointer("pos", pos, {
        line: 3,
        note: `${pos - start} later elements are smaller, so ${item} belongs at ${pos}.`,
      });
      place(6);
      while (pos !== start) {
        pos = findPos(start, item, 8);
        A.pointer("pos", pos, { line: 8, note: `${item} belongs at ${pos}.` });
        place(9);
      }
    }
    A.pointer("start", null, { line: 2 });
    A.pointer("pos", null, { line: 2 });
    if (n > 0)
      A.mark(
        Array.from({ length: n }, (_, i) => i),
        "sorted",
        { line: 2 },
      );
    const output = A.toArray() as number[];
    t.finish(input, output, {
      vars: { writes },
      note: `Sorted with ${writes} write${writes === 1 ? "" : "s"}.`,
    });
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};
