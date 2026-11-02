import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import { createRng } from "@/lib/random";
import type { AlgorithmModule, InputSpec } from "../types";
import { clamp, parseNumberList, randomNumbers } from "../inputs";
import { arrayFidelity } from "../sorting/common";

const LIMITS = { minLength: 1, maxLength: 16, min: -99, max: 99 };

export interface ShuffleInput {
  values: number[];
  seed: number;
}

export interface ReservoirInput extends ShuffleInput {
  k: number;
}

function parseSeed(text: string | undefined, errors: string[]): number {
  const s = (text ?? "").trim();
  const seed = /^\d+$/.test(s) ? Number(s) : NaN;
  if (!(seed >= 0 && seed <= 9999)) errors.push("Seed must be a whole number 0–9999");
  return seed;
}

const SEED_FIELD = {
  name: "seed",
  label: "Random seed",
  placeholder: "e.g. 7",
  help: "The same seed always gives the same random choices.",
};

const shuffleInput: InputSpec<ShuffleInput> = {
  fields: [{ name: "values", label: "Array", placeholder: "e.g. 1, 2, 3, 4, 5" }, SEED_FIELD],
  constraints: `${LIMITS.minLength}–${LIMITS.maxLength} whole numbers from ${LIMITS.min} to ${LIMITS.max}, and a seed 0–9999.`,
  parse(f) {
    const list = parseNumberList(f.values ?? "", LIMITS);
    const errors = list.ok ? [] : [...list.errors];
    const seed = parseSeed(f.seed, errors);
    if (errors.length || !list.ok) return { ok: false, errors };
    return { ok: true, value: { values: list.value, seed } };
  },
  format: (v) => ({ values: v.values.join(", "), seed: String(v.seed) }),
  presets: [
    { id: "classic", label: "Six cards", value: { values: [1, 2, 3, 4, 5, 6], seed: 7 } },
    {
      id: "other",
      label: "Same cards, another seed",
      value: { values: [1, 2, 3, 4, 5, 6], seed: 42 },
    },
  ],
  random: (rng, size) => ({
    values: randomNumbers(rng, clamp(size ?? 8, 1, LIMITS.maxLength), 1, 30),
    seed: rng.int(0, 9999),
  }),
};

/**
 * Fisher–Yates shuffle (Durstenfeld's in-place version): for i from n − 1 down to 1,
 * swap A[i] with A[j] for a uniformly random j in [0, i]. Every one of the n!
 * orders is equally likely, given a uniform random source.
 */
export const fisherYates: AlgorithmModule<ShuffleInput, number[]> = {
  id: "fisher-yates",
  version: 1,
  pseudocode: [
    "for i ← n − 1 down to 1",
    "  j ← uniform random integer with 0 ≤ j ≤ i",
    "  swap A[i], A[j]   // A[i] is now final",
  ],
  input: shuffleInput,

  run(inp, t) {
    const A = t.array("A", inp.values, { label: "A", display: "cells" });
    const n = A.length;
    const rng = createRng(inp.seed);
    for (let i = n - 1; i > 0; i--) {
      A.pointer("i", i, { line: 1, vars: { i } });
      const j = rng.int(0, i);
      A.pointer("j", j, {
        line: 2,
        vars: { j },
        note: `Pick j uniformly from 0..${i}: j = ${j}.`,
      });
      if (j !== i) A.swap(i, j, { line: 3 });
      A.mark([i], "sorted", {
        line: 3,
        note: `A[${i}] = ${A.get(i)} is final: each of the ${i + 1} remaining values had chance 1/${i + 1} to land here.`,
      });
    }
    A.pointer("i", null, { line: 1 });
    A.pointer("j", null, { line: 1 });
    if (n > 0) A.mark([0], "sorted", { line: 1, note: "The last remaining value stays at 0." });
    const output = A.toArray() as number[];
    t.finish(inp, output, { vars: { i: null, j: null } });
    return output;
  },

  check(inp, out) {
    // An independent replay of the seeded draws, on a plain array.
    const a = [...inp.values];
    const rng = createRng(inp.seed);
    for (let i = a.length - 1; i > 0; i--) {
      const j = rng.int(0, i);
      [a[i], a[j]] = [a[j]!, a[i]!];
    }
    const sameMultiset =
      JSON.stringify([...out].sort((x, y) => x - y)) ===
      JSON.stringify([...inp.values].sort((x, y) => x - y));
    if (!sameMultiset) return "the output is not a permutation of the input";
    return JSON.stringify(a) === JSON.stringify(out) ? null : `expected [${a.join(", ")}]`;
  },
  fidelity: arrayFidelity("A"),
  describeOutput: (o) => `Shuffled: [${o.join(", ")}]`,
};

