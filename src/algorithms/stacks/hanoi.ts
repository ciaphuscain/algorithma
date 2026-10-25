import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";

export interface HanoiOutput {
  /** Every move as [from, to], pegs 0 = A, 1 = B, 2 = C. */
  moves: [number, number][];
}

const PEGS = ["A", "B", "C"] as const;
const MAX_DISKS = 6;

const input: InputSpec<number> = {
  fields: [{ name: "n", label: "Number of disks", placeholder: "e.g. 3" }],
  constraints: `1–${MAX_DISKS} disks, moved from peg A to peg C (${2 ** MAX_DISKS - 1} moves for ${MAX_DISKS}).`,
  parse(f) {
    const s = (f.n ?? "").trim();
    const n = /^\d+$/.test(s) ? Number(s) : NaN;
    return n >= 1 && n <= MAX_DISKS
      ? { ok: true, value: n }
      : { ok: false, errors: [`Give a number of disks from 1 to ${MAX_DISKS}`] };
  },
  format: (n) => ({ n: String(n) }),
  presets: [
    { id: "classic", label: "Three disks (7 moves)", value: 3 },
    { id: "four", label: "Four disks (15 moves)", value: 4 },
    { id: "one", label: "One disk", value: 1 },
  ],
  random: (rng) => rng.int(1, 4),
};

/**
 * Tower of Hanoi, recursively: to move n disks from one peg to another, move the top
 * n − 1 out of the way to the spare peg, move the largest disk, then move the n − 1
 * back on top of it. Each peg is a stack; a larger disk never sits on a smaller one.
 */
export const hanoi: AlgorithmModule<number, HanoiOutput> = {
  id: "tower-of-hanoi",
  version: 1,
  pseudocode: [
    "procedure hanoi(n, from, to, spare)",
    "  if n = 0: return",
    "  hanoi(n − 1, from, spare, to)",
    "  move the top disk of from to to",
    "  hanoi(n − 1, spare, to, from)",
  ],
  input,

  run(n, t) {
    const S = PEGS.map((p) => t.sequence(p, "stack", { label: `Peg ${p}` }));
    const pegs: number[][] = [[], [], []];
    for (let d = n; d >= 1; d--) {
      pegs[0]!.push(d);
      S[0]!.push(d, {
        line: 1,
        note:
          d === 1 ? `${n} disk${n === 1 ? "" : "s"} on peg A, largest at the bottom.` : undefined,
      });
    }
    const moves: [number, number][] = [];
    const go = (k: number, from: number, to: number, spare: number, depth: number) => {
      if (k === 0) return;
      t.step({ line: 3, vars: { n: k, from: PEGS[from]!, to: PEGS[to]!, depth } });
      go(k - 1, from, spare, to, depth + 1);
      const disk = pegs[from]!.pop()!;
      S[from]!.pop({ line: 4 });
      pegs[to]!.push(disk);
      S[to]!.push(disk, {
        line: 4,
        vars: { n: k, from: PEGS[from]!, to: PEGS[to]!, depth },
        note: `Move disk ${disk} from ${PEGS[from]!} to ${PEGS[to]!}.`,
      });
      moves.push([from, to]);
      t.tally("moves");
      go(k - 1, spare, to, from, depth + 1);
    };
    go(n, 0, 2, 1, 1);
    const output: HanoiOutput = { moves };
    t.finish(n, output, {
      line: 1,
      vars: { n: null, from: null, to: null, depth: null },
      note: `${moves.length} moves = 2^${n} − 1.`,
    });
    return output;
  },

  check(n, out) {
    // Independent oracle: replay the moves, checking each is legal, and that the
    // count is the proven minimum 2^n − 1.
    const pegs: number[][] = [Array.from({ length: n }, (_, i) => n - i), [], []];
    for (const [from, to] of out.moves) {
      const disk = pegs[from]!.pop();
      if (disk === undefined) return `a move from empty peg ${PEGS[from]!}`;
      const top = pegs[to]!.at(-1);
      if (top !== undefined && top < disk) return `disk ${disk} placed on smaller disk ${top}`;
      pegs[to]!.push(disk);
    }
    if (pegs[2]!.length !== n) return "not every disk reached peg C";
    if (out.moves.length !== 2 ** n - 1)
      return `${out.moves.length} moves, the minimum is ${2 ** n - 1}`;
    return null;
  },

  fidelity(state: TraceState) {
    const [a, b, c] = PEGS.map((p) => state.structures[p]);
    if (a?.kind !== "sequence" || b?.kind !== "sequence" || c?.kind !== "sequence")
      return "missing pegs";
    if (a.items.length || b.items.length) return "disks left on A or B";
    return c.items.every((d, i) => i === 0 || (d as number) < (c.items[i - 1] as number))
      ? null
      : "peg C is out of order";
  },

  describeOutput: (o) =>
    `${o.moves.length} moves: ${o.moves
      .slice(0, 7)
      .map(([f, t]) => `${PEGS[f]}→${PEGS[t]}`)
      .join(", ")}${o.moves.length > 7 ? ", …" : ""}`,
};
