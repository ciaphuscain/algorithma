import type { TraceState } from "@/engine/state";
import { createRng } from "@/lib/random";
import type { AlgorithmModule, InputSpec } from "../types";

export interface MctsInput {
  /** Stones on the table; players alternately take 1, 2 or 3, and taking the last stone wins. */
  stones: number;
  iterations: number;
  seed: number;
}

export interface MctsOutput {
  /** The recommended move: the most visited at the root (fewest stones on a tie). */
  move: number;
  /** Visits and wins (for the first player) after taking 1, 2, 3 stones. */
  visits: number[];
  wins: number[];
  /** Tree nodes, root included. */
  nodes: number;
}

const MAX_STONES = 12;
const MAX_ITERATIONS = 150;
const MAX_SEED = 999_999;
/** Exploration constant of UCB1. */
const C = Math.SQRT2;

const whole = (text: string | undefined, min: number, max: number) => {
  const s = (text ?? "").trim();
  return /^\d+$/.test(s) && Number(s) >= min && Number(s) <= max ? Number(s) : null;
};

const input: InputSpec<MctsInput> = {
  fields: [
    { name: "stones", label: "Stones", placeholder: "e.g. 7" },
    { name: "iterations", label: "Iterations", placeholder: "e.g. 40" },
    {
      name: "seed",
      label: "Random seed",
      placeholder: "e.g. 1",
      help: "Playouts are random; the same seed repeats the same run.",
    },
  ],
  constraints: `1–${MAX_STONES} stones; 1–${MAX_ITERATIONS} iterations; seed from 0 to ${MAX_SEED}. Players take 1, 2 or 3 stones in turn; whoever takes the last stone wins.`,
  parse(fields) {
    const stones = whole(fields.stones, 1, MAX_STONES);
    const iterations = whole(fields.iterations, 1, MAX_ITERATIONS);
    const seed = whole(fields.seed, 0, MAX_SEED);
    const errors = [
      ...(stones === null ? [`Stones must be a whole number from 1 to ${MAX_STONES}`] : []),
      ...(iterations === null
        ? [`Iterations must be a whole number from 1 to ${MAX_ITERATIONS}`]
        : []),
      ...(seed === null ? [`The seed must be a whole number from 0 to ${MAX_SEED}`] : []),
    ];
    return errors.length
      ? { ok: false, errors }
      : { ok: true, value: { stones: stones!, iterations: iterations!, seed: seed! } };
  },
  format: (v) => ({
    stones: String(v.stones),
    iterations: String(v.iterations),
    seed: String(v.seed),
  }),
  presets: [
    {
      id: "classic",
      label: "7 stones, 40 iterations",
      value: { stones: 7, iterations: 40, seed: 0 },
    },
    {
      id: "unlucky",
      label: "Same position, another seed: 40 iterations pick a losing move",
      value: { stones: 7, iterations: 40, seed: 1 },
    },
    {
      id: "longer",
      label: "That seed with 150 iterations",
      value: { stones: 7, iterations: 150, seed: 1 },
    },
    {
      id: "losing",
      label: "8 stones: every move loses",
      value: { stones: 8, iterations: 60, seed: 2 },
    },
  ],
  random(rng, size) {
    return {
      stones: rng.int(1, MAX_STONES),
      iterations: Math.max(1, Math.min(MAX_ITERATIONS, 5 * (size ?? 8))),
      seed: rng.int(0, MAX_SEED),
    };
  },
};

interface Node {
  id: string;
  stones: number;
  /** The player (1 = first, 2 = second) whose move led here. The root's is 2. */
  mover: 1 | 2;
  visits: number;
  wins: number;
  children: Map<number, Node>;
  parent: Node | null;
}

const other = (p: 1 | 2): 1 | 2 => (p === 1 ? 2 : 1);
const who = (p: 1 | 2) => (p === 1 ? "first" : "second");

/**
 * Monte Carlo tree search with UCB1 (UCT) on a take-away game. Each iteration selects
 * a path by UCB1 through fully expanded nodes, adds one new node, plays the rest of
 * the game at random from it, and records the result along the path. Visit counts
 * concentrate on the moves whose random playouts win most often.
 */
