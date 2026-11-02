import { describe, expect, it } from "vitest";
import {
  DEFAULT_CONFIG,
  FAMILY_IDS,
  asDirected,
  defaultConfig,
  randomGraph,
  searchInputFor,
  DISTRIBUTIONS,
  decodeConfig,
  encodeConfig,
  experimentCells,
  generateInput,
  runCell,
  sizesUpTo,
  toCsv,
} from "@/experiments/arena";

describe("experiment inputs", () => {
  it.each(DISTRIBUTIONS.map((d) => d.id))(
    "%s inputs are deterministic and the right length",
    (dist) => {
      for (const n of [8, 64, 1024]) {
        const a = generateInput(dist, n, 42);
        expect(a).toHaveLength(n);
        expect(generateInput(dist, n, 42)).toEqual(a);
      }
    },
  );

  it("each distribution has its defining shape", () => {
    const n = 200;
    expect(generateInput("sorted", n, 1)).toEqual([...Array(n).keys()]);
    expect(generateInput("reversed", n, 1)).toEqual([...Array(n).keys()].reverse());
    expect(new Set(generateInput("few-unique", n, 1)).size).toBeLessThanOrEqual(5);
    const nearly = generateInput("nearly", n, 1);
    expect([...nearly].sort((a, b) => a - b)).toEqual([...Array(n).keys()]);
    let displaced = 0;
    nearly.forEach((v, i) => (displaced += v !== i ? 1 : 0));
    expect(displaced).toBeGreaterThan(0);
    expect(displaced).toBeLessThanOrEqual(2 * Math.ceil(n / 20));
    expect(generateInput("random", n, 1)).not.toEqual(generateInput("random", n, 2));
  });
});

describe("experiment runs", () => {
  it("operation counts are deterministic and match known formulas", () => {
    const config = { ...DEFAULT_CONFIG, distribution: "reversed" as const, repetitions: 1 };
    const bubble = runCell(config, "bubble-sort", 64);
    expect(bubble.counts.comparisons).toBe((64 * 63) / 2);
    expect(bubble.counts.swaps).toBe((64 * 63) / 2);
    expect(bubble.counts.moves).toBe(64 * 63);
    expect(bubble.correct).toBe(true);
    const quick = runCell({ ...config, distribution: "sorted" }, "quick-sort", 128);
    expect(quick.counts.comparisons).toBe((128 * 127) / 2);
    expect(runCell(config, "merge-sort", 64).counts.comparisons).toBe(
      runCell(config, "merge-sort", 64).counts.comparisons,
    );
  });

  it("produces one correct row per algorithm and size", () => {
    const config = { ...DEFAULT_CONFIG, maxSize: 64, repetitions: 1 };
    const rows = experimentCells(config).map((cell) => cell());
    expect(rows).toHaveLength(sizesUpTo(64).length * config.algorithms.length);
    expect(rows.every((r) => r.correct && r.medianMs >= 0)).toBe(true);
    expect(toCsv(rows).split("\n")).toHaveLength(rows.length + 1);
  });
});

describe("shareable configuration", () => {
  it("round-trips through URL parameters", () => {
    const config = {
      ...DEFAULT_CONFIG,
      algorithms: ["merge-sort" as const, "quick-sort" as const],
      distribution: "nearly" as const,
      maxSize: 256,
      seed: 7,
      repetitions: 5,
    };
    expect(decodeConfig(Object.fromEntries(new URLSearchParams(encodeConfig(config))))).toEqual(
      config,
    );
  });

  it("rejects invalid values field by field", () => {
    expect(
      decodeConfig({
        alg: "rm-rf,quick-sort",
        dist: "evil",
        max: "99999",
        seed: "-1",
        reps: "1000",
      }),
    ).toEqual({
      ...DEFAULT_CONFIG,
      algorithms: ["quick-sort"],
    });
    expect(decodeConfig({})).toEqual(DEFAULT_CONFIG);
  });
});

describe("experiment families", () => {
  it("searching: exact comparison counts on shared sorted inputs", () => {
    const base = { ...defaultConfig("searching"), repetitions: 1 };
    const n = 1024;
    const absent = runCell({ ...base, distribution: "absent" }, "linear-search", n);
    expect(absent.correct).toBe(true);
    expect(absent.counts.comparisons).toBe(n);
    expect(runCell({ ...base, distribution: "first" }, "linear-search", n).counts.comparisons).toBe(
      1,
    );
    for (const distribution of ["present", "absent", "first", "last"]) {
      const b = runCell({ ...base, distribution }, "binary-search", n);
      expect(b.correct).toBe(true);
      expect(b.counts.comparisons).toBeLessThanOrEqual(Math.floor(Math.log2(n)) + 1);
    }
    const input = searchInputFor("absent", 64, 5);
    expect(input.values).toEqual(Array.from({ length: 64 }, (_, i) => 2 * i));
    expect(input.target % 2).toBe(1);
  });

  it("shortest paths: connected random graphs, both algorithms verified on the same graph", () => {
    for (const distribution of ["sparse", "dense"]) {
      const g = randomGraph(distribution, 64, 3);
      expect(g.nodes).toHaveLength(64);
      expect(g.edges).toHaveLength(distribution === "sparse" ? 128 : 512);
      const keys = g.edges.map((e) => [e.from, e.to].sort().join("-"));
      expect(new Set(keys).size).toBe(keys.length);
      expect(asDirected(g).edges).toHaveLength(2 * g.edges.length);
      const config = { ...defaultConfig("shortest-paths"), distribution, repetitions: 1 };
      const d = runCell(config, "dijkstra", 64);
      const b = runCell(config, "bellman-ford", 64);
      expect(d.correct && b.correct).toBe(true);
      // Bellman–Ford checks every directed edge in every round it runs.
      expect(b.counts["edge checks"]! % (2 * g.edges.length)).toBe(0);
      // Dijkstra skips settled neighbours, so each edge is checked once, from the end settled first.
      expect(d.counts["edge checks"]).toBe(g.edges.length);
    }
  });

  it("every family runs, and its configuration survives the URL", () => {
    for (const id of FAMILY_IDS) {
      const config = { ...defaultConfig(id), maxSize: 32, repetitions: 1 };
      const rows = experimentCells(config).map((cell) => cell());
      expect(rows.every((r) => r.correct)).toBe(true);
      expect(toCsv(rows, id).split("\n")).toHaveLength(rows.length + 1);
      expect(decodeConfig(Object.fromEntries(new URLSearchParams(encodeConfig(config))))).toEqual(
        config,
      );
    }
    // A sorting algorithm is not accepted for another family.
    expect(decodeConfig({ fam: "searching", alg: "bubble-sort" }).algorithms).toEqual([
      "linear-search",
      "binary-search",
    ]);
  });
});
