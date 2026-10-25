import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import {
  afterChange,
  checkMinimalMovement,
  hash32,
  placementInput,
  type PlacementInput,
  type PlacementOutput,
} from "./placement";

/** The score of server s for key k: a hash of the pair, 0–999. */
export const score = (k: string, s: string) => hash32(`${k}|${s}`) % 1000;

/** Highest score wins; ties go to the alphabetically first server. */
const better = (k: string, a: string, b: string) =>
  score(k, a) > score(k, b) || (score(k, a) === score(k, b) && a < b);

/**
 * Rendezvous (highest-random-weight) hashing: every key gives every server a score,
 * hash(key, server), and goes to the server with the highest score. Removing a server
 * moves only the keys it had won, each to its second-best server; adding one moves
 * only the keys for which the newcomer scores highest.
 */
export const rendezvousHashing: AlgorithmModule<PlacementInput, PlacementOutput> = {
  id: "rendezvous-hashing",
  version: 1,
  pseudocode: [
    "score(k, s) = hash(k, s)",
    "for each key k: compute score(k, s) for every server s; k goes to the highest",
    "change: add or remove one server",
    "for each key k: the highest score among the servers now present wins",
  ],
  input: placementInput([
    {
      id: "classic",
      label: "Remove a server",
      value: {
        servers: ["A", "B", "C", "D"],
        keys: ["apple", "fig", "kiwi", "lime", "pear", "plum"],
        change: { kind: "remove", server: "C" },
      },
    },
    {
      id: "add",
      label: "Add a server",
      value: {
        servers: ["A", "B", "C"],
        keys: ["apple", "fig", "kiwi", "lime", "pear", "plum"],
        change: { kind: "add", server: "D" },
      },
    },
  ]),

  run(input, t) {
    const servers = [
      ...new Set([...input.servers, ...(input.change ? [input.change.server] : [])]),
    ];
    const col = (s: string) => servers.indexOf(s);
    const G = t.grid("S", input.keys.length, servers.length, null, {
      label: "Scores hash(key, server); the highest in each row wins",
      rowHeaders: input.keys,
      colHeaders: servers,
    });
    const place = (live: string[], line: number, previous?: Record<string, string>) => {
      const result: Record<string, string> = {};
      input.keys.forEach((k, r) => {
        let best: string | null = null;
        for (const s of live) {
          if (G.get(r, col(s)) === null)
            G.write(r, col(s), score(k, s), { line: previous ? 4 : 2 });
          t.tally("scores");
          if (best === null || better(k, s, best)) best = s;
        }
        result[k] = best!;
        const moved = previous !== undefined && previous[k] !== best;
        if (previous && moved) G.mark([[r, col(previous[k]!)]], null, { line });
        G.mark([[r, col(best!)]], "path", {
          line,
          note:
            previous === undefined
              ? `${k}: the highest score is ${score(k, best!)}, from ${best}.`
              : moved
                ? `${k} moves from ${previous[k]} to ${best}, its best remaining server.`
                : undefined,
        });
      });
      return result;
    };
    const before = place(input.servers, 2);
    let after: Record<string, string> | null = null;
    let moved: string[] = [];
    if (input.change) {
      const { kind, server } = input.change;
      t.step({
        line: 3,
        note: kind === "add" ? `Add server ${server}.` : `Remove server ${server}.`,
      });
      if (kind === "remove")
        input.keys.forEach((_, r) => G.write(r, col(server), "—", { line: 3 }));
      after = place(afterChange(input), 4, before);
      moved = input.keys.filter((k) => before[k] !== after![k]);
      t.tally("moved", moved.length);
    }
    const output: PlacementOutput = { before, after, moved };
    t.finish(input, output, {
      line: 4,
      note: input.change
        ? `${moved.length} of ${input.keys.length} keys moved.`
        : `${input.keys.length} keys placed on ${input.servers.length} servers.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: sort each key's servers by score (descending), then name.
    const owner = (k: string, live: string[]) =>
      [...live].sort((a, b) => score(k, b) - score(k, a) || (a < b ? -1 : 1))[0]!;
    for (const k of input.keys) {
      if (out.before[k] !== owner(k, input.servers)) return `${k} placed on ${out.before[k]}`;
      if (out.after && out.after[k] !== owner(k, afterChange(input)))
        return `${k} placed on ${out.after[k]} after the change`;
    }
    return checkMinimalMovement(input, out);
  },

  fidelity(state: TraceState, out) {
    const G = state.structures.S;
    if (G?.kind !== "grid") return "no table S";
    const final = out.after ?? out.before;
    const keys = G.rowHeaders ?? [];
    for (let r = 0; r < G.rows; r++) {
      const winners = G.marks[r]!.flatMap((m, c) => (m === "path" ? [G.colHeaders![c]] : []));
      if (winners.length !== 1 || winners[0] !== final[keys[r]!])
        return `row ${keys[r]} marks ${winners}`;
    }
    return null;
  },

  describeOutput: (o) => {
    const final = o.after ?? o.before;
    const list = Object.entries(final)
      .map(([k, s]) => `${k}→${s}`)
      .join(", ");
    return o.after ? `${list}; moved: ${o.moved.join(", ") || "none"}` : list;
  },
};
