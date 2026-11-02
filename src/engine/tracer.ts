import {
  TRACE_PROTOCOL,
  TRACE_VERSION,
  type ArrayMark,
  type EdgeStatus,
  type EventMeta,
  type GraphEdge,
  type GraphNode,
  type GridMark,
  type NodeStatus,
  type PlaneGeometry,
  type PlanePoint,
  type PlaneStructure,
  type Scalar,
  type SequenceDiscipline,
  type Structure,
  type TimelineLane,
  type Trace,
  type TraceEvent,
  type TraceTruncation,
  type TreeStructure,
  type VarValue,
} from "./protocol";
import { emptyTree, treeAdd, treeMove, treeRemove, treeRotate, treeSplice, treeSwap } from "./tree";

/**
 * Metadata for an operation. A function is evaluated only when the tracer records,
 * so narration strings cost nothing in counting mode.
 */
export type MetaArg = Omit<EventMeta, "count"> | (() => Omit<EventMeta, "count">) | undefined;

/** Distributes Omit over a union so each event variant keeps its own payload fields. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type EventBody = DistributiveOmit<TraceEvent, keyof EventMeta>;

export interface TracerOptions {
  /**
   * "record" builds a full trace for visualisation. "count" runs the same algorithm
   * code but keeps only counters, for operation-count experiments on large inputs.
   */
  mode?: "record" | "count";
  /** Event budget in record mode. When exhausted the trace is marked truncated. */
  maxEvents?: number;
}

export const DEFAULT_MAX_EVENTS = 50_000;

const compareScalars = (x: Scalar, y: Scalar): number => {
  if (typeof x === "number" && typeof y === "number") return x < y ? -1 : x > y ? 1 : 0;
  const a = String(x);
  const b = String(y);
  return a < b ? -1 : a > b ? 1 : 0;
};

/**
 * The instrumentation SDK algorithms are written against.
 *
 * Algorithms mutate their data *through* traced wrappers (TracedArray.swap etc.), so
 * the recorded events are, by construction, the operations the algorithm actually
 * performed. Tests additionally check that replaying a trace reproduces the
 * algorithm's returned output.
 */
export class Tracer {
  readonly mode: "record" | "count";
  readonly maxEvents: number;
  private readonly events: TraceEvent[] = [];
  private readonly initialStructures: Record<string, Structure> = {};
  private readonly initialOrder: string[] = [];
  private readonly initialVars: Record<string, VarValue> = {};
  private readonly counters: Record<string, number> = {
    comparisons: 0,
    swaps: 0,
    reads: 0,
    writes: 0,
  };
  private pendingCounts: Record<string, number> = {};
  private started = false;
  private finished = false;
  private truncation: TraceTruncation | null = null;
  private finalTrace: Trace | null = null;

  constructor(
    private readonly algorithm: { id: string; version: number },
    options: TracerOptions = {},
  ) {
    this.mode = options.mode ?? "record";
    this.maxEvents = Math.max(2, options.maxEvents ?? DEFAULT_MAX_EVENTS);
  }

  get recording(): boolean {
    return this.mode === "record" && this.truncation === null;
  }

  get truncated(): TraceTruncation | null {
    return this.truncation;
  }

  /* ------------------------------------------------------------ structures */

  array(
    name: string,
    values: readonly Scalar[],
    options: { label?: string; display?: "bars" | "cells" | "heap" } = {},
  ): TracedArray {
    this.register(name, {
      kind: "array",
      ...(options.label ? { label: options.label } : {}),
      ...(options.display ? { display: options.display } : {}),
      values: [...values],
      marks: values.map(() => null),
      pointers: {},
    });
    return new TracedArray(this, name, [...values]);
  }

