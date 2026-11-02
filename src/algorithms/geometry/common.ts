import type { PlanePoint } from "@/engine/protocol";
import type { Rng } from "@/lib/random";
import type { InputPreset, InputSpec, ParseResult } from "../types";

export interface Point {
  x: number;
  y: number;
}

/** Twice the signed area of triangle o, a, b: positive for a left (counter-clockwise) turn. */
export const cross = (o: Point, a: Point, b: Point) =>
  (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

/** Squared distance: exact for whole-number coordinates. */
export const dist2 = (a: Point, b: Point) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

export const COORD_LIMIT = 100;

/** Read whole-number points written as "x,y" pairs; brackets, commas and semicolons are separators. */
export function parsePoints(
  text: string,
  options: { min: number; max: number; what?: string },
): ParseResult<Point[]> {
  const what = options.what ?? "points";
  const tokens = text.split(/[\s,;()]+/).filter(Boolean);
  const errors: string[] = [];
  for (const tk of tokens)
    if (!/^-?\d+$/.test(tk) || Math.abs(Number(tk)) > COORD_LIMIT)
      errors.push(`"${tk}" must be a whole number from −${COORD_LIMIT} to ${COORD_LIMIT}`);
  if (tokens.length % 2 === 1) errors.push("Every point needs both an x and a y");
  const n = Math.floor(tokens.length / 2);
  if (n < options.min || n > options.max)
    errors.push(`Give ${options.min}–${options.max} ${what}; got ${n}`);
  if (errors.length) return { ok: false, errors: [...new Set(errors)].slice(0, 5) };
  return {
    ok: true,
    value: Array.from({ length: n }, (_, i) => ({
      x: Number(tokens[2 * i]),
      y: Number(tokens[2 * i + 1]),
    })),
  };
}

export const formatPoints = (points: readonly Point[]) =>
  points.map((p) => `${p.x},${p.y}`).join(" ");

/** `n` random points on a grid from 0 to `range`. Repeats are possible and allowed. */
export const randomPoints = (rng: Rng, n: number, range = 40): Point[] =>
  Array.from({ length: n }, () => ({ x: rng.int(0, range), y: rng.int(0, range) }));

/** A list of points as the only input. */
export function pointsInput(options: {
  min: number;
  max: number;
  presets: InputPreset<Point[]>[];
  defaultSize: number;
}): InputSpec<Point[]> {
  return {
    fields: [
      {
        name: "points",
        label: "Points (x,y pairs)",
        placeholder: "e.g. 0,0 4,1 2,5 3,2",
        multiline: true,
      },
    ],
    constraints: `${options.min}–${options.max} points, written as x,y pairs separated by spaces; whole-number coordinates from −${COORD_LIMIT} to ${COORD_LIMIT}. Repeated points are allowed.`,
    parse: (fields) => parsePoints(fields.points ?? "", options),
    format: (points) => ({ points: formatPoints(points) }),
    presets: options.presets,
    random: (rng, size) =>
      randomPoints(rng, Math.max(options.min, Math.min(options.max, size ?? options.defaultSize))),
  };
}

/** Plane points labelled by their index in the input. */
export const indexedPoints = (points: readonly Point[]): PlanePoint[] =>
  points.map((p, i) => ({ id: `p${i}`, label: String(i), x: p.x, y: p.y }));

export const showPoint = (p: Point) => `(${p.x}, ${p.y})`;
