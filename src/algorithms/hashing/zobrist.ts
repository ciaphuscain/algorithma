import type { TraceState } from "@/engine/state";
import { createRng } from "@/lib/random";
import type { AlgorithmModule, InputSpec } from "../types";

export interface ZobristInput {
  /** Up to three games on a 3×3 board, each a list of cells 1–9; X moves first. */
  games: number[][];
  /** Seed for the table of random numbers. */
  seed: number;
}

export interface ZobristOutput {
  /** The hash after every move, game by game (the empty board is hash 0). */
  hashes: number[][];
  /** Positions whose hash equals an earlier one: [game, move] pairs, later then earlier. */
  repeats: { at: [number, number]; same: [number, number]; sameBoard: boolean }[];
  /** The last game's final board, row by row: "X", "O" or "." per cell. */
  finalBoard: string;
}

const PIECES = ["X", "O"] as const;
const hex = (x: number) => x.toString(16).padStart(4, "0");

/** The Zobrist table: one random 16-bit number per (cell, piece), from the seed. */
export function zobristTable(seed: number): number[][] {
  const rng = createRng(seed);
  return Array.from({ length: 9 }, () => [rng.int(1, 0xffff), rng.int(1, 0xffff)]);
}

const input: InputSpec<ZobristInput> = {
  fields: [
    {
      name: "games",
      label: "Games (one per line: cells 1–9, X first)",
      placeholder: "e.g. 5 1 9",
      multiline: true,
    },
    { name: "seed", label: "Random seed for the table", placeholder: "e.g. 7" },
  ],
  constraints:
    "1–3 games, each 1–9 distinct cells numbered 1–9 (row by row); X and O alternate, X first. Seed 0–999999.",
  parse(f) {
    const errors: string[] = [];
    const lines = (f.games ?? "")
      .split(/[\n;|]+/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) errors.push("Give at least one game");
    if (lines.length > 3) errors.push("Give at most three games");
    const games = lines.map((line, g) => {
      const cells = line
        .split(/[\s,]+/)
        .filter(Boolean)
        .map(Number);
      if (cells.some((c) => !Number.isInteger(c) || c < 1 || c > 9))
        errors.push(`Game ${g + 1}: cells must be whole numbers 1–9`);
      if (new Set(cells).size !== cells.length) errors.push(`Game ${g + 1}: a cell is used twice`);
      return cells;
    });
    const ss = (f.seed ?? "").trim();
    const seed = /^\d+$/.test(ss) && Number(ss) <= 999_999 ? Number(ss) : null;
    if (seed === null) errors.push("The seed must be a whole number from 0 to 999999");
    return errors.length
      ? { ok: false, errors: errors.slice(0, 5) }
      : { ok: true, value: { games, seed: seed! } };
  },
  format: (v) => ({ games: v.games.map((g) => g.join(" ")).join("\n"), seed: String(v.seed) }),
  presets: [
    {
      id: "classic",
      label: "Two move orders, one position",
      value: {
        games: [
          [5, 1, 9],
          [9, 1, 5],
          [5, 9, 1],
        ],
        seed: 7,
      },
    },
    {
      id: "longer",
      label: "Longer games that meet",
      value: {
        games: [
          [1, 2, 3, 4, 5],
          [3, 4, 1, 2, 5],
        ],
        seed: 42,
      },
    },
  ],
  random(rng) {
    const games = Array.from({ length: rng.int(1, 3) }, () => {
      const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (let i = cells.length - 1; i > 0; i--) {
        const j = rng.int(0, i);
        [cells[i], cells[j]] = [cells[j]!, cells[i]!];
      }
      return cells.slice(0, rng.int(1, 9));
    });
    return { games, seed: rng.int(0, 999_999) };
  },
};

/**
 * Zobrist hashing: give every (cell, piece) pair a fixed random number. A position's
 * hash is the XOR of the numbers of its pieces, so a move changes it with one XOR, and
 * undoing the move XORs the same number back. Positions reached by different move
 * orders get the same hash, which is how game programs spot transpositions.
 */
