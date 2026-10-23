import {
  MAX_PLANE_SHAPES,
  type ArrayStructure,
  type GraphStructure,
  type GridStructure,
  type PlaneStructure,
  type SequenceStructure,
  type Structure,
  type StructureKind,
  type TraceEvent,
  type TreeStructure,
} from "./protocol";
import type { TraceState } from "./state";
import { treeAdd, treeMove, treeRemove, treeSplice } from "./tree";

/** Raised when an event cannot be applied to the current state (e.g. index out of range). */
export class TraceReplayError extends Error {
  constructor(
    message: string,
    /** 0-based index of the offending event, when known. */
    public readonly eventIndex?: number,
  ) {
    super(eventIndex === undefined ? message : `event #${eventIndex}: ${message}`);
    this.name = "TraceReplayError";
  }
}

type KindMap = {
  array: ArrayStructure;
  graph: GraphStructure;
  sequence: SequenceStructure;
  grid: GridStructure;
  tree: TreeStructure;
  plane: PlaneStructure;
};

/** Run a shared tree operation, converting its errors into replay errors. */
function treeOp(fn: () => void): void {
  try {
    fn();
  } catch (err) {
    throw new TraceReplayError((err as Error).message);
  }
}

function treeNode(t: TreeStructure, node: string, s: string) {
  const data = t.nodes[node];
  if (!data) throw new TraceReplayError(`unknown node "${node}" in tree "${s}"`);
  return data;
}

function planePoint(p: PlaneStructure, point: string, s: string): void {
  if (!p.points.some((x) => x.id === point))
    throw new TraceReplayError(`unknown point "${point}" in plane "${s}"`);
}

function get<K extends StructureKind>(state: TraceState, s: string, kind: K): KindMap[K] {
  const structure = state.structures[s];
  if (!structure) throw new TraceReplayError(`unknown structure "${s}"`);
  if (structure.kind !== kind) {
    throw new TraceReplayError(`structure "${s}" is a ${structure.kind}, expected ${kind}`);
  }
  return structure as KindMap[K];
}

function checkIndex(a: ArrayStructure, i: number, s: string): void {
  if (!Number.isInteger(i) || i < 0 || i >= a.values.length) {
    throw new TraceReplayError(
      `index ${i} out of range for array "${s}" (length ${a.values.length})`,
    );
  }
}

function checkCell(g: GridStructure, r: number, c: number, s: string): void {
  if (
    !Number.isInteger(r) ||
    !Number.isInteger(c) ||
    r < 0 ||
    c < 0 ||
    r >= g.rows ||
    c >= g.cols
  ) {
    throw new TraceReplayError(
      `cell (${r}, ${c}) out of range for grid "${s}" (${g.rows}×${g.cols})`,
    );
  }
}

function bump(state: TraceState, counter: string, by = 1): void {
  state.counters[counter] = (state.counters[counter] ?? 0) + by;
}

/**
 * Apply one event to `state`, mutating it in place.
 *
 * This function is the single definition of protocol semantics. Renderers never
 * interpret events; they only read the resulting state. Keeping it pure apart from the
 * in-place mutation (no I/O, no randomness, no clock) is what makes replay deterministic.
 */
export function applyEvent(state: TraceState, event: TraceEvent, index?: number): void {
  try {
    applyUnchecked(state, event);
  } catch (err) {
    if (err instanceof TraceReplayError && err.eventIndex === undefined && index !== undefined) {
      throw new TraceReplayError(err.message, index);
    }
    throw err;
  }
}

