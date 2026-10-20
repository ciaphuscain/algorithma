"use client";

import { useState } from "react";
import type { Implementation } from "@/content/types";

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
      <p className="field__help" style={{ marginTop: 12 }}>
        Running your own code in the browser is not enabled yet: user code needs an isolation
        boundary first (see the Studio page and docs/security.md).
      </p>
    </div>
  );
}
