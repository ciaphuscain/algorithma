import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { segmentTree, type SegmentTreeInput, type SegmentTreeOutput } from "../trees/segment-tree";
import { range } from "../searching/common";

/**
 * Square-root decomposition: cut the array into blocks of about √n elements and keep
 * each block's sum. A range sum adds whole blocks from the block array and only the
 * partial blocks at its two ends element by element: O(√n) per query; a point update
 * changes one element and one block sum, O(1).
 */
export const sqrtDecomposition: AlgorithmModule<SegmentTreeInput, SegmentTreeOutput> = {
  id: "sqrt-decomposition",
  version: 1,
  pseudocode: [
    "b ← ⌈√n⌉;  block k covers A[k·b .. k·b + b − 1];  B[k] ← the sum of block k",
    "procedure sum(l, r)",
    "  while l ≤ r and l is not at a block start: s ← s + A[l];  l ← l + 1",
    "  while l + b − 1 ≤ r: s ← s + B[l / b];  l ← l + b   // whole blocks",
    "  while l ≤ r: s ← s + A[l];  l ← l + 1",
    "procedure set(i, x)",
    "  B[⌊i / b⌋] ← B[⌊i / b⌋] − A[i] + x;  A[i] ← x",
  ],
  // Same operations ("sum l r", "set i x") and presets as the segment tree, for comparison.
  input: segmentTree.input,

  run(inp, t) {
    const n = inp.values.length;
    const b = Math.ceil(Math.sqrt(n));
    const blocks = Math.ceil(n / b);
    const A = t.array("A", inp.values, { label: `A (blocks of ${b})`, display: "cells" });
    const B = t.array("B", new Array(blocks).fill(0), {
      label: "B (block sums)",
      display: "cells",
    });
    for (let k = 0; k < blocks; k++) {
      let s = 0;
      for (let i = k * b; i < Math.min(n, (k + 1) * b); i++) s += A.read(i, { line: 1 }) as number;
      B.write(k, s, {
        line: 1,
        vars: { b },
        note: `Block ${k} = A[${k * b}..${Math.min(n, (k + 1) * b) - 1}] sums to ${s}.`,
      });
    }
    const sums: number[] = [];
    for (const op of inp.ops) {
      if (op.kind === "sum") {
        let { l } = op;
        const { r } = op;
        let s = 0;
        t.step({ line: 2, vars: { l: op.l, r, s: 0 }, note: `Sum of A[${op.l}..${r}].` });
        while (l <= r && l % b !== 0) {
          s += A.read(l, { line: 3 }) as number;
          A.mark([l], "active", { line: 3, vars: { s } });
          l++;
        }
        while (l + b - 1 <= r) {
          s += B.read(l / b, { line: 4 }) as number;
          A.mark(range(l, l + b - 1), "found", {
            line: 4,
            vars: { s },
            note: `Block ${l / b} lies inside: add B[${l / b}] = ${B.get(l / b)} in one step.`,
          });
          l += b;
        }
        while (l <= r) {
          s += A.read(l, { line: 5 }) as number;
          A.mark([l], "active", { line: 5, vars: { s } });
          l++;
        }
        sums.push(s);
        t.step({ line: 5, vars: { result: s }, note: `sum(A[${op.l}..${r}]) = ${s}.` });
        A.mark(range(op.l, r), null, { line: 5 });
      } else {
        const k = Math.floor(op.i / b);
        const old = A.read(op.i, { line: 7 }) as number;
        B.write(k, B.num(k) - old + op.value, {
          line: 7,
          vars: { result: null },
          note: `Set A[${op.i}] = ${op.value}: block ${k}'s sum changes by ${op.value - old}.`,
        });
        A.write(op.i, op.value, { line: 7 });
      }
    }
    const output: SegmentTreeOutput = { sums, final: A.toArray() as number[] };
    t.finish(inp, output, {
      vars: { l: null, r: null, s: null },
      note: sums.length ? `Query results: ${sums.join(", ")}.` : "Done.",
    });
    return output;
  },

  // The segment tree's oracle replays the operations naively on a plain array.
  check: segmentTree.check,

  fidelity(state: TraceState, out) {
    const A = state.structures.A;
    const B = state.structures.B;
    if (A?.kind !== "array" || B?.kind !== "array") return "missing arrays";
    if (JSON.stringify(A.values) !== JSON.stringify(out.final)) return "A differs from the output";
    const b = Math.ceil(Math.sqrt(out.final.length));
    for (let k = 0; k < B.values.length; k++) {
      const s = out.final.slice(k * b, (k + 1) * b).reduce((x, y) => x + y, 0);
      if (B.values[k] !== s) return `B[${k}] = ${B.values[k]}, block sum is ${s}`;
    }
    return null;
  },

  describeOutput: segmentTree.describeOutput,
};
