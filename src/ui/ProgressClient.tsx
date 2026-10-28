"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { SERVER_PROGRESS, loadProgress, resetProgress, subscribeProgress } from "@/lib/progress";
import {
  domainSummaries,
  entryPractice,
  practised,
  readyNext,
  type EntryFacts,
} from "@/lib/progress-summary";

export function ProgressClient({
  facts,
  domains,
}: {
  facts: EntryFacts[];
  domains: Record<string, string>;
}) {
  const progress = useSyncExternalStore(subscribeProgress, loadProgress, () => SERVER_PROGRESS);
  const [confirming, setConfirming] = useState(false);
  const summaries = domainSummaries(facts, progress).sort((a, b) =>
    (domains[a.domain] ?? a.domain).localeCompare(domains[b.domain] ?? b.domain),
  );
  const done = facts.filter((f) => practised(entryPractice(f, progress)));
  const started = facts.filter((f) => {
    const p = entryPractice(f, progress);
    return p.attempted > 0 && !practised(p);
  });
  const next = readyNext(facts, progress);
  const answered = Object.keys(progress.practice).length;

  return (
    <div className="stack">
      <section aria-labelledby="next-heading">
        <h2 id="next-heading">Suggested next</h2>
        <p className="field__help">
          Algorithms whose prerequisites in the catalogue you have practised (every question
          answered correctly at least once). With nothing practised yet, these are the beginner
          entries.
        </p>
        <div className="grid" data-testid="ready-next">
          {next.map((f) => (
            <Link key={f.slug} href={`/algorithms/${f.slug}`} className="card card--link">
              <p className="eyebrow">
                {domains[f.domain] ?? f.domain}
                {f.tier ? ` · Tier ${f.tier}` : ""}
              </p>
              <h3>{f.name}</h3>
            </Link>
          ))}
          {next.length === 0 && (
            <p>Nothing new is unlocked yet: finish the practice in progress first.</p>
          )}
        </div>
      </section>

      <section aria-labelledby="topics-heading">
        <h2 id="topics-heading">By topic</h2>
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Practice by topic">
          <table className="table" data-testid="topic-table">
            <thead>
              <tr>
                <th scope="col">Topic</th>
                <th scope="col">Algorithms practised</th>
                <th scope="col">Questions answered correctly</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((s) => (
                <tr key={s.domain}>
                  <th scope="row">{domains[s.domain] ?? s.domain}</th>
                  <td>
                    {s.practised} of {s.entries}
                  </td>
                  <td>
                    {s.correct} of {s.questions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {(started.length > 0 || done.length > 0) && (
        <section aria-labelledby="mine-heading">
          <h2 id="mine-heading">Your algorithms</h2>
          {started.length > 0 && (
            <p>
              In progress:{" "}
              {started
                .map((f) => (
                  <Link key={f.slug} href={`/algorithms/${f.slug}#practice`}>
                    {f.name}
                  </Link>
                ))
                .flatMap((node, i) => (i === 0 ? [node] : [" · ", node]))}
            </p>
          )}
          {done.length > 0 && (
            <p data-testid="practised">
              Practised:{" "}
              {done
                .map((f) => (
                  <Link key={f.slug} href={`/algorithms/${f.slug}`}>
                    {f.name}
                  </Link>
                ))
                .flatMap((node, i) => (i === 0 ? [node] : [" · ", node]))}
            </p>
          )}
        </section>
      )}

      <section aria-labelledby="data-heading">
        <h2 id="data-heading">Your data</h2>
        <p>
          {answered} question{answered === 1 ? "" : "s"} attempted on this device.{" "}
          {confirming ? (
            <>
              Delete all progress on this device?{" "}
              <button
                type="button"
                className="btn"
                onClick={() => {
                  resetProgress();
                  setConfirming(false);
                }}
              >
                Yes, delete
              </button>{" "}
              <button type="button" className="btn btn--ghost" onClick={() => setConfirming(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button type="button" className="btn btn--ghost" onClick={() => setConfirming(true)}>
              Reset progress
            </button>
          )}
        </p>
      </section>
    </div>
  );
}
