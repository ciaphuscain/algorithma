import type { InputPreset, InputSpec } from "../types";
import { clamp, parseNumberList, randomNumbers, type NumberArrayLimits } from "../inputs";

export interface RangeQueryInput {
  values: number[];
  /** Inclusive, 0-based ranges [l, r]. */
  queries: [number, number][];
}

export function parseRanges(
  text: string,
  n: number,
  maxQueries: number,
): { ok: true; value: [number, number][] } | { ok: false; errors: string[] } {
  const parts = text
    .split(/[,;\n]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const errors: string[] = [];
  const ranges: [number, number][] = [];
  for (const p of parts) {
    const m = /^(\d+)\s*(?:\.\.|-|\s)\s*(\d+)$/.exec(p);
    if (!m) {
      errors.push(`"${p}" should be a range like "2 5" or "2..5"`);
      continue;
    }
    const [l, r] = [Number(m[1]), Number(m[2])];
    if (l > r || r >= n) errors.push(`"${p}": need 0 ≤ l ≤ r ≤ ${n - 1}`);
    else ranges.push([l, r]);
  }
  if (ranges.length > maxQueries)
    errors.push(`${ranges.length} queries; the limit is ${maxQueries}`);
  return errors.length ? { ok: false, errors: errors.slice(0, 5) } : { ok: true, value: ranges };
}

/** An array and a few inclusive range queries, written "l r" or "l..r". */
export function rangeQueryInput(options: {
  limits: NumberArrayLimits;
  maxQueries: number;
  presets: InputPreset<RangeQueryInput>[];
}): InputSpec<RangeQueryInput> {
  const { limits, maxQueries } = options;
  return {
    fields: [
      { name: "values", label: "Array", placeholder: "e.g. 3, 1, 4, 1, 5, 9, 2, 6" },
      {
        name: "queries",
        label: "Ranges",
        placeholder: "e.g. 2..5, 0..7",
        help: "Inclusive ranges l..r; indices start at 0.",
      },
    ],
    constraints: `${limits.minLength}–${limits.maxLength} whole numbers from ${limits.min} to ${limits.max}; up to ${maxQueries} ranges.`,
    parse(fields) {
      const v = parseNumberList(fields.values ?? "", limits);
      if (!v.ok) return v;
      const q = parseRanges(fields.queries ?? "", v.value.length, maxQueries);
      if (!q.ok) return q;
      return { ok: true, value: { values: v.value, queries: q.value } };
    },
    format: (v) => ({
      values: v.values.join(", "),
      queries: v.queries.map(([l, r]) => `${l}..${r}`).join(", "),
    }),
    presets: options.presets,
    random(rng, size) {
      const n = clamp(size ?? 8, limits.minLength, limits.maxLength);
      const values = randomNumbers(rng, n, Math.max(limits.min, -9), Math.min(limits.max, 30));
      const queries: [number, number][] = Array.from({ length: Math.min(3, maxQueries) }, () => {
        const l = rng.int(0, n - 1);
        return [l, rng.int(l, n - 1)];
      });
      return { values, queries };
    },
  };
}

export interface WindowInput {
  values: number[];
  k: number;
}

/** An array and a window size k (1 ≤ k ≤ n). */
export function windowInput(options: {
  limits: NumberArrayLimits;
  presets: InputPreset<WindowInput>[];
}): InputSpec<WindowInput> {
  const { limits } = options;
  return {
    fields: [
      { name: "values", label: "Array", placeholder: "e.g. 1, 3, -1, -3, 5, 3, 6, 7" },
      { name: "k", label: "Window size k", placeholder: "e.g. 3" },
    ],
    constraints: `${limits.minLength}–${limits.maxLength} whole numbers from ${limits.min} to ${limits.max}; 1 ≤ k ≤ array length.`,
    parse(fields) {
      const v = parseNumberList(fields.values ?? "", limits);
      const kText = (fields.k ?? "").trim();
      const errors = v.ok ? [] : [...v.errors];
      if (!/^\d+$/.test(kText)) errors.push("Window size must be a whole number");
      else if (v.ok && (Number(kText) < 1 || Number(kText) > v.value.length))
        errors.push(`Window size must be between 1 and ${v.value.length}`);
      if (errors.length || !v.ok) return { ok: false, errors };
      return { ok: true, value: { values: v.value, k: Number(kText) } };
    },
    format: (v) => ({ values: v.values.join(", "), k: String(v.k) }),
    presets: options.presets,
    random(rng, size) {
      const n = clamp(size ?? 8, Math.max(limits.minLength, 1), limits.maxLength);
      return {
        values: randomNumbers(rng, n, Math.max(limits.min, -9), Math.min(limits.max, 30)),
        k: rng.int(1, Math.min(n, 4)),
      };
    },
  };
}
