import { describe, expect, it } from "vitest";
import {
  DEFAULT_CONFIG,
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
    expect(bubble.comparisons).toBe((64 * 63) / 2);
    expect(bubble.swaps).toBe((64 * 63) / 2);
    expect(bubble.moves).toBe(64 * 63);
    expect(bubble.correct).toBe(true);
    const quick = runCell({ ...config, distribution: "sorted" }, "quick-sort", 128);
    expect(quick.comparisons).toBe((128 * 127) / 2);
    expect(runCell(config, "merge-sort", 64)).toMatchObject({
      comparisons: runCell(config, "merge-sort", 64).comparisons,
    });
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
