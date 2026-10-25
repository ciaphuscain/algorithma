import { getModule } from "@/algorithms/registry";
import { runAlgorithm } from "@/algorithms/run";
import type { GraphInputValue, SearchInput } from "@/algorithms/inputs";
import { createRng, type Rng } from "@/lib/random";

/**
 * Arena experiments: run several algorithms on identical, seeded inputs and record
 * operation counts (deterministic) and wall-clock time (noisy, environment-dependent).
 *
 * Counts come from the tracer in "count" mode, i.e. from the same instrumented code
 * the visualizer replays, so a comparison counted here is a comparison you can watch.
 * Each family of algorithms solves one problem, so its members can share inputs.
 */

interface Distribution {
  id: string;
  label: string;
  description: string;
}

export interface Family {
  id: FamilyId;
  label: string;
  /** What every algorithm in the family does to the shared input, for the page text. */
  task: string;
  algorithms: readonly string[];
  distributions: readonly Distribution[];
  sizes: readonly number[];
  defaultMax: number;
  /** Counters shown in the table and CSV; the first `charted` can be plotted. */
  columns: readonly { id: string; label: string }[];
  charted: readonly string[];
  /** The input for one algorithm; equal for all algorithms up to representation. */
  input(algorithm: string, distribution: string, n: number, seed: number): unknown;
}

/** A generator per (distribution, n, seed), derived so adding a size does not change the others. */
const rngFor = (n: number, seed: number): Rng => createRng((seed ^ Math.imul(n, 0x9e3779b1)) >>> 0);

/* ------------------------------------------------------------------ sorting */

export const SORTING_DISTRIBUTIONS = [
  { id: "random", label: "Random", description: "Uniform random integers in [0, n)." },
  { id: "sorted", label: "Sorted", description: "0, 1, …, n − 1." },
  { id: "reversed", label: "Reversed", description: "n − 1, …, 1, 0." },
  {
    id: "nearly",
    label: "Nearly sorted",
    description: "Sorted, then ⌈n/20⌉ random adjacent swaps.",
  },
  { id: "few-unique", label: "Few unique values", description: "Random integers in [0, 4]." },
] as const;
/** Kept for the sorting family's existing URLs and tests. */
export const DISTRIBUTIONS = SORTING_DISTRIBUTIONS;
export type DistributionId = (typeof SORTING_DISTRIBUTIONS)[number]["id"];

/** The sorting input for (distribution, n, seed). Identical for every algorithm in a run. */
export function generateInput(distribution: DistributionId, n: number, seed: number): number[] {
  const rng = rngFor(n, seed);
  switch (distribution) {
    case "random":
      return Array.from({ length: n }, () => rng.int(0, n - 1));
    case "sorted":
      return Array.from({ length: n }, (_, i) => i);
    case "reversed":
      return Array.from({ length: n }, (_, i) => n - 1 - i);
    case "nearly": {
      const a = Array.from({ length: n }, (_, i) => i);
      for (let k = 0; k < Math.ceil(n / 20); k++) {
        const i = rng.int(0, Math.max(0, n - 2));
        if (i + 1 < n) [a[i], a[i + 1]] = [a[i + 1]!, a[i]!];
      }
      return a;
    }
    case "few-unique":
      return Array.from({ length: n }, () => rng.int(0, 4));
  }
}

/* ---------------------------------------------------------------- searching */

export const SEARCH_DISTRIBUTIONS = [
  {
    id: "present",
    label: "Target present",
    description:
      "The array 0, 2, 4, …, 2(n − 1); the target is one of its values, chosen at random.",
  },
  {
    id: "absent",
    label: "Target absent",
    description:
      "The array 0, 2, 4, …, 2(n − 1); the target is an odd number in range, so it is missing.",
  },
  { id: "first", label: "Target first", description: "The target is the first value, 0." },
  { id: "last", label: "Target last", description: "The target is the last value, 2(n − 1)." },
] as const;

export function searchInputFor(distribution: string, n: number, seed: number): SearchInput {
  const rng = rngFor(n, seed);
  const values = Array.from({ length: n }, (_, i) => 2 * i);
  const target =
    distribution === "absent"
      ? 2 * rng.int(0, n - 1) + 1
      : distribution === "first"
        ? 0
        : distribution === "last"
          ? 2 * (n - 1)
          : 2 * rng.int(0, n - 1);
  return { values, target };
}

/* ----------------------------------------------------------- shortest paths */

export const GRAPH_DISTRIBUTIONS = [
  {
    id: "sparse",
    label: "Sparse (2n edges)",
    description: "A random connected graph with about 2n edges and weights 1–20.",
  },
  {
    id: "dense",
    label: "Dense (n²/8 edges)",
    description: "A random connected graph with about n²/8 edges and weights 1–20.",
  },
] as const;

