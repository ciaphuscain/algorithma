"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FAMILY_IDS,
  defaultConfig,
  encodeConfig,
  experimentCells,
  family,
  toCsv,
  type ExperimentConfig,
  type ExperimentRow,
  type FamilyId,
} from "@/experiments/arena";
import type { ArenaWorkerMessage } from "@/experiments/arena.worker";
import { getEntry } from "@/content/catalog";
import { LineChart, compact, type ChartSeries } from "./charts/LineChart";

const TIME = { id: "medianMs", label: "Wall-clock time (ms, indicative)" };
const name = (id: string) => getEntry(id)?.name ?? id;

interface Run {
  config: ExperimentConfig;
  rows: ExperimentRow[];
  environment: string;
  finishedAt: string;
  /** Where the experiment ran: a Web Worker, or the page itself if workers are unavailable. */
  thread: "worker" | "page";
}

export function ArenaClient({ initial }: { initial: ExperimentConfig }) {
  const [config, setConfig] = useState(initial);
  const fam = family(config.family);
  const [metric, setMetric] = useState<string>(fam.charted[0]!);
  const [scale, setScale] = useState<"linear" | "log">("log");
  const [run, setRun] = useState<Run | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cancel = useRef<() => void>(() => {});

  useEffect(() => {
    window.history.replaceState(null, "", `/arena?${encodeConfig(config)}`);
  }, [config]);

  const finish = (rows: ExperimentRow[], thread: Run["thread"]) => {
    setProgress(null);
    setRun({
      config,
      rows,
      thread,
      environment: `${navigator.userAgent}; ${navigator.hardwareConcurrency ?? "?"} logical CPUs`,
      finishedAt: new Date().toISOString(),
    });
  };

  /** Fallback when Web Workers are unavailable: run on the page, yielding between cells. */
  const startOnPage = async () => {
    const cells = experimentCells(config);
    const rows: ExperimentRow[] = [];
    let stopped = false;
    cancel.current = () => {
      stopped = true;
      setProgress(null);
    };
    for (const [i, cell] of cells.entries()) {
      if (stopped) return;
      await new Promise((r) => setTimeout(r, 0));
      rows.push(cell());
      setProgress({ done: i + 1, total: cells.length });
    }
    if (!stopped) finish(rows, "page");
  };

  const start = () => {
    setError(null);
    setProgress({ done: 0, total: experimentCells(config).length });
    let worker: Worker;
    try {
      worker = new Worker(new URL("../experiments/arena.worker.ts", import.meta.url), {
        type: "module",
      });
    } catch {
      void startOnPage();
      return;
    }
    const rows: ExperimentRow[] = [];
    cancel.current = () => {
      worker.terminate();
      setProgress(null);
    };
    worker.onmessage = (e: MessageEvent<ArenaWorkerMessage>) => {
      const m = e.data;
      if (m.type === "row") {
        rows.push(m.row);
        setProgress({ done: m.done, total: m.total });
      } else if (m.type === "done") {
        worker.terminate();
        finish(rows, "worker");
      } else {
        worker.terminate();
        setProgress(null);
        setError(m.message);
      }
    };
    worker.onerror = () => {
      // The worker could not start (e.g. blocked): run on the page instead.
      worker.terminate();
      void startOnPage();
    };
    worker.postMessage({ config });
  };

  const runFam = run ? family(run.config.family) : fam;
  const metrics = [...runFam.charted.map((id) => runFam.columns.find((c) => c.id === id)!), TIME];
  const metricInfo = metrics.find((m) => m.id === metric) ?? metrics[0]!;

  const series: ChartSeries[] = !run
    ? []
    : run.config.algorithms.map((a) => ({
        id: a,
        label: name(a),
        slot: (runFam.algorithms.indexOf(a) + 1) as 1 | 2 | 3 | 4,
        points: run.rows
          .filter((r) => r.algorithm === a)
          .map((r) => ({
            x: r.n,
            y: metricInfo.id === TIME.id ? r.medianMs : (r.counts[metricInfo.id] ?? 0),
          })),
      }));

  const switchFamily = (id: FamilyId) => {
    setConfig({ ...defaultConfig(id), seed: config.seed, repetitions: config.repetitions });
    setMetric(family(id).charted[0]!);
    setRun(null);
  };

  const toggleAlgorithm = (a: string, on: boolean) =>
    setConfig((c) => ({
      ...c,
      algorithms: family(c.family).algorithms.filter((x) =>
        x === a ? on : c.algorithms.includes(x),
      ),
    }));

  const download = (text: string, filename: string, type: string) => {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allCorrect = run?.rows.every((r) => r.correct) ?? false;
  const distribution = fam.distributions.find((d) => d.id === config.distribution);

  return (
    <>
      <form
        className="card"
        style={{ display: "grid", gap: 16, marginBottom: 24 }}
        onSubmit={(e) => {
          e.preventDefault();
          void start();
        }}
        aria-label="Experiment configuration"
      >
        <div className="field" style={{ maxWidth: 360 }}>
          <label htmlFor="family">Problem</label>
          <select
            id="family"
            className="select"
            value={config.family}
            onChange={(e) => switchFamily(e.target.value as FamilyId)}
          >
            {FAMILY_IDS.map((id) => (
              <option key={id} value={id}>
                {family(id).label}
              </option>
            ))}
          </select>
        </div>
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="field__label" style={{ marginBottom: 6 }}>
            Algorithms
          </legend>
          <div className="chip-row">
            {fam.algorithms.map((a) => (
              <label key={a} className="check">
                <input
                  type="checkbox"
                  checked={config.algorithms.includes(a)}
                  onChange={(e) => toggleAlgorithm(a, e.target.checked)}
                  disabled={config.algorithms.length === 1 && config.algorithms.includes(a)}
                />
                {name(a)}
              </label>
            ))}
          </div>
        </fieldset>
        <div
          className="filters"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
            margin: 0,
          }}
        >
          <div className="field">
            <label htmlFor="dist">Input distribution</label>
            <select
              id="dist"
              className="select"
              value={config.distribution}
              onChange={(e) => setConfig({ ...config, distribution: e.target.value })}
            >
              {fam.distributions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="max">Largest input size</label>
            <select
              id="max"
              className="select"
              value={config.maxSize}
              onChange={(e) => setConfig({ ...config, maxSize: Number(e.target.value) })}
            >
              {fam.sizes
                .filter((n) => n >= 32)
                .map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="seed">Seed</label>
            <input
              id="seed"
              className="input"
              inputMode="numeric"
              value={config.seed}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isInteger(v) && v >= 0 && v < 2 ** 32) setConfig({ ...config, seed: v });
              }}
            />
          </div>
          <div className="field">
            <label htmlFor="reps">Timed repetitions</label>
            <select
              id="reps"
              className="select"
              value={config.repetitions}
              onChange={(e) => setConfig({ ...config, repetitions: Number(e.target.value) })}
            >
              {[1, 3, 5, 7].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="field__help" style={{ margin: 0 }}>
          {distribution?.description} Sizes {fam.sizes[0]}, {fam.sizes[1]}, … {config.maxSize}.
          Every algorithm {fam.task} the same input for each size.
          {config.family === "shortest-paths" &&
            " Bellman–Ford receives each undirected edge as two directed edges, so both algorithms solve the same problem."}
        </p>
        <div className="chip-row" style={{ alignItems: "center" }}>
          <button type="submit" className="btn btn--primary" disabled={progress !== null}>
            {progress ? "Running…" : "Run experiment"}
          </button>
          {progress && (
            <>
              <progress
                value={progress.done}
                max={progress.total}
                aria-label="Experiment progress"
              />
              <span className="field__help">
                {progress.done} / {progress.total} runs
              </span>
              <button type="button" className="btn btn--small" onClick={() => cancel.current()}>
                Cancel
              </button>
            </>
          )}
        </div>
      </form>

      {error && (
        <p className="alert alert--error" role="alert">
          The experiment failed: {error}
        </p>
      )}

      {!run && !progress && (
        <div className="card">
          <h3>Nothing measured yet</h3>
          <p>
            Choose algorithms and an input distribution, then run the experiment. Results stay in
            this browser.
          </p>
        </div>
      )}

      {run && (
        <section aria-labelledby="results-title" data-testid="arena-results">
          <div className="section__title">
            <h2 id="results-title">Results</h2>
            <div className="chip-row">
              <button
                type="button"
                className="btn btn--small"
                onClick={() =>
                  download(toCsv(run.rows, run.config.family), "arena-results.csv", "text/csv")
                }
              >
                Download CSV
              </button>
              <button
                type="button"
                className="btn btn--small"
                onClick={() =>
                  download(
                    JSON.stringify(run, null, 2),
                    "arena-experiment.json",
                    "application/json",
                  )
                }
              >
                Download experiment (JSON)
              </button>
            </div>
          </div>
          {allCorrect ? (
            <p className="badge badge--ok" style={{ marginBottom: 12 }}>
              ✓ All {run.rows.length} outputs verified by independent checkers
            </p>
          ) : (
            <p className="alert alert--error" role="alert">
              Some outputs failed verification. Treat these results as invalid.
            </p>
          )}
          <div className="filters" style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)" }}>
            <div className="field">
              <label htmlFor="metric">Metric</label>
              <select
                id="metric"
                className="select"
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
              >
                {metrics.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="scale">Y axis</label>
              <select
                id="scale"
                className="select"
                value={scale}
                onChange={(e) => setScale(e.target.value as "linear" | "log")}
              >
                <option value="log">Logarithmic</option>
                <option value="linear">Linear</option>
              </select>
            </div>
          </div>
          {metricInfo.id === TIME.id && (
            <div className="alert alert--warning" style={{ marginBottom: 12 }}>
              Wall-clock times are medians of {run.config.repetitions} instrumented runs in this
              browser tab, after one warm-up. They include counting overhead, vary between machines
              and runs, and are too coarse below about 0.1 ms. Use operation counts to compare
              algorithms; use times only to see the overall growth shape.
            </div>
          )}
          <div className="card">
            <LineChart
              series={series}
              xLabel="Input size n"
              yLabel={metricInfo.label.replace(/ \(.*\)$/, "")}
              yScale={scale}
              formatY={(v) =>
                metricInfo.id === TIME.id ? `${v.toFixed(3)} ms` : v.toLocaleString("en")
              }
              summary={`${metricInfo.label} against input size for ${series.map((s) => s.label).join(", ")} on ${runFam.distributions
                .find((d) => d.id === run.config.distribution)
                ?.label.toLowerCase()} inputs`}
            />
          </div>
          <details style={{ marginTop: 16 }} open>
            <summary>Data table</summary>
            <div className="table-wrap">
              <table className="table" data-testid="arena-table">
                <thead>
                  <tr>
                    <th scope="col">Algorithm</th>
                    <th scope="col">n</th>
                    {runFam.columns.map((c) => (
                      <th scope="col" key={c.id}>
                        {c.label.replace(/ \(.*\)$/, "")}
                      </th>
                    ))}
                    <th scope="col">Median ms</th>
                    <th scope="col">Correct</th>
                  </tr>
                </thead>
                <tbody>
                  {run.rows.map((r) => (
                    <tr key={`${r.algorithm}-${r.n}`}>
                      <td>{name(r.algorithm)}</td>
                      <td>{r.n}</td>
                      {runFam.columns.map((c) => (
                        <td key={c.id}>{(r.counts[c.id] ?? 0).toLocaleString("en")}</td>
                      ))}
                      <td>{r.medianMs < 0.1 ? "< 0.1" : r.medianMs.toFixed(2)}</td>
                      <td>{r.correct ? "✓" : "✗"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          <p className="field__help">
            Recorded {run.finishedAt} · {run.environment} · seed {run.config.seed} · run in{" "}
            {run.thread === "worker" ? "a background worker" : "the page (workers unavailable)"}.
            The URL of this page reproduces the configuration; operation counts are identical on
            every machine, times are not.
          </p>
        </section>
      )}

      <section className="section prose">
        <h2>Methodology</h2>
        <ul>
          <li>
            <strong>Same inputs.</strong> For each size, one input is generated from the seed and
            given to every algorithm.
          </li>
          <li>
            <strong>Counts are exact and deterministic.</strong> They come from the same
            instrumented code the <Link href="/algorithms/quick-sort">visualizers</Link> replay, so
            every counted comparison is one you can step through.
          </li>
          <li>
            <strong>Counts measure algorithms, not languages.</strong> Comparing Python with
            optimised C++ times would mostly measure the languages. Counts avoid that, but they
            still ignore constant factors such as cache behaviour.
          </li>
          <li>
            <strong>Correctness is checked</strong> on every run by an independent oracle; a failing
            run invalidates the experiment.
          </li>
          <li>
            Try <em>Sorted</em> inputs to see quick sort (last-element pivot) degrade to{" "}
            {compact((1024 * 1023) / 2)} comparisons at n = 1024, while insertion sort becomes
            linear.
          </li>
        </ul>
      </section>
    </>
  );
}
