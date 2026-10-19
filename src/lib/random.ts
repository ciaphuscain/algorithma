/**
 * Seeded pseudo-random generator (mulberry32). Deterministic across platforms, so a
 * seed fully reproduces a generated input — required for replayable experiments.
 * Not suitable for anything security-related.
 */
export interface Rng {
  /** Uniform float in [0, 1). */
  next(): number;
  /** Uniform integer in [min, max] (inclusive). */
  int(min: number, max: number): number;
  readonly seed: number;
}

export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    seed,
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
  };
}

/** A fresh seed for "random input" buttons. Recorded so the input can be reproduced. */
export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}
