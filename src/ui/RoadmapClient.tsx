"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { entryForItem, searchCurriculum } from "@/content/catalog";
import { CURRICULUM_PARTS, curriculumItem, type CurriculumItem } from "@/content/curriculum";
import { TierBadge } from "./badges";

type Status = "" | "available" | "planned";

function Item({ item }: { item: CurriculumItem }) {
  const entry = entryForItem(item.number);
  const canonical = item.duplicateOf ? curriculumItem(item.duplicateOf) : undefined;
  return (
    <li
      className={`roadmap-item${entry ? "" : " roadmap-item--planned"}`}
      data-number={item.number}
    >
      <span className="roadmap-item__num">#{item.number}</span>
      <span>
        {entry ? (
          <Link className="roadmap-item__name" href={`/algorithms/${entry.slug}`}>
            {item.name}
          </Link>
        ) : (
          <span className="roadmap-item__name">{item.name}</span>
        )}
        {item.note && <span className="roadmap-item__note">{item.note}</span>}
        {canonical && (
          <span className="roadmap-item__note">
            Same as #{canonical.number} {canonical.name}
          </span>
        )}
      </span>
      <span className="roadmap-item__badges">
        {item.tier && <TierBadge tier={item.tier} />}
        {entry ? (
          <span className="badge badge--ok">Available</span>
        ) : (
          <span className="badge">Planned</span>
        )}
      </span>
    </li>
  );
}

export function RoadmapClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<Status>("");
  const [tier, setTier] = useState<"" | "1" | "2" | "3">("");
  const filtering = query.trim() !== "" || status !== "" || tier !== "";

  const visible = useMemo(() => {
    const set = new Set(
      searchCurriculum(query)
        .filter((i) => !status || (status === "available") === Boolean(entryForItem(i.number)))
        .filter((i) => !tier || String(i.tier) === tier)
        .map((i) => i.number),
    );
    return set;
  }, [query, status, tier]);

  return (
    <>
      <form
        className="filters"
        role="search"
        onSubmit={(e) => e.preventDefault()}
        style={{ gridTemplateColumns: "minmax(0,2fr) repeat(2, minmax(0,1fr))" }}
      >
        <div className="field">
          <label htmlFor="rq">Search the curriculum</label>
          <input
            id="rq"
            className="input"
            type="search"
            placeholder="Name, number or section"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="rs">Status</label>
          <select
            id="rs"
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="planned">Planned</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="rt">Priority tier</label>
          <select
            id="rt"
            className="select"
            value={tier}
            onChange={(e) => setTier(e.target.value as typeof tier)}
          >
            <option value="">All</option>
            <option value="1">Tier 1 · essential</option>
            <option value="2">Tier 2 · important</option>
            <option value="3">Tier 3 · advanced</option>
          </select>
        </div>
      </form>
      <p className="field__help" aria-live="polite" data-testid="roadmap-count">
        Showing {visible.size} of 600 items.
      </p>
      {CURRICULUM_PARTS.map((part) => {
        const sections = part.sections
          .map((s) => ({ ...s, items: s.items.filter((i) => visible.has(i.number)) }))
          .filter((s) => s.items.length > 0);
        if (sections.length === 0) return null;
        const count = sections.reduce((n, s) => n + s.items.length, 0);
        return (
          <details
            key={part.id}
            className="roadmap-part"
            open={filtering || part.id === "I" || part.id === "V"}
          >
            <summary>
              <h2>
                Part {part.id} · {part.title}
              </h2>
              <span className="field__help">
                #{part.range[0]}–{part.range[1]}
                {filtering ? ` · ${count} shown` : ""}
              </span>
            </summary>
            {sections.map((s) => (
              <div key={s.title} className="roadmap-section">
                <h3>{s.title}</h3>
                <ul className="roadmap-items">
                  {s.items.map((item) => (
                    <Item key={item.number} item={item} />
                  ))}
                </ul>
              </div>
            ))}
          </details>
        );
      })}
    </>
  );
}
