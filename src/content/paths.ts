import { ENTRIES } from "./catalog";
import type { AlgorithmEntry } from "./types";

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
/** "Kosaraju's Algorithm (Strongly Connected Components)" → "Kosaraju's Algorithm". */
const withoutNote = (s: string) => s.replace(/\s*\([^)]*\)\s*$/, "");

/** Every way a prerequisite may name an entry: its name, the name without a final note, its aliases. */
const byName = new Map<string, AlgorithmEntry[]>();
for (const e of ENTRIES)
  for (const key of new Set([e.name, withoutNote(e.name), ...e.aliases].map(norm))) {
    byName.set(key, [...(byName.get(key) ?? []), e]);
  }

/** The entries a prerequisite text could mean (more than one means it is ambiguous). */
export const entriesNamed = (text: string): AlgorithmEntry[] => byName.get(norm(text)) ?? [];

export interface Prerequisites {
  /** Prerequisites that are entries in the catalogue, in the order listed. */
  entries: AlgorithmEntry[];
  /** General background with no entry of its own (e.g. "Recursion"). */
  background: string[];
}

export function prerequisitesOf(entry: AlgorithmEntry): Prerequisites {
  const entries: AlgorithmEntry[] = [];
  const background: string[] = [];
  for (const p of entry.prerequisites) {
    const [match] = entriesNamed(p);
    if (match && match.slug !== entry.slug) entries.push(match);
    else background.push(p);
  }
  return { entries, background };
}

/**
 * Every entry to learn before this one, prerequisites before the entries that need
 * them (a depth-first post-order, so the result is deterministic).
 */
export function learningPath(entry: AlgorithmEntry): AlgorithmEntry[] {
  const order: AlgorithmEntry[] = [];
  const seen = new Set<string>([entry.slug]);
  const visit = (e: AlgorithmEntry) => {
    for (const p of prerequisitesOf(e).entries) {
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      visit(p);
      order.push(p);
    }
  };
  visit(entry);
  return order;
}

/** Entries that list this one as a prerequisite. */
export const leadsTo = (entry: AlgorithmEntry): AlgorithmEntry[] =>
  ENTRIES.filter((e) => prerequisitesOf(e).entries.some((p) => p.slug === entry.slug));
