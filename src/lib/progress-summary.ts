import type { AlgorithmEntry } from "@/content/types";
import type { Progress } from "./progress";

export interface EntryPractice {
  slug: string;
  total: number;
  /** Questions answered correctly at least once. */
  correct: number;
  /** Questions tried at least once. */
  attempted: number;
}

export function entryPractice(
  entry: { slug: string; questionIds: string[] },
  progress: Progress,
): EntryPractice {
  let correct = 0;
  let attempted = 0;
  for (const id of entry.questionIds) {
    const p = progress.practice[id];
    if (p) attempted++;
    if (p?.correct) correct++;
  }
  return { slug: entry.slug, total: entry.questionIds.length, correct, attempted };
}

/** Every practice question of the entry answered correctly at least once. */
export const practised = (p: EntryPractice) => p.total > 0 && p.correct === p.total;

/** The serialisable facts the progress views need about an entry. */
export interface EntryFacts {
  slug: string;
  name: string;
  domain: string;
  difficulty: AlgorithmEntry["difficulty"];
  tier: 1 | 2 | 3 | null;
  questionIds: string[];
  /** Slugs of catalogue prerequisites. */
  requires: string[];
}

export interface DomainSummary {
  domain: string;
  entries: number;
  practised: number;
  questions: number;
  correct: number;
}

export function domainSummaries(facts: EntryFacts[], progress: Progress): DomainSummary[] {
  const out = new Map<string, DomainSummary>();
  for (const f of facts) {
    const p = entryPractice(f, progress);
    const d = out.get(f.domain) ?? {
      domain: f.domain,
      entries: 0,
      practised: 0,
      questions: 0,
      correct: 0,
    };
    d.entries++;
    d.questions += p.total;
    d.correct += p.correct;
    if (practised(p)) d.practised++;
    out.set(f.domain, d);
  }
  return [...out.values()];
}

const DIFFICULTY = { beginner: 0, intermediate: 1, advanced: 2 };

/**
 * Suggested next entries: not yet practised, with every catalogue prerequisite
 * practised. Entries without catalogue prerequisites are suggested only when they are
 * beginner level, so a new learner starts at the start. Ordered by tier, then
 * difficulty, then name.
 */
export function readyNext(facts: EntryFacts[], progress: Progress, limit = 6): EntryFacts[] {
  const done = new Set(
    facts.filter((f) => practised(entryPractice(f, progress))).map((f) => f.slug),
  );
  return facts
    .filter((f) => !done.has(f.slug) && f.questionIds.length > 0)
    .filter((f) =>
      f.requires.length > 0 ? f.requires.every((r) => done.has(r)) : f.difficulty === "beginner",
    )
    .sort(
      (a, b) =>
        (a.tier ?? 4) - (b.tier ?? 4) ||
        DIFFICULTY[a.difficulty] - DIFFICULTY[b.difficulty] ||
        a.name.localeCompare(b.name),
    )
    .slice(0, limit);
}
