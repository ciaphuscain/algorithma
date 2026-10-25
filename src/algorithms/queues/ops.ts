import type { Rng } from "@/lib/random";

/** One operation on a container: a command word and, for insertions, a value. */
export interface Op {
  name: string;
  value?: number;
}

/** What an operation reported: a value, "ok" for an insertion, or why it could not run. */
export type OpResult = number | "ok" | "empty" | "full" | "overwrote";

export const MAX_VALUE = 99;

/** Command words, and whether each takes a value. Aliases map to the canonical name. */
export type OpSpec = Record<string, { value: boolean; aliases?: string[] }>;

export const showOp = (op: Op) => (op.value === undefined ? op.name : `${op.name} ${op.value}`);
export const showOps = (ops: Op[]) => ops.map(showOp).join(", ");
export const showResult = (r: OpResult) => String(r);

/**
 * Parse "push 3, push 5, pop, min" into operations. Separators are commas, semicolons
 * or new lines; words are case-insensitive.
 */
export function parseOps(text: string, spec: OpSpec, maxOps: number): Op[] | string[] {
  const errors: string[] = [];
  const lookup = new Map<string, string>();
  for (const [name, s] of Object.entries(spec)) {
    lookup.set(name.toLowerCase(), name);
    for (const a of s.aliases ?? []) lookup.set(a.toLowerCase(), name);
  }
  const ops: Op[] = [];
  for (const raw of text.split(/[,;\n]+/)) {
    const part = raw.trim();
    if (!part) continue;
    const m = /^([A-Za-z_-]+)\s*(-?\d+)?$/.exec(part);
    const name = m ? lookup.get(m[1]!.toLowerCase()) : undefined;
    if (!m || !name) {
      errors.push(`"${part}" is not one of: ${Object.keys(spec).join(", ")}`);
      continue;
    }
    const takes = spec[name]!.value;
    if (takes && m[2] === undefined) errors.push(`"${part}" needs a value`);
    else if (!takes && m[2] !== undefined) errors.push(`"${name}" takes no value`);
    else if (takes) {
      const v = Number(m[2]);
      if (v < 0 || v > MAX_VALUE) errors.push(`${v} is outside 0–${MAX_VALUE}`);
      else ops.push({ name, value: v });
    } else ops.push({ name });
  }
  if (ops.length === 0 && errors.length === 0) errors.push("Give at least one operation");
  if (ops.length > maxOps) errors.push(`Give at most ${maxOps} operations`);
  return errors.length ? errors.slice(0, 5) : ops;
}

/**
 * Random operations: insertions (with values 1–99) more often than the others, so the
 * container usually fills up and empties again.
 */
export function randomOps(
  rng: Rng,
  n: number,
  insert: string[],
  other: string[],
  insertWeight = 6,
): Op[] {
  return Array.from({ length: n }, () =>
    rng.int(0, 9) < insertWeight
      ? { name: insert[rng.int(0, insert.length - 1)]!, value: rng.int(1, 99) }
      : { name: other[rng.int(0, other.length - 1)]! },
  );
}

/** Compare reported results with expected ones, naming the first difference. */
export function compareResults(ops: Op[], got: OpResult[], want: OpResult[]): string | null {
  if (got.length !== want.length) return `${got.length} results for ${want.length} operations`;
  for (let i = 0; i < want.length; i++)
    if (got[i] !== want[i])
      return `operation ${i + 1} (${showOp(ops[i]!)}) reported ${got[i]}, expected ${want[i]}`;
  return null;
}
