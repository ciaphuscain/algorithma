import type { Difficulty, ReviewStatus } from "@/content/types";

const REVIEW: Record<ReviewStatus, { label: string; cls: string; title: string }> = {
  reviewed: {
    label: "Expert reviewed",
    cls: "badge--ok",
    title: "Checked by a subject-matter reviewer.",
  },
  draft: {
    label: "Draft · unreviewed prose",
    cls: "badge--warn",
    title:
      "Code and quantitative claims are tested automatically; the explanations await expert review.",
  },
  community: {
    label: "Community contributed",
    cls: "",
    title: "Contributed by a community member; not officially reviewed.",
  },
  experimental: {
    label: "Experimental",
    cls: "badge--warn",
    title: "Unverified research content.",
  },
};

export function ReviewBadge({ status, stale = false }: { status: ReviewStatus; stale?: boolean }) {
  if (status === "reviewed" && stale)
    return (
      <span
        className="badge badge--warn"
        title="The content has changed since its last expert review; the changes are not yet reviewed."
      >
        Changed since expert review
      </span>
    );
  const r = REVIEW[status];
  return (
    <span className={`badge ${r.cls}`} title={r.title}>
      {r.label}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const dots = { beginner: "●○○", intermediate: "●●○", advanced: "●●●" }[difficulty];
  return (
    <span className="badge badge--accent" title={`Difficulty: ${difficulty}`}>
      <span aria-hidden="true">{dots}</span> {difficulty}
    </span>
  );
}

export function TierBadge({ tier }: { tier: 1 | 2 | 3 }) {
  const label = { 1: "Tier 1 · essential", 2: "Tier 2 · important", 3: "Tier 3 · advanced" }[tier];
  return <span className={`badge badge--tier${tier}`}>{label}</span>;
}
