"use client";

import { useState, type ReactNode } from "react";

export interface LevelSpec {
  id: string;
  title: string;
  blurb: string;
  content: ReactNode;
}

/** Progressive disclosure: one explanation depth at a time, beginners start at level 1. */
export function Levels({ levels }: { levels: LevelSpec[] }) {
  const [selected, setSelected] = useState(levels[0]!.id);
  const index = levels.findIndex((l) => l.id === selected);
  const current = levels[index]!;
  return (
    <div className="levels">
      <nav className="levels__nav no-print" aria-label="Explanation depth">
        {levels.map((l, i) => (
          <button
            key={l.id}
            type="button"
            aria-pressed={l.id === selected}
            onClick={() => setSelected(l.id)}
          >
            <span className="level-num">{i + 1}</span>
            {l.title}
            <small>{l.blurb}</small>
          </button>
        ))}
      </nav>
      <article className="prose" aria-live="polite">
        <p className="eyebrow">
          Level {index + 1} of {levels.length} · {current.title}
        </p>
        {current.content}
        <div className="chip-row no-print" style={{ marginTop: 24 }}>
          {index > 0 && (
            <button
              type="button"
              className="btn btn--small"
              onClick={() => setSelected(levels[index - 1]!.id)}
            >
              ← {levels[index - 1]!.title}
            </button>
          )}
          {index < levels.length - 1 && (
            <button
              type="button"
              className="btn btn--small"
              onClick={() => setSelected(levels[index + 1]!.id)}
            >
              Go deeper: {levels[index + 1]!.title} →
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
