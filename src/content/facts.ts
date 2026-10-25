import { ENTRIES } from "./catalog";
import { TIERS } from "./curriculum";
import { prerequisitesOf } from "./paths";
import type { EntryFacts } from "@/lib/progress-summary";
import type { AlgorithmEntry } from "./types";

/** The tier of an entry's main curriculum item, if it has one. */
export const tierOf = (e: AlgorithmEntry): 1 | 2 | 3 | null => {
  for (const n of e.curriculum) if (TIERS[n]) return TIERS[n]!;
  return null;
};

export const factsOf = (e: AlgorithmEntry): EntryFacts => ({
  slug: e.slug,
  name: e.name,
  domain: e.domain,
  difficulty: e.difficulty,
  tier: tierOf(e),
  questionIds: e.practice.map((q) => q.id),
  requires: prerequisitesOf(e).entries.map((p) => p.slug),
});

export const ENTRY_FACTS: EntryFacts[] = ENTRIES.map(factsOf);
