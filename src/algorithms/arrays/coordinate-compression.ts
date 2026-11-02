import type { Scalar } from "@/engine/protocol";
import type { AlgorithmModule } from "../types";
import { clamp, numberArrayInput } from "../inputs";
import { arrayFidelity } from "../sorting/common";

const LIMITS = { minLength: 1, maxLength: 16, min: -999, max: 999 };

/**
 * Coordinate compression: replace each value by its rank among the distinct values, so
 * that arbitrary (large, negative, sparse) values become 0, 1, …, k − 1 and can index
 * arrays such as a Fenwick tree. Sort a copy, remove duplicates, then binary-search each
 * value's position: O(n log n).
 */
export const coordinateCompression: AlgorithmModule<number[], number[]> = {
  id: "coordinate-compression",
  version: 1,
  pseudocode: [
    "U ← a sorted copy of A   // any O(n log n) sort",
    "remove adjacent duplicates from U   // U now lists the k distinct values in order",
    "for each i: R[i] ← the position of A[i] in U, by binary search",
    "return R   // ranks 0 … k − 1, in the same order as the values",
  ],
  input: {
    ...numberArrayInput({
      limits: LIMITS,
      presets: [
        {
          id: "classic",
          label: "Large and repeated values",
          value: [999, -40, 500, 999, 7, -40, 500],
        },
        { id: "sparse", label: "Sparse coordinates", value: [100, 3, 75, 3, 900, 42] },
      ],
    }),
    random: (rng, size) =>
      Array.from({ length: clamp(size ?? 8, 1, LIMITS.maxLength) }, () => rng.int(-20, 20) * 25),
  },

  run(values, t) {
    const n = values.length;
    const A = t.array("A", values, { label: "A", display: "cells" });
    const sorted = [...values].sort((a, b) => a - b);
    const U = t.array(
      "U",
      values.map((): Scalar => null),
      { label: "U (sorted, then distinct)", display: "cells" },
    );
    sorted.forEach((v, i) => U.write(i, v, { line: 1 }));
    t.step({ line: 1, note: `Sorted copy: ${sorted.join(", ")}.` });
    let k = 0;
    for (let i = 0; i < n; i++) {
      if (k > 0 && U.compare(k - 1, i, { line: 2 }) === 0) continue;
      if (k !== i) U.write(k, U.get(i), { line: 2 });
      k++;
    }
    for (let i = k; i < n; i++) U.write(i, null, { line: 2 });
    U.mark(
      Array.from({ length: k }, (_, i) => i),
      "sorted",
      { line: 2, vars: { k }, note: `${k} distinct value${k === 1 ? "" : "s"}.` },
    );
    const R = t.array(
      "R",
      values.map((): Scalar => null),
      { label: "R (ranks)", display: "cells" },
    );
    for (let i = 0; i < n; i++) {
      const x = A.read(i, { line: 3, vars: { i } }) as number;
      let lo = 0;
      let hi = k - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (U.compareWith(mid, x, { line: 3 }) < 0) lo = mid + 1;
        else hi = mid;
      }
      R.write(i, lo, { line: 3, note: `${x} is U[${lo}]: rank ${lo}.` });
    }
    const output = R.toArray() as number[];
    t.finish(values, output, { vars: { i: null }, note: `Ranks: ${output.join(", ")}.` });
    return output;
  },

  check(values, out) {
    const want = values.map((v) => new Set(values.filter((w) => w < v)).size);
    return JSON.stringify(want) === JSON.stringify(out)
      ? null
      : `ranks [${out.join(", ")}], expected [${want.join(", ")}]`;
  },
  fidelity: arrayFidelity("R"),
  describeOutput: (o) => `Ranks: [${o.join(", ")}]`,
};
