"use client";

import { useState } from "react";
import type { Question } from "@/content/types";
import { grade, type Grade } from "@/lib/grading";
import { recordAnswer } from "@/lib/progress";
import { RichText } from "@/ui/RichText";

function QuestionCard({ q, index }: { q: Question; index: number }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Grade | null>(null);
  const [hints, setHints] = useState(0);
  const name = `q-${q.id}`;

  const submit = () => {
    if (q.kind === "mcq" && choice === null) return;
    const g =
      q.kind === "mcq"
        ? grade(q, { kind: "mcq", choice: choice! })
        : grade(q, { kind: "numeric", value });
    setResult(g);
    recordAnswer(q.id, g.correct);
  };

  return (
    <fieldset className="card question" data-testid={`question-${q.id}`}>
      <legend className="sr-only">Question {index + 1}</legend>
      <p className="eyebrow">
        Question {index + 1} · {q.objective}
      </p>
      <div className="question__prompt">
        <RichText text={q.prompt} />
      </div>
      {q.kind === "mcq" ? (
        <div className="options">
          {q.options.map((opt, i) => (
            <label key={i} className="option">
              <input
                type="radio"
                name={name}
                checked={choice === i}
                onChange={() => {
                  setChoice(i);
                  setResult(null);
                }}
              />
              <span>
                <RichText text={opt} />
              </span>
            </label>
          ))}
        </div>
      ) : (
        <div className="field" style={{ maxWidth: 220, marginBottom: 12 }}>
          <label htmlFor={`${name}-answer`}>Your answer</label>
          <input
            id={`${name}-answer`}
            className="input"
            inputMode="decimal"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setResult(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
      )}
      <div className="question__actions">
        <button
          type="button"
          className="btn btn--primary btn--small"
          onClick={submit}
          disabled={q.kind === "mcq" ? choice === null : value.trim() === ""}
        >
          Check answer
        </button>
        {hints < q.hints.length && !result?.correct && (
          <button type="button" className="btn btn--small" onClick={() => setHints((h) => h + 1)}>
            {hints === 0 ? "Show a hint" : "Another hint"}
          </button>
        )}
      </div>
      {hints > 0 && (
        <ul className="field__help" style={{ marginTop: 10 }}>
          {q.hints.slice(0, hints).map((h, i) => (
            <li key={i}>
              Hint {i + 1}: <RichText text={h} />
            </li>
          ))}
        </ul>
      )}
      <div aria-live="polite">
        {result && (
          <div
            className={`alert ${result.correct ? "alert--ok" : "alert--error"}`}
            style={{ marginTop: 12 }}
            data-testid="feedback"
          >
            <strong>{result.correct ? "✓ Correct." : "✗ Not quite."}</strong>{" "}
            {!result.correct && <RichText text={result.feedback} />}
            {result.correct && (
              <p style={{ margin: "6px 0 0" }}>
                <RichText text={result.explanation} />
              </p>
            )}
          </div>
        )}
      </div>
    </fieldset>
  );
}

export function Practice({ questions }: { questions: Question[] }) {
  if (questions.length === 0) return <p>No practice questions yet.</p>;
  return (
    <div style={{ maxWidth: 760 }}>
      <p className="field__help">
        Answers are graded instantly in your browser. Hints are revealed one at a time; the full
        explanation appears once you answer correctly. Results are stored only on this device.
      </p>
      {questions.map((q, i) => (
        <QuestionCard key={q.id} q={q} index={i} />
      ))}
    </div>
  );
}
