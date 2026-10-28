import type { Metadata } from "next";
import Link from "next/link";
import { entryForItem } from "@/content/catalog";
import {
  CURRICULUM_ITEMS,
  CURRICULUM_PARTS,
  DP_PATTERNS,
  DUPLICATES,
  LEARNING_ORDER,
  MASTERY_GOALS,
  curriculumItem,
} from "@/content/curriculum";
import { RoadmapClient } from "@/ui/RoadmapClient";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "The 600-algorithm curriculum and which entries are available.",
};

export default async function RoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const q = (await searchParams).q;
  const unique = CURRICULUM_ITEMS.filter((i) => !DUPLICATES[i.number]);
  const available = unique.filter((i) => entryForItem(i.number)).length;
  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">Curriculum</p>
        <h1>The 600-algorithm roadmap</h1>
        <p>
          The full curriculum, from linear search to Shor&apos;s algorithm, in{" "}
          {CURRICULUM_PARTS.length} parts. <strong>{available}</strong> of {unique.length} distinct
          algorithms have an interactive entry so far; the rest are planned. Entries are added only
          when their explanation, implementation and tests are complete, never as placeholders.{" "}
          {Object.keys(DUPLICATES).length} items repeat earlier ones and share their entry.
        </p>
      </header>
      <RoadmapClient initialQuery={(Array.isArray(q) ? q[0] : q) ?? ""} />

      <section className="section">
        <h2>Recommended learning order</h2>
        <ol className="prose">
          {LEARNING_ORDER.map((s) => (
            <li key={s.step}>
              <strong>{s.step}</strong>
              {s.sections.length > 0 && (
                <span className="field__help"> — {s.sections.join(", ")}</span>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <h2>Dynamic programming patterns</h2>
        <div className="table-wrap">
          <table className="table" style={{ maxWidth: 760 }}>
            <thead>
              <tr>
                <th scope="col">Pattern</th>
                <th scope="col">Examples</th>
              </tr>
            </thead>
            <tbody>
              {DP_PATTERNS.map((p) => (
                <tr key={p.pattern}>
                  <td>{p.pattern}</td>
                  <td>
                    {p.examples.map((n, i) => {
                      const item = curriculumItem(n)!;
                      const entry = entryForItem(n);
                      return (
                        <span key={n}>
                          {i > 0 && ", "}#{n}{" "}
                          {entry ? (
                            <Link href={`/algorithms/${entry.slug}`}>{item.name}</Link>
                          ) : (
                            item.name
                          )}
                        </span>
                      );
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2>Proof of mastery</h2>
        <p className="field__help">
          Personal goals from the curriculum. ALGORITHMA does not track these yet.
        </p>
        <ul className="prose">
          {MASTERY_GOALS.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
