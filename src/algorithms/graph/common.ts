import type { TraceState } from "@/engine/state";

/**
 * The graph's final annotations must show "d=<distance>" (or "d=∞") for every node,
 * matching the algorithm's returned distances.
 */
export const distanceFidelity =
  <O>(name: string, distances: (output: O) => Record<string, number | null>) =>
  (state: TraceState, output: O): string | null => {
    const g = state.structures[name];
    if (!g || g.kind !== "graph") return `final state has no graph "${name}"`;
    for (const [node, d] of Object.entries(distances(output))) {
      const want = `d=${d === null ? "∞" : d}`;
      if (g.annotations[node] !== want)
        return `node ${node} shows ${g.annotations[node] ?? "nothing"}, expected ${want}`;
    }
    return null;
  };
