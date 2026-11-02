import type { TraceState } from "@/engine/state";

/**
 * Oracle for sorting algorithms: `output` must be ordered and a permutation of
 * `input`. Uses the platform sort on a copy, independent of the traced code.
 */
export function checkSorted(input: number[], output: number[]): string | null {
  if (output.length !== input.length) return `length ${output.length}, expected ${input.length}`;
  const expected = [...input].sort((a, b) => a - b);
  for (let i = 0; i < expected.length; i++) {
    if (output[i] !== expected[i]) {
      return `position ${i} holds ${output[i]}, expected ${expected[i]} (output: [${output.join(", ")}])`;
    }
  }
  return null;
}

/** The array structure `name` in the final replayed state must equal the output. */
export const arrayFidelity =
  (name: string) =>
  (state: TraceState, output: number[]): string | null => {
    const s = state.structures[name];
    if (!s || s.kind !== "array") return `final state has no array "${name}"`;
    if (s.values.length !== output.length || s.values.some((v, i) => v !== output[i])) {
      return `replayed array [${s.values.join(", ")}] differs from output [${output.join(", ")}]`;
    }
    return null;
  };

export const SORT_LIMITS = { minLength: 1, maxLength: 40, min: -999, max: 999 };

/** The usual sorting presets, plus any extra ones. */
export function sortPresets(
  extra: { id: string; label: string; value: number[] }[] = [],
): { id: string; label: string; value: number[] }[] {
  return [
    { id: "classic", label: "Small example", value: [5, 1, 4, 2, 8] },
    { id: "reversed", label: "Reversed (worst case)", value: [9, 8, 7, 6, 5, 4, 3, 2] },
    { id: "sorted", label: "Already sorted", value: [1, 2, 3, 4, 5, 6, 7, 8] },
    ...extra,
  ];
}

/** Number of pairs i < j with a[i] > a[j]. */
export function inversions(a: number[]): number {
  let count = 0;
  for (let i = 0; i < a.length; i++)
    for (let j = i + 1; j < a.length; j++) if (a[i]! > a[j]!) count++;
  return count;
}

export const describeSorted = (out: number[]) => `Sorted: [${out.join(", ")}]`;
