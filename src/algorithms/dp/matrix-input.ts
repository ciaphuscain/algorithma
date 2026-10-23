import type { InputPreset, InputSpec } from "../types";

/** A square matrix of whole numbers, one row per line (or separated by ";"). */
export function squareMatrixInput(options: {
  label: string;
  minSize: number;
  maxSize: number;
  maxValue: number;
  /** Diagonal entries are ignored (shown as 0), e.g. for distances. */
  zeroDiagonal: boolean;
  placeholder: string;
  presets: InputPreset<number[][]>[];
}): InputSpec<number[][]> {
  const { minSize, maxSize, maxValue } = options;
  return {
    fields: [
      { name: "matrix", label: options.label, placeholder: options.placeholder, multiline: true },
    ],
    constraints: `${minSize}–${maxSize} rows of the same number of whole numbers from 0 to ${maxValue}, one row per line (or separated by ";").${options.zeroDiagonal ? " The diagonal is ignored." : ""}`,
    parse(fields) {
      const rows = (fields.matrix ?? "")
        .split(/[;\n]+/)
        .map((r) => r.trim())
        .filter(Boolean)
        .map((r) => r.split(/[\s,]+/).filter(Boolean));
      const errors: string[] = [];
      if (rows.length < minSize || rows.length > maxSize)
        errors.push(`Give ${minSize}–${maxSize} rows; got ${rows.length}`);
      for (const [i, r] of rows.entries()) {
        if (r.length !== rows.length)
          errors.push(
            `Row ${i + 1} has ${r.length} entries; the matrix must be ${rows.length} × ${rows.length}`,
          );
        for (const x of r)
          if (!/^\d+$/.test(x) || Number(x) > maxValue)
            errors.push(`Row ${i + 1}: "${x}" must be a whole number from 0 to ${maxValue}`);
      }
      if (errors.length) return { ok: false, errors: [...new Set(errors)].slice(0, 5) };
      const m = rows.map((r) => r.map(Number));
      if (options.zeroDiagonal) for (let i = 0; i < m.length; i++) m[i]![i] = 0;
      return { ok: true, value: m };
    },
    format: (m) => ({ matrix: m.map((r) => r.join(" ")).join("\n") }),
    presets: options.presets,
    random(rng, size) {
      const n = Math.max(minSize, Math.min(maxSize, size ?? maxSize));
      return Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) =>
          options.zeroDiagonal && i === j ? 0 : rng.int(1, Math.min(maxValue, 30)),
        ),
      );
    },
  };
}

/** All permutations of 0..n−1 (the brute-force oracles use them; n ≤ 7). */
export function permutations(n: number): number[][] {
  if (n === 0) return [[]];
  return permutations(n - 1).flatMap((p) =>
    Array.from({ length: n }, (_, i) => [...p.slice(0, i), n - 1, ...p.slice(i)]),
  );
}

export const cityName = (i: number) => String.fromCharCode(65 + i);
