import type { TreeStructure } from "@/engine/protocol";
import type { Rng } from "@/lib/random";
import type { InputPreset, InputSpec } from "../types";

/** A cache operation: put a value under a key, or get the value stored under a key. */
export type CacheOp = { name: "put"; key: number; value: number } | { name: "get"; key: number };

/** get: the value or "miss"; put: "stored", "updated", or the key it evicted ("evict 4"). */
export type CacheResult = number | "miss" | "stored" | "updated" | `evict ${number}`;

export interface CacheInput {
  capacity: number;
  ops: CacheOp[];
}

export const MAX_CACHE_OPS = 16;
export const MAX_CAPACITY = 6;

export const showCacheOp = (op: CacheOp) =>
  op.name === "put" ? `put ${op.key} ${op.value}` : `get ${op.key}`;

/** Shorthand for presets: "p1:10 p2:20 g1" → put 1 10, put 2 20, get 1. */
export function cacheOps(text: string): CacheOp[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w): CacheOp => {
      if (w[0] === "g") return { name: "get", key: Number(w.slice(1)) };
      const [k, v] = w.slice(1).split(":").map(Number);
      return { name: "put", key: k!, value: v! };
    });
}

export function cacheInput(presets: InputPreset<CacheInput>[]): InputSpec<CacheInput> {
  return {
    fields: [
      { name: "capacity", label: "Capacity", placeholder: `1–${MAX_CAPACITY}` },
      {
        name: "ops",
        label: "Operations",
        placeholder: "e.g. put 1 10, put 2 20, get 1, put 3 30",
        multiline: true,
      },
    ],
    constraints: `Capacity 1–${MAX_CAPACITY}; 1–${MAX_CACHE_OPS} operations: put k v, get k, with keys and values 0–99.`,
    parse(f) {
      const errors: string[] = [];
      const cs = (f.capacity ?? "").trim();
      const capacity = /^\d+$/.test(cs) ? Number(cs) : NaN;
      if (!(capacity >= 1 && capacity <= MAX_CAPACITY))
        errors.push(`Capacity must be a whole number from 1 to ${MAX_CAPACITY}`);
      const ops: CacheOp[] = [];
      for (const raw of (f.ops ?? "").split(/[,;\n]+/)) {
        const part = raw.trim().toLowerCase();
        if (!part) continue;
        let m: RegExpExecArray | null;
        if ((m = /^(?:put|set|p)\s+(\d+)\s*(?:[:=,]|\s)\s*(\d+)$/.exec(part)))
          ops.push({ name: "put", key: Number(m[1]), value: Number(m[2]) });
        else if ((m = /^(?:get|g)\s+(\d+)$/.exec(part)))
          ops.push({ name: "get", key: Number(m[1]) });
        else errors.push(`"${raw.trim()}" should be put k v or get k`);
      }
      for (const op of ops)
        if (op.key > 99 || (op.name === "put" && op.value > 99)) {
          errors.push("Keys and values must be 0–99");
          break;
        }
      if (ops.length === 0 && errors.length === 0) errors.push("Give at least one operation");
      if (ops.length > MAX_CACHE_OPS) errors.push(`Give at most ${MAX_CACHE_OPS} operations`);
      return errors.length
        ? { ok: false, errors: errors.slice(0, 5) }
        : { ok: true, value: { capacity, ops } };
    },
    format: (v) => ({ capacity: String(v.capacity), ops: v.ops.map(showCacheOp).join(", ") }),
    presets,
    random(rng: Rng, size) {
      const n = Math.min(MAX_CACHE_OPS, Math.max(3, size ?? 12));
      // Few distinct keys, so gets often hit and the cache often fills up.
      const keys = rng.int(3, 6);
      const ops = Array.from({ length: n }, (): CacheOp => {
        const key = rng.int(1, keys);
        return rng.int(0, 9) < 5
          ? { name: "put", key, value: rng.int(1, 99) }
          : { name: "get", key };
      });
      return { capacity: rng.int(1, 4), ops };
    },
  };
}

export function compareCacheResults(
  ops: CacheOp[],
  got: readonly CacheResult[],
  want: readonly CacheResult[],
): string | null {
  if (got.length !== want.length) return `${got.length} results for ${want.length} operations`;
  for (let i = 0; i < want.length; i++)
    if (got[i] !== want[i])
      return `operation ${i + 1} (${showCacheOp(ops[i]!)}) reported ${got[i]}, expected ${want[i]}`;
  return null;
}

/** An entry is drawn as "key:value". */
export const entryLabel = (key: number, value: number) => `${key}:${value}`;

/** The labels of a node's children in the replayed state. */
export function childLabels(T: TreeStructure, id: string): string[] {
  return T.nodes[id]!.children.map((c) => String(T.nodes[c!]!.value));
}