  graph(
    name: string,
    def: { directed: boolean; nodes: GraphNode[]; edges: GraphEdge[]; label?: string },
  ): TracedGraph {
    const nodeStatus: Record<string, NodeStatus> = {};
    for (const n of def.nodes) nodeStatus[n.id] = "unvisited";
    const edgeStatus: Record<string, EdgeStatus> = {};
    for (const e of def.edges) edgeStatus[e.id] = "idle";
    this.register(name, {
      kind: "graph",
      ...(def.label ? { label: def.label } : {}),
      directed: def.directed,
      nodes: def.nodes.map((n) => ({ ...n })),
      edges: def.edges.map((e) => ({ ...e })),
      nodeStatus,
      edgeStatus,
      annotations: {},
    });
    return new TracedGraph(this, name);
  }

  sequence(
    name: string,
    discipline: SequenceDiscipline,
    options: { label?: string } = {},
  ): TracedSequence {
    this.register(name, {
      kind: "sequence",
      ...(options.label ? { label: options.label } : {}),
      discipline,
      items: [],
    });
    return new TracedSequence(this, name, discipline);
  }

  /** A rooted tree. Binary trees keep separate left/right slots. */
  tree(name: string, options: { binary: boolean; label?: string }): TracedTree {
    this.register(name, emptyTree(options.binary, options.label));
    return new TracedTree(this, name, emptyTree(options.binary, options.label));
  }

  /**
   * Points in the plane, with shapes drawn over them. The window defaults to the
   * points' bounding box plus a margin.
   */
  plane(
    name: string,
    def: { points: PlanePoint[]; label?: string; bounds?: PlaneStructure["bounds"] },
  ): TracedPlane {
    const pointStatus: Record<string, NodeStatus> = {};
    for (const p of def.points) pointStatus[p.id] = "unvisited";
    this.register(name, {
      kind: "plane",
      ...(def.label ? { label: def.label } : {}),
      bounds: def.bounds ?? planeBounds(def.points),
      points: def.points.map((p) => ({ ...p })),
      pointStatus,
      annotations: {},
      shapes: [],
    });
    return new TracedPlane(this, name);
  }

  /** Processes as lanes, with messages between them over time. */
  timeline(
    name: string,
    def: { lanes: TimelineLane[]; label?: string; horizon?: number },
  ): TracedTimeline {
    const laneStatus: Record<string, NodeStatus> = {};
    for (const l of def.lanes) laneStatus[l.id] = "unvisited";
    this.register(name, {
      kind: "timeline",
      ...(def.label ? { label: def.label } : {}),
      lanes: def.lanes.map((l) => ({ ...l })),
      laneStatus,
      annotations: {},
      now: 0,
      ...(def.horizon !== undefined ? { horizon: def.horizon } : {}),
      messages: [],
      marks: [],
    });
    return new TracedTimeline(this, name);
  }

  grid(
    name: string,
    rows: number,
    cols: number,
    fill: Scalar,
    options: { label?: string; rowHeaders?: string[]; colHeaders?: string[] } = {},
  ): TracedGrid {
    const cells = Array.from({ length: rows }, () => Array<Scalar>(cols).fill(fill));
    this.register(name, {
      kind: "grid",
      ...(options.label ? { label: options.label } : {}),
      rows,
      cols,
      cells: cells.map((r) => [...r]),
      marks: Array.from({ length: rows }, () => Array<GridMark | null>(cols).fill(null)),
      ...(options.rowHeaders ? { rowHeaders: options.rowHeaders } : {}),
      ...(options.colHeaders ? { colHeaders: options.colHeaders } : {}),
    });
    return new TracedGrid(this, name, cells);
  }

  /** Remove a structure from the display (e.g. a temporary merge buffer). */
  remove(name: string, meta?: MetaArg): void {
    this.emit({ type: "structure.remove", s: name }, meta);
  }

  private register(name: string, structure: Structure): void {
    if (name in this.initialStructures && !this.started)
      throw new Error(`structure "${name}" registered twice`);
    if (this.started) {
      this.emit({ type: "structure.create", s: name, structure });
    } else {
      this.initialStructures[name] = structure;
      this.initialOrder.push(name);
    }
  }

  /* ---------------------------------------------------------------- events */

  /** Set initial variable values (before the first event) without emitting a step. */
  initVars(vars: Record<string, VarValue>): void {
    if (this.started) throw new Error("initVars must be called before the first event");
    Object.assign(this.initialVars, vars);
  }

