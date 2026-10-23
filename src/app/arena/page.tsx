import type { Metadata } from "next";
import { decodeConfig } from "@/experiments/arena";
import { ArenaClient } from "@/ui/ArenaClient";

export const metadata: Metadata = {
  title: "Arena",
  description:
    "Compare sorting algorithms on identical, reproducible inputs by operation counts and time.",
};

export default async function ArenaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const flat = Object.fromEntries(
    Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
  );
  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">Arena</p>
        <h1>Compare algorithms</h1>
        <p>
          Run sorting algorithms on the same seeded inputs and watch how their work grows with n.
          Operation counts are exact and reproducible; times are shown with their caveats.
        </p>
      </header>
      <ArenaClient initial={decodeConfig(flat)} />
    </div>
  );
}
