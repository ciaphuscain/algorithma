import type { GraphNode } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { ListPointers, pointerLabels, nodeId, parseList, MAX_LIST } from "./common";

export interface CycleInput {
  values: number[];
  /** Position (0-based) the tail's next points back to, or -1 for no cycle. */
  pos: number;
}

export interface CycleOutput {
  hasCycle: boolean;
  /** Node where slow and fast met, by position; null without a cycle. */
  meet: number | null;
  /** First node of the cycle, by position; null without a cycle. */
  start: number | null;
  /** Moves of the slow pointer until meeting (or until fast fell off the end). */
  slowSteps: number;
}

const input: InputSpec<CycleInput> = {
  fields: [
    { name: "values", label: "List (head first)", placeholder: "e.g. 3, 2, 0, -4" },
    {
      name: "pos",
      label: "Tail points back to position (blank: no cycle)",
      placeholder: "e.g. 1",
      help: "Positions count from 0 at the head.",
    },
  ],
  constraints: `1–${MAX_LIST} whole numbers from −99 to 99; the cycle position from 0 to n − 1, or blank.`,
  parse(f) {
    const values = parseList(f.values);
    const errors: string[] = typeof values === "string" ? [values] : [];
    const ps = (f.pos ?? "").trim();
    const n = typeof values === "string" ? MAX_LIST : values.length;
    const pos = ps === "" ? -1 : /^\d+$/.test(ps) ? Number(ps) : NaN;
    if (!(pos === -1 || (pos >= 0 && pos < n)))
      errors.push(`The position must be from 0 to ${n - 1}, or blank`);
    return errors.length
      ? { ok: false, errors }
      : { ok: true, value: { values: values as number[], pos } };
  },
  format: (v) => ({ values: v.values.join(", "), pos: v.pos < 0 ? "" : String(v.pos) }),
  presets: [
    {
      id: "classic",
      label: "A cycle back to position 2",
      value: { values: [3, 1, 4, 1, 5, 9, 2, 6], pos: 2 },
    },
    { id: "loop", label: "The whole list is a cycle", value: { values: [1, 2, 3, 4, 5], pos: 0 } },
    { id: "none", label: "No cycle", value: { values: [1, 2, 3, 4, 5, 6], pos: -1 } },
    { id: "self", label: "The last node points to itself", value: { values: [7, 8, 9], pos: 2 } },
  ],
  random(rng, size) {
    const n = Math.min(MAX_LIST, Math.max(1, size ?? 7));
    const values = Array.from({ length: n }, () => rng.int(1, 99));
    return { values, pos: rng.int(0, 2) === 0 ? -1 : rng.int(0, n - 1) };
  },
};

/** Tail nodes on a line at the left, cycle nodes on a circle at the right. */
function layout(values: number[], pos: number): GraphNode[] {
  const n = values.length;
  const tail = pos < 0 ? n : pos;
  const cyc = n - tail;
  const nodes: GraphNode[] = [];
  const lineEnd = cyc === 0 ? 0.95 : 0.45;
  for (let i = 0; i < tail; i++) {
    const x = tail === 1 ? 0.05 : 0.05 + ((lineEnd - 0.05) * i) / Math.max(1, tail - (cyc ? 0 : 1));
    nodes.push({ id: nodeId(i), label: String(values[i]), x: Number(x.toFixed(4)), y: 0.5 });
  }
  for (let j = 0; j < cyc; j++) {
    const a = Math.PI - (2 * Math.PI * j) / cyc; // first cycle node on the circle's left
    const [cx, cy, r] = [0.75, 0.5, cyc === 1 ? 0 : 0.2];
    nodes.push({
      id: nodeId(tail + j),
      label: String(values[tail + j]),
      x: Number((cx + r * Math.cos(a) - (cyc === 1 ? 0.2 : 0)).toFixed(4)),
      y: Number((cy - r * Math.sin(a)).toFixed(4)),
    });
  }
  return nodes;
}

/**
 * Floyd's cycle detection ("tortoise and hare"): slow moves one node per step, fast
 * moves two. Without a cycle, fast reaches the end; with one, fast catches slow inside
 * the cycle. Then a pointer from the head and one from the meeting node, moving one step
 * at a time, meet exactly at the first node of the cycle.
 */