/** A random connected undirected graph: a random spanning tree plus extra distinct edges. */
export function randomGraph(distribution: string, n: number, seed: number): GraphInputValue {
  const rng = rngFor(n, seed);
  const id = (i: number) => `v${i}`;
  const target = Math.min(
    (n * (n - 1)) / 2,
    distribution === "dense" ? Math.floor((n * n) / 8) : 2 * n,
  );
  const seen = new Set<string>();
  const edges: GraphInputValue["edges"] = [];
  const add = (a: number, b: number) => {
    const key = a < b ? `${a},${b}` : `${b},${a}`;
    if (a === b || seen.has(key)) return false;
    seen.add(key);
    edges.push({ from: id(a), to: id(b), weight: rng.int(1, 20) });
    return true;
  };
  for (let i = 1; i < n; i++) add(i, rng.int(0, i - 1));
  while (edges.length < target) add(rng.int(0, n - 1), rng.int(0, n - 1));
  return {
    directed: false,
    weighted: true,
    nodes: Array.from({ length: n }, (_, i) => ({ id: id(i), x: 0, y: 0 })),
    edges,
    source: id(0),
  };
}

/** The same graph with every undirected edge as two directed ones. */
export const asDirected = (g: GraphInputValue): GraphInputValue => ({
  ...g,
  directed: true,
  edges: g.edges.flatMap((e) => [e, { from: e.to, to: e.from, weight: e.weight }]),
});

/* ----------------------------------------------------------------- families */

export const FAMILIES = {
  sorting: {
    id: "sorting",
    label: "Sorting",
    task: "sorts",
    algorithms: ["bubble-sort", "insertion-sort", "merge-sort", "quick-sort"],
    distributions: SORTING_DISTRIBUTIONS,
    sizes: [8, 16, 32, 64, 128, 256, 512, 1024, 2048],
    defaultMax: 512,
    columns: [
      { id: "comparisons", label: "Comparisons" },
      { id: "moves", label: "Element moves (writes + 2 × swaps)" },
      { id: "swaps", label: "Swaps" },
      { id: "writes", label: "Writes" },
    ],
    charted: ["comparisons", "moves"],
    input: (_a, distribution, n, seed) => generateInput(distribution as DistributionId, n, seed),
  },
  searching: {
    id: "searching",
    label: "Searching a sorted array",
    task: "searches",
    algorithms: ["linear-search", "binary-search"],
    distributions: SEARCH_DISTRIBUTIONS,
    sizes: [8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384],
    defaultMax: 4096,
    columns: [{ id: "comparisons", label: "Comparisons" }],
    charted: ["comparisons"],
    input: (_a, distribution, n, seed) => searchInputFor(distribution, n, seed),
  },
  "shortest-paths": {
    id: "shortest-paths",
    label: "Single-source shortest paths",
    task: "solves",
    algorithms: ["dijkstra", "bellman-ford"],
    distributions: GRAPH_DISTRIBUTIONS,
    sizes: [8, 16, 32, 64, 128, 256],
    defaultMax: 128,
    columns: [
      { id: "edge checks", label: "Edge checks" },
      { id: "relaxations", label: "Relaxations" },
    ],
    charted: ["edge checks", "relaxations"],
    input: (algorithm, distribution, n, seed) => {
      const g = randomGraph(distribution, n, seed);
      // Bellman–Ford here takes directed graphs: give it each edge both ways.
      return algorithm === "bellman-ford" ? asDirected(g) : g;
    },
  },
} as const satisfies Record<string, Omit<Family, "id"> & { id: string }>;

export type FamilyId = keyof typeof FAMILIES;
export const FAMILY_IDS = Object.keys(FAMILIES) as FamilyId[];
export const family = (id: FamilyId): Family => FAMILIES[id] as unknown as Family;

/** Every algorithm in any family, in a stable order (for chart colours). */
export const SORTING_ALGORITHMS = FAMILIES.sorting.algorithms;
export type SortingAlgorithmId = (typeof SORTING_ALGORITHMS)[number];

export interface ExperimentConfig {
  family: FamilyId;
  algorithms: string[];
  distribution: string;
  /** Largest input size; sizes are the family's sizes up to this. */
  maxSize: number;
  seed: number;
  /** Timed repetitions per cell (after one warm-up run). */
  repetitions: number;
}

