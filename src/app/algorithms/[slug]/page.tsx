import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ENTRIES, getEntry } from "@/content/catalog";
import { getDomain } from "@/content/domains";
import { LEVELS, type AlgorithmEntry } from "@/content/types";
import { Blocks } from "@/ui/Blocks";
import { RichText, Tex } from "@/ui/RichText";
import { CodeView } from "@/ui/algorithm/CodeView";
import { Levels } from "@/ui/algorithm/Levels";
import { Practice } from "@/ui/algorithm/Practice";
import { Tabs } from "@/ui/algorithm/Tabs";
import { VisitRecorder } from "@/ui/algorithm/VisitRecorder";
import { AlgorithmVisualizer } from "@/ui/visualizer/AlgorithmVisualizer";
import { ReviewBadge, DifficultyBadge } from "@/ui/badges";
import { reviewState } from "@/content/review";
import { leadsTo, learningPath, prerequisitesOf } from "@/content/paths";
import { LearningPath } from "@/ui/algorithm/LearningPath";

export function generateStaticParams() {
  return ENTRIES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const entry = getEntry((await params).slug);
  return entry ? { title: entry.name, description: entry.summary } : {};
}

function ComplexityTable({ entry }: { entry: AlgorithmEntry }) {
  const { time, space, note } = entry.complexity;
  return (
    <div>
      <table className="table complexity-table" style={{ maxWidth: 520 }}>
        <tbody>
          <tr>
            <td>Best time</td>
            <td>
              <Tex tex={time.best} />
            </td>
          </tr>
          <tr>
            <td>Average time</td>
            <td>
              <Tex tex={time.average} />
            </td>
          </tr>
          <tr>
            <td>Worst time</td>
            <td>
              <Tex tex={time.worst} />
            </td>
          </tr>
          <tr>
            <td>Extra space</td>
            <td>
              <Tex tex={space} />
            </td>
          </tr>
          {entry.properties.map((p) => (
            <tr key={p.label}>
              <td>{p.label}</td>
              <td>
                <RichText text={p.value} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {note && (
        <p className="field__help" style={{ maxWidth: "70ch" }}>
          <RichText text={note} />
        </p>
      )}
    </div>
  );
}

function ExamNotes({ entry }: { entry: AlgorithmEntry }) {
  const ex = entry.exam;
  return (
    <article className="prose" data-testid="exam-notes">
      <div className="chip-row no-print" style={{ marginBottom: 16 }}>
        <span className="field__help">
          Structured for written examinations. Use your browser&apos;s print dialog for a clean
          revision sheet.
        </span>
      </div>
      <h2>{entry.name} — revision notes</h2>
      <h3>1. Definition</h3>
      <p>
        <RichText text={ex.definition} />
      </p>
      <h3>2. Problem</h3>
      <p>
        <strong>Input:</strong> <RichText text={entry.problem.input} />
        <br />
        <strong>Output:</strong> <RichText text={entry.problem.output} />
      </p>
      <h3>3. Algorithm steps</h3>
      <ol>
        {ex.steps.map((s, i) => (
          <li key={i}>
            <RichText text={s} />
          </li>
        ))}
      </ol>
      <h3>4. Time complexity</h3>
      <p>
        <RichText text={ex.timeComplexity} />
      </p>
      <h3>5. Space complexity</h3>
      <p>
        <RichText text={ex.spaceComplexity} />
      </p>
      <h3>6. Correctness</h3>
      <p>
        <RichText text={ex.correctness} />
      </p>
      <h3>7. Applications</h3>
      <ul>
        {ex.applications.map((a, i) => (
          <li key={i}>
            <RichText text={a} />
          </li>
        ))}
      </ul>
      <h3>8. Limitations</h3>
      <ul>
        {ex.limitations.map((a, i) => (
          <li key={i}>
            <RichText text={a} />
          </li>
        ))}
      </ul>
      <h3>9. Frequently asked</h3>
      <dl>
        {ex.faq.map((f, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <dt style={{ fontWeight: 600 }}>
              <RichText text={f.q} />
            </dt>
            <dd style={{ margin: 0 }}>
              <RichText text={f.a} />
            </dd>
          </div>
        ))}
      </dl>
      <h3>10. Answer outlines by marks</h3>
      <p className="field__help">
        Generic outlines, not any institution&apos;s marking scheme. Check your own syllabus for how
        marks are awarded.
      </p>
      {ex.answers.map((a) => (
        <div key={a.marks} className="card" style={{ marginBottom: 12 }}>
          <h4 style={{ margin: "0 0 6px" }}>{a.marks}-mark answer</h4>
          <ul style={{ margin: 0 }}>
            {a.outline.map((o, i) => (
              <li key={i}>
                <RichText text={o} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </article>
  );
}

export default async function AlgorithmPage({ params }: { params: Promise<{ slug: string }> }) {
  const entry = getEntry((await params).slug);
  if (!entry) notFound();
  const domain = getDomain(entry.domain);
  const review = reviewState(entry);
  const prerequisites = prerequisitesOf(entry);
  const path = learningPath(entry).map((e) => ({
    slug: e.slug,
    name: e.name,
    questionIds: e.practice.map((q) => q.id),
  }));
  const next = leadsTo(entry);
  const related = entry.related.map(getEntry).filter((e): e is AlgorithmEntry => Boolean(e));

  const tabs = [
    ...(entry.visualizer
      ? [
          {
            id: "visualize",
            label: "Visualize",
            content: <AlgorithmVisualizer moduleId={entry.visualizer} />,
          },
        ]
      : []),
    {
      id: "learn",
      label: "Learn",
      content: (
        <Levels
          levels={LEVELS.map((l) => ({
            id: l.id,
            title: l.title,
            blurb: l.blurb,
            content: <Blocks blocks={entry.levels[l.id]} />,
          }))}
        />
      ),
    },
    { id: "complexity", label: "Complexity", content: <ComplexityTable entry={entry} /> },
    { id: "code", label: "Code", content: <CodeView implementations={entry.implementations} /> },
    {
      id: "practice",
      label: `Practice (${entry.practice.length})`,
      content: <Practice questions={entry.practice} />,
    },
    { id: "exam", label: "Exam notes", content: <ExamNotes entry={entry} /> },
    {
      id: "references",
      label: "References",
      content: (
        <div className="prose">
          <ol>
            {entry.references.map((r, i) => (
              <li key={i}>
                {r.url ? <a href={r.url}>{r.citation}</a> : r.citation}
                <br />
                <span className="field__help">Cited for: {r.supports}</span>
              </li>
            ))}
          </ol>
          <h3>Provenance</h3>
          <p>
            Version {entry.version}, updated {entry.updated}. {entry.review.note}
          </p>
          {review.kind !== "unreviewed" && (
            <p data-testid="review-record">
              Expert review: {review.record.reviewer}
              {review.record.affiliation ? ` (${review.record.affiliation})` : ""},{" "}
              {review.record.date}; checked {review.record.scope}.
              {review.kind === "stale" && " The entry has changed since then."}
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <VisitRecorder slug={entry.slug} />
      <header className="algo-head">
        <p className="eyebrow">
          <Link href={`/explore?domain=${entry.domain}`}>{domain?.title}</Link> ·{" "}
          {entry.subcategory}
          {entry.curriculum.length > 0 && <> · Curriculum #{entry.curriculum.join(", #")}</>}
        </p>
        <h1>{entry.name}</h1>
        <p className="algo-head__summary">{entry.summary}</p>
        <div className="algo-facts">
          <DifficultyBadge difficulty={entry.difficulty} />
          <span className="badge">
            Worst time&nbsp;
            <Tex tex={entry.complexity.time.worst} />
          </span>
          <span className="badge">
            Space&nbsp;
            <Tex tex={entry.complexity.space} />
          </span>
          <ReviewBadge status={entry.review.status} stale={review.kind === "stale"} />
          {entry.aliases.length > 0 && (
            <span className="badge">Also: {entry.aliases.join(", ")}</span>
          )}
        </div>
        {entry.prerequisites.length > 0 && (
          <p className="review-note" data-testid="prerequisites">
            Before you start:{" "}
            {[
              ...prerequisites.entries.map((p) => (
                <Link key={p.slug} href={`/algorithms/${p.slug}`}>
                  {p.name}
                </Link>
              )),
              ...prerequisites.background.map((b) => <span key={b}>{b}</span>),
            ].flatMap((node, i) => (i === 0 ? [node] : [" · ", node]))}
          </p>
        )}
        {path.length > 0 && <LearningPath steps={path} current={entry.name} />}
        {next.length > 0 && (
          <p className="review-note" data-testid="leads-to">
            Leads to:{" "}
            {next
              .map((e) => (
                <Link key={e.slug} href={`/algorithms/${e.slug}`}>
                  {e.name}
                </Link>
              ))
              .flatMap((node, i) => (i === 0 ? [node] : [" · ", node]))}
          </p>
        )}
      </header>
      <Tabs label={`${entry.name} sections`} tabs={tabs} />
      {related.length > 0 && (
        <section className="section no-print">
          <h2>Related</h2>
          <div className="grid">
            {related.map((r) => (
              <Link key={r.slug} href={`/algorithms/${r.slug}`} className="card card--link">
                <h3>{r.name}</h3>
                <p>{r.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