export const zobrist: AlgorithmModule<ZobristInput, ZobristOutput> = {
  id: "zobrist-hashing",
  version: 1,
  pseudocode: [
    "Z[cell][piece] ← a random number, for every cell and piece",
    "start of a game: empty board, hash ← 0",
    "move: put piece p on cell c;  hash ← hash XOR Z[c][p]",
    "look the hash up among the positions seen before: equal hash = (almost surely) same position",
  ],
  input,

  run(input, t) {
    const Z = zobristTable(input.seed);
    const ZT = t.grid("Z", 9, 2, null, {
      label: "Zobrist table: a random 16-bit number (hex) per cell and piece",
      rowHeaders: Array.from({ length: 9 }, (_, i) => `cell ${i + 1}`),
      colHeaders: [...PIECES],
    });
    for (let c = 0; c < 9; c++)
      for (let p = 0; p < 2; p++) ZT.write(c, p, hex(Z[c]![p]!), { line: 1 });
    const B = t.grid("B", 3, 3, null, { label: "Board" });
    const seen: { hash: number; at: [number, number]; board: string }[] = [];
    const hashes: number[][] = [];
    let finalBoard = "";
    const repeats: ZobristOutput["repeats"] = [];
    input.games.forEach((game, g) => {
      for (let c = 0; c < 9; c++)
        if (B.get(Math.floor(c / 3), c % 3) !== null)
          B.write(Math.floor(c / 3), c % 3, null, { line: 2 });
      let hash = 0;
      const board = new Array<string>(9).fill(".");
      t.step({
        line: 2,
        vars: { game: g + 1, hash: hex(0) },
        note: `Game ${g + 1} starts from the empty board, hash 0000.`,
      });
      const gh: number[] = [];
      game.forEach((cell, i) => {
        const p = i % 2;
        const c = cell - 1;
        ZT.read([[c, p]], { line: 3 });
        const old = hash;
        hash ^= Z[c]![p]!;
        board[c] = PIECES[p]!;
        B.write(Math.floor(c / 3), c % 3, PIECES[p]!, {
          line: 3,
          vars: { hash: hex(hash) },
          note: `${PIECES[p]} on cell ${cell}: ${hex(old)} XOR ${hex(Z[c]![p]!)} = ${hex(hash)}.`,
        });
        t.tally("xors");
        gh.push(hash);
        const key = board.join("");
        const match = seen.find((s) => {
          t.tally("lookups");
          return s.hash === hash;
        });
        if (match) {
          const sameBoard = match.board === key;
          const sameMoves =
            input.games[match.at[0]]!.slice(0, match.at[1] + 1).join() ===
            game.slice(0, i + 1).join();
          repeats.push({ at: [g, i], same: match.at, sameBoard });
          t.step({
            line: 4,
            note: !sameBoard
              ? `Hash ${hex(hash)} was seen before for a different board: a collision.`
              : `Hash ${hex(hash)} was seen in game ${match.at[0] + 1} after move ${match.at[1] + 1}: the same position, ${sameMoves ? "reached by the same moves" : "reached by a different move order (a transposition)"}.`,
          });
        }
        seen.push({ hash, at: [g, i], board: key });
      });
      hashes.push(gh);
      finalBoard = board.join("");
    });
    const output: ZobristOutput = { hashes, repeats, finalBoard };
    const again = repeats.filter((r) => r.sameBoard).length;
    const collisions = repeats.length - again;
    t.finish(input, output, {
      line: 4,
      note: `${again} position${again === 1 ? "" : "s"} recognised as seen before${collisions ? `; ${collisions} hash collision${collisions === 1 ? "" : "s"}` : ""}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: each hash recomputed from scratch from the board, and repeats
    // found by comparing every pair of positions.
    const Z = zobristTable(input.seed);
    const positions: { hash: number; board: string; at: [number, number] }[] = [];
    for (const [g, game] of input.games.entries()) {
      const board = new Array<string>(9).fill(".");
      for (const [i, cell] of game.entries()) {
        board[cell - 1] = PIECES[i % 2]!;
        let h = 0;
        board.forEach((piece, c) => {
          if (piece !== ".") h ^= Z[c]![piece === "X" ? 0 : 1]!;
        });
        if (out.hashes[g]?.[i] !== h)
          return `game ${g + 1}, move ${i + 1}: hash ${out.hashes[g]?.[i]}, expected ${h}`;
        positions.push({ hash: h, board: board.join(""), at: [g, i] });
      }
    }
    const want = positions.flatMap((p, j) => {
      const first = positions.slice(0, j).find((q) => q.hash === p.hash);
      return first ? [{ at: p.at, same: first.at, sameBoard: first.board === p.board }] : [];
    });
    if (out.finalBoard !== positions.at(-1)?.board) return `final board ${out.finalBoard}`;
    if (JSON.stringify(want) !== JSON.stringify(out.repeats))
      return `repeats ${JSON.stringify(out.repeats)}, expected ${JSON.stringify(want)}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const B = state.structures.B;
    if (B?.kind !== "grid") return "no board B";
    const shown = B.cells
      .flat()
      .map((v) => (v === null ? "." : v))
      .join("");
    return shown === out.finalBoard ? null : `board shows ${shown}, expected ${out.finalBoard}`;
  },

  describeOutput: (o) =>
    `${o.hashes.map((g, i) => `game ${i + 1}: ${g.map(hex).join(" → ")}`).join("; ")}${o.repeats.length ? `; repeats: ${o.repeats.map((r) => `${r.at[0] + 1}.${r.at[1] + 1}=${r.same[0] + 1}.${r.same[1] + 1}${r.sameBoard ? "" : " (collision)"}`).join(", ")}` : ""}`,
};
