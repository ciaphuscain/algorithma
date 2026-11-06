import type { Metadata } from "next";
import Link from "next/link";
import { CURATED_PATHS } from "@/content/curated-paths";
import { getEntry } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Learning Paths",
  description: "Curated sequences of algorithms for different goals.",
};

const ICONS: Record<string, string> = {
  briefcase: "\u{1F4BC}",
  trophy: "\u{1F3C6}",
  server: "\u{1F5A5}",
  brain: "\u{1F9E0}",
  lock: "\u{1F512}",
  layers: "\u{1F4DA}",
};

const DIFF_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function PathsPage() {
  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">Guided Learning</p>
        <h1>Learning Paths</h1>
        <p>
          Curated sequences of algorithms and data structures, ordered for
          progressive learning. Pick a path that matches your goal.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {CURATED_PATHS.map((path) => {
          const available = path.entries.filter((s) => getEntry(s)).length;
          return (
            <Link
              key={path.id}
              href={`/paths/${path.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article
                className="card"
                style={{
                  padding: "1.5rem",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ fontSize: "2rem" }}>
                  {ICONS[path.icon] ?? ""}
                </div>
                <h2 style={{ margin: 0, fontSize: "1.25rem" }}>{path.title}</h2>
                <p
                  className="field__help"
                  style={{ margin: 0, flex: 1, fontSize: "0.9rem" }}
                >
                  {path.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    fontSize: "0.85rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span className="badge">{DIFF_LABEL[path.difficulty]}</span>
                  <span className="field__help">
                    {available}/{path.entries.length} entries
                  </span>
                  <span className="field__help">~{path.estimatedHours}h</span>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
