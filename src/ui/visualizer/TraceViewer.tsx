"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import type { TracePlayer } from "@/engine/player";
import type { VarValue } from "@/engine/protocol";
import { StructurePanel } from "@/ui/renderers";
import { describeState } from "@/ui/renderers/describe";
import { ErrorBoundary } from "@/ui/ErrorBoundary";
import { Controls } from "./Controls";
import { usePlayback } from "./usePlayback";

const formatVar = (v: VarValue) => (Array.isArray(v) ? `[${v.map(String).join(", ")}]` : String(v));
const COUNTER_LABEL: Record<string, string> = {
  comparisons: "comparisons",
  swaps: "swaps",
  reads: "reads",
  writes: "writes",
};

/** Every status each graph takes during the whole trace (statuses only change via events). */
function graphLegends(player: TracePlayer) {
  const out: Record<string, { nodeStatuses: string[]; edgeStatuses: string[] }> = {};
  const order = [
    "unvisited",
    "frontier",
    "current",
    "visited",
    "path",
    "unreachable",
    "highlight",
    "idle",
    "examining",
    "tree",
    "relaxed",
    "rejected",
    "back",
  ];
  const sets: Record<string, { n: Set<string>; e: Set<string> }> = {};
  for (const [name, s] of Object.entries(player.trace.initial.structures)) {
    if (s.kind === "tree") sets[name] = { n: new Set(["unvisited"]), e: new Set() };
    else if (s.kind === "graph")
      sets[name] = {
        n: new Set(Object.values(s.nodeStatus)),
        e: new Set(Object.values(s.edgeStatus)),
      };
  }
  for (const e of player.trace.events) {
    if (e.type === "graph.node" || e.type === "tree.node") sets[e.s]?.n.add(e.status);
    else if (e.type === "structure.create" && e.structure.kind === "tree")
      sets[e.s] = { n: new Set(["unvisited"]), e: new Set() };
    else if (e.type === "graph.edge") sets[e.s]?.e.add(e.status);
  }
  for (const [name, { n, e }] of Object.entries(sets)) {
    out[name] = {
      nodeStatuses: order.filter((s) => n.has(s)),
      edgeStatuses: order.filter((s) => e.has(s)),
    };
  }
  return out;
}

/**
 * Plays back any validated trace. It knows nothing about the algorithm that produced
 * it: structures are drawn by kind, and pseudocode is optional.
 */
export function TraceViewer({
  player,
  pseudocode,
  footer,
}: {
  player: TracePlayer;
  pseudocode?: string[];
  footer?: ReactNode;
}) {
  const pb = usePlayback(player);
  const [textView, setTextView] = useState(false);
  const state = pb.state;
  if (!state) return null;

  // Show the counters this execution uses, in a stable order, from the first step.
  const counterNames = Object.entries(player.trace.meta.counters)
    .filter(([, v]) => v > 0)
    .map(([k]) => k);
  const truncated = player.trace.meta.truncated;
  const legends = graphLegends(player);

  const onKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) &&
      target.getAttribute("type") !== "range"
    )
      return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const keys: Record<string, () => void> = {
      " ": pb.toggle,
      k: pb.toggle,
      ArrowRight: () => pb.step(1),
      l: () => pb.step(1),
      ArrowLeft: () => pb.step(-1),
      j: () => pb.step(-1),
      Home: () => pb.seek(0),
      End: () => pb.seek(pb.length),
    };
    const action = keys[e.key];
    // Let the range input handle its own arrow keys.
    if (action && !(target.getAttribute("type") === "range" && e.key.startsWith("Arrow"))) {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="viz" onKeyDown={onKeyDown} data-testid="trace-viewer">
      <div className="viz__stage">
        {truncated && (
          <div className="alert alert--warning" role="status">
            <strong>Incomplete trace.</strong> Recording stopped after {truncated.afterEvents}{" "}
            events ({truncated.reason}). The result and counters below are from the full run; the
            animation covers only the recorded part.
          </div>
        )}
        <div
          className="narration"
          aria-live={pb.playing ? "off" : "polite"}
          aria-atomic="true"
          data-testid="narration"
        >
          <span className="narration__step">
            step {state.position}/{pb.length}
          </span>
          {state.note ??
            (state.position === 0
              ? "Initial state. Press play or step forward."
              : state.done
                ? "Finished."
                : " ")}
        </div>
        {state.order.map((name) => (
          <ErrorBoundary
            key={name}
            label={`“${state.structures[name]!.label ?? name}”`}
            resetKey={state.position}
          >
            <StructurePanel
              name={name}
              structure={state.structures[name]!}
              focus={state.focus}
              legend={legends[name]}
            />
          </ErrorBoundary>
        ))}
        <div className="no-print">
          <button
            type="button"
            className="btn btn--small btn--ghost"
            aria-pressed={textView}
            onClick={() => setTextView((v) => !v)}
          >
            {textView ? "Hide" : "Show"} text description
          </button>
          {textView && (
            <p className="field__help" data-testid="text-description" style={{ marginTop: 8 }}>
              {describeState(state)}
            </p>
          )}
        </div>
      </div>
      <div className="viz__controls">
        <Controls
          position={pb.position}
          length={pb.length}
          playing={pb.playing}
          speed={pb.speed}
          onSeek={pb.seek}
          onStep={pb.step}
          onToggle={pb.toggle}
          onSpeed={pb.setSpeed}
        />
        <p className="field__help" style={{ marginTop: 6 }}>
          Keyboard: <kbd>Space</kbd> play/pause · <kbd>←</kbd> <kbd>→</kbd> step · <kbd>Home</kbd>{" "}
          <kbd>End</kbd> jump
        </p>
      </div>
      <aside className="viz__side" aria-label="Execution details">
        {pseudocode && (
          <section className="panel">
            <h3 className="panel__title">Pseudocode</h3>
            <ol className="pseudo" aria-label="Pseudocode">
              {pseudocode.map((line, i) => (
                <li key={i} aria-current={state.line === i + 1 ? "step" : undefined}>
                  {line}
                </li>
              ))}
            </ol>
          </section>
        )}
        <section className="panel">
          <h3 className="panel__title">Variables</h3>
          {Object.keys(state.vars).length === 0 ? (
            <p className="field__help" style={{ margin: 0 }}>
              None yet.
            </p>
          ) : (
            <dl className="vars" data-testid="vars">
              {Object.entries(state.vars).map(([k, v]) => (
                <div key={k} style={{ display: "contents" }}>
                  <dt>{k}</dt>
                  <dd>{formatVar(v)}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
        {counterNames.length > 0 && (
          <section className="panel">
            <h3 className="panel__title">Operation counts</h3>
            <div className="counters" data-testid="counters">
              {counterNames.map((k) => (
                <div key={k}>
                  <div className="counter__value">{state.counters[k] ?? 0}</div>
                  <div className="counter__label">{COUNTER_LABEL[k] ?? k}</div>
                </div>
              ))}
            </div>
          </section>
        )}
        {footer}
      </aside>
    </div>
  );
}
