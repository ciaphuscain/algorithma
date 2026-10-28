import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { clamp } from "../inputs";

/** Half-open intervals [start, end). */
export type Interval = [number, number];

export interface SweepOutput {
  /** The largest number of intervals covering one point. */
  max: number;
  /** The first point where that many overlap (null when there are no intervals). */
  at: number | null;
}

const MAX_INTERVALS = 8;
const MAX_X = 30;
const lane = (i: number) => `I${i}`;

export function parseIntervals(
  text: string,
): { ok: true; value: Interval[] } | { ok: false; errors: string[] } {
  const parts = text
    .split(/[,;\n]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const errors: string[] = [];
  const out: Interval[] = [];
  for (const p of parts) {
    const m = /^(\d+)\s*(?:-|\.\.|\s)\s*(\d+)$/.exec(p);
    if (!m) {
      errors.push(`"${p}" should look like "2-5"`);
      continue;
    }
    const [s, e] = [Number(m[1]), Number(m[2])];
    if (!(s < e && e <= MAX_X)) errors.push(`"${p}": need 0 ≤ start < end ≤ ${MAX_X}`);
    else out.push([s, e]);
  }
  if (out.length === 0 && errors.length === 0) errors.push("Give at least one interval");
  if (out.length > MAX_INTERVALS)
    errors.push(`${out.length} intervals; the limit is ${MAX_INTERVALS}`);
  return errors.length ? { ok: false, errors: errors.slice(0, 5) } : { ok: true, value: out };
}

const input: InputSpec<Interval[]> = {
  fields: [
    {
      name: "intervals",
      label: "Intervals",
      placeholder: "e.g. 1-5, 2-7, 4-9, 8-10",
      help: "Half-open: 2-5 covers 2, 3 and 4 but not 5. Whole numbers 0–30.",
    },
  ],
  constraints: `1–${MAX_INTERVALS} intervals start-end with 0 ≤ start < end ≤ ${MAX_X}.`,
  parse: (f) => parseIntervals(f.intervals ?? ""),
  format: (v) => ({ intervals: v.map(([s, e]) => `${s}-${e}`).join(", ") }),
  presets: [
    {
      id: "meetings",
      label: "Meetings: how many rooms?",
      value: [
        [1, 5],
        [2, 7],
        [4, 9],
        [8, 10],
        [9, 12],
      ],
    },
    {
      id: "touching",
      label: "Touching ends do not overlap",
      value: [
        [0, 3],
        [3, 6],
        [6, 9],
      ],
    },
  ],
  random(rng, size) {
    const k = clamp(size ?? 5, 1, MAX_INTERVALS);
    return Array.from({ length: k }, (): Interval => {
      const s = rng.int(0, 20);
      return [s, rng.int(s + 1, Math.min(MAX_X, s + 10))];
    });
  },
};

/**
 * Sweep line over intervals: turn each interval into a start event and an end event,
 * sort the events by position (ends before starts at the same position, since the
 * intervals are half-open), and sweep left to right keeping a running count. The
 * largest count is the most intervals that overlap at one point — for example, the
 * number of meeting rooms needed.
 */
export const sweepLine: AlgorithmModule<Interval[], SweepOutput> = {
  id: "sweep-line",
  version: 1,
  pseudocode: [
    "events ← (start, +1) and (end, −1) for every interval",
    "sort the events by position; at equal positions, ends (−1) first",
    "count ← 0;  best ← 0",
    "for each event (x, δ) in order",
    "  count ← count + δ",
    "  if count > best: best ← count;  at ← x",
    "return best, at",
  ],
  input,

  run(intervals, t) {
    const events = intervals
      .flatMap(([s, e], i) => [
        { x: s, d: 1, i },
        { x: e, d: -1, i },
      ])
      .sort((a, b) => a.x - b.x || a.d - b.d || a.i - b.i);
    const T = t.timeline("T", {
      lanes: intervals.map(([s, e], i) => ({ id: lane(i), label: `[${s}, ${e})` })),
      label: "Intervals, swept left to right",
      horizon: Math.max(...intervals.map(([, e]) => e)),
    });
    const E = t.array(
      "E",
      events.map((ev) => `${ev.x}${ev.d > 0 ? "+" : "−"}`),
      { label: "Events (position and +start / −end), sorted", display: "cells" },
    );
    t.step({
      line: 2,
      note: `${events.length} events, sorted; at equal positions ends come first, because [a, b) does not cover b.`,
    });
    let count = 0;
    let best = 0;
    let at: number | null = null;
    events.forEach((ev, k) => {
      if (ev.x > 0) T.tick(ev.x, { line: 4 });
      E.pointer("next", k, { line: 4, vars: { x: ev.x } });
      count += ev.d;
      if (ev.d > 0) {
        T.lane(lane(ev.i), "frontier", { line: 5 });
        T.mark(lane(ev.i), "start", { line: 5 });
      } else {
        T.lane(lane(ev.i), "visited", { line: 5 });
        T.mark(lane(ev.i), "end", { line: 5 });
      }
      E.mark([k], "sorted", {
        line: 5,
        vars: { count },
        note: `At ${ev.x}, interval [${intervals[ev.i]![0]}, ${intervals[ev.i]![1]}) ${ev.d > 0 ? "starts" : "ends"}: ${count} open.`,
      });
      if (count > best) {
        best = count;
        at = ev.x;
        t.step({
          line: 6,
          vars: { best, at },
          note: `New maximum: ${best} intervals overlap at ${at}.`,
        });
      }
    });
    E.pointer("next", null, { line: 7 });
    const output: SweepOutput = { max: best, at };
    t.finish(intervals, output, {
      line: 7,
      note: `At most ${best} intervals overlap, first at ${at}.`,
    });
    return output;
  },

  check(intervals, out) {
    // Count at every whole-number point; with whole-number ends that covers every case.
    let max = 0;
    let at: number | null = null;
    for (let x = 0; x <= MAX_X; x++) {
      const c = intervals.filter(([s, e]) => s <= x && x < e).length;
      if (c > max) [max, at] = [c, x];
    }
    return out.max === max && out.at === at
      ? null
      : `got ${out.max} at ${out.at}, expected ${max} at ${at}`;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "timeline") return "no timeline";
    const done = Object.values(T.laneStatus).every((s) => s === "visited");
    if (!done) return "some interval was never closed";
    return state.vars.best === out.max ? null : `best shows ${state.vars.best}`;
  },

  describeOutput: (o) => `At most ${o.max} overlapping, first at ${o.at}`,
};
