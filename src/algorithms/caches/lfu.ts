import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import {
  cacheInput,
  cacheOps,
  childLabels,
  compareCacheResults,
  entryLabel,
  type CacheInput,
  type CacheResult,
} from "./common";

export interface LfuBucket {
  freq: number;
  /** Entries used this many times, least recently used first, as "key:value". */
  entries: string[];
}

export interface LfuOutput {
  results: CacheResult[];
  buckets: LfuBucket[];
}

/**
 * Independent model: a plain table of entries with use counts and last-use times;
 * eviction scans for the smallest (count, last use).
 */
export function lfuModel(input: CacheInput): { results: CacheResult[]; buckets: LfuBucket[] } {
  const m = new Map<number, { value: number; freq: number; last: number }>();
  const results = input.ops.map((op, time): CacheResult => {
    const e = m.get(op.key);
    if (op.name === "get") {
      if (!e) return "miss";
      e.freq++;
      e.last = time;
      return e.value;
    }
    if (e) {
      e.value = op.value;
      e.freq++;
      e.last = time;
      return "updated";
    }
    let r: CacheResult = "stored";
    if (m.size === input.capacity) {
      let victim = -1;
      for (const [k, x] of m) {
        const v = m.get(victim);
        if (!v || x.freq < v.freq || (x.freq === v.freq && x.last < v.last)) victim = k;
      }
      m.delete(victim);
      r = `evict ${victim}`;
    }
    m.set(op.key, { value: op.value, freq: 1, last: time });
    return r;
  });
  const freqs = [...new Set([...m.values()].map((e) => e.freq))].sort((a, b) => a - b);
  const buckets = freqs.map((freq) => ({
    freq,
    entries: [...m]
      .filter(([, e]) => e.freq === freq)
      .sort((a, b) => a[1].last - b[1].last)
      .map(([k, e]) => entryLabel(k, e.value)),
  }));
  return { results, buckets };
}

const input = cacheInput([
  {
    id: "classic",
    label: "The least frequently used key is evicted",
    value: { capacity: 2, ops: cacheOps("p1:10 p2:20 g1 p3:30 g2 g3 p4:40 g1 g3 g4") },
  },
  {
    id: "tie",
    label: "Ties go to the least recently used",
    value: { capacity: 3, ops: cacheOps("p1:1 p2:2 p3:3 g1 g2 g3 p4:4 g1 p5:5 g4") },
  },
  {
    id: "lru-contrast",
    label: "Where LFU and LRU disagree",
    value: { capacity: 2, ops: cacheOps("p1:1 g1 g1 g1 p2:2 g2 p3:3 g1 g2 g3") },
  },
]);

interface Entry {
  id: string;
  key: number;
  value: number;
  bucket: Bucket;
}
interface Bucket {
  id: string;
  freq: number;
  entries: Entry[];
}

/**
 * An LFU (least frequently used) cache in O(1) per operation, after Shah, Mitra and
 * Matani: entries are grouped into buckets by use count, buckets are kept in increasing
 * order, and each bucket lists its entries from least to most recently used. A use moves
 * an entry to the end of the next bucket; eviction takes the first entry of the first
 * bucket, so ties in frequency go to the least recently used key.
 */
