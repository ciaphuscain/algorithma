import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { wordInput } from "./common";

export interface ManacherOutput {
  /** P[i]: palindrome radius around position i of the #-separated string. */
  radii: number[];
  start: number;
  length: number;
  palindrome: string;
}

/**
 * Manacher's algorithm: the longest palindromic substring in linear time. Letters are
 * separated by "#", so every palindrome has odd length and a centre. Inside the
 * rightmost palindrome found so far, a position starts from its mirror's radius
 * instead of from zero.
 */
export const manacher: AlgorithmModule<string, ManacherOutput> = {
  id: "manacher",
  version: 1,
  pseudocode: [
    "procedure Manacher(s)",
    "  T ← s with # between and around the letters   // every palindrome in T has odd length",
    "  C ← 0;  R ← 0   // the palindrome reaching furthest right: centre C, right end R",
    "  for i ← 0 to |T| − 1",
    "    if i < R: P[i] ← min(R − i, P[2C − i])   // start from the mirror's radius",
    "    else: P[i] ← 0",
    "    while T[i − P[i] − 1] = T[i + P[i] + 1]: P[i] ← P[i] + 1   // expand",
    "    if i + P[i] > R: C ← i;  R ← i + P[i]",
    "  the largest P[i] is the length of the longest palindrome in s",
  ],
  input: wordInput({
    label: "Text",
    minLength: 1,
    maxLength: 14,
    placeholder: "e.g. babad",
    presets: [
      { id: "classic", label: "abacabad", value: "abacabad" },
      { id: "even", label: "Even length (cbbd)", value: "cbbd" },
      { id: "repeat", label: "aaaa", value: "aaaa" },
    ],
  }),

  run(input, t) {
    const T = ["#", ...[...input].flatMap((c) => [c, "#"])];
    const m = T.length;
    const A = t.array("T", T, { label: "T (letters with # between)", display: "cells" });
    const P = t.array(
      "P",
      T.map((): Scalar => null),
      { label: "P[i] (radius = length of the palindrome in s)", display: "cells" },
    );
    const radii: number[] = T.map(() => 0);
    let C = 0;
    let R = 0;
    t.step({
      line: 2,
      vars: { C, R },
      note: `"${input}" becomes ${T.join("")}: palindromes of even and odd length both get a centre.`,
    });
    for (let i = 0; i < m; i++) {
      A.pointer("i", i, { line: 4, vars: { i } });
      let p = 0;
      if (i < R) {
        const mirror = 2 * C - i;
        p = Math.min(R - i, radii[mirror]!);
        A.pointer("mirror", mirror, {
          line: 5,
          vars: { mirror },
          note: `${i} lies inside the palindrome centred at ${C} (up to ${R}), so it mirrors ${mirror}: start from min(${R - i}, ${radii[mirror]}) = ${p}.`,
        });
      } else {
        t.step({ line: 6, note: `${i} is beyond R = ${R}: start from 0.` });
      }
      while (i - p - 1 >= 0 && i + p + 1 < m) {
        if (A.compare(i - p - 1, i + p + 1, { line: 7 }) !== 0) break;
        p++;
      }
      radii[i] = p;
      P.write(i, p, {
        line: 7,
        note:
          p > 0
            ? `A palindrome of length ${p} is centred here.`
            : "No palindrome longer than 0 is centred here.",
      });
      A.pointer("mirror", null, { line: 7, vars: { mirror: null } });
      if (i + p > R) {
        C = i;
        R = i + p;
        t.step({
          line: 8,
          vars: { C, R },
          note: `It reaches past the old R: centre C = ${C}, R = ${R}.`,
        });
      }
    }
    A.pointer("i", null, { line: 9 });
    let best = 0;
    for (let i = 1; i < m; i++) if (radii[i]! > radii[best]!) best = i;
    const length = radii[best]!;
    const start = (best - length) / 2;
    const cells = Array.from({ length: 2 * length + 1 }, (_, k) => best - length + k);
    A.mark(cells, "found", { line: 9, vars: { i: null, mirror: null } });
    const output: ManacherOutput = {
      radii,
      start,
      length,
      palindrome: input.slice(start, start + length),
    };
    t.finish(input, output, {
      line: 9,
      note: `Longest palindrome: "${output.palindrome}" (length ${length}), centred at position ${best} of T.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: try every substring.
    const isPal = (s: string) => s === [...s].reverse().join("");
    let best = 0;
    let bestStart = 0;
    for (let i = 0; i < input.length; i++)
      for (let j = i + 1; j <= input.length; j++)
        if (j - i > best && isPal(input.slice(i, j))) {
          best = j - i;
          bestStart = i;
        }
    if (out.length !== best) return `length ${out.length}, expected ${best}`;
    if (out.palindrome !== input.slice(out.start, out.start + out.length) || !isPal(out.palindrome))
      return `"${out.palindrome}" is not a palindrome of the input at ${out.start}`;
    if (out.start !== bestStart) return `start ${out.start}, expected the leftmost ${bestStart}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const p = state.structures.P;
    if (p?.kind !== "array") return "no array P";
    return JSON.stringify(p.values) === JSON.stringify(out.radii) ? null : "P differs";
  },

  describeOutput: (out) => `Longest palindrome: "${out.palindrome}" (length ${out.length})`,
};
