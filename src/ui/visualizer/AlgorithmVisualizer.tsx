"use client";

import { useId, useState, type FormEvent } from "react";
import { getModule } from "@/algorithms/registry";
import { runAlgorithm } from "@/algorithms/run";
import type { AnyAlgorithmModule } from "@/algorithms/types";
import { TracePlayer } from "@/engine/player";
import type { Trace } from "@/engine/protocol";
import { createRng, randomSeed } from "@/lib/random";
import { ErrorBoundary } from "@/ui/ErrorBoundary";
import { TraceViewer } from "./TraceViewer";

interface Run {
  player: TracePlayer;
  trace: Trace;
  summary: string;
  /** Result of the module's independent oracle: null = verified. */
  checkError: string | null;
  /** How the input was produced, for reproducibility. */
  origin: string;
}

function execute(module: AnyAlgorithmModule, input: unknown, origin: string): Run {
  const { output, trace } = runAlgorithm(module, input);
  return {
    player: new TracePlayer(trace),
    trace,
    summary: module.describeOutput(output),
    checkError: module.check(input, output),
    origin,
  };
}

export function AlgorithmVisualizer({ moduleId }: { moduleId: string }) {
  const module = getModule(moduleId);
  const formId = useId();
  const firstPreset = module?.input.presets[0];
  const [fields, setFields] = useState<Record<string, string>>(() =>
    module && firstPreset ? module.input.format(firstPreset.value) : {},
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [run, setRun] = useState<Run | null>(() =>
    module && firstPreset
      ? execute(module, firstPreset.value, `preset “${firstPreset.label}”`)
      : null,
  );

  if (!module)
    return <div className="alert alert--error">No visualizer is registered for “{moduleId}”.</div>;

  const load = (input: unknown, origin: string) => {
    try {
      setRun(execute(module, input, origin));
      setErrors([]);
    } catch (err) {
      // Inputs are validated before running, so this indicates a bug; report it rather than crash.
      setErrors([`The algorithm failed on this input: ${(err as Error).message}`]);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = module.input.parse(fields);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    load(parsed.value, "custom input");
  };

  const onPreset = (id: string) => {
    const preset = module.input.presets.find((p) => p.id === id);
    if (!preset) return;
    setFields(module.input.format(preset.value));
    load(preset.value, `preset “${preset.label}”`);
  };

  const onRandom = () => {
    const seed = randomSeed();
    const value = module.input.random(createRng(seed));
    setFields(module.input.format(value));
    load(value, `random input, seed ${seed}`);
  };

  const exportTrace = () => {
    if (!run) return;
    const blob = new Blob([JSON.stringify(run.trace, null, 1)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${module.id}-trace.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const errorId = `${formId}-errors`;
  return (
    <div>
      <form
        className="input-panel no-print"
        onSubmit={onSubmit}
        aria-label="Algorithm input"
        noValidate
      >
        <div className="input-panel__fields">
          {module.input.fields.map((f) => (
            <div key={f.name} className={`field${f.multiline ? " field--wide" : ""}`}>
              <label htmlFor={`${formId}-${f.name}`}>{f.label}</label>
              {f.multiline ? (
                <textarea
                  id={`${formId}-${f.name}`}
                  className="textarea"
                  value={fields[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => setFields({ ...fields, [f.name]: e.target.value })}
                  aria-invalid={errors.length > 0}
                  aria-describedby={errors.length > 0 ? errorId : undefined}
                  spellCheck={false}
                />
              ) : (
                <input
                  id={`${formId}-${f.name}`}
                  className="input"
                  value={fields[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => setFields({ ...fields, [f.name]: e.target.value })}
                  aria-invalid={errors.length > 0}
                  aria-describedby={errors.length > 0 ? errorId : undefined}
                  spellCheck={false}
                  autoComplete="off"
                />
              )}
              {f.help && <span className="field__help">{f.help}</span>}
            </div>
          ))}
        </div>
        <div className="input-panel__row">
          <button type="submit" className="btn btn--primary">
            Run
          </button>
          <button type="button" className="btn" onClick={onRandom}>
            Random input
          </button>
          <label className="sr-only" htmlFor={`${formId}-preset`}>
            Load an example
          </label>
          <select
            id={`${formId}-preset`}
            className="select"
            style={{ width: "auto" }}
            value=""
            onChange={(e) => onPreset(e.target.value)}
          >
            <option value="" disabled>
              Load an example…
            </option>
            {module.input.presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <span className="field__help">{module.input.constraints}</span>
        </div>
        {errors.length > 0 && (
          <div className="alert alert--error" role="alert" id={errorId}>
            <strong>Please fix the input:</strong>
            <ul>
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}
      </form>

      {run && (
        <ErrorBoundary label="the visualizer">
          <TraceViewer
            player={run.player}
            pseudocode={module.pseudocode}
            footer={
              <section className="panel" data-testid="result">
                <h3 className="panel__title">Result</h3>
                <p
                  style={{
                    margin: "0 0 8px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    overflowWrap: "anywhere",
                  }}
                >
                  {run.summary}
                </p>
                {run.checkError === null ? (
                  <p className="badge badge--ok" style={{ margin: 0 }}>
                    ✓ Verified by an independent checker
                  </p>
                ) : (
                  <p className="alert alert--error" role="alert" style={{ margin: 0 }}>
                    Checker disagrees: {run.checkError}
                  </p>
                )}
                <p className="field__help" style={{ margin: "8px 0" }}>
                  Input: {run.origin}. {run.trace.meta.eventCount} events.
                </p>
                <button type="button" className="btn btn--small" onClick={exportTrace}>
                  Export trace (JSON)
                </button>
              </section>
            }
          />
        </ErrorBoundary>
      )}
    </div>
  );
}
