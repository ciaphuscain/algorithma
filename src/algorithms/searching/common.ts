import type { TraceState } from "@/engine/state";
import type { InputPreset } from "../types";
import type { SearchInput } from "../inputs";

export const SORTED_LIMITS = { minLength: 1, maxLength: 40, min: -999, max: 999 };

export const BASIC = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

/** The usual presets: found, missing, first element. */
export function sortedPresets(extra: InputPreset<SearchInput>[] = []): InputPreset<SearchInput>[] {
  return [
    { id: "found", label: "Target present", value: { values: BASIC, target: 23 } },
    { id: "missing", label: "Target absent", value: { values: BASIC, target: 40 } },
    ...extra,
  ];
}

/** Any index holding the target is correct; −1 only when the target is absent. */
export function sortedSearchCheck(input: SearchInput, out: number): string | null {
  const present = input.values.includes(input.target);
  if (out === -1) return present ? `returned −1 but ${input.target} is present` : null;
  if (input.values[out] !== input.target)
    return `A[${out}] = ${input.values[out]}, not ${input.target}`;
  return null;
}

/** The cells marked "found" in the final state are exactly the result. */
export function foundFidelity(state: TraceState, out: number, name = "A"): string | null {
  const A = state.structures[name];
  if (!A || A.kind !== "array") return `no array ${name}`;
  const found = A.marks.flatMap((m, i) => (m === "found" ? [i] : []));
  const want = out === -1 ? [] : [out];
  return found.join() === want.join() ? null : `found marks [${found}] do not match result ${out}`;
}

export function range(from: number, to: number): number[] {
  return to < from ? [] : Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

export const describeIndex = (out: number) =>
  out === -1 ? "Not found (−1)" : `Found at index ${out}`;
