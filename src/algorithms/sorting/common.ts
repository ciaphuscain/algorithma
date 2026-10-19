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