const reservoirInput: InputSpec<ReservoirInput> = {
  fields: [
    { name: "values", label: "Stream", placeholder: "e.g. 10, 20, 30, 40, 50, 60" },
    { name: "k", label: "Sample size k", placeholder: "e.g. 3" },
    SEED_FIELD,
  ],
  constraints: `${LIMITS.minLength}–${LIMITS.maxLength} whole numbers from ${LIMITS.min} to ${LIMITS.max}; 1 ≤ k ≤ stream length; a seed 0–9999.`,
  parse(f) {
    const list = parseNumberList(f.values ?? "", LIMITS, "Stream");
    const errors = list.ok ? [] : [...list.errors];
    const kText = (f.k ?? "").trim();
    const k = /^\d+$/.test(kText) ? Number(kText) : NaN;
    if (!(k >= 1)) errors.push("Sample size must be a whole number of at least 1");
    else if (list.ok && k > list.value.length)
      errors.push(`Sample size must be at most the stream length, ${list.value.length}`);
    const seed = parseSeed(f.seed, errors);
    if (errors.length || !list.ok) return { ok: false, errors };
    return { ok: true, value: { values: list.value, k, seed } };
  },
  format: (v) => ({ values: v.values.join(", "), k: String(v.k), seed: String(v.seed) }),
  presets: [
    {
      id: "classic",
      label: "Ten items, keep three",
      value: { values: [11, 22, 33, 44, 55, 66, 77, 88, 99, 9], k: 3, seed: 7 },
    },
    {
      id: "one",
      label: "Keep one",
      value: { values: [5, 8, 13, 21, 34, 55], k: 1, seed: 3 },
    },
  ],
  random: (rng, size) => {
    const n = clamp(size ?? 10, 1, LIMITS.maxLength);
    return {
      values: randomNumbers(rng, n, 1, 99),
      k: rng.int(1, Math.min(n, 4)),
      seed: rng.int(0, 9999),
    };
  },
};

export interface ReservoirOutput {
  sample: number[];
  /** Stream positions of the sampled items, in reservoir order. */
  positions: number[];
}

/**
 * Reservoir sampling, Algorithm R (Vitter, 1985, after Waterman): keep the first k
 * items; item i (0-based, i ≥ k) replaces a random reservoir slot with probability
 * k/(i + 1). After any prefix of the stream, every k-subset of it is equally likely —
 * without knowing the stream's length in advance.
 */
export const reservoirSampling: AlgorithmModule<ReservoirInput, ReservoirOutput> = {
  id: "reservoir-sampling",
  version: 1,
  pseudocode: [
    "R[0..k − 1] ← the first k items",
    "for i ← k, k + 1, … while the stream lasts",
    "  j ← uniform random integer with 0 ≤ j ≤ i",
    "  if j < k: R[j] ← item i   // happens with probability k/(i + 1)",
    "  else: item i is skipped",
    "return R",
  ],
  input: reservoirInput,

  run(inp, t) {
    const { values, k } = inp;
    const S = t.array("S", values, { label: "Stream", display: "cells" });
    const R = t.array(
      "R",
      Array.from({ length: k }, (): Scalar => null),
      { label: `Reservoir (k = ${k})`, display: "cells" },
    );
    const positions: number[] = [];
    const rng = createRng(inp.seed);
    for (let i = 0; i < k; i++) {
      R.write(i, S.read(i, { line: 1 }), { line: 1 });
      positions.push(i);
      S.mark([i], "active", { line: 1 });
    }
    t.step({
      line: 1,
      vars: { k },
      note: `The first ${k} item${k === 1 ? "" : "s"} fill the reservoir.`,
    });
    for (let i = k; i < values.length; i++) {
      S.pointer("i", i, { line: 2, vars: { i } });
      const x = S.read(i, { line: 2 });
      const j = rng.int(0, i);
      t.step({
        line: 3,
        vars: { j },
        note: `Draw j from 0..${i}: j = ${j}. Item ${i} is kept with probability ${k}/${i + 1}.`,
      });
      if (j < k) {
        S.mark([positions[j]!], "discarded", { line: 4 });
        R.write(j, x, { line: 4, note: `j < ${k}: ${x} replaces R[${j}].` });
        positions[j] = i;
        S.mark([i], "active", { line: 4 });
        t.tally("replacements");
      } else {
        S.mark([i], "discarded", { line: 5, note: `j ≥ ${k}: ${x} is skipped.` });
      }
    }
    S.pointer("i", null, { line: 6 });
    const output: ReservoirOutput = { sample: R.toArray() as number[], positions };
    t.finish(inp, output, {
      line: 6,
      vars: { i: null, j: null },
      note: `Sample: ${output.sample.join(", ")}.`,
    });
    return output;
  },

  check(inp, out) {
    // Replay Algorithm R's draws independently on plain arrays.
    const rng = createRng(inp.seed);
    const pos = Array.from({ length: inp.k }, (_, i) => i);
    for (let i = inp.k; i < inp.values.length; i++) {
      const j = rng.int(0, i);
      if (j < inp.k) pos[j] = i;
    }
    if (JSON.stringify(pos) !== JSON.stringify(out.positions))
      return `positions [${out.positions}], expected [${pos}]`;
    const sample = pos.map((p) => inp.values[p]);
    return JSON.stringify(sample) === JSON.stringify(out.sample)
      ? null
      : `sample [${out.sample}], expected [${sample}]`;
  },

  fidelity(state: TraceState, out) {
    const err = arrayFidelity("R")(state, out.sample);
    if (err) return err;
    const S = state.structures.S;
    if (S?.kind !== "array") return "no array S";
    const kept = S.marks.flatMap((m, i) => (m === "active" ? [i] : []));
    const want = [...out.positions].sort((a, b) => a - b);
    return kept.join() === want.join() ? null : `kept marks [${kept}], expected [${want}]`;
  },

  describeOutput: (o) =>
    `Sample: ${o.sample.join(", ")} (stream positions ${o.positions.join(", ")})`,
};
