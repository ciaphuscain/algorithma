/// <reference lib="webworker" />
/**
 * Runs Arena experiments off the main thread, so long runs never freeze the page.
 * Protocol: receive { config }; post { type: "row", row, done, total } per cell, then
 * { type: "done" }, or { type: "error", message }. Cancel by terminating the worker.
 */
import { experimentCells, type ExperimentConfig, type ExperimentRow } from "./arena";

export type ArenaWorkerMessage =
  | { type: "row"; row: ExperimentRow; done: number; total: number }
  | { type: "done" }
  | { type: "error"; message: string };

const post = (m: ArenaWorkerMessage) =>
  (self as unknown as DedicatedWorkerGlobalScope).postMessage(m);

self.onmessage = (e: MessageEvent<{ config: ExperimentConfig }>) => {
  try {
    const cells = experimentCells(e.data.config);
    cells.forEach((cell, i) =>
      post({ type: "row", row: cell(), done: i + 1, total: cells.length }),
    );
    post({ type: "done" });
  } catch (err) {
    post({ type: "error", message: (err as Error).message });
  }
};
