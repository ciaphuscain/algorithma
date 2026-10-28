"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { SERVER_PROGRESS, loadProgress, subscribeProgress } from "@/lib/progress";
import { entryPractice, practised } from "@/lib/progress-summary";

/**
 * The entries to learn before this one, in order, each ticked once all its practice
 * questions have been answered correctly on this device.
 */
export function LearningPath({
  steps,
  current,
}: {
  steps: { slug: string; name: string; questionIds: string[] }[];
  current: string;
}) {
  const progress = useSyncExternalStore(subscribeProgress, loadProgress, () => SERVER_PROGRESS);
  return (
    <nav className="path" aria-label="Learning path">
      <span className="path__title">Learning path</span>
      <ol>
        {steps.map((s) => {
          const done = practised(entryPractice(s, progress));
          return (
            <li key={s.slug} className={done ? "path__step path__step--done" : "path__step"}>
              <Link href={`/algorithms/${s.slug}`}>{s.name}</Link>
              {done && (
                <span className="path__done" title="All practice questions answered correctly">
                  <span aria-hidden="true"> ✓</span>
                  <span className="sr-only"> (practised)</span>
                </span>
              )}
            </li>
          );
        })}
        <li className="path__step path__step--current" aria-current="page">
          {current}
        </li>
      </ol>
    </nav>
  );
}