  /** A pure narration / pseudocode-position step with no data change. */
  step(meta: MetaArg): void {
    this.emit({ type: "step" }, meta);
  }

  /** Increment a custom counter (e.g. "relaxations"). Recorded on the next event. */
  tally(counter: string, by = 1): void {
    this.counters[counter] = (this.counters[counter] ?? 0) + by;
    if (this.recording) this.pendingCounts[counter] = (this.pendingCounts[counter] ?? 0) + by;
  }

  /** @internal Used by the traced wrappers. */
  emit(body: EventBody, meta?: MetaArg, standardCounter?: string, by = 1): void {
    if (this.finished) throw new Error("tracer already finished");
    this.started = true;
    if (standardCounter)
      this.counters[standardCounter] = (this.counters[standardCounter] ?? 0) + by;
    if (!this.recording) return;

    // Reserve the final slot for the "done" event so a truncated trace still ends cleanly.
    if (this.events.length >= this.maxEvents - 1) {
      this.truncation = {
        afterEvents: this.events.length,
        reason: `event budget of ${this.maxEvents} reached; execution continued but later steps were not recorded`,
      };
      this.pendingCounts = {};
      return;
    }
    const m = typeof meta === "function" ? meta() : meta;
    const event = { ...body } as TraceEvent;
    if (m?.line !== undefined) event.line = m.line;
    if (m?.note !== undefined) event.note = m.note;
    if (m?.vars !== undefined) event.vars = m.vars;
    if (Object.keys(this.pendingCounts).length > 0) {
      event.count = this.pendingCounts;
      this.pendingCounts = {};
    }
    this.events.push(event);
  }

  /** Close the trace. Call exactly once, after the algorithm has computed `result`. */
  finish(input: unknown, result: unknown, meta?: MetaArg): Trace {
    if (this.finished) throw new Error("tracer already finished");
    if (this.mode === "record") {
      const m = typeof meta === "function" ? meta() : meta;
      const done: TraceEvent = { type: "done", ...m };
      if (this.truncation === null && Object.keys(this.pendingCounts).length > 0)
        done.count = this.pendingCounts;
      this.events.push(done);
    }
    this.finished = true;
    this.finalTrace = {
      protocol: TRACE_PROTOCOL,
      version: TRACE_VERSION,
      algorithm: { ...this.algorithm },
      input,
      initial: {
        structures: this.initialStructures,
        order: this.initialOrder,
        vars: this.initialVars,
      },
      events: this.events,
      result,
      meta: {
        eventCount: this.events.length,
        truncated: this.truncation,
        counters: { ...this.counters },
      },
    };
    return this.finalTrace;
  }

  /** The finished trace, or null while the algorithm is still running. */
  get trace(): Trace | null {
    return this.finalTrace;
  }

  /** Counters accumulated so far (always complete, independent of recording). */
  get counts(): Readonly<Record<string, number>> {
    return this.counters;
  }
}

/** The points' bounding box with a 10% margin (at least 1 unit) on every side. */
export function planeBounds(points: readonly { x: number; y: number }[]): PlaneStructure["bounds"] {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const [minX, maxX] = xs.length ? [Math.min(...xs), Math.max(...xs)] : [0, 1];
  const [minY, maxY] = ys.length ? [Math.min(...ys), Math.max(...ys)] : [0, 1];
  const mx = Math.max(1, (maxX - minX) / 10);
  const my = Math.max(1, (maxY - minY) / 10);
  return { minX: minX - mx, maxX: maxX + mx, minY: minY - my, maxY: maxY + my };
}

export class TracedArray {
  constructor(
    private readonly tracer: Tracer,
    readonly name: string,
    private readonly values: Scalar[],
  ) {}

  get length(): number {
    return this.values.length;
  }

  /** Untraced access, for the algorithm's own bookkeeping. Use `read` to show a read. */
  get(i: number): Scalar {
    this.check(i);
    return this.values[i]!;
  }

