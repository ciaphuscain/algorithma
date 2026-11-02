import type { Metadata } from "next";
import Link from "next/link";
import type { CatalogFilters } from "@/content/catalog";
import { ExploreClient } from "@/ui/ExploreClient";

export const metadata: Metadata = {
  title: "Explore",
  description: "Search and filter the algorithm encyclopedia.",
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const initial = {
    query: one(sp.query),
    domain: one(sp.domain),
    difficulty: one(sp.difficulty),
    maxWorst: one(sp.maxWorst),
    visualOnly: one(sp.visualOnly) === "true",
  } as CatalogFilters;
  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">Encyclopedia</p>
        <h1>Explore algorithms</h1>
        <p>
          Interactive entries have layered explanations, a step-by-step visualizer, tested code,
          practice questions and exam notes. The <Link href="/roadmap">roadmap</Link> lists all 600
          algorithms in the curriculum, including those not yet written.
        </p>
      </header>
      <ExploreClient initial={initial} />
    </div>
  );
}