function applyUnchecked(state: TraceState, e: TraceEvent): void {
  if (state.done) throw new TraceReplayError(`event "${e.type}" after "done"`);

  state.focus = [];
  state.note = e.note ?? null;
  if (e.line !== undefined) state.line = e.line;
  if (e.vars) {
    for (const [name, value] of Object.entries(e.vars)) {
      if (value === null) delete state.vars[name];
      else state.vars[name] = value;
    }
  }
  if (e.count) for (const [name, by] of Object.entries(e.count)) bump(state, name, by);

  switch (e.type) {
    case "array.compare": {
      const a = get(state, e.s, "array");
      checkIndex(a, e.i, e.s);
      if (e.j !== undefined) {
        checkIndex(a, e.j, e.s);
        state.focus.push({ s: e.s, tone: "compare", indices: [e.i, e.j] });
      } else {
        state.focus.push({ s: e.s, tone: "compare", indices: [e.i], value: e.value ?? null });
      }
      bump(state, "comparisons");
      break;
    }
    case "array.read": {
      const a = get(state, e.s, "array");
      checkIndex(a, e.i, e.s);
      state.focus.push({ s: e.s, tone: "read", indices: [e.i] });
      bump(state, "reads");
      break;
    }
    case "array.write": {
      const a = get(state, e.s, "array");
      checkIndex(a, e.i, e.s);
      a.values[e.i] = e.value;
      state.focus.push({ s: e.s, tone: "write", indices: [e.i] });
      bump(state, "writes");
      break;
    }
    case "array.swap": {
      const a = get(state, e.s, "array");
      checkIndex(a, e.i, e.s);
      checkIndex(a, e.j, e.s);
      const tmp = a.values[e.i]!;
      a.values[e.i] = a.values[e.j]!;
      a.values[e.j] = tmp;
      state.focus.push({ s: e.s, tone: "swap", indices: [e.i, e.j] });
      bump(state, "swaps");
      break;
    }
    case "array.mark": {
      const a = get(state, e.s, "array");
      for (const i of e.indices) {
        checkIndex(a, i, e.s);
        a.marks[i] = e.mark;
      }
      break;
    }
    case "array.pointer": {
      const a = get(state, e.s, "array");
      if (e.index === null) {
        delete a.pointers[e.name];
      } else {
        // A pointer may sit one past either end (e.g. lo > hi at the end of binary search).
        if (!Number.isInteger(e.index) || e.index < -1 || e.index > a.values.length) {
          throw new TraceReplayError(`pointer ${e.name}=${e.index} out of range for "${e.s}"`);
        }
        a.pointers[e.name] = e.index;
      }
      break;
    }
    case "graph.node": {
      const g = get(state, e.s, "graph");
      if (!g.nodes.some((n) => n.id === e.node)) {
        throw new TraceReplayError(`unknown node "${e.node}" in graph "${e.s}"`);
      }
      g.nodeStatus[e.node] = e.status;
      state.focus.push({ s: e.s, tone: "visit", nodes: [e.node] });
      break;
    }
    case "graph.edge": {
      const g = get(state, e.s, "graph");
      const edge = g.edges.find((x) => x.id === e.edge);
      if (!edge) throw new TraceReplayError(`unknown edge "${e.edge}" in graph "${e.s}"`);
      g.edgeStatus[e.edge] = e.status;
      state.focus.push({
        s: e.s,
        tone: e.status === "relaxed" ? "relax" : "visit",
        edges: [e.edge],
        nodes: [edge.from, edge.to],
      });
      break;
    }
    case "graph.annotate": {
      const g = get(state, e.s, "graph");
      if (!g.nodes.some((n) => n.id === e.node)) {
        throw new TraceReplayError(`unknown node "${e.node}" in graph "${e.s}"`);
      }
      if (e.text === null) delete g.annotations[e.node];
      else g.annotations[e.node] = e.text;
      break;
    }
    case "seq.push": {
      const q = get(state, e.s, "sequence");
      q.items.push(e.value);
      break;
    }
    case "seq.pop": {
      const q = get(state, e.s, "sequence");
      if (q.items.length === 0) throw new TraceReplayError(`pop from empty sequence "${e.s}"`);
      if (q.discipline === "priority") {
        if (
          e.index === undefined ||
          !Number.isInteger(e.index) ||
          e.index < 0 ||
          e.index >= q.items.length
        ) {
          throw new TraceReplayError(`priority pop on "${e.s}" needs a valid index`);
        }
        q.items.splice(e.index, 1);
      } else if (q.discipline === "deque") {
        if (e.index !== 0 && e.index !== q.items.length - 1) {
          throw new TraceReplayError(`deque pop on "${e.s}" must name the front (0) or the back`);
        }
        q.items.splice(e.index, 1);
      } else if (q.discipline === "queue") {
        q.items.shift();
      } else {
        q.items.pop();
      }
      break;
    }
    case "grid.write": {
      const g = get(state, e.s, "grid");
      checkCell(g, e.r, e.c, e.s);
      g.cells[e.r]![e.c] = e.value;
      state.focus.push({ s: e.s, tone: "write", cells: [[e.r, e.c]] });
      bump(state, "writes");
      break;
    }
    case "grid.read": {
      const g = get(state, e.s, "grid");
      for (const [r, c] of e.cells) checkCell(g, r, c, e.s);
      state.focus.push({ s: e.s, tone: "read", cells: e.cells.map(([r, c]) => [r, c]) });
      bump(state, "reads", e.cells.length);
      break;
    }
    case "grid.mark": {
      const g = get(state, e.s, "grid");
      for (const [r, c] of e.cells) {
        checkCell(g, r, c, e.s);
        g.marks[r]![c] = e.mark;
      }
      break;
    }
    case "tree.add": {
      const t = get(state, e.s, "tree");
      treeOp(() => treeAdd(t, e.node, e.value, e.parent, e.slot, e.edgeLabel));
      state.focus.push({ s: e.s, tone: "write", nodes: [e.node] });
      bump(state, "writes");
      break;
    }
    case "tree.set": {
      const t = get(state, e.s, "tree");
      treeNode(t, e.node, e.s).value = e.value;
      state.focus.push({ s: e.s, tone: "write", nodes: [e.node] });
      bump(state, "writes");
      break;
    }
    case "tree.compare": {
      const t = get(state, e.s, "tree");
      treeNode(t, e.node, e.s);
      state.focus.push({ s: e.s, tone: "compare", nodes: [e.node], value: e.value });
      bump(state, "comparisons");
      break;
    }
    case "tree.node": {
      const t = get(state, e.s, "tree");
      treeNode(t, e.node, e.s);
      t.nodeStatus[e.node] = e.status;
      state.focus.push({ s: e.s, tone: "visit", nodes: [e.node] });
      break;
    }
    case "tree.annotate": {
      const t = get(state, e.s, "tree");
      treeNode(t, e.node, e.s);
      if (e.text === null) delete t.annotations[e.node];
      else t.annotations[e.node] = e.text;
      break;
    }
    case "tree.remove": {
      const t = get(state, e.s, "tree");
      treeOp(() => treeRemove(t, e.node));
      break;
    }
    case "tree.splice": {
      const t = get(state, e.s, "tree");
      treeOp(() => treeSplice(t, e.node));
      break;
    }
    case "tree.move": {
      const t = get(state, e.s, "tree");
      treeOp(() => treeMove(t, e.node, e.parent, e.slot));
      // Structural, like remove and splice: no counter, so drawing a pointer change
      // that the algorithm also writes to an array is not counted twice.
      state.focus.push({ s: e.s, tone: "write", nodes: [e.node] });
      break;
    }
    case "plane.point": {
      const p = get(state, e.s, "plane");
      planePoint(p, e.point, e.s);
      p.pointStatus[e.point] = e.status;
      state.focus.push({ s: e.s, tone: "visit", nodes: [e.point] });
      break;
    }
    case "plane.annotate": {
      const p = get(state, e.s, "plane");
      planePoint(p, e.point, e.s);
      if (e.text === null) delete p.annotations[e.point];
      else p.annotations[e.point] = e.text;
      break;
    }
    case "plane.draw": {
      const p = get(state, e.s, "plane");
      const shape = {
        ...structuredClone(e.shape),
        id: e.id,
        status: e.status,
        ...(e.label !== undefined ? { label: e.label } : {}),
      };
      const at = p.shapes.findIndex((x) => x.id === e.id);
      if (at !== -1) p.shapes[at] = shape;
      else if (p.shapes.length >= MAX_PLANE_SHAPES)
        throw new TraceReplayError(`plane "${e.s}" already holds ${MAX_PLANE_SHAPES} shapes`);
      else p.shapes.push(shape);
      state.focus.push({ s: e.s, tone: "visit", edges: [e.id] });
      break;
    }
    case "plane.erase": {
      const p = get(state, e.s, "plane");
      const at = p.shapes.findIndex((x) => x.id === e.id);
      if (at === -1) throw new TraceReplayError(`unknown shape "${e.id}" in plane "${e.s}"`);
      p.shapes.splice(at, 1);
      break;
    }
    case "structure.create": {
      if (state.structures[e.s]) throw new TraceReplayError(`structure "${e.s}" already exists`);
      state.structures[e.s] = structuredClone(e.structure) as Structure;
      state.order.push(e.s);
      break;
    }
    case "structure.remove": {
      if (!state.structures[e.s]) throw new TraceReplayError(`unknown structure "${e.s}"`);
      delete state.structures[e.s];
      state.order = state.order.filter((name) => name !== e.s);
      break;
    }
    case "step":
      break;
    case "done":
      state.done = true;
      break;
    default: {
      const unknown: never = e;
      throw new TraceReplayError(`unknown event type "${(unknown as { type: string }).type}"`);
    }
  }
  state.position += 1;
}