  /** Numeric access; throws if the element is not a number. */
  num(i: number): number {
    const v = this.get(i);
    if (typeof v !== "number") throw new Error(`${this.name}[${i}] is not a number`);
    return v;
  }

  read(i: number, meta?: MetaArg): Scalar {
    this.check(i);
    this.tracer.emit({ type: "array.read", s: this.name, i }, meta, "reads");
    return this.values[i]!;
  }

  /** Compare A[i] with A[j]. Returns negative, zero, or positive. */
  compare(i: number, j: number, meta?: MetaArg): number {
    this.check(i);
    this.check(j);
    this.tracer.emit({ type: "array.compare", s: this.name, i, j }, meta, "comparisons");
    return compareScalars(this.values[i]!, this.values[j]!);
  }

  /** Compare A[i] with an external value (e.g. a search target). */
  compareWith(i: number, value: Scalar, meta?: MetaArg): number {
    this.check(i);
    this.tracer.emit({ type: "array.compare", s: this.name, i, value }, meta, "comparisons");
    return compareScalars(this.values[i]!, value);
  }

  write(i: number, value: Scalar, meta?: MetaArg): void {
    this.check(i);
    this.values[i] = value;
    this.tracer.emit({ type: "array.write", s: this.name, i, value }, meta, "writes");
  }

  swap(i: number, j: number, meta?: MetaArg): void {
    this.check(i);
    this.check(j);
    const tmp = this.values[i]!;
    this.values[i] = this.values[j]!;
    this.values[j] = tmp;
    this.tracer.emit({ type: "array.swap", s: this.name, i, j }, meta, "swaps");
  }

  mark(indices: number | number[], mark: ArrayMark | null, meta?: MetaArg): void {
    const list = Array.isArray(indices) ? indices : [indices];
    for (const i of list) this.check(i);
    this.tracer.emit({ type: "array.mark", s: this.name, indices: list, mark }, meta);
  }

  pointer(name: string, index: number | null, meta?: MetaArg): void {
    this.tracer.emit({ type: "array.pointer", s: this.name, name, index }, meta);
  }

  toArray(): Scalar[] {
    return [...this.values];
  }

  private check(i: number): void {
    if (!Number.isInteger(i) || i < 0 || i >= this.values.length) {
      throw new RangeError(
        `index ${i} out of range for ${this.name} (length ${this.values.length})`,
      );
    }
  }
}

export class TracedGraph {
  constructor(
    private readonly tracer: Tracer,
    readonly name: string,
  ) {}

  node(id: string, status: NodeStatus, meta?: MetaArg): void {
    this.tracer.emit({ type: "graph.node", s: this.name, node: id, status }, meta);
  }

  edge(id: string, status: EdgeStatus, meta?: MetaArg): void {
    this.tracer.emit({ type: "graph.edge", s: this.name, edge: id, status }, meta);
  }

  annotate(node: string, text: string | null, meta?: MetaArg): void {
    this.tracer.emit({ type: "graph.annotate", s: this.name, node, text }, meta);
  }

  /** Add the edge `id` from → to (counted as a write: a pointer is set). */
  link(id: string, from: string, to: string, status: EdgeStatus, meta?: MetaArg): void {
    this.tracer.emit({ type: "graph.link", s: this.name, id, from, to, status }, meta, "writes");
  }

  /** Remove the edge `id` (counted as a write: a pointer is cleared). */
  unlink(id: string, meta?: MetaArg): void {
    this.tracer.emit({ type: "graph.unlink", s: this.name, id }, meta, "writes");
  }
}

export class TracedSequence {
  private readonly items: Scalar[] = [];

  constructor(
    private readonly tracer: Tracer,
    readonly name: string,
    readonly discipline: SequenceDiscipline,
  ) {}

  get size(): number {
    return this.items.length;
  }

  peekAll(): readonly Scalar[] {
    return this.items;
  }

  push(value: Scalar, meta?: MetaArg): void {
    this.items.push(value);
    this.tracer.emit({ type: "seq.push", s: this.name, value }, meta);
  }

