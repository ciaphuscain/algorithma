"use client";

import { useEffect, useRef, useState } from "react";
import { CODE_RUNNER_ENABLED } from "@/lib/features";
import { SANDBOX_LIMITS, runInSandbox, type LogLine, type RunResult } from "@/lib/sandbox/run-code";

function statusText(r: RunResult): string {
  switch (r.status) {
    case "ok":
      return `Finished in ${r.durationMs} ms.`;
    case "error":
      return `Error: ${r.error ?? "unknown error"}`;
    case "timeout":
      return `Stopped: the program ran longer than the ${SANDBOX_LIMITS.timeoutMs / 1000} s limit.`;
    case "output-limit":
      return `Stopped: output limit reached (${SANDBOX_LIMITS.maxLines} lines or ${SANDBOX_LIMITS.maxChars.toLocaleString("en")} characters).`;
    case "stopped":
      return "Stopped.";
    case "unavailable":
      return `The sandbox is unavailable in this browser${r.error ? `: ${r.error}` : "."}`;
  }
}

/**
 * Edit and run your own JavaScript in the browser sandbox (ADR-0007). Output comes
 * only from console.log and friends; nothing the program does can reach this page.
 * Give it a `key` that changes with `initialCode` to start over with new code.
 */
export function CodeRunner({ initialCode, label }: { initialCode: string; label: string }) {
  const [code, setCode] = useState(initialCode);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [result, setResult] = useState<RunResult | null>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => () => abort.current?.abort(), []);

  if (!CODE_RUNNER_ENABLED) {
    return (
      <p className="field__help" data-testid="runner-disabled">
        Running your own code is built but switched off in this build until the browser sandbox has
        had an independent security review (see docs/decisions/0007-browser-code-sandbox.md).
      </p>
    );
  }

  const run = async () => {
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    setRunning(true);
    setLogs([]);
    setResult(null);
    const r = await runInSandbox(code, {
      signal: controller.signal,
      onLog: (line) => setLogs((prev) => [...prev, line]),
    });
    if (abort.current === controller) {
      setResult(r);
      setRunning(false);
    }
  };

  return (
    <section className="runner" aria-label="Code runner">
      <div className="field">
        <label htmlFor="runner-code">{label}</label>
        <textarea
          id="runner-code"
          className="textarea runner__editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          rows={Math.min(24, Math.max(8, code.split("\n").length + 1))}
        />
        <span className="field__help">
          Runs in your browser in an isolated sandbox: no network, no access to this site, stopped
          after {SANDBOX_LIMITS.timeoutMs / 1000} s. Use console.log to print.
        </span>
      </div>
      <div className="chip-row" style={{ margin: "12px 0" }}>
        <button type="button" className="btn btn--primary" onClick={run} disabled={running}>
          Run
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => abort.current?.abort()}
          disabled={!running}
        >
          Stop
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setCode(initialCode)}
          disabled={running || code === initialCode}
        >
          Reset code
        </button>
      </div>
      <pre
        className="code runner__output"
        role="log"
        aria-label="Program output"
        data-testid="run-output"
      >
        {logs.length === 0 && !running && !result ? (
          <span className="runner__hint">Output appears here.</span>
        ) : (
          logs.map((l, i) => (
            <span key={i} className={`runner__line runner__line--${l.level}`}>
              {l.text}
              {"\n"}
            </span>
          ))
        )}
      </pre>
      <p
        className={`runner__status${result && result.status !== "ok" ? " runner__status--problem" : ""}`}
        role="status"
        data-testid="run-status"
        data-status={running ? "running" : (result?.status ?? "idle")}
      >
        {running ? "Running…" : result ? statusText(result) : ""}
      </p>
    </section>
  );
}
