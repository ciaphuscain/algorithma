import type { AlgorithmEntry, ReviewRecord } from "./types";

/** JSON with object keys sorted, so the hash does not depend on key order. */
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.keys(value)
      .sort()
      .filter((k) => (value as Record<string, unknown>)[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${stable((value as Record<string, unknown>)[k])}`)
      .join(",")}}`;
  return JSON.stringify(value);
}

/** FNV-1a over the UTF-8 bytes, 64-bit, as 16 hex digits. Detects edits; not a security hash. */
export function fnv1a64(text: string): string {
  const mask = (1n << 64n) - 1n;
  let h = 0xcbf29ce484222325n;
  for (const byte of new TextEncoder().encode(text)) {
    h ^= BigInt(byte);
    h = (h * 0x100000001b3n) & mask;
  }
  return h.toString(16).padStart(16, "0");
}

/**
 * Hash of everything a reviewer checks: all of an entry except its review metadata,
 * version and date. Any later edit to the reviewed content changes it.
 */
export function contentHash(entry: AlgorithmEntry): string {
  const { review: _review, version: _version, updated: _updated, ...content } = entry;
  return fnv1a64(stable(content));
}

export type ReviewState =
  | { kind: "reviewed"; record: ReviewRecord }
  /** Marked reviewed, but the content changed after the last review. */
  | { kind: "stale"; record: ReviewRecord }
  | { kind: "unreviewed" };

export function reviewState(entry: AlgorithmEntry): ReviewState {
  const record = entry.review.records?.at(-1);
  if (entry.review.status !== "reviewed" || !record) return { kind: "unreviewed" };
  return record.contentHash === contentHash(entry)
    ? { kind: "reviewed", record }
    : { kind: "stale", record };
}
