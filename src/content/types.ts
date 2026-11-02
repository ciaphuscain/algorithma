import type { DomainId } from "./domains";

/**
 * Lesson content is a list of typed blocks, so new kinds of material can be added
 * without schema changes per algorithm. Inline text supports $TeX$, **bold** and
 * `code` (see ui/RichText.tsx).
 */
export type Block =
  | { kind: "p"; text: string }
  | { kind: "math"; tex: string }
  | { kind: "list"; ordered?: boolean; items: string[] }
  | { kind: "callout"; tone: "note" | "tip" | "warning"; title?: string; text: string }
  | { kind: "code"; language: string; code: string }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "heading"; text: string };

export const LEVELS = [
  { id: "intuition", title: "Intuition", blurb: "The idea in plain language." },
  { id: "mechanics", title: "Mechanics", blurb: "Step by step, with a worked example." },
  { id: "implementation", title: "Implementation", blurb: "Code, edge cases and pitfalls." },
  { id: "mathematics", title: "Mathematics", blurb: "Invariants, proofs and analysis." },
  { id: "advanced", title: "Advanced", blurb: "Variants, limits and related work." },
] as const;
export type LevelId = (typeof LEVELS)[number]["id"];

export type Difficulty = "beginner" | "intermediate" | "advanced";

/** Growth classes used for filtering; the precise bound lives in the TeX fields. */
export const COMPLEXITY_CLASSES = [
  "1",
  "log n",
  "n",
  "n log n",
  "n + m",
  "n^2",
  "n^3",
  "2^n",
  "other",
] as const;
export type ComplexityClass = (typeof COMPLEXITY_CLASSES)[number];

/**
 * A reference implementation in a real language. `tests` are executed by
 * tests/unit/content.test.ts, so displayed code is checked, not just shown.
 */
export interface Implementation {
  language: "python" | "javascript";
  /** Function the tests call. */
  entry: string;
  code: string;
  tests: { args: unknown[]; expected: unknown }[];
}

export type Question =
  | {
      id: string;
      kind: "mcq";
      prompt: string;
      options: string[];
      answer: number;
      explanation: string;
      /** Why each wrong option is wrong, keyed by option index. */
      distractors?: Record<number, string>;
      hints: string[];
      objective: string;
    }
  | {
      id: string;
      kind: "numeric";
      prompt: string;
      answer: number;
      explanation: string;
      hints: string[];
      objective: string;
    };

export interface ExamNotes {
  definition: string;
  steps: string[];
  timeComplexity: string;
  spaceComplexity: string;
  correctness: string;
  applications: string[];
  limitations: string[];
  faq: { q: string; a: string }[];
  /** Model answer outlines by marks. */
  answers: { marks: 2 | 5 | 10 | 15; outline: string[] }[];
}

export interface Reference {
  citation: string;
  url?: string;
  /** What this source supports, so readers know why it is cited. */
  supports: string;
}

/**
 * Review states. Content is published only after expert review is "reviewed"; all
 * current entries are honest drafts (see docs/content-review.md).
 */
/** One expert review, recorded by the reviewer (see docs/content-review.md). */
export interface ReviewRecord {
  reviewer: string;
  /** Optional affiliation or credentials, as the reviewer wishes to be named. */
  affiliation?: string;
  /** YYYY-MM-DD. */
  date: string;
  /** What was checked, e.g. "all five levels, exam notes, practice and references". */
  scope: string;
  /** contentHash() of the entry when it was reviewed. */
  contentHash: string;
}

export type ReviewStatus = "reviewed" | "draft" | "community" | "experimental";

export interface AlgorithmEntry {
  slug: string;
  name: string;
  aliases: string[];
  /** Numbers in the 600-item curriculum this entry covers. */
  curriculum: number[];
  domain: DomainId;
  subcategory: string;
  difficulty: Difficulty;
  summary: string;
  tags: string[];
  prerequisites: string[];
  related: string[];
  problem: { input: string; output: string };
  levels: Record<LevelId, Block[]>;
  complexity: {
    time: { best: string; average: string; worst: string };
    space: string;
    worstClass: ComplexityClass;
    note?: string;
  };
  properties: { label: string; value: string }[];
  implementations: Implementation[];
  /** Algorithm module id for the interactive visualizer, if one exists. */
  visualizer: string | null;
  practice: Question[];
  exam: ExamNotes;
  references: Reference[];
  /** `reviewed` requires at least one record whose hash matches the current content. */
  review: { status: ReviewStatus; note: string; records?: ReviewRecord[] };
  version: number;
  updated: string;
}
