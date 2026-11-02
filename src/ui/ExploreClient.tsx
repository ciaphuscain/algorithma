"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ENTRIES, searchCatalog, type CatalogFilters } from "@/content/catalog";
import { CURRICULUM_ITEMS, DUPLICATES } from "@/content/curriculum";
import { DOMAINS, type DomainId } from "@/content/domains";
import { COMPLEXITY_CLASSES, type ComplexityClass, type Difficulty } from "@/content/types";
import { DifficultyBadge } from "./badges";
import { Tex } from "./RichText";

const WORST_LABEL: Partial<Record<ComplexityClass, string>> = {
  "log n": "O(log n)",
  n: "O(n)",
  "n + m": "O(V + E)",
  "n log n": "O(n log n)",
  "n^2": "O(n²)",
  "n^3": "O(n³)",
};

export function ExploreClient({ initial }: { initial: CatalogFilters }) {
  const router = useRouter();
  const [filters, setFilters] = useState<CatalogFilters>(initial);
  const results = useMemo(() => searchCatalog(filters), [filters]);

  // Keep the URL shareable without adding history entries on each keystroke.
  useEffect(() => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) if (v) params.set(k, String(v));
    const qs = params.toString();
    router.replace(qs ? `/explore?${qs}` : "/explore", { scroll: false });
  }, [filters, router]);

  const set = (patch: Partial<CatalogFilters>) => setFilters((f) => ({ ...f, ...patch }));
  const planned = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of CURRICULUM_ITEMS)
      if (!DUPLICATES[item.number]) counts.set(item.domain, (counts.get(item.domain) ?? 0) + 1);
    return counts;
  }, []);
  const available = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of ENTRIES) counts.set(e.domain, (counts.get(e.domain) ?? 0) + 1);
    return counts;
  }, []);

  return (
    <>
      <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor="q">Search</label>
          <input
            id="q"
            className="input"
            type="search"
            placeholder="Name, alias or topic — e.g. shortest path, stable sort"
            value={filters.query ?? ""}
            onChange={(e) => set({ query: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="domain">Domain</label>
          <select
            id="domain"
            className="select"
            value={filters.domain ?? ""}
            onChange={(e) => set({ domain: e.target.value as DomainId | "" })}
          >
            <option value="">All domains</option>
            {DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.short}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            className="select"
            value={filters.difficulty ?? ""}
            onChange={(e) => set({ difficulty: e.target.value as Difficulty | "" })}
          >
            <option value="">Any</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="worst">Worst-case time at most</label>
          <select
            id="worst"
            className="select"
            value={filters.maxWorst ?? ""}
            onChange={(e) => set({ maxWorst: e.target.value as ComplexityClass | "" })}
          >
            <option value="">Any</option>
            {COMPLEXITY_CLASSES.filter((c) => WORST_LABEL[c]).map((c) => (
              <option key={c} value={c}>
                {WORST_LABEL[c]}
              </option>
            ))}
          </select>
        </div>
        <label className="check">
          <input
            type="checkbox"
            checked={filters.visualOnly ?? false}
            onChange={(e) => set({ visualOnly: e.target.checked })}
          />
          Only with a visualizer
        </label>
      </form>

      <p className="field__help" aria-live="polite" data-testid="result-count">
        {results.length} interactive {results.length === 1 ? "entry" : "entries"}
        {filters.query ? (
          <>
            {" "}
            ·{" "}
            <Link href={`/roadmap?q=${encodeURIComponent(filters.query)}`}>
              search the full 600-item roadmap for “{filters.query}”
            </Link>
          </>
        ) : null}
      </p>
      <div className="grid" data-testid="results">
        {results.map((e) => (
          <Link key={e.slug} href={`/algorithms/${e.slug}`} className="card card--link">
            <p className="eyebrow">{DOMAINS.find((d) => d.id === e.domain)?.short}</p>
            <h3>{e.name}</h3>
            <p>{e.summary}</p>
            <div className="card__meta">
              <DifficultyBadge difficulty={e.difficulty} />
              <span className="badge">
                <Tex tex={e.complexity.time.worst} />
              </span>
              {e.visualizer && <span className="badge">Visualizer</span>}
            </div>
          </Link>
        ))}
      </div>
      {results.length === 0 && (
        <div className="card">
          <h3>No interactive entry matches</h3>
          <p>
            Try fewer words, or look it up in the <Link href="/roadmap">roadmap</Link>. Most of the
            600 curriculum items are planned but not written yet.
          </p>
        </div>
      )}

      <section className="section">
        <h2>Subject domains</h2>
        <p className="field__help">Interactive entries / algorithms planned in the curriculum.</p>
        <ul className="domain-list">
          {DOMAINS.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                className="btn"
                style={{ width: "100%", justifyContent: "space-between" }}
                aria-pressed={filters.domain === d.id}
                onClick={() => set({ domain: filters.domain === d.id ? "" : d.id })}
              >
                <span>{d.title}</span>
                <span className="count">
                  {available.get(d.id) ?? 0} / {planned.get(d.id) ?? 0}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