  /** Remove from the front (queue) or back (stack). */
  pop(meta?: MetaArg): Scalar {
    if (this.discipline === "priority") throw new Error("use popAt for priority sequences");
    if (this.discipline === "deque") throw new Error("use popFront or popBack for deques");
    if (this.items.length === 0) throw new Error(`pop from empty ${this.discipline} ${this.name}`);
    const value = this.discipline === "queue" ? this.items.shift()! : this.items.pop()!;
    this.tracer.emit({ type: "seq.pop", s: this.name }, meta);
    return value;
  }

  /** Deques: remove the first item. */
  popFront(meta?: MetaArg): Scalar {
    return this.popEnd(0, meta);
  }

  /** Deques: remove the last item. */
  popBack(meta?: MetaArg): Scalar {
    return this.popEnd(this.items.length - 1, meta);
  }

  /** Deques: the items, front first. */
  get front(): Scalar | undefined {
    return this.items[0];
  }

  get back(): Scalar | undefined {
    return this.items[this.items.length - 1];
  }

  private popEnd(index: number, meta?: MetaArg): Scalar {
    if (this.discipline !== "deque") throw new Error("popFront/popBack are only for deques");
    if (this.items.length === 0) throw new Error(`pop from empty deque ${this.name}`);
    const [value] = this.items.splice(index, 1);
    this.tracer.emit({ type: "seq.pop", s: this.name, index }, meta);
    return value!;
  }

  /** Remove the item at `index` (priority sequences: the algorithm chooses the minimum). */
  popAt(index: number, meta?: MetaArg): Scalar {
    if (this.discipline !== "priority") throw new Error("popAt is only for priority sequences");
    if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
      throw new RangeError(`index ${index} out of range for ${this.name}`);
    }
    const [value] = this.items.splice(index, 1);
    this.tracer.emit({ type: "seq.pop", s: this.name, index }, meta);
    return value!;
  }
}

export class TracedGrid {
  constructor(
    private readonly tracer: Tracer,
    readonly name: string,
    private readonly cells: Scalar[][],
  ) {}

  get(r: number, c: number): Scalar {
    this.check(r, c);
    return this.cells[r]![c]!;
  }

  num(r: number, c: number): number {
    const v = this.get(r, c);
    if (typeof v !== "number") throw new Error(`${this.name}[${r}][${c}] is not a number`);
    return v;
  }

  read(cells: [number, number][], meta?: MetaArg): void {
    for (const [r, c] of cells) this.check(r, c);
    this.tracer.emit({ type: "grid.read", s: this.name, cells }, meta, "reads", cells.length);
  }

  write(r: number, c: number, value: Scalar, meta?: MetaArg): void {
    this.check(r, c);
    this.cells[r]![c] = value;
    this.tracer.emit({ type: "grid.write", s: this.name, r, c, value }, meta, "writes");
  }

  mark(cells: [number, number][], mark: GridMark | null, meta?: MetaArg): void {
    for (const [r, c] of cells) this.check(r, c);
    this.tracer.emit({ type: "grid.mark", s: this.name, cells, mark }, meta);
  }

  private check(r: number, c: number): void {
    if (r < 0 || c < 0 || r >= this.cells.length || c >= (this.cells[0]?.length ?? 0)) {
      throw new RangeError(`cell (${r}, ${c}) out of range for ${this.name}`);
    }
  }
}

/**
 * A traced tree. The wrapper keeps its own copy of the tree, edited by the same
 * functions the reducer uses, so algorithms can read the structure they are drawing.
 */
export class TracedTree {
  private counter = 0;

  constructor(
    private readonly tracer: Tracer,
    readonly name: string,
    private readonly t: TreeStructure,
  ) {}

  get root(): string | null {
    return this.t.root;
  }

  get size(): number {
    return Object.keys(this.t.nodes).length;
  }

  has(id: string): boolean {
    return id in this.t.nodes;
  }

  value(id: string): Scalar {
    return this.node(id).value;
  }

  num(id: string): number {
    const v = this.value(id);
    if (typeof v !== "number") throw new Error(`tree node ${id} does not hold a number`);
    return v;
  }

