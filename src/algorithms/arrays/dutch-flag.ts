import type { AlgorithmModule } from "../types";
import { clamp, numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted } from "../sorting/common";
import { range } from "../searching/common";

const LIMITS = { minLength: 1, maxLength: 24, min: 0, max: 2 };
const COLOUR = ["red", "white", "blue"];

/**
 * Dutch national flag (Dijkstra): sort an array of 0s, 1s and 2s in one pass with three
 * pointers. A[0..lo) holds 0s, A[lo..mid) 1s, A(hi..n − 1] 2s, and A[mid..hi] is still
 * unknown. Each step classifies A[mid] and shrinks the unknown region by one.
 */
export const dutchFlag: AlgorithmModule<number[], number[]> = {
  id: "dutch-national-flag",
  version: 1,
  pseudocode: [
    "lo ← 0;  mid ← 0;  hi ← n − 1",
    "while mid ≤ hi   // A[mid..hi] is still unknown",
    "  if A[mid] = 0: swap A[lo], A[mid];  lo ← lo + 1;  mid ← mid + 1",
    "  else if A[mid] = 1: mid ← mid + 1",
    "  else: swap A[mid], A[hi];  hi ← hi − 1   // the new A[mid] is not yet classified",
  ],
  input: {
    ...numberArrayInput({
      limits: LIMITS,
      presets: [
        { id: "classic", label: "Mixed colours", value: [2, 0, 2, 1, 1, 0, 1, 2, 0] },
        { id: "reversed", label: "Blues first", value: [2, 2, 2, 1, 1, 0, 0] },
        { id: "single", label: "Only whites", value: [1, 1, 1, 1] },
      ],
    }),
    random: (rng, size) =>
      Array.from({ length: clamp(size ?? 10, 1, LIMITS.maxLength) }, () => rng.int(0, 2)),
  },

  run(values, t) {
    const A = t.array("A", values, { label: "A (0 red, 1 white, 2 blue)", display: "cells" });
    const n = A.length;
    let lo = 0;
    let mid = 0;
    let hi = n - 1;
    const show = (line: number) => {
      A.pointer("lo", lo < n ? lo : null, { line });
      A.pointer("mid", mid < n ? mid : null, { line });
      A.pointer("hi", hi >= 0 ? hi : null, { line, vars: { lo, mid, hi } });
    };
    show(1);
    while (mid <= hi) {
      const v = A.read(mid, { line: 2 }) as number;
      t.tally("steps");
      if (v === 0) {
        if (lo !== mid) A.swap(lo, mid, { line: 3 });
        lo++;
        mid++;
        show(3);
        t.step({ line: 3, note: `A red: it joins the reds at the left (now A[0..${lo - 1}]).` });
      } else if (v === 1) {
        mid++;
        show(4);
        t.step({ line: 4, note: "A white: already in the right region; move on." });
      } else {
        if (mid !== hi) A.swap(mid, hi, { line: 5 });
        hi--;
        show(5);
        t.step({
          line: 5,
          note: `A blue: swap it to the right end. The value that came back to ${mid} is checked next.`,
        });
      }
    }
    A.pointer("lo", null, { line: 2 });
    A.pointer("mid", null, { line: 2 });
    A.pointer("hi", null, { line: 2 });
    A.mark(range(0, n - 1), "sorted", { line: 2, note: "The unknown region is empty." });
    const output = A.toArray() as number[];
    t.finish(values, output, {
      vars: { lo, mid, hi },
      note: `${lo} red, ${mid - lo} white, ${n - mid} blue.`,
    });
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: (o) => o.map((v) => COLOUR[v]).join(", "),
};
