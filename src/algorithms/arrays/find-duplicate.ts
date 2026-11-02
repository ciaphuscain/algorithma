import type { TraceState } from "@/engine/state";
import { layoutGraph } from "@/lib/graph-layout";
import type { AlgorithmModule, InputSpec } from "../types";
import { clamp, parseNumberList } from "../inputs";
import { pointerLabels } from "../lists/common";

const MAX = 14;
const nid = (i: number) => `n${i}`;

const input: InputSpec<number[]> = {
  fields: [
    {
      name: "values",
      label: "Array",
      placeholder: "e.g. 1, 3, 4, 2, 2",
      help: "n + 1 values, each between 1 and n, so at least one value repeats.",
    },
  ],
  constraints: `2–${MAX} whole numbers; with m values, each must be between 1 and m − 1.`,
  parse(f) {
    const list = parseNumberList(f.values ?? "", {
      minLength: 2,
      maxLength: MAX,
      min: 1,
      max: MAX,
    });
    if (!list.ok) return list;
    const m = list.value.length;
    const bad = list.value.filter((v) => v > m - 1);
    return bad.length
      ? { ok: false, errors: [`With ${m} values, each must be at most ${m - 1}; ${bad[0]} is not`] }
      : list;
  },
  format: (v) => ({ values: v.join(", ") }),
  presets: [
    { id: "classic", label: "Five values", value: [1, 3, 4, 2, 2] },
    { id: "long-tail", label: "A long tail", value: [2, 5, 9, 6, 9, 3, 8, 9, 7, 1] },
    { id: "many", label: "One value many times", value: [3, 3, 3, 3, 3] },
  ],
  random(rng, size) {
    const m = clamp(size ?? 8, 2, MAX);
    return Array.from({ length: m }, () => rng.int(1, m - 1));
  },
};

/**
 * Finding a duplicate with Floyd's cycle detection. With n + 1 values in 1..n, read the
 * array as a function i → A[i]. Following it from index 0 (which no value points to)
 * must eventually repeat; the first repeated index has two different predecessors, i.e.
 * two positions holding the same value. Floyd's tortoise and hare finds that entry point
 * in O(n) time and O(1) extra space, without modifying the array.
 */
export const findDuplicate: AlgorithmModule<number[], number> = {
  id: "floyd-find-duplicate",
  version: 1,
  pseudocode: [
    "slow ← 0;  fast ← 0   // follow i → A[i] from index 0",
    "repeat slow ← A[slow];  fast ← A[A[fast]]  until slow = fast",
    "p ← 0",
    "while p ≠ slow: p ← A[p];  slow ← A[slow]",
    "return p   // the cycle's entry: a value two indices point to",
  ],
  input,

  run(values, t) {
    const A = t.array("A", values, { label: "A", display: "cells" });
    const ids = values.map((_, i) => nid(i));
    const edges = values.map((v, i) => ({ id: `e${i}`, from: nid(i), to: nid(v) }));
    const G = t.graph("G", {
      directed: true,
      nodes: layoutGraph(ids, edges).map((n) => ({ ...n, label: n.id.slice(1) })),
      edges,
      label: "Index i points to A[i]",
    });
    const roles = pointerLabels(t, G, nid);
    const step = (i: number, line: number) => {
      t.tally("moves");
      return A.read(i, { line }) as number;
    };
    let slow = 0;
    let fast = 0;
    roles(
      { slow, fast },
      { line: 1, note: "Both start at index 0. No value is 0, so 0 is never on the cycle." },
    );
    G.node(nid(0), "visited", { line: 1 });
    do {
      slow = step(slow, 2);
      fast = step(step(fast, 2), 2);
      G.node(nid(slow), "visited", { line: 2 });
      A.pointer("slow", slow, { line: 2 });
      A.pointer("fast", fast, { line: 2, vars: { slow, fast } });
      roles({ slow, fast }, { line: 2, note: `slow moves to ${slow}, fast two steps to ${fast}.` });
    } while (slow !== fast);
    G.node(nid(slow), "highlight", {
      line: 2,
      note: `They meet at index ${slow}, inside the cycle.`,
    });
    let p = 0;
    A.pointer("fast", null, { line: 3 });
    A.pointer("p", p, { line: 3, vars: { p, fast: null } });
    roles(
      { p, slow },
      { line: 3, note: "Phase 2: p starts at 0; slow stays at the meeting point." },
    );
    while (p !== slow) {
      p = step(p, 4);
      slow = step(slow, 4);
      A.pointer("p", p, { line: 4 });
      A.pointer("slow", slow, { line: 4, vars: { p, slow } });
      roles({ p, slow }, { line: 4, note: `p moves to ${p}, slow to ${slow}.` });
    }
    G.node(nid(p), "path", { line: 5 });
    A.mark(
      values.flatMap((v, i) => (v === p ? [i] : [])),
      "found",
      { line: 5, note: `They meet at ${p}: the entry of the cycle, so ${p} is a duplicate value.` },
    );
    t.finish(values, p, { vars: { duplicate: p } });
    return p;
  },

  check(values, out) {
    // Walk i → A[i] from 0 with a visited set; the first index seen twice is the entry.
    const seen = new Set<number>();
    let i = 0;
    while (!seen.has(i)) {
      seen.add(i);
      i = values[i]!;
    }
    if (out !== i) return `returned ${out}, but the cycle entry is ${i}`;
    const count = values.filter((v) => v === out).length;
    return count >= 2 ? null : `${out} occurs only ${count} time(s)`;
  },

  fidelity(state: TraceState, out) {
    const A = state.structures.A;
    if (A?.kind !== "array") return "no array A";
    const found = A.marks.flatMap((m, i) => (m === "found" ? [i] : []));
    const want = A.values.flatMap((v, i) => (v === out ? [i] : []));
    return found.length >= 2 && found.join() === want.join()
      ? null
      : `found marks [${found}], expected [${want}]`;
  },

  describeOutput: (o) => `Duplicate value: ${o}`,
};
