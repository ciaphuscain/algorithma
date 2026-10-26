import type { InputPreset, InputSpec } from "../../types";

/** An operation on a set of words. */
export interface WordOp {
  name: "insert" | "delete" | "search" | "prefix";
  word: string;
}

/** What a word operation reported; a prefix query reports found or missing. */
export type WordResult = "inserted" | "present" | "deleted" | "missing" | "found";

export const MAX_WORD_OPS = 16;
const WORD = /^[a-z]{1,8}$/;

const SYMBOL: Record<string, WordOp["name"]> = {
  "+": "insert",
  "-": "delete",
  "?": "search",
  "^": "prefix",
};

/** Shorthand for presets: "+car +cart ?ca ^ca -car". */
export function wordOps(text: string): WordOp[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ({ name: SYMBOL[w[0]!]!, word: w.slice(1) }));
}

export const showWordOp = (op: WordOp) => `${op.name} ${op.word}`;

const ALIASES: Record<string, WordOp["name"]> = {
  insert: "insert",
  add: "insert",
  i: "insert",
  delete: "delete",
  remove: "delete",
  d: "delete",
  search: "search",
  find: "search",
  s: "search",
  prefix: "prefix",
  startswith: "prefix",
  p: "prefix",
};

/** "insert car, insert cart, search ca, prefix ca, delete car". */
export function wordInput(options: {
  presets: InputPreset<WordOp[]>[];
  allow: WordOp["name"][];
}): InputSpec<WordOp[]> {
  const { allow } = options;
  const describe = allow.map((a) => `${a} w`).join(", ");
  return {
    fields: [
      {
        name: "ops",
        label: "Operations",
        placeholder: `e.g. insert car, insert cart, search car${allow.includes("prefix") ? ", prefix ca" : ""}`,
        multiline: true,
      },
    ],
    constraints: `1–${MAX_WORD_OPS} operations: ${describe}. Words are 1–8 lowercase letters a–z.`,
    parse(f) {
      const errors: string[] = [];
      const ops: WordOp[] = [];
      for (const raw of (f.ops ?? "").split(/[,;\n]+/)) {
        const part = raw.trim().toLowerCase();
        if (!part) continue;
        const m = /^([a-z]+)\s+(\S+)$/.exec(part);
        const name = m ? ALIASES[m[1]!] : undefined;
        if (!m || !name || !allow.includes(name)) {
          errors.push(`"${raw.trim()}" should be one of: ${describe}`);
          continue;
        }
        if (!WORD.test(m[2]!)) errors.push(`"${m[2]}" must be 1–8 lowercase letters a–z`);
        else ops.push({ name, word: m[2]! });
      }
      if (ops.length === 0 && errors.length === 0) errors.push("Give at least one operation");
      if (ops.length > MAX_WORD_OPS) errors.push(`Give at most ${MAX_WORD_OPS} operations`);
      return errors.length ? { ok: false, errors: errors.slice(0, 5) } : { ok: true, value: ops };
    },
    format: (ops) => ({ ops: ops.map(showWordOp).join(", ") }),
    presets: options.presets,
    random(rng, size) {
      const n = Math.min(MAX_WORD_OPS, Math.max(3, size ?? 12));
      // A small pool over a small alphabet, so words share prefixes and queries often hit.
      const pool = Array.from({ length: 7 }, () =>
        Array.from({ length: rng.int(1, 5) }, () => "abc"[rng.int(0, 2)]).join(""),
      );
      const others = allow.filter((a) => a !== "insert");
      return Array.from({ length: n }, (): WordOp => {
        const word = pool[rng.int(0, pool.length - 1)]!;
        if (others.length === 0 || rng.int(0, 9) < 6) return { name: "insert", word };
        const name = others[rng.int(0, others.length - 1)]!;
        return { name, word: name === "prefix" ? word.slice(0, rng.int(1, word.length)) : word };
      });
    },
  };
}

/** Reference set semantics. */
export function wordModel(ops: WordOp[]): { results: WordResult[]; words: string[] } {
  const set = new Set<string>();
  const results = ops.map((op): WordResult => {
    const w = op.word;
    if (op.name === "insert") return set.has(w) ? "present" : (set.add(w), "inserted");
    if (op.name === "delete") return set.delete(w) ? "deleted" : "missing";
    if (op.name === "search") return set.has(w) ? "found" : "missing";
    return [...set].some((s) => s.startsWith(w)) ? "found" : "missing";
  });
  return { results, words: [...set].sort() };
}

export function compareWordResults(
  ops: WordOp[],
  got: readonly WordResult[],
  want: readonly WordResult[],
): string | null {
  if (got.length !== want.length) return `${got.length} results for ${want.length} operations`;
  for (let i = 0; i < want.length; i++)
    if (got[i] !== want[i])
      return `operation ${i + 1} (${showWordOp(ops[i]!)}) reported ${got[i]}, expected ${want[i]}`;
  return null;
}

/** Length of the longest common prefix of two strings. */
export function commonPrefix(a: string, b: string): number {
  let k = 0;
  while (k < a.length && k < b.length && a[k] === b[k]) k++;
  return k;
}
