import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { knapsackInput, type KnapsackInput } from "../inputs";

export interface KnapsackOutput {
  best: number;
  /** 0-based indices of the chosen items. */
  chosen: number[];
}

/** 0/1 knapsack by bottom-up DP over (items considered, capacity). */
export const knapsack: AlgorithmModule<KnapsackInput, KnapsackOutput> = {
  id: "knapsack",
  version: 1,
  pseudocode: [
    "procedure knapsack(w, v, W)",
    "  K[0][c] ← 0 for every capacity c",
    "  for i ← 1 to n",
    "    for c ← 0 to W",
    "      K[i][c] ← K[i−1][c]   // skip item i",
    "      if w[i] ≤ c: K[i][c] ← max(K[i][c], K[i−1][c−w[i]] + v[i])",
    "  trace back from K[n][W] to find the chosen items",
    "  return K[n][W]",
  ],
  input: knapsackInput({
    maxItems: 8,
    maxCapacity: 15,
    presets: [
      {
        id: "classic",
        label: "Four items, capacity 7",
        value: { weights: [1, 3, 4, 5], values: [1, 4, 5, 7], capacity: 7 },
      },
      {
        id: "greedy-trap",
        label: "Greedy by value fails",
        value: { weights: [5, 4, 3], values: [10, 7, 6], capacity: 7 },
      },
      {
        id: "nothing-fits",
        label: "Nothing fits",
        value: { weights: [6, 8], values: [5, 9], capacity: 4 },
      },
    ],
  }),

  run(input, t) {
    const { weights: w, values: v, capacity: W } = input;
    const n = w.length;
    const K = t.grid("K", n + 1, W + 1, null, {
      label: "K (best value)",
      rowHeaders: ["none", ...w.map((wi, i) => `#${i + 1} w${wi} v${v[i]}`)],
      colHeaders: Array.from({ length: W + 1 }, (_, c) => `c=${c}`),
    });
    t.initVars({ W });
    for (let c = 0; c <= W; c++) {
      K.write(0, c, 0, { line: 2 });
      K.mark([[0, c]], "base", { line: 2 });
    }
    t.step({ line: 2, note: "With no items available, the best value is 0 at every capacity." });

    for (let i = 1; i <= n; i++) {
      const [wi, vi] = [w[i - 1]!, v[i - 1]!];
      for (let c = 0; c <= W; c++) {
        const skip = K.num(i - 1, c);
        if (wi > c) {
          K.read([[i - 1, c]], {
            line: 5,
            vars: { i, c, "w[i]": wi, "v[i]": vi },
            note: `Item ${i} (weight ${wi}) does not fit in capacity ${c}: copy ${skip} from above.`,
          });
          K.write(i, c, skip, { line: 5 });
        } else {
          const take = K.num(i - 1, c - wi) + vi;
          K.read(
            [
              [i - 1, c],
              [i - 1, c - wi],
            ],
            {
              line: 6,
              vars: { i, c, "w[i]": wi, "v[i]": vi },
              note: `Capacity ${c}: skip item ${i} → ${skip}; take it → K[${i - 1}][${c - wi}] + ${vi} = ${take}.`,
            },
          );
          K.write(i, c, Math.max(skip, take), {
            line: 6,
            note:
              take > skip
                ? `Taking item ${i} is better: ${take}.`
                : `Skipping item ${i} is at least as good: ${skip}.`,
          });
        }
        K.mark([[i, c]], "filled", { line: 6 });
      }
    }

    // Traceback: an item was taken exactly when the value changed from the row above.
    const chosen: number[] = [];
    let c = W;
    K.mark([[n, c]], "path", {
      line: 7,
      vars: { i: null, c, "w[i]": null, "v[i]": null },
      note: `The best value is K[${n}][${W}] = ${K.num(n, W)}. Find which items produced it.`,
    });
    for (let i = n; i >= 1; i--) {
      if (K.num(i, c) !== K.num(i - 1, c)) {
        chosen.push(i - 1);
        c -= w[i - 1]!;
        K.mark([[i - 1, c]], "path", {
          line: 7,
          vars: { c },
          note: `K[${i}] differs from the row above, so item ${i} was taken; ${c} capacity remains.`,
        });
      } else {
        K.mark([[i - 1, c]], "path", { line: 7, note: `Item ${i} was not taken.` });
      }
    }
    chosen.reverse();
    const output: KnapsackOutput = { best: K.num(n, W), chosen };
    t.finish(input, output, {
      line: 8,
      vars: { c: null },
      note: `Best value ${output.best} with item${chosen.length === 1 ? "" : "s"} ${chosen.map((x) => `#${x + 1}`).join(", ") || "none"}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: brute force over all 2^n subsets (n ≤ 8).
    const n = input.weights.length;
    let best = 0;
    for (let mask = 0; mask < 1 << n; mask++) {
      let weight = 0;
      let value = 0;
      for (let i = 0; i < n; i++)
        if (mask & (1 << i)) {
          weight += input.weights[i]!;
          value += input.values[i]!;
        }
      if (weight <= input.capacity) best = Math.max(best, value);
    }
    if (out.best !== best) return `best ${out.best}, expected ${best}`;
    const weight = out.chosen.reduce((s, i) => s + input.weights[i]!, 0);
    const value = out.chosen.reduce((s, i) => s + input.values[i]!, 0);
    if (new Set(out.chosen).size !== out.chosen.length) return "an item is chosen twice";
    if (weight > input.capacity) return `chosen items weigh ${weight} > ${input.capacity}`;
    return value === best ? null : `chosen items are worth ${value}, not ${best}`;
  },

  fidelity(state: TraceState, out) {
    const K = state.structures.K;
    if (!K || K.kind !== "grid") return "no grid K";
    return K.cells[K.rows - 1]![K.cols - 1] === out.best
      ? null
      : "K[n][W] differs from the best value";
  },

  describeOutput: (out) =>
    `Best value ${out.best}; items ${out.chosen.map((i) => `#${i + 1}`).join(", ") || "none"}`,
};
