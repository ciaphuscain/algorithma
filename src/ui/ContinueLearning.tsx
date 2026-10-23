"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getEntry } from "@/content/catalog";
import { SERVER_PROGRESS, loadProgress, subscribeProgress } from "@/lib/progress";

export function ContinueLearning() {
  const progress = useSyncExternalStore(subscribeProgress, loadProgress, () => SERVER_PROGRESS);
  const recent = progress.recent.map((r) => getEntry(r.slug)).filter((e) => e !== undefined);
  const answered = Object.values(progress.practice);
  const correct = answered.filter((a) => a.correct).length;

  if (recent.length === 0) {
    return (
      <div className="card">
        <h3>Start here</h3>
        <p>
          New to algorithms? Open <Link href="/algorithms/bubble-sort">Bubble Sort</Link>, press
          play, and step through it at your own pace. Your recent pages will appear here. They are
          stored only in this browser.
        </p>
      </div>
    );
  }
  return (
    <div className="grid">
      {recent.slice(0, 3).map((e) => (
        <Link key={e.slug} href={`/algorithms/${e.slug}`} className="card card--link">
          <p className="eyebrow">Continue</p>
          <h3>{e.name}</h3>
          <p>{e.summary}</p>
        </Link>
      ))}
      <div className="card">
        <p className="eyebrow">Practice so far</p>
        <div className="stat">
          <span className="stat__value">
            {correct} / {answered.length}
          </span>
          <span className="stat__label">questions answered correctly (on this device)</span>
        </div>
      </div>
    </div>
  );
}
