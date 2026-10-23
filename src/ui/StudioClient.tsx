"use client";

import { useState, type ChangeEvent } from "react";
import type { TracePlayer } from "@/engine/player";
import { validateTrace } from "@/engine/validate";
import { STUDIO_EXAMPLES } from "@/studio/examples";
import { ErrorBoundary } from "./ErrorBoundary";
import { TraceViewer } from "./visualizer/TraceViewer";

const MAX_FILE_BYTES = 8 * 1024 * 1024;

type Loaded = { player: TracePlayer; pseudocode: string[]; summary: string } | { errors: string[] };

export function StudioClient() {
  const [json, setJson] = useState("");
  const [pseudocode, setPseudocode] = useState("");
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  const visualize = (text: string, lines: string) => {
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch (err) {
      setLoaded({ errors: [`Not valid JSON: ${(err as Error).message}`] });
      return;
    }
    const result = validateTrace(raw);
    if (!result.ok) {
      setLoaded({ errors: result.errors });
      return;
    }
    const t = result.trace;
    const kinds = [...new Set(Object.values(t.initial.structures).map((s) => s.kind))];
    setLoaded({
      player: result.player,
      pseudocode: lines.split("\n").filter((l, i, all) => l.trim() !== "" || i < all.length - 1),
      summary: `“${t.algorithm.id}” v${t.algorithm.version}: ${t.meta.eventCount} events over ${Object.keys(t.initial.structures).length} structure(s) (${kinds.join(", ")})${
        t.meta.truncated ? "; truncated" : ""
      }.`,
    });
  };

  const loadExample = (id: string) => {
    const ex = STUDIO_EXAMPLES.find((e) => e.id === id);
    if (!ex) return;
    const text = JSON.stringify(ex.build(), null, 1);
    const lines = ex.pseudocode.join("\n");
    setJson(text);
    setPseudocode(lines);
    visualize(text, lines);
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    // Check size before reading, so a huge file cannot exhaust memory.
    if (file.size > MAX_FILE_BYTES) {
      setLoaded({
        errors: [
          `The file is ${(file.size / 1e6).toFixed(1)} MB; the limit is ${MAX_FILE_BYTES / 1e6} MB.`,
        ],
      });
      return;
    }
    const text = await file.text();
    setJson(text.length > 200_000 ? "" : text);
    visualize(text, pseudocode);
  };

  return (
    <>
      <div className="card" style={{ display: "grid", gap: 12, marginBottom: 24 }}>
        <div className="chip-row" style={{ alignItems: "center" }}>
          <label className="sr-only" htmlFor="studio-example">
            Load an example
          </label>
          <select
            id="studio-example"
            className="select"
            style={{ width: "auto" }}
            value=""
            onChange={(e) => loadExample(e.target.value)}
          >
            <option value="" disabled>
              Load an example…
            </option>
            {STUDIO_EXAMPLES.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.label}
              </option>
            ))}
          </select>
          <label className="btn">
            Upload trace (.json)
            <input
              type="file"
              accept="application/json,.json"
              onChange={onFile}
              className="sr-only"
            />
          </label>
        </div>
        <div className="input-panel__fields">
          <div className="field field--wide">
            <label htmlFor="studio-json">Trace JSON</label>
            <textarea
              id="studio-json"
              className="textarea"
              style={{ minHeight: 180 }}
              spellCheck={false}
              value={json}
              onChange={(e) => setJson(e.target.value)}
              placeholder='{ "protocol": "algorithma.trace", "version": 1, … }'
            />
          </div>
          <div className="field field--wide">
            <label htmlFor="studio-pseudo">
              Pseudocode (optional, one line per row; events refer to lines by number)
            </label>
            <textarea
              id="studio-pseudo"
              className="textarea"
              spellCheck={false}
              value={pseudocode}
              onChange={(e) => setPseudocode(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => visualize(json, pseudocode)}
            disabled={json.trim() === ""}
          >
            Validate and visualize
          </button>
        </div>
      </div>

      {loaded && "errors" in loaded && (
        <div className="alert alert--error" role="alert" data-testid="studio-errors">
          <strong>This trace was rejected.</strong> Nothing was drawn.
          <ul>
            {loaded.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      {loaded && "player" in loaded && (
        <section aria-label="Imported trace">
          <div
            className="alert alert--warning"
            style={{ marginBottom: 12 }}
            data-testid="studio-summary"
          >
            <strong>Imported trace — unreviewed.</strong> {loaded.summary} It passed structural and
            replay validation, so it is internally consistent, but it shows what the file says
            happened; it is not a verified execution of any algorithm.
          </div>
          <ErrorBoundary label="this trace" resetKey={loaded.player}>
            <TraceViewer
              player={loaded.player}
              pseudocode={loaded.pseudocode.length > 0 ? loaded.pseudocode : undefined}
            />
          </ErrorBoundary>
        </section>
      )}
    </>
  );
}
