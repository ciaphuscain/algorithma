/**
 * Local, per-browser learning progress. There are no accounts yet (Phase 5), so this
 * lives in localStorage and never leaves the device. Every access is guarded: storage
 * can be unavailable (private mode, blocked site data) and the app must still work.
 *
 * Viewing a page is recorded separately from answering questions correctly; only the
 * latter counts as evidence of understanding.
 */
const KEY = "algorithma.progress.v1";
const MAX_RECENT = 8;

export interface Progress {
  recent: { slug: string; at: number }[];
  practice: Record<string, { correct: boolean; attempts: number; at: number }>;
}

const empty = (): Progress => ({ recent: [], practice: {} });
const listeners = new Set<() => void>();
let cache: Progress | null = null;

export function loadProgress(): Progress {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Progress>) : {};
    cache = {
      recent: Array.isArray(parsed.recent)
        ? parsed.recent.filter((r) => typeof r?.slug === "string")
        : [],
      practice: typeof parsed.practice === "object" && parsed.practice ? parsed.practice : {},
    };
  } catch {
    cache = empty();
  }
  return cache;
}

function save(next: Progress): void {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable: progress lasts for this page session only.
  }
  listeners.forEach((l) => l());
}

export function recordVisit(slug: string): void {
  const p = loadProgress();
  save({
    ...p,
    recent: [{ slug, at: Date.now() }, ...p.recent.filter((r) => r.slug !== slug)].slice(
      0,
      MAX_RECENT,
    ),
  });
}

export function recordAnswer(questionId: string, correct: boolean): void {
  const p = loadProgress();
  const prev = p.practice[questionId];
  save({
    ...p,
    practice: {
      ...p.practice,
      // Once answered correctly, a question stays correct; attempts keep counting.
      [questionId]: {
        correct: correct || (prev?.correct ?? false),
        attempts: (prev?.attempts ?? 0) + 1,
        at: Date.now(),
      },
    },
  });
}

export function resetProgress(): void {
  save(empty());
}

export function subscribeProgress(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Server snapshot: no progress is known during server rendering. */
export const SERVER_PROGRESS: Progress = empty();