export const mcts: AlgorithmModule<MctsInput, MctsOutput> = {
  id: "mcts",
  version: 1,
  pseudocode: [
    "procedure MCTS(root, iterations)",
    "  repeat iterations times",
    "    node ← root;  while node is fully expanded and the game is not over: node ← the child with the largest UCB1",
    "    if the game is not over at node: add a child for one untried move; node ← it",
    "    winner ← play random moves from node to the end of the game",
    "    for node and each ancestor: visits += 1; wins += 1 if the player who moved there won",
    "  return the root's most visited move",
    "UCB1(child) = wins / visits + √2 · √(ln(parent visits) / visits)",
  ],
  input,

  run(input, t) {
    const { stones, iterations, seed } = input;
    const rng = createRng(seed);
    const T = t.tree("T", { binary: false, label: "Search tree (stones left; wins/visits)" });
    const moves = Math.min(3, stones);
    const R = t.grid("R", moves, 3, 0, {
      label: "Root moves (wins for the first player)",
      rowHeaders: Array.from({ length: moves }, (_, i) => `take ${i + 1}`),
      colHeaders: ["visits", "wins", "win rate"],
    });
    const root: Node = {
      id: "root",
      stones,
      mover: 2,
      visits: 0,
      wins: 0,
      children: new Map(),
      parent: null,
    };
    T.add(
      stones,
      null,
      undefined,
      { line: 1, note: `${stones} stones; the first player moves.` },
      { id: "root" },
    );
    let count = 1;
    const ucb = (child: Node, parent: Node) =>
      child.wins / child.visits + C * Math.sqrt(Math.log(parent.visits) / child.visits);

    for (let it = 1; it <= iterations; it++) {
      // Selection.
      let node = root;
      T.status("root", "current", { line: 3, vars: { iteration: it } });
      const path: Node[] = [root];
      while (node.stones > 0 && node.children.size === Math.min(3, node.stones)) {
        t.tally("UCB evaluations", node.children.size);
        let best: Node | null = null;
        let bestScore = -Infinity;
        for (const child of node.children.values()) {
          const score = ucb(child, node);
          if (score > bestScore) [best, bestScore] = [child, score];
        }
        node = best!;
        path.push(node);
        T.status(node.id, "current", {
          line: 3,
          vars: { UCB1: Number(bestScore.toFixed(3)) },
        });
      }
      // Expansion.
      if (node.stones > 0) {
        const take = [1, 2, 3].find((m) => m <= node.stones && !node.children.has(m))!;
        const child: Node = {
          id: `n${count++}`,
          stones: node.stones - take,
          mover: other(node.mover),
          visits: 0,
          wins: 0,
          children: new Map(),
          parent: node,
        };
        node.children.set(take, child);
        T.add(
          child.stones,
          node.id,
          undefined,
          { line: 4 },
          { id: child.id, edgeLabel: `−${take}` },
        );
        T.status(child.id, "highlight", { line: 4 });
        node = child;
        path.push(node);
      }
      // Simulation.
      let left = node.stones;
      let toMove = other(node.mover);
      let winner = node.mover;
      const takes: number[] = [];
      while (left > 0) {
        const take = 1 + Math.floor(rng.next() * Math.min(3, left));
        takes.push(take);
        left -= take;
        winner = toMove;
        toMove = other(toMove);
      }
      t.tally("playout moves", takes.length);
      t.step({
        line: 5,
        vars: { winner: who(winner) },
        note:
          takes.length === 0
            ? `No stones left: the ${who(winner)} player took the last one and wins.`
            : `Random playout from ${node.stones}: take ${takes.join(", ")}. The ${who(winner)} player takes the last stone.`,
      });
      // Backpropagation.
      for (const n of path) {
        n.visits++;
        if (n.mover === winner) n.wins++;
        T.annotate(n.id, `${n.wins}/${n.visits}`, { line: 6 });
      }
      const first = path[1];
      if (first) {
        const row = [...root.children.entries()].find(([, c]) => c === first)![0] - 1;
        R.write(row, 0, first.visits, { line: 6 });
        R.write(row, 1, first.wins, { line: 6 });
        R.write(row, 2, Number((first.wins / first.visits).toFixed(2)), { line: 6 });
      }
      for (const n of path) T.status(n.id, "visited");
    }

    const visits = Array.from({ length: moves }, (_, i) => root.children.get(i + 1)?.visits ?? 0);
    const wins = Array.from({ length: moves }, (_, i) => root.children.get(i + 1)?.wins ?? 0);
    const move = visits.indexOf(Math.max(...visits)) + 1;
    const chosen = root.children.get(move);
    if (chosen) T.status(chosen.id, "path", { line: 7 });
    R.mark([[move - 1, 0]], "path", { line: 7 });
    const output: MctsOutput = { move, visits, wins, nodes: count };
    t.finish(input, output, {
      line: 7,
      vars: { iteration: null, UCB1: null, winner: null },
      note: `Most visited: take ${move} (${visits[move - 1]} of ${iterations} visits, ${wins[move - 1]} wins).`,
    });
    return output;
  },

  check(input, out) {
    const moves = Math.min(3, input.stones);
    if (out.visits.length !== moves || out.wins.length !== moves)
      return `statistics for ${out.visits.length} moves, expected ${moves}`;
    // Every iteration passes through exactly one root move.
    const total = out.visits.reduce((a, b) => a + b, 0);
    if (total !== input.iterations)
      return `${total} root visits for ${input.iterations} iterations`;
    if (out.wins.some((w, i) => w < 0 || w > out.visits[i]!)) return "more wins than visits";
    // Taking every remaining stone wins outright, so every playout through it is a win.
    if (input.stones <= 3 && out.wins[input.stones - 1] !== out.visits[input.stones - 1])
      return `taking all ${input.stones} stones won ${out.wins[input.stones - 1]} of ${out.visits[input.stones - 1]} times`;
    const most = Math.max(...out.visits);
    if (out.move !== out.visits.indexOf(most) + 1)
      return `move ${out.move} is not the most visited`;
    // Each iteration adds at most one node.
    return out.nodes >= 1 + Math.min(moves, input.iterations) && out.nodes <= input.iterations + 1
      ? null
      : `${out.nodes} nodes after ${input.iterations} iterations`;
  },

  fidelity(state: TraceState, out) {
    const tree = state.structures.T;
    const grid = state.structures.R;
    if (tree?.kind !== "tree" || grid?.kind !== "grid") return "missing tree or table";
    if (Object.keys(tree.nodes).length !== out.nodes) return "node count differs";
    const shown = grid.cells.map((r) => r[0]);
    if (JSON.stringify(shown) !== JSON.stringify(out.visits)) return `visits shown ${shown}`;
    const marked = Object.entries(tree.nodeStatus).filter(([, s]) => s === "path");
    if (marked.length !== 1) return `${marked.length} moves marked`;
    const data = tree.nodes[marked[0]![0]]!;
    return tree.nodes.root!.children.includes(marked[0]![0]) && data.edgeLabel === `−${out.move}`
      ? null
      : "the marked move differs";
  },

  describeOutput: (out) =>
    `Take ${out.move} (visits ${out.visits.join(" / ")}; wins ${out.wins.join(" / ")})`,
};
