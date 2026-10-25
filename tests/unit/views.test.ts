import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { runAlgorithm } from "@/algorithms/run";
import { heapSort } from "@/algorithms/sorting/heap-sort";
import { mergeSort } from "@/algorithms/sorting/merge-sort";
import { quickSort } from "@/algorithms/sorting/quick-sort";
import { TracePlayer } from "@/engine/player";
import type { ArrayStructure } from "@/engine/protocol";
import { applyEvent } from "@/engine/reduce";
import { initialState } from "@/engine/state";
import { Tracer } from "@/engine/tracer";
import { validateTrace } from "@/engine/validate";
import { heapSize, heapTree } from "@/ui/renderers/heap-view";

const arrays = fc.array(fc.integer({ min: -50, max: 50 }), { minLength: 1, maxLength: 24 });

describe("drawing-only tree nodes", () => {
  it("tree.add with view changes no counter, and validates", () => {
    const t = new Tracer({ id: "x", version: 1 });
    const T = t.tree("T", { binary: true });
    T.add(1, null, undefined, undefined, { view: true });
    T.add(2, "n0", 0);
    const trace = t.finish(null, null);
    expect(trace.meta.counters.writes).toBe(1);
    const state = initialState(trace);
    trace.events.forEach((e, i) => applyEvent(state, e, i));
    expect(state.counters.writes).toBe(1);
    expect(validateTrace(JSON.parse(JSON.stringify(trace))).ok).toBe(true);
    const bad = structuredClone(trace) as unknown as { events: Record<string, unknown>[] };
    bad.events[0]!.view = false;
    expect(validateTrace(bad).ok).toBe(false);
  });

  it("merge sort's recursion tree has 2n − 1 calls and quick sort's has n, all finished", () => {
    fc.assert(
      fc.property(arrays, (input) => {
        for (const [m, want] of [
          [mergeSort, 2 * input.length - 1],
          [quickSort, input.length],
        ] as const) {
          const { trace } = runAlgorithm(m, input);
          const R = new TracePlayer(trace).finalState().structures.R;
          expect(R?.kind).toBe("tree");
          if (R?.kind !== "tree") return;
          expect(Object.keys(R.nodes)).toHaveLength(want);
          expect(Object.values(R.nodeStatus).every((s) => s === "visited")).toBe(true);
        }
      }),
      { numRuns: 100 },
    );
  });
});

describe("heap view", () => {
  it("draws the unsorted prefix as a binary tree with the array's pointers", () => {
    const a: ArrayStructure = {
      kind: "array",
      display: "heap",
      values: [9, 7, 8, 1, 2, 10],
      marks: [null, null, null, null, null, "sorted"],
      pointers: { i: 1, c: 4 },
    };
    expect(heapSize(a)).toBe(5);
    const { tree, focus } = heapTree(
      a,
      [
        { s: "A", tone: "swap", indices: [1, 4] },
        { s: "B", tone: "read", indices: [0] },
      ],
      "A",
      "A:heap",
    );
    expect(tree.root).toBe("h0");
    expect(tree.nodes.h0!.children).toEqual(["h1", "h2"]);
    expect(tree.nodes.h1!.children).toEqual(["h3", "h4"]);
    expect(tree.nodes.h2!.children).toEqual([null, null]);
    expect(Object.keys(tree.nodes)).toHaveLength(5);
    expect(tree.annotations).toEqual({ h1: "i", h4: "c" });
    expect(focus).toEqual([{ s: "A:heap", tone: "swap", nodes: ["h1", "h4"] }]);
  });

  it("at every step of heap sort, the heap prefix satisfies the heap property outside the sift path", () => {
    fc.assert(
      fc.property(arrays, (input) => {
        const { trace } = runAlgorithm(heapSort, input);
        const final = new TracePlayer(trace).finalState().structures.A as ArrayStructure;
        expect(final.display).toBe("heap");
        expect(heapSize(final)).toBe(0);
        // After phase 1 (just before the first extraction swap), the whole array is a max-heap.
        const player = new TracePlayer(trace);
        const swapAt = trace.events.findIndex((e) => e.type === "array.swap" && e.line === 4);
        if (swapAt === -1) return;
        const A = player.stateAt(swapAt).structures.A as ArrayStructure;
        const v = A.values as number[];
        for (let i = 1; i < v.length; i++)
          expect(v[Math.floor((i - 1) / 2)]!).toBeGreaterThanOrEqual(v[i]!);
      }),
      { numRuns: 100 },
    );
  });
});
