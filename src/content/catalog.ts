import { CURRICULUM_ITEMS, DUPLICATES, type CurriculumItem } from "./curriculum";
import type { DomainId } from "./domains";
import type { AlgorithmEntry, ComplexityClass, Difficulty } from "./types";
import { bubbleSortEntry } from "./entries/bubble-sort";
import { bfsEntry } from "./entries/bfs";

/** All published entries. Order here is the default display order. */
export const ENTRIES: readonly AlgorithmEntry[] = [bubbleSortEntry, bfsEntry];

const bySlug = new Map(ENTRIES.map((e) => [e.slug, e]));
const byCurriculum = new Map<number, AlgorithmEntry>();
for (const e of ENTRIES) for (const n of e.curriculum) byCurriculum.set(n, e);

export function getEntry(slug: string): AlgorithmEntry | undefined {
  return bySlug.get(slug);
}

/** The entry covering curriculum item `n`, following duplicates to the canonical item. */
export function entryForItem(n: number): AlgorithmEntry | undefined {
  return byCurriculum.get(DUPLICATES[n] ?? n);
}

export interface CatalogFilters {
  query?: string;
  domain?: DomainId | "";
  difficulty?: Difficulty | "";
  /** Keep entries whose worst case grows no faster than this class. */
  maxWorst?: ComplexityClass | "";
  visualOnly?: boolean;
}

const WORST_ORDER: ComplexityClass[] = [
  "1",
  "log n",
  "n",
  "n + m",
  "n log n",
  "n^2",
  "n^3",
  "2^n",
  "other",
];

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9+*]+/g, " ")
    .trim();

/**
 * Score an entry against a free-text query. Every query term must match somewhere;
 * matches in the name or aliases weigh more than matches in tags or the summary.
 * Returns 0 for no match.
 */
export function scoreEntry(entry: AlgorithmEntry, query: string): number {
  const terms = normalise(query).split(" ").filter(Boolean);
  if (terms.length === 0) return 1;
  const fields: [string, number][] = [
    [normalise([entry.name, ...entry.aliases].join(" ")), 10],
    [normalise(entry.tags.join(" ")), 5],
    [normalise(`${entry.subcategory} ${entry.domain}`), 3],
    [normalise(`${entry.summary} ${entry.problem.input} ${entry.problem.output}`), 1],
  ];
  let total = 0;
  for (const term of terms) {
    let best = 0;
    for (const [text, weight] of fields) {
      const words = text.split(" ");
      if (words.includes(term)) best = Math.max(best, weight * 2);
      else if (words.some((w) => w.startsWith(term))) best = Math.max(best, weight);
    }
    if (best === 0) return 0;
    total += best;
  }
  return total;
}

export function searchCatalog(filters: CatalogFilters): AlgorithmEntry[] {
  const maxIndex = filters.maxWorst ? WORST_ORDER.indexOf(filters.maxWorst) : Infinity;
  return ENTRIES.map((entry) => ({ entry, score: scoreEntry(entry, filters.query ?? "") }))
    .filter(({ entry, score }) => {
      if (score === 0) return false;
      if (filters.domain && entry.domain !== filters.domain) return false;
      if (filters.difficulty && entry.difficulty !== filters.difficulty) return false;
      if (filters.visualOnly && !entry.visualizer) return false;
      if (WORST_ORDER.indexOf(entry.complexity.worstClass) > maxIndex) return false;
      return true;
    })
    .sort((a, b) => b.score - a.score)
    .map(({ entry }) => entry);
}

/** Curriculum items matching a query, for the roadmap view. */
export function searchCurriculum(query: string): CurriculumItem[] {
  const terms = normalise(query).split(" ").filter(Boolean);
  if (terms.length === 0) return [...CURRICULUM_ITEMS];
  return CURRICULUM_ITEMS.filter((item) => {
    const text = normalise(
      `${item.name} ${item.note ?? ""} ${item.section} ${item.partTitle} ${item.number}`,
    );
    return terms.every((t) => text.split(" ").some((w) => w.startsWith(t)));
  });
}

export function curriculumStatus(item: CurriculumItem): "available" | "planned" {
  return entryForItem(item.number) ? "available" : "planned";
}