export interface ExperimentRow {
  algorithm: string;
  n: number;
  /** The family's counters, plus every counter the run recorded. */
  counts: Record<string, number>;
  /** Median wall-clock milliseconds of the instrumented run. */
  medianMs: number;
  correct: boolean;
}

export const DEFAULT_CONFIG: ExperimentConfig = {
  family: "sorting",
  algorithms: [...FAMILIES.sorting.algorithms],
  distribution: "random",
  maxSize: 512,
  seed: 20261020,
  repetitions: 3,
};

export function defaultConfig(id: FamilyId): ExperimentConfig {
  const f = family(id);
  return {
    ...DEFAULT_CONFIG,
    family: id,
    algorithms: [...f.algorithms],
    distribution: f.distributions[0]!.id,
    maxSize: f.defaultMax,
  };
}

export function sizesUpTo(maxSize: number, id: FamilyId = "sorting"): number[] {
  return family(id).sizes.filter((n) => n <= maxSize);
}

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

/** Run one (algorithm, n) cell. Pure apart from reading the clock. */
export function runCell(config: ExperimentConfig, algorithm: string, n: number): ExperimentRow {
  const module = getModule(algorithm);
  const f = family(config.family);
  if (!module || !f.algorithms.includes(algorithm))
    throw new Error(`unknown algorithm ${algorithm}`);
  const input = f.input(algorithm, config.distribution, n, config.seed);
  const fresh = () => structuredClone(input);
  // Warm-up: lets the JIT compile the hot paths before timing.
  const first = runAlgorithm(module, fresh(), { mode: "count" });
  const times: number[] = [];
  for (let r = 0; r < Math.max(1, config.repetitions); r++) {
    const copy = fresh();
    const start = performance.now();
    runAlgorithm(module, copy, { mode: "count" });
    times.push(performance.now() - start);
  }
  const c = first.trace.meta.counters;
  const counts: Record<string, number> = { ...c };
  for (const col of f.columns) counts[col.id] ??= 0;
  if (config.family === "sorting") counts.moves = (c.writes ?? 0) + 2 * (c.swaps ?? 0);
  return {
    algorithm,
    n,
    counts,
    medianMs: median(times),
    correct: module.check(input, first.output) === null,
  };
}

/** All cells of an experiment, in a stable order, as a list of thunks (for chunked execution). */
export function experimentCells(config: ExperimentConfig): (() => ExperimentRow)[] {
  return sizesUpTo(config.maxSize, config.family).flatMap((n) =>
    config.algorithms.map((a) => () => runCell(config, a, n)),
  );
}

/* ------------------------------------------------- shareable configuration */

export function encodeConfig(config: ExperimentConfig): string {
  const p = new URLSearchParams({
    ...(config.family !== "sorting" ? { fam: config.family } : {}),
    alg: config.algorithms.join(","),
    dist: config.distribution,
    max: String(config.maxSize),
    seed: String(config.seed),
    reps: String(config.repetitions),
  });
  return p.toString();
}

/** Parse a configuration from URL parameters, falling back to defaults field by field. */
export function decodeConfig(params: Record<string, string | undefined>): ExperimentConfig {
  const fam: FamilyId = FAMILY_IDS.includes(params.fam as FamilyId)
    ? (params.fam as FamilyId)
    : "sorting";
  const f = family(fam);
  const base = defaultConfig(fam);
  const algs = (params.alg ?? "").split(",").filter((a) => f.algorithms.includes(a));
  const dist = f.distributions.find((d) => d.id === params.dist)?.id;
  const max = Number(params.max);
  const seed = Number(params.seed);
  const reps = Number(params.reps);
  return {
    family: fam,
    algorithms: algs.length > 0 ? f.algorithms.filter((a) => algs.includes(a)) : base.algorithms,
    distribution: dist ?? base.distribution,
    maxSize: f.sizes.includes(max) ? max : base.maxSize,
    seed: Number.isInteger(seed) && seed >= 0 && seed < 2 ** 32 ? seed : DEFAULT_CONFIG.seed,
    repetitions:
      Number.isInteger(reps) && reps >= 1 && reps <= 9 ? reps : DEFAULT_CONFIG.repetitions,
  };
}

export function toCsv(rows: ExperimentRow[], id: FamilyId = "sorting"): string {
  const cols = family(id).columns.map((c) => c.id);
  const head = ["algorithm", "n", ...cols.map((c) => c.replace(/ /g, "_")), "median_ms", "correct"];
  return [
    head.join(","),
    ...rows.map((r) =>
      [
        r.algorithm,
        r.n,
        ...cols.map((c) => r.counts[c] ?? 0),
        r.medianMs.toFixed(3),
        r.correct,
      ].join(","),
    ),
  ].join("\n");
}
