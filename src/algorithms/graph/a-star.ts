import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { clamp } from "../inputs";

export interface GridMap {
  rows: string[];
}

export interface AStarOutput {
  /** Number of moves on a shortest path, or null if the goal is unreachable. */
  length: number | null;
  /** Cells [row, col] from S to G. */
  path: [number, number][];
  expanded: number;
}

const MAX_ROWS = 8;
const MAX_COLS = 12;

function find(rows: string[], ch: string): [number, number] {
  for (let r = 0; r < rows.length; r++) {
    const c = rows[r]!.indexOf(ch);
    if (c >= 0) return [r, c];
  }
  return [-1, -1];
}

const mapInput: InputSpec<GridMap> = {
  fields: [
    {
      name: "map",
      label: "Map",
      placeholder: "S..#\n.#..\n...G",
      multiline: true,
      help: "One row per line (or separate rows with /). S = start, G = goal, # = wall, . = free. Moves go up, down, left and right.",
    },
  ],
  constraints: `Up to ${MAX_ROWS} rows of up to ${MAX_COLS} cells, all the same length, with exactly one S and one G.`,
  parse(fields) {
    const rows = (fields.map ?? "")
      .split(/[\n/]+/)
      .map((r) => r.trim())
      .filter(Boolean);
    const errors: string[] = [];
    if (rows.length === 0) errors.push("Draw a map");
    if (rows.length > MAX_ROWS) errors.push(`${rows.length} rows; the limit is ${MAX_ROWS}`);
    if (rows.some((r) => r.length !== rows[0]!.length))
      errors.push("All rows must have the same length");
    if (rows[0] && rows[0].length > MAX_COLS) errors.push(`Rows are limited to ${MAX_COLS} cells`);
    const bad = rows.join("").replace(/[SG#.]/g, "");
    if (bad) errors.push(`Unknown map character "${bad[0]}"; use S, G, # and .`);
    const all = rows.join("");
    if ((all.match(/S/g) ?? []).length !== 1) errors.push("The map needs exactly one S");
    if ((all.match(/G/g) ?? []).length !== 1) errors.push("The map needs exactly one G");
    return errors.length
      ? { ok: false, errors: errors.slice(0, 5) }
      : { ok: true, value: { rows } };
  },
  format: (v) => ({ map: v.rows.join("\n") }),
  presets: [
    {
      id: "classic",
      label: "Wall in the way",
      value: { rows: ["S...#....", "....#....", "....#..G.", "........."] },
    },
    {
      id: "maze",
      label: "Small maze",
      value: { rows: ["S.#.....", ".##.###.", "....#...", "##.##.#.", "......#G"] },
    },
    { id: "blocked", label: "Goal walled off", value: { rows: ["S..#.", "...#G", "...##"] } },
    {
      // Found by searching random maps: an overestimating heuristic (3 × Manhattan)
      // returns a 7-move path here instead of the shortest, 5.
      id: "trap",
      label: "Trap for overestimates",
      value: { rows: ["..S.....", "...#..#.", "....#...", "....G..#"] },
    },
  ],
  random(rng, size) {
    const rowsN = clamp(Math.ceil((size ?? 6) / 2) + 2, 2, MAX_ROWS);
    const cols = clamp((size ?? 6) + 2, 3, MAX_COLS);
    const cells = Array.from({ length: rowsN }, () =>
      Array.from({ length: cols }, (): string => (rng.next() < 0.25 ? "#" : ".")),
    );
    const pick = () => [rng.int(0, rowsN - 1), rng.int(0, cols - 1)] as const;
    const [sr, sc] = pick();
    let [gr, gc] = pick();
    if (gr === sr && gc === sc) [gr, gc] = [(sr + 1) % rowsN, sc];
    cells[sr]![sc] = "S";
    cells[gr]![gc] = "G";
    return { rows: cells.map((r) => r.join("")) };
  },
};

const STEPS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

/**
 * A* on a 4-connected grid with unit moves and the Manhattan-distance heuristic, which
 * never overestimates and is consistent, so the first time the goal is taken from the
 * open set its distance is optimal. Ties on f are broken by the smaller h, then by
 * position, and stale queue entries are skipped (lazy deletion).
 */
export const aStar: AlgorithmModule<GridMap, AStarOutput> = {
  id: "a-star",
  version: 1,
  pseudocode: [
    "procedure AStar(grid, S, G)   // h(v) = Manhattan distance from v to G",
    "  g[S] ← 0;  insert S into OPEN with f = h(S)",
    "  while OPEN is not empty",
    "    u ← the entry in OPEN with the smallest f = g + h (ties: smaller h)",
    "    if u = G: return the path to u",
    "    move u to CLOSED",
    "    for each free neighbour v of u not in CLOSED",
    "      if g[u] + 1 < g[v]: g[v] ← g[u] + 1;  parent[v] ← u;  insert v with f = g[v] + h(v)",
    "  return no path",
  ],
  input: mapInput,

  run(input, t) {
    const rows = input.rows;
    const R = rows.length;
    const C = rows[0]!.length;
    const [sr, sc] = find(rows, "S");
    const [gr, gc] = find(rows, "G");
    const key = (r: number, c: number) => r * C + c;
    const h = (r: number, c: number) => Math.abs(r - gr) + Math.abs(c - gc);
    const cells: Scalar[][] = rows.map((row) =>
      [...row].map((ch) => (ch === "#" ? "#" : ch === "." ? null : ch)),
    );
    const M = t.grid("M", R, C, null, {
      label: "Map (numbers are g, the distance from S found so far)",
      rowHeaders: rows.map((_, r) => String(r)),
      colHeaders: [...rows[0]!].map((_, c) => String(c)),
    });
    const walls: [number, number][] = [];
    for (let r = 0; r < R; r++)
      for (let c = 0; c < C; c++) {
        if (cells[r]![c] !== null) M.write(r, c, cells[r]![c]!, { line: 1 });
        if (cells[r]![c] === "#") walls.push([r, c]);
      }
    if (walls.length) M.mark(walls, "base", { line: 1 });
    const OPEN = t.sequence("OPEN", "priority", { label: "OPEN (row,col: f = g + h)" });

    const g = new Map<number, number>([[key(sr, sc), 0]]);
    const parent = new Map<number, number>();
    const closed = new Set<number>();
    const open: { r: number; c: number; f: number; hv: number }[] = [];
    const label = (r: number, c: number, f: number) => `${r},${c}: ${f}`;
    open.push({ r: sr, c: sc, f: h(sr, sc), hv: h(sr, sc) });
    OPEN.push(label(sr, sc, h(sr, sc)), {
      line: 2,
      vars: { g: 0, h: h(sr, sc) },
      note: `Start at S = (${sr}, ${sc}). Its estimate is f = 0 + h = ${h(sr, sc)}: the goal is at least ${h(sr, sc)} moves away.`,
    });
    M.mark([[sr, sc]], "active", { line: 2 });

    let expanded = 0;
    let reached = false;
    while (open.length > 0) {
      let best = 0;
      for (let i = 1; i < open.length; i++) {
        const a = open[i]!;
        const b = open[best]!;
        if (
          a.f < b.f ||
          (a.f === b.f && (a.hv < b.hv || (a.hv === b.hv && key(a.r, a.c) < key(b.r, b.c))))
        )
          best = i;
      }
      const u = open.splice(best, 1)[0]!;
      OPEN.popAt(best, {
        line: 4,
        vars: { u: `${u.r},${u.c}`, f: u.f },
        note: `Take (${u.r}, ${u.c}), the most promising entry: f = ${u.f}.`,
      });
      const ku = key(u.r, u.c);
      if (closed.has(ku)) {
        t.step({ line: 4, note: `(${u.r}, ${u.c}) was already expanded; this entry is stale.` });
        continue;
      }
      if (u.r === gr && u.c === gc) {
        reached = true;
        t.step({
          line: 5,
          note: `The goal comes out of OPEN with g = ${g.get(ku)}: no shorter path exists.`,
        });
        break;
      }
      closed.add(ku);
      expanded++;
      t.tally("expansions");
      M.mark([[u.r, u.c]], "filled", { line: 6 });
      const gu = g.get(ku)!;
      for (const [dr, dc] of STEPS) {
        const [vr, vc] = [u.r + dr, u.c + dc];
        if (vr < 0 || vc < 0 || vr >= R || vc >= C || rows[vr]![vc] === "#") continue;
        const kv = key(vr, vc);
        if (closed.has(kv)) continue;
        t.tally("neighbour checks");
        if (gu + 1 < (g.get(kv) ?? Infinity)) {
          g.set(kv, gu + 1);
          parent.set(kv, ku);
          const f = gu + 1 + h(vr, vc);
          open.push({ r: vr, c: vc, f, hv: h(vr, vc) });
          if (rows[vr]![vc] === ".") M.write(vr, vc, gu + 1, { line: 8 });
          M.mark([[vr, vc]], "active", { line: 8 });
          OPEN.push(label(vr, vc, f), {
            line: 8,
            vars: { g: gu + 1, h: h(vr, vc) },
            note: `(${vr}, ${vc}): g = ${gu + 1}, h = ${h(vr, vc)}, so f = ${f}.`,
          });
        }
      }
    }

    const path: [number, number][] = [];
    if (reached) {
      for (let k: number | undefined = key(gr, gc); k !== undefined; k = parent.get(k))
        path.unshift([Math.floor(k / C), k % C]);
      M.mark(path, "path", { line: 5 });
    }
    const output: AStarOutput = { length: reached ? path.length - 1 : null, path, expanded };
    t.finish(input, output, {
      line: reached ? 5 : 9,
      vars: { u: null, f: null, g: null, h: null },
      note: reached
        ? `Shortest path: ${path.length - 1} moves, after expanding ${expanded} cell${expanded === 1 ? "" : "s"}.`
        : "OPEN is empty: the goal cannot be reached.",
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: breadth-first search for the true distance.
    const rows = input.rows;
    const [sr, sc] = find(rows, "S");
    const [gr, gc] = find(rows, "G");
    const dist = rows.map((row) => [...row].map(() => -1));
    dist[sr]![sc] = 0;
    const queue: [number, number][] = [[sr, sc]];
    while (queue.length) {
      const [r, c] = queue.shift()!;
      for (const [dr, dc] of STEPS) {
        const [a, b] = [r + dr, c + dc];
        if (rows[a]?.[b] === undefined || rows[a]![b] === "#" || dist[a]![b] !== -1) continue;
        dist[a]![b] = dist[r]![c]! + 1;
        queue.push([a, b]);
      }
    }
    const want = dist[gr]![gc] === -1 ? null : dist[gr]![gc]!;
    if (out.length !== want) return `length ${out.length}, expected ${want}`;
    if (want === null) return out.path.length === 0 ? null : "a path was reported";
    const [first, last] = [out.path[0], out.path.at(-1)];
    if (first?.[0] !== sr || first[1] !== sc || last?.[0] !== gr || last[1] !== gc)
      return "the path does not run from S to G";
    for (let i = 1; i < out.path.length; i++) {
      const [[a, b], [c, d]] = [out.path[i - 1]!, out.path[i]!];
      if (Math.abs(a - c) + Math.abs(b - d) !== 1 || rows[c]![d] === "#")
        return "the path makes an invalid move";
    }
    return out.path.length - 1 === want ? null : "path length differs";
  },

  fidelity(state: TraceState, out) {
    const m = state.structures.M;
    if (m?.kind !== "grid") return "no grid M";
    const marked: string[] = [];
    m.marks.forEach((row, r) => row.forEach((mk, c) => mk === "path" && marked.push(`${r},${c}`)));
    const want = out.path.map(([r, c]) => `${r},${c}`).sort();
    return JSON.stringify(marked.sort()) === JSON.stringify(want) ? null : "path marks differ";
  },

  describeOutput: (out) =>
    out.length === null
      ? `No path (expanded ${out.expanded} cells)`
      : `Shortest path: ${out.length} moves; expanded ${out.expanded} cells`,
};
