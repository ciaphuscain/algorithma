"use client";

import { useState } from "react";
import type { Implementation } from "@/content/types";
import { CodeRunner } from "@/ui/code/CodeRunner";

/** A JavaScript expression for a test argument (JSON, plus non-finite numbers). */
export function jsLiteral(v: unknown): string {
  if (typeof v === "number" && !Number.isFinite(v)) return String(v);
  if (Array.isArray(v)) return `[${v.map(jsLiteral).join(", ")}]`;
  if (v !== null && typeof v === "object")
    return `{ ${Object.entries(v)
      .map(([k, x]) => `${JSON.stringify(k)}: ${jsLiteral(x)}`)
      .join(", ")} }`;
  return JSON.stringify(v) ?? "undefined";
}

/** The reference implementation followed by a call on its first test case. */
export function starterProgram(impl: Implementation): string {
  const first = impl.tests[0];
  const call = first ? `${impl.entry}(${first.args.map(jsLiteral).join(", ")})` : `${impl.entry}()`;
  return `${impl.code.trimEnd()}\n\n// Try it: change the input, or the code, and press Run.\nconsole.log(${call});\n`;
}

const LANGUAGE_LABEL: Record<Implementation["language"], string> = {
  python: "Python",
  javascript: "JavaScript",
};

export function CodeView({ implementations }: { implementations: Implementation[] }) {
  const [lang, setLang] = useState(implementations[0]?.language);
  const [copied, setCopied] = useState(false);
  const impl = implementations.find((i) => i.language === lang) ?? implementations[0];
  if (!impl) return <p>No reference implementation yet.</p>;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(impl.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div>
      <div className="chip-row" style={{ marginBottom: 12, alignItems: "center" }}>
        <div role="group" aria-label="Language" className="chip-row">
          {implementations.map((i) => (
            <button
              key={i.language}
              type="button"
              className="btn btn--small"
              aria-pressed={i.language === impl.language}
              onClick={() => setLang(i.language)}
              style={
                i.language === impl.language
                  ? { borderColor: "var(--accent)", color: "var(--accent)" }
                  : undefined
              }
            >
              {LANGUAGE_LABEL[i.language]}
            </button>
          ))}
        </div>
        <span className="badge badge--ok" title="Executed by the test suite on every change">
          ✓ Tested on {impl.tests.length} cases
        </span>
        <button
          type="button"
          className="btn btn--small btn--ghost"
          onClick={copy}
          style={{ marginLeft: "auto" }}
        >
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
      <pre className="code" aria-label={`${LANGUAGE_LABEL[impl.language]} implementation`}>
        <code>{impl.code}</code>
      </pre>
      <details>
        <summary>Test cases</summary>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Call</th>
                <th scope="col">Expected</th>
              </tr>
            </thead>
            <tbody>
              {impl.tests.map((t, i) => (
                <tr key={i}>
                  <td>
                    <code>
                      {impl.entry}({t.args.map((a) => JSON.stringify(a)).join(", ")})
                    </code>
                  </td>
                  <td>
                    <code>{JSON.stringify(t.expected)}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <h3 className="runner__title">Try it yourself</h3>
      {impl.language === "javascript" ? (
        <CodeRunner
          key={impl.entry}
          initialCode={starterProgram(impl)}
          label={`Your copy of ${impl.entry}`}
        />
      ) : (
        <p className="field__help">
          Python runs only in the test suite. Switch to JavaScript to run and edit the code here.
        </p>
      )}
    </div>
  );
}