export const floydCycle: AlgorithmModule<CycleInput, CycleOutput> = {
  id: "floyd-cycle",
  version: 1,
  pseudocode: [
    "procedure floyd(head)",
    "  slow ← head;  fast ← head",
    "  while fast and fast.next exist",
    "    slow ← slow.next;  fast ← fast.next.next",
    "    if slow = fast: there is a cycle; go to phase 2",
    "  return no cycle",
    "  phase 2: p ← head;  q ← slow",
    "  while p ≠ q:  p ← p.next;  q ← q.next",
    "  return p   // the first node of the cycle",
  ],
  input,

  run(input, t) {
    const { values, pos } = input;
    const n = values.length;
    const G = t.graph("L", {
      directed: true,
      nodes: layout(values, pos),
      edges: [],
      label: "The list (a cycle is drawn as a ring)",
    });
    const next = new ListPointers(G);
    for (let i = 0; i + 1 < n; i++) next.set(i, i + 1, { line: 1 });
    if (pos >= 0)
      next.set(n - 1, pos, {
        line: 1,
        note: `The last node, ${values[n - 1]}, points back to ${values[pos]} at position ${pos}: a cycle.`,
      });
    else t.step({ line: 1, note: "The last node's next is null: no cycle." });

    const roles = pointerLabels(t, G, nodeId);
    let slow = 0;
    let fast = 0;
    let slowSteps = 0;
    roles({ slow, fast }, { line: 2, note: "Both pointers start at the head." });
    let meet: number | null = null;
    for (;;) {
      const f1 = next.get(fast);
      const f2 = f1 === null ? null : next.get(f1);
      if (f1 === null || f2 === null) {
        roles(
          { slow, fast },
          { line: 6, note: "fast reached the end of the list: there is no cycle." },
        );
        break;
      }
      slow = next.get(slow)!;
      fast = f2;
      slowSteps++;
      t.tally("moves", 3);
      G.node(nodeId(slow), "visited", { line: 4 });
      roles(
        { slow, fast },
        {
          line: 4,
          note: `Step ${slowSteps}: slow moves to ${values[slow]}, fast jumps two nodes to ${values[fast]}.`,
        },
      );
      if (slow === fast) {
        meet = slow;
        G.node(nodeId(slow), "highlight", {
          line: 5,
          note: `slow and fast meet at ${values[slow]}: there is a cycle.`,
        });
        break;
      }
    }
    let start: number | null = null;
    if (meet !== null) {
      let p = 0;
      let q = meet;
      roles({ p, q }, { line: 7, note: "Phase 2: p starts at the head, q at the meeting node." });
      let guard = 0;
      while (p !== q) {
        // Theory says p and q meet after exactly mu moves, so at most n.
        if (++guard > n) throw new Error("phase 2 made more than n moves without meeting");
        p = next.get(p)!;
        q = next.get(q)!;
        t.tally("moves", 2);
        roles({ p, q }, { line: 8, note: `p moves to ${values[p]}, q to ${values[q]}.` });
      }
      start = p;
      G.node(nodeId(start), "path", {
        line: 9,
        note: `p and q meet at ${values[start]}, position ${start}: the cycle starts here.`,
      });
    }
    const output: CycleOutput = { hasCycle: meet !== null, meet, start, slowSteps };
    t.finish(input, output, {
      line: meet === null ? 6 : 9,
      note:
        start === null
          ? "No cycle."
          : `The cycle starts at ${values[start]}, position ${start}, after a tail of ${start} node${start === 1 ? "" : "s"}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle from the shape: a tail of length mu = pos and a cycle of
    // length lambda = n - pos. Slow is at step i at walk position x(i); they meet at
    // the first i >= 1 with i >= mu and i divisible by lambda.
    const { values, pos } = input;
    const n = values.length;
    if (pos < 0) {
      if (out.hasCycle || out.start !== null) return "reported a cycle where there is none";
      return out.slowSteps === Math.floor((n - 1) / 2)
        ? null
        : `slow moved ${out.slowSteps} times, expected ${Math.floor((n - 1) / 2)}`;
    }
    const [mu, lambda] = [pos, n - pos];
    let i = Math.max(1, mu);
    while (i % lambda !== 0) i++;
    const x = (k: number) => (k < n ? k : mu + ((k - mu) % lambda));
    if (!out.hasCycle) return "missed the cycle";
    if (out.slowSteps !== i) return `met after ${out.slowSteps} steps, expected ${i}`;
    if (out.meet !== x(i)) return `met at position ${out.meet}, expected ${x(i)}`;
    if (out.start !== pos) return `cycle start ${out.start}, expected ${pos}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.L;
    if (g?.kind !== "graph") return "no graph";
    if (out.start === null) return null;
    return g.nodeStatus[nodeId(out.start)] === "path" ? null : "the cycle start is not marked";
  },

  describeOutput: (o) =>
    o.hasCycle
      ? `Cycle: slow and fast met at position ${o.meet} after ${o.slowSteps} steps; it starts at position ${o.start}`
      : `No cycle (fast reached the end after ${o.slowSteps} slow steps)`,
};
