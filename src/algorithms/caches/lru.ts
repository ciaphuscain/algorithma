import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import {
  cacheInput,
  cacheOps,
  childLabels,
  compareCacheResults,
  entryLabel,
  type CacheInput,
  type CacheOp,
  type CacheResult,
} from "./common";

export interface LruOutput {
  results: CacheResult[];
  /** Entries from least to most recently used, as "key:value". */
  order: string[];
  hits: number;
  misses: number;
}

/** Independent model: a Map iterates in insertion order, so re-inserting marks recency. */
export function lruModel(input: CacheInput): { results: CacheResult[]; order: string[] } {
  const m = new Map<number, number>();
  const results = input.ops.map((op): CacheResult => {
    if (op.name === "get") {
      if (!m.has(op.key)) return "miss";
      const v = m.get(op.key)!;
      m.delete(op.key);
      m.set(op.key, v);
      return v;
    }
    if (m.has(op.key)) {
      m.delete(op.key);
      m.set(op.key, op.value);
      return "updated";
    }
    let r: CacheResult = "stored";
    if (m.size === input.capacity) {
      const oldest = m.keys().next().value!;
      m.delete(oldest);
      r = `evict ${oldest}`;
    }
    m.set(op.key, op.value);
    return r;
  });
  return { results, order: [...m].map(([k, v]) => entryLabel(k, v)) };
}

const input = cacheInput([
  {
    id: "classic",
    label: "A get saves a key from eviction",
    value: { capacity: 2, ops: cacheOps("p1:10 p2:20 g1 p3:30 g2 p4:40 g1 g3 g4") },
  },
  {
    id: "update",
    label: "Updating a value also counts as a use",
    value: { capacity: 3, ops: cacheOps("p1:1 p2:2 p3:3 p1:5 p4:4 g2 g1") },
  },
  {
    id: "scan",
    label: "A scan larger than the cache misses every time",
    value: { capacity: 3, ops: cacheOps("p1:1 p2:2 p3:3 p4:4 g1 g2 g3 g4") },
  },
]);

/**
 * An LRU (least recently used) cache: a hash map from keys to the nodes of a doubly
 * linked list ordered by recency. A get or put moves the entry to the most-recent end in
 * O(1); when a new key arrives and the cache is full, the entry at the least-recent end
 * is evicted. Only the list is drawn — the hash map is what makes finding a key O(1).
 */
export const lruCache: AlgorithmModule<CacheInput, LruOutput> = {
  id: "lru-cache",
  version: 1,
  pseudocode: [
    "get k: look k up in the hash map; a miss if it is not there",
    "  on a hit: unlink its node and relink it at the most-recent end; return its value",
    "put k v: if k is present: update its value and move it to the most-recent end",
    "  otherwise, if the cache is full: evict the node at the least-recent end (and its key)",
    "  add a node for k at the most-recent end and map k to it",
  ],
  input,

  run(input, t) {
    const T = t.tree("T", {
      binary: false,
      label: "LRU cache: least recently used on the left, most recent on the right",
    });
    const head = T.add(`0 of ${input.capacity}`, null, undefined, { line: 1 }, { view: true });
    const map = new Map<number, { id: string; value: number }>();
    const order: number[] = [];
    let hits = 0;
    let misses = 0;
    let lit: string | null = null;
    const light = (id: string | null, line: number) => {
      if (lit && T.has(lit)) T.status(lit, "unvisited", { line });
      lit = id;
      if (id) T.status(id, "current", { line });
    };
    const size = (line: number) => T.set(head, `${map.size} of ${input.capacity}`, { line });
    const touch = (k: number, line: number, note: string) => {
      const e = map.get(k)!;
      order.splice(order.indexOf(k), 1);
      order.push(k);
      T.move(e.id, head, undefined, { line, note });
      t.tally("moves");
    };

    const results: CacheResult[] = [];
    for (const op of input.ops) {
      light(null, 1);
      t.tally("lookups");
      const e = map.get(op.key);
      if (op.name === "get") {
        if (!e) {
          misses++;
          t.step({
            line: 1,
            vars: { op: `get ${op.key}` },
            note: `get ${op.key}: not cached — a miss.`,
          });
          results.push("miss");
          continue;
        }
        hits++;
        light(e.id, 2);
        touch(op.key, 2, `get ${op.key}: a hit (${e.value}); it is now the most recently used.`);
        results.push(e.value);
        continue;
      }
      if (e) {
        e.value = op.value;
        light(e.id, 3);
        T.set(e.id, entryLabel(op.key, op.value), {
          line: 3,
          vars: { op: `put ${op.key} ${op.value}` },
          note: `put ${op.key}: already cached; update its value.`,
        });
        touch(op.key, 3, `Move ${op.key} to the most-recent end.`);
        results.push("updated");
        continue;
      }
      let r: CacheResult = "stored";
      if (map.size === input.capacity) {
        const old = order.shift()!;
        const victim = map.get(old)!;
        map.delete(old);
        T.status(victim.id, "unreachable", {
          line: 4,
          vars: { op: `put ${op.key} ${op.value}` },
          note: `put ${op.key}: the cache is full; ${old} is the least recently used.`,
        });
        T.remove(victim.id, { line: 4, note: `Evict ${old}.` });
        t.tally("evictions");
        r = `evict ${old}`;
      }
      const id = T.add(entryLabel(op.key, op.value), head, undefined, {
        line: 5,
        vars: { op: `put ${op.key} ${op.value}` },
        note: `Add ${op.key} at the most-recent end.`,
      });
      map.set(op.key, { id, value: op.value });
      order.push(op.key);
      light(id, 5);
      size(5);
      results.push(r);
    }
    light(null, 5);
    const output: LruOutput = {
      results,
      order: order.map((k) => entryLabel(k, map.get(k)!.value)),
      hits,
      misses,
    };
    t.finish(input, output, {
      vars: { op: null },
      note: `${hits} hit${hits === 1 ? "" : "s"}, ${misses} miss${misses === 1 ? "" : "es"}.`,
    });
    return output;
  },

  check(input, out) {
    const want = lruModel(input);
    const r = compareCacheResults(input.ops, out.results, want.results);
    if (r) return r;
    if (out.order.join() !== want.order.join())
      return `recency order ${out.order}, expected ${want.order}`;
    const gets = input.ops.filter((o: CacheOp) => o.name === "get").length;
    const missed = want.results.filter((x) => x === "miss").length;
    return out.hits === gets - missed && out.misses === missed
      ? null
      : "hit and miss counts are wrong";
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree" || !T.root) return "no tree";
    return childLabels(T, T.root).join() === out.order.join()
      ? null
      : "the drawn recency list differs from the result";
  },

  describeOutput: (o) =>
    `${o.results.join(", ")}; ${o.hits} hits, ${o.misses} misses; LRU → MRU: ${o.order.join(" ") || "empty"}`,
};