  children(id: string): (string | null)[] {
    return [...this.node(id).children];
  }

  /** Binary trees: the left (0) or right (1) child. */
  child(id: string, slot: 0 | 1): string | null {
    return this.node(id).children[slot] ?? null;
  }

  edgeLabel(id: string): string | undefined {
    return this.node(id).edgeLabel;
  }

  /** Add a node and return its id (generated unless given). */
  add(
    value: Scalar,
    parent: string | null,
    slot?: number,
    meta?: MetaArg,
    /** `view`: a drawing aid such as a recursion tree, not an operation (no counter). */
    options: { id?: string; edgeLabel?: string; view?: boolean } = {},
  ): string {
    const id = options.id ?? `n${this.counter++}`;
    treeAdd(this.t, id, value, parent, slot, options.edgeLabel);
    this.tracer.emit(
      {
        type: "tree.add",
        s: this.name,
        node: id,
        value,
        parent,
        ...(slot !== undefined ? { slot } : {}),
        ...(options.edgeLabel !== undefined ? { edgeLabel: options.edgeLabel } : {}),
        ...(options.view ? { view: true as const } : {}),
      },
      meta,
      options.view ? undefined : "writes",
    );
    return id;
  }

  set(id: string, value: Scalar, meta?: MetaArg): void {
    this.node(id).value = value;
    this.tracer.emit({ type: "tree.set", s: this.name, node: id, value }, meta, "writes");
  }

  /** Compare the node's value with `value`: negative, zero or positive. */
  compare(id: string, value: Scalar, meta?: MetaArg): number {
    const v = this.value(id);
    this.tracer.emit({ type: "tree.compare", s: this.name, node: id, value }, meta, "comparisons");
    if (typeof v === "number" && typeof value === "number")
      return v < value ? -1 : v > value ? 1 : 0;
    const [a, b] = [String(v), String(value)];
    return a < b ? -1 : a > b ? 1 : 0;
  }

  status(id: string, status: NodeStatus, meta?: MetaArg): void {
    this.node(id);
    this.t.nodeStatus[id] = status;
    this.tracer.emit({ type: "tree.node", s: this.name, node: id, status }, meta);
  }

  annotate(id: string, text: string | null, meta?: MetaArg): void {
    this.node(id);
    this.tracer.emit({ type: "tree.annotate", s: this.name, node: id, text }, meta);
  }

  remove(id: string, meta?: MetaArg): void {
    treeRemove(this.t, id);
    this.tracer.emit({ type: "tree.remove", s: this.name, node: id }, meta);
  }

  splice(id: string, meta?: MetaArg): void {
    treeSplice(this.t, id);
    this.tracer.emit({ type: "tree.splice", s: this.name, node: id }, meta);
  }

  /** Re-attach `id` (with its subtree) under `parent`. */
  move(id: string, parent: string, slot?: number, meta?: MetaArg): void {
    treeMove(this.t, id, parent, slot);
    this.tracer.emit(
      {
        type: "tree.move",
        s: this.name,
        node: id,
        parent,
        ...(slot !== undefined ? { slot } : {}),
      },
      meta,
    );
  }

  /** Exchange two nodes, each with its subtree. */
  swap(a: string, b: string, meta?: MetaArg): void {
    treeSwap(this.t, a, b);
    this.tracer.emit({ type: "tree.swap", s: this.name, a, b }, meta);
  }

  /** Binary trees: rotate at `id`; returns the child that moved up into its place. */
  rotate(id: string, dir: "left" | "right", meta?: MetaArg): string {
    const up = treeRotate(this.t, id, dir);
    this.tracer.emit({ type: "tree.rotate", s: this.name, node: id, dir }, meta);
    return up;
  }

  private node(id: string) {
    const n = this.t.nodes[id];
    if (!n) throw new Error(`unknown tree node ${id} in ${this.name}`);
    return n;
  }
}

/**
 * A traced plane. It remembers each shape's geometry, so `restyle` can change a
 * shape's status without the algorithm repeating its coordinates.
 */
