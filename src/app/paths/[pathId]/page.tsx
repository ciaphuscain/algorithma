import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CURATED_PATHS } from "@/content/curated-paths";
import { getEntry } from "@/content/catalog";

export function generateStaticParams() {
  return CURATED_PATHS.map((p) => ({ pathId: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pathId: string }>;
}): Promise<Metadata> {
  const { pathId } = await params;
  const path = CURATED_PATHS.find((p) => p.id === pathId);
  if (!path) return {};
  return { title: path.title, description: path.description };
}

export default async function PathDetailPage({
  params,
}: {
  params: Promise<{ pathId: string }>;
}) {
  const { pathId } = await params;
  const path = CURATED_PATHS.find((p) => p.id === pathId);
  if (!path) notFound();

  const entries = path.entries.map((slug, i) => {
    const entry = getEntry(slug);
    return { slug, entry, index: i + 1 };
  });

  const available = entries.filter((e) => e.entry).length;

  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">
          <Link href="/paths">Learning Paths</Link>
        </p>
        <h1>{path.title}</h1>
        <p>{path.description}</p>
        <p className="field__help">
          {available}/{entries.length} entries available &middot; ~
          {path.estimatedHours} hours
        </p>
      </header>

      <ol className="prose" style={{ marginTop: "1.5rem" }}>
        {entries.map(({ slug, entry, index }) => (
          <li key={slug} style={{ marginBottom: "0.75rem" }}>
            {entry ? (
              <Link href={`/algorithms/${slug}`}>
                <strong>{entry.name}</strong>
              </Link>
            ) : (
              <span className="field__help">{slug} (planned)</span>
            )}
            {entry && (
              <span
                className="field__help"
                style={{ marginLeft: "0.5rem", fontSize: "0.85rem" }}
              >
                {entry.difficulty} &middot; {entry.domain}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
