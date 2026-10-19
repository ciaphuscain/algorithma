import type { AnyAlgorithmModule } from "./types";
import { bubbleSort } from "./sorting/bubble-sort";
import { bfs } from "./graph/bfs";

/**
 * Every traceable algorithm. Registering a module here is the only step needed for
 * the conformance suite (tests/unit/conformance.test.ts) and the visualizer to pick
 * it up; renderers are chosen by the structures the trace contains.
 */
export const ALGORITHM_MODULES: readonly AnyAlgorithmModule[] = [bubbleSort, bfs];

const byId = new Map(ALGORITHM_MODULES.map((m) => [m.id, m]));

export function getModule(id: string): AnyAlgorithmModule | undefined {
  return byId.get(id);
}