export class TracedPlane {
  private readonly shapes = new Map<string, { shape: PlaneGeometry; label?: string }>();

  constructor(
    private readonly tracer: Tracer,
    readonly name: string,
  ) {}

  point(id: string, status: NodeStatus, meta?: MetaArg): void {
    this.tracer.emit({ type: "plane.point", s: this.name, point: id, status }, meta);
  }

  annotate(id: string, text: string | null, meta?: MetaArg): void {
    this.tracer.emit({ type: "plane.annotate", s: this.name, point: id, text }, meta);
  }

  /** Add a shape, or replace the one with this id. */
  draw(id: string, shape: PlaneGeometry, status: EdgeStatus, meta?: MetaArg, label?: string): void {
    this.shapes.set(id, { shape, ...(label !== undefined ? { label } : {}) });
    this.tracer.emit(
      {
        type: "plane.draw",
        s: this.name,
        id,
        shape: { ...shape },
        status,
        ...(label !== undefined ? { label } : {}),
      },
      meta,
    );
  }

  /** Change a drawn shape's status. */
  restyle(id: string, status: EdgeStatus, meta?: MetaArg): void {
    const known = this.shapes.get(id);
    if (!known) throw new Error(`unknown shape ${id} in ${this.name}`);
    this.draw(id, known.shape, status, meta, known.label);
  }

  erase(id: string, meta?: MetaArg): void {
    if (!this.shapes.delete(id)) throw new Error(`unknown shape ${id} in ${this.name}`);
    this.tracer.emit({ type: "plane.erase", s: this.name, id }, meta);
  }

  has(id: string): boolean {
    return this.shapes.has(id);
  }
}

/**
 * A traced timeline. It keeps the clock and the set of messages in flight, so an
 * algorithm cannot deliver a message twice or move time backwards.
 */
export class TracedTimeline {
  private time = 0;
  private counter = 0;
  private marks = 0;
  private readonly flying = new Set<string>();

  constructor(
    private readonly tracer: Tracer,
    readonly name: string,
  ) {}

  get now(): number {
    return this.time;
  }

  /** Move the clock forwards to `time` (no event if it is already there). */
  tick(time: number, meta?: MetaArg): void {
    if (time < this.time) throw new Error(`time ${time} is before ${this.time} in ${this.name}`);
    if (time === this.time) return;
    this.time = time;
    this.tracer.emit({ type: "timeline.tick", s: this.name, time }, meta);
  }

  /** Send a message now; returns its id. */
  send(from: string, to: string, label?: string, meta?: MetaArg): string {
    const id = `m${this.counter++}`;
    this.flying.add(id);
    this.tracer.emit(
      {
        type: "timeline.send",
        s: this.name,
        id,
        from,
        to,
        ...(label !== undefined ? { label } : {}),
      },
      meta,
    );
    return id;
  }

  deliver(id: string, status: EdgeStatus = "tree", meta?: MetaArg): void {
    if (!this.flying.delete(id)) throw new Error(`message ${id} is not in flight in ${this.name}`);
    this.tracer.emit({ type: "timeline.deliver", s: this.name, id, status }, meta);
  }

  lose(id: string, meta?: MetaArg): void {
    if (!this.flying.delete(id)) throw new Error(`message ${id} is not in flight in ${this.name}`);
    this.tracer.emit({ type: "timeline.lose", s: this.name, id }, meta);
  }

  lane(id: string, status: NodeStatus, meta?: MetaArg): void {
    this.tracer.emit({ type: "timeline.lane", s: this.name, lane: id, status }, meta);
  }

  annotate(lane: string, text: string | null, meta?: MetaArg): void {
    this.tracer.emit({ type: "timeline.annotate", s: this.name, lane, text }, meta);
  }

  /** A local event on a lane at the current time. */
  mark(lane: string, label: string, meta?: MetaArg): void {
    this.tracer.emit(
      { type: "timeline.mark", s: this.name, id: `k${this.marks++}`, lane, label },
      meta,
    );
  }
}