export const lfuCache: AlgorithmModule<CacheInput, LfuOutput> = {
  id: "lfu-cache",
  version: 1,
  pseudocode: [
    "get k: look k up in the hash map; a miss if it is not there",
    "  on a hit: move k from bucket f to the end of bucket f + 1 (create it if needed)",
    "  if bucket f is now empty, remove it; return k's value",
    "put k v: if k is present: update its value and move it up a bucket, as for a hit",
    "  otherwise, if the cache is full: evict the first entry of the lowest bucket",
    "  add k at the end of bucket 1 (create it if needed) and map k to it",
  ],
  input,

  run(input, t) {
    const T = t.tree("T", {
      binary: false,
      label: "LFU cache: buckets by use count; least recently used first in each",
    });
    const root = T.add(`0 of ${input.capacity}`, null, undefined, { line: 1 }, { view: true });
    const map = new Map<number, Entry>();
    const buckets: Bucket[] = [];
    let lit: string | null = null;
    const light = (id: string | null, line: number) => {
      if (lit && T.has(lit)) T.status(lit, "unvisited", { line });
      lit = id;
      if (id) T.status(id, "current", { line });
    };
    /** The bucket for `freq`, created at position `at` if missing. */
    const bucketAt = (freq: number, at: number, line: number): Bucket => {
      const b = buckets[at];
      if (b && b.freq === freq) return b;
      const nb: Bucket = { id: "", freq, entries: [] };
      nb.id = T.add(`used ${freq}×`, root, at, {
        line,
        note: `No bucket for ${freq} use${freq === 1 ? "" : "s"} yet: create it.`,
      });
      buckets.splice(at, 0, nb);
      return nb;
    };
    const dropIfEmpty = (b: Bucket, line: number) => {
      if (b.entries.length) return;
      buckets.splice(buckets.indexOf(b), 1);
      T.remove(b.id, { line, note: `The bucket for ${b.freq}× is empty: remove it.` });
    };
    const bump = (e: Entry, line: number) => {
      const from = e.bucket;
      const to = bucketAt(from.freq + 1, buckets.indexOf(from) + 1, line);
      from.entries.splice(from.entries.indexOf(e), 1);
      to.entries.push(e);
      e.bucket = to;
      T.move(e.id, to.id, undefined, {
        line,
        note: `${e.key} has now been used ${to.freq} times: move it to the end of that bucket.`,
      });
      t.tally("moves");
      dropIfEmpty(from, 3);
    };

    const results: CacheResult[] = [];
    for (const op of input.ops) {
      light(null, 1);
      t.tally("lookups");
      const e = map.get(op.key);
      const label = op.name === "get" ? `get ${op.key}` : `put ${op.key} ${op.value}`;
      if (op.name === "get") {
        if (!e) {
          t.step({ line: 1, vars: { op: label }, note: `get ${op.key}: not cached — a miss.` });
          results.push("miss");
          continue;
        }
        light(e.id, 2);
        t.step({ line: 2, vars: { op: label }, note: `get ${op.key}: a hit (${e.value}).` });
        bump(e, 2);
        results.push(e.value);
        continue;
      }
      if (e) {
        e.value = op.value;
        light(e.id, 4);
        T.set(e.id, entryLabel(op.key, op.value), {
          line: 4,
          vars: { op: label },
          note: `put ${op.key}: already cached; update its value.`,
        });
        bump(e, 4);
        results.push("updated");
        continue;
      }
      let r: CacheResult = "stored";
      if (map.size === input.capacity) {
        const low = buckets[0]!;
        const victim = low.entries.shift()!;
        map.delete(victim.key);
        T.status(victim.id, "unreachable", {
          line: 5,
          vars: { op: label },
          note: `put ${op.key}: the cache is full. The lowest bucket is ${low.freq}×; its least recently used entry is ${victim.key}.`,
        });
        T.remove(victim.id, { line: 5, note: `Evict ${victim.key}.` });
        t.tally("evictions");
        dropIfEmpty(low, 5);
        r = `evict ${victim.key}`;
      }
      const b = bucketAt(1, 0, 6);
      const ne: Entry = { id: "", key: op.key, value: op.value, bucket: b };
      ne.id = T.add(entryLabel(op.key, op.value), b.id, undefined, {
        line: 6,
        vars: { op: label },
        note: `Add ${op.key} at the end of the bucket for 1 use.`,
      });
      b.entries.push(ne);
      map.set(op.key, ne);
      light(ne.id, 6);
      T.set(root, `${map.size} of ${input.capacity}`, { line: 6 });
      results.push(r);
    }
    light(null, 6);
    const output: LfuOutput = {
      results,
      buckets: buckets.map((b) => ({
        freq: b.freq,
        entries: b.entries.map((x) => entryLabel(x.key, x.value)),
      })),
    };
    t.finish(input, output, {
      vars: { op: null },
      note: `${map.size} entries in ${buckets.length} bucket${buckets.length === 1 ? "" : "s"}.`,
    });
    return output;
  },

  check(input, out) {
    const want = lfuModel(input);
    const r = compareCacheResults(input.ops, out.results, want.results);
    if (r) return r;
    return JSON.stringify(out.buckets) === JSON.stringify(want.buckets)
      ? null
      : `buckets ${JSON.stringify(out.buckets)}, expected ${JSON.stringify(want.buckets)}`;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree" || !T.root) return "no tree";
    const drawn = T.nodes[T.root]!.children.map((b) => ({
      freq: Number(String(T.nodes[b!]!.value).replace(/\D/g, "")),
      entries: childLabels(T, b!),
    }));
    return JSON.stringify(drawn) === JSON.stringify(out.buckets)
      ? null
      : "the drawn buckets differ from the result";
  },

  describeOutput: (o) =>
    `${o.results.join(", ")}; ${o.buckets.map((b) => `${b.freq}×: ${b.entries.join(" ")}`).join("; ") || "empty"}`,
};
