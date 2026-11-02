import type { InputField, InputPreset, InputSpec } from "../types";
import type { Rng } from "@/lib/random";

export type OpKind = "insert" | "delete" | "find";

export interface HashOp {
  kind: OpKind;
  key: number;
}

export interface HashInput {
  /** Table size: buckets or slots (per table, for cuckoo hashing). */
  m: number;
  ops: HashOp[];
}

/** What each operation reported, in order: "inserted", "present", "full", "failed", "found", "missing", "deleted". */
export type OpResult = "inserted" | "present" | "full" | "failed" | "found" | "missing" | "deleted";

export const MAX_KEY = 999;
export const MAX_OPS = 20;

const SYMBOL: Record<OpKind, string> = { insert: "+", delete: "-", find: "?" };
export const showOp = (op: HashOp) => `${SYMBOL[op.kind]}${op.key}`;

/**
 * Hash-table input: a table size and a list of operations written "+k" (insert),
 * "-k" (delete) and "?k" (find), e.g. "+12, +25, ?12, -12".
 */
export function hashInput(options: {
  sizes: { min: number; max: number; primeOnly?: boolean };
  presets: InputPreset<HashInput>[];
  sizeHelp?: string;
}): InputSpec<HashInput> {
  const { min, max, primeOnly } = options.sizes;
  const fields: InputField[] = [
    {
      name: "m",
      label: "Table size m",
      placeholder: `${min}–${max}`,
      help: options.sizeHelp,
    },
    {
      name: "ops",
      label: "Operations (+k insert, -k delete, ?k find)",
      placeholder: "e.g. +12, +25, +38, ?25, -12, ?38",
      multiline: true,
    },
  ];
  return {
    fields,
    constraints: `m from ${min} to ${max}${primeOnly ? " and prime" : ""}; 1–${MAX_OPS} operations on whole-number keys 0–${MAX_KEY}.`,
    parse(f) {
      const errors: string[] = [];
      const ms = (f.m ?? "").trim();
      const m = /^\d+$/.test(ms) ? Number(ms) : NaN;
      if (!(m >= min && m <= max)) errors.push(`m must be a whole number from ${min} to ${max}`);
      else if (primeOnly && !isPrime(m)) errors.push(`m must be prime (${m} is not)`);
      const ops: HashOp[] = [];
      for (const token of (f.ops ?? "").split(/[\s,;]+/).filter(Boolean)) {
        const t = /^([+\-?])(\d+)$/.exec(token);
        if (!t) {
          errors.push(`"${token}" should be +k, -k or ?k`);
          continue;
        }
        const key = Number(t[2]);
        if (key > MAX_KEY) errors.push(`key ${key} is above ${MAX_KEY}`);
        ops.push({ kind: t[1] === "+" ? "insert" : t[1] === "-" ? "delete" : "find", key });
      }
      if (ops.length === 0) errors.push("Give at least one operation");
      if (ops.length > MAX_OPS) errors.push(`Give at most ${MAX_OPS} operations`);
      return errors.length
        ? { ok: false, errors: errors.slice(0, 5) }
        : { ok: true, value: { m, ops } };
    },
    format: (v) => ({ m: String(v.m), ops: v.ops.map(showOp).join(", ") }),
    presets: options.presets,
    random(rng: Rng, size?: number) {
      const candidates = Array.from({ length: max - min + 1 }, (_, i) => min + i).filter(
        (x) => !primeOnly || isPrime(x),
      );
      const m = candidates[rng.int(0, candidates.length - 1)]!;
      const n = Math.min(MAX_OPS, Math.max(3, size ?? 12));
      const keys: number[] = [];
      const ops: HashOp[] = [];
      for (let i = 0; i < n; i++) {
        const r = rng.int(0, 9);
        if (r < 6 || keys.length === 0) {
          const key = rng.int(0, 99);
          keys.push(key);
          ops.push({ kind: "insert", key });
        } else {
          const key = rng.int(0, 2) === 0 ? rng.int(0, 99) : keys[rng.int(0, keys.length - 1)]!;
          ops.push({ kind: r < 8 ? "find" : "delete", key });
        }
      }
      return { m, ops };
    },
  };
}

export function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

/**
 * The reference behaviour of a set, for oracles. A table may legitimately refuse an
 * insert (open addressing when every slot holds a key; cuckoo hashing when no placement
 * exists), so the model is told which inserts were refused and expects "refused" there;
 * whether a refusal was justified is each oracle's own check.
 */
export function setModel(ops: HashOp[], refused: (i: number) => boolean) {
  const set = new Set<number>();
  const expected = ops.map((op, i): OpResult | "refused" => {
    if (op.kind === "insert") {
      if (set.has(op.key)) return "present";
      if (refused(i)) return "refused";
      set.add(op.key);
      return "inserted";
    }
    if (op.kind === "find") return set.has(op.key) ? "found" : "missing";
    return set.delete(op.key) ? "deleted" : "missing";
  });
  return { expected, set };
}

const isRefusal = (r: OpResult | undefined) => r === "full" || r === "failed";

/** Compare reported results with the set model. */
export function checkResults(ops: HashOp[], results: OpResult[]): string | null {
  if (results.length !== ops.length)
    return `${results.length} results for ${ops.length} operations`;
  const { expected } = setModel(ops, (i) => isRefusal(results[i]));
  for (let i = 0; i < ops.length; i++) {
    const want = expected[i]!;
    const ok = want === "refused" ? isRefusal(results[i]) : results[i] === want;
    if (!ok) return `${showOp(ops[i]!)} reported ${results[i]}, expected ${want}`;
  }
  return null;
}

/** The keys the set model holds at the end. */
export function finalKeys(ops: HashOp[], results: OpResult[]): Set<number> {
  return setModel(ops, (i) => isRefusal(results[i])).set;
}
