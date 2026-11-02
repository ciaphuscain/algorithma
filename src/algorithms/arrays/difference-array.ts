import type { Scalar } from "@/engine/protocol";
import type { AlgorithmModule, InputSpec } from "../types";
import { clamp, parseNumberList, randomNumbers } from "../inputs";
import { arrayFidelity } from "../sorting/common";

export interface RangeUpdateInput {
  values: number[];
  /** Inclusive, 0-based ranges [l, r] and the amount d added to each element. */
  updates: [number, number, number][];
}

const LIMITS = { minLength: 1, maxLength: 16, min: -99, max: 99 };
const MAX_UPDATES = 6;

export function parseUpdates(
  text: string,
  n: number,
): { ok: true; value: [number, number, number][] } | { ok: false; errors: string[] } {
  const parts = text
    .split(/[,;\n]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const errors: string[] = [];
  const out: [number, number, number][] = [];
  for (const p of parts) {
    const m = /^(\d+)\s*(?:\.\.|\s)\s*(\d+)\s+([+-]?\s*\d+)$/.exec(p);
    if (!m) {
      errors.push(`"${p}" should look like "1..3 +5"`);
      continue;
    }
    const [l, r, d] = [Number(m[1]), Number(m[2]), Number(m[3]!.replace(/\s/g, ""))];
    if (l > r || r >= n) errors.push(`"${p}": need 0 ≤ l ≤ r ≤ ${n - 1}`);
    else if (Math.abs(d) > 99) errors.push(`"${p}": the amount must be between −99 and 99`);
    else out.push([l, r, d]);
  }
  if (out.length > MAX_UPDATES) errors.push(`${out.length} updates; the limit is ${MAX_UPDATES}`);
  return errors.length ? { ok: false, errors: errors.slice(0, 5) } : { ok: true, value: out };
}

const formatUpdate = ([l, r, d]: [number, number, number]) => `${l}..${r} ${d < 0 ? d : `+${d}`}`;

const input: InputSpec<RangeUpdateInput> = {
  fields: [
    { name: "values", label: "Array", placeholder: "e.g. 3, 1, 4, 1, 5, 9" },
    {
      name: "updates",
      label: "Range updates",
      placeholder: "e.g. 1..3 +5, 0..2 -1",
      help: "Each update l..r +d adds d to A[l], …, A[r]; indices start at 0.",
    },
  ],
  constraints: `${LIMITS.minLength}–${LIMITS.maxLength} whole numbers from ${LIMITS.min} to ${LIMITS.max}; up to ${MAX_UPDATES} updates with amounts from −99 to 99.`,
  parse(fields) {
    const v = parseNumberList(fields.values ?? "", LIMITS);
    if (!v.ok) return v;
    const u = parseUpdates(fields.updates ?? "", v.value.length);
    if (!u.ok) return u;
    return { ok: true, value: { values: v.value, updates: u.value } };
  },
  format: (v) => ({ values: v.values.join(", "), updates: v.updates.map(formatUpdate).join(", ") }),
  presets: [
    {
      id: "classic",
      label: "Three overlapping updates",
      value: {
        values: [3, 1, 4, 1, 5, 9, 2, 6],
        updates: [
          [1, 4, 5],
          [3, 7, -2],
          [0, 2, 10],
        ],
      },
    },
    {
      id: "zeros",
      label: "From all zeros: count coverage",
      value: {
        values: [0, 0, 0, 0, 0, 0],
        updates: [
          [0, 3, 1],
          [2, 5, 1],
          [1, 2, 1],
        ],
      },
    },
  ],
  random(rng, size) {
    const n = clamp(size ?? 8, LIMITS.minLength, LIMITS.maxLength);
    return {
      values: randomNumbers(rng, n, -9, 20),
      updates: Array.from({ length: 3 }, (): [number, number, number] => {
        const l = rng.int(0, n - 1);
        return [l, rng.int(l, n - 1), rng.int(-9, 9)];
      }),
    };
  },
};

/**
 * Difference array: store D[i] = A[i] − A[i − 1]. Adding d to a whole range A[l..r]
 * changes only two differences, D[l] and D[r + 1], so each update is O(1); one prefix
 * sum over D rebuilds the array at the end.
 */
export const differenceArray: AlgorithmModule<RangeUpdateInput, number[]> = {
  id: "difference-array",
  version: 1,
  pseudocode: [
    "D[0] ← A[0];  for i ← 1 to n − 1: D[i] ← A[i] − A[i − 1];  D[n] ← 0",
    "procedure add(l, r, d)   // A[l..r] += d",
    "  D[l] ← D[l] + d",
    "  D[r + 1] ← D[r + 1] − d",
    "rebuild: A[0] ← D[0];  for i ← 1 to n − 1: A[i] ← A[i − 1] + D[i]",
  ],
  input,

  run(inp, t) {
    const { values, updates } = inp;
    const n = values.length;
    const A = t.array("A", values, { label: "A", display: "cells" });
    const D = t.array(
      "D",
      Array.from({ length: n + 1 }, (): Scalar => null),
      { label: "D[i] = A[i] − A[i − 1]", display: "cells" },
    );
    for (let i = 0; i < n; i++) {
      const a = A.read(i, { line: 1 }) as number;
      const prev = i === 0 ? 0 : (A.get(i - 1) as number);
      D.write(i, a - prev, {
        line: 1,
        note: i === 0 ? `D[0] = A[0] = ${a}.` : `D[${i}] = ${a} − ${prev} = ${a - prev}.`,
      });
    }
    D.write(n, 0, { line: 1, note: `D[${n}] = 0: a spare slot so that r + 1 is always valid.` });
    for (const [l, r, d] of updates) {
      t.tally("updates");
      D.write(l, D.num(l) + d, {
        line: 3,
        vars: { l, r, d },
        note: `Add ${d} to A[${l}..${r}]: from position ${l} on, every value rises by ${d} …`,
      });
      D.write(r + 1, D.num(r + 1) - d, {
        line: 4,
        note: `… and from position ${r + 1} on it falls back: two writes, however long the range.`,
      });
    }
    let running = 0;
    for (let i = 0; i < n; i++) {
      running += D.read(i, { line: 5 }) as number;
      A.write(i, running, { line: 5, vars: { i }, note: `A[${i}] = ${running}.` });
    }
    const output = A.toArray() as number[];
    t.finish(inp, output, {
      vars: { l: null, r: null, d: null, i: null },
      note: `${updates.length} range update${updates.length === 1 ? "" : "s"} applied in O(1) each, then one O(n) rebuild.`,
    });
    return output;
  },

  check(inp, out) {
    const want = [...inp.values];
    for (const [l, r, d] of inp.updates) for (let i = l; i <= r; i++) want[i]! += d;
    return JSON.stringify(want) === JSON.stringify(out)
      ? null
      : `got [${out.join(", ")}], expected [${want.join(", ")}]`;
  },
  fidelity: arrayFidelity("A"),
  describeOutput: (out) => `Final array: [${out.join(", ")}]`,
};
