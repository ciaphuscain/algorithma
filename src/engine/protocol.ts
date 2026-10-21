/**
 * ALGORITHMA execution-trace protocol, version 1.
 *
 * A trace is a deterministic record of one algorithm execution:
 *
 *   header (algorithm id, input, initial structures)  +  ordered semantic events
 *
 * Events describe *what the algorithm did* ("compare A[2] with A[3]", "relax edge B→C"),
 * not how to draw it. Every event has a precisely defined effect on the visual state
 * (see reduce.ts), so the state at any position is reconstructed by replaying events
 * from the initial state. Snapshots are derived data: the player builds keyframes in
 * memory and never needs them on the wire. See docs/trace-protocol.md and ADR-0002.
 *
 * Everything here is plain JSON-serialisable data.
 */

export const TRACE_PROTOCOL = "algorithma.trace" as const;
/**
 * Version history:
 *   1 — arrays, graphs, sequences, grids.
 *   2 — adds the tree structure kind and tree.* events, including tree.move (v1 traces
 *       are valid v2 traces).
 */
export const TRACE_VERSION = 2 as const;

export type Scalar = number | string | boolean | null;
export type VarValue = Scalar | Scalar[];

/* ---------------------------------------------------------------- structures */

/** Persistent per-element tags on arrays. Rendered with both colour and a text/shape cue. */
export const ARRAY_MARKS = ["sorted", "pivot", "found", "discarded", "active", "min"] as const;
export type ArrayMark = (typeof ARRAY_MARKS)[number];

export const NODE_STATUSES = [
  "unvisited",
  "frontier",
  "current",
  "visited",
  "path",
  "unreachable",
] as const;
export type NodeStatus = (typeof NODE_STATUSES)[number];

export const EDGE_STATUSES = [
  "idle",
  "examining",
  "tree",
  "relaxed",
  "rejected",
  "path",
  "back",
] as const;
export type EdgeStatus = (typeof EDGE_STATUSES)[number];

export const GRID_MARKS = ["filled", "active", "path", "base"] as const;
export type GridMark = (typeof GRID_MARKS)[number];

export const SEQUENCE_DISCIPLINES = ["queue", "stack", "priority"] as const;
export type SequenceDiscipline = (typeof SEQUENCE_DISCIPLINES)[number];

/** Transient emphasis tone attached to the elements an event touched. */
export const FOCUS_TONES = [
  "compare",
  "swap",
  "read",
  "write",
  "visit",
  "relax",
  "match",
  "mismatch",
] as const;
export type FocusTone = (typeof FOCUS_TONES)[number];

export interface ArrayStructure {
  kind: "array";
  label?: string;
  /** Rendering hint only: "bars" (heights) or "cells" (boxes). Renderers may ignore it. */
  display?: "bars" | "cells";
  values: Scalar[];
  marks: (ArrayMark | null)[];
  pointers: Record<string, number>;
}

export interface GraphNode {
  id: string;
  label?: string;
  /** Layout position in the unit square. Producers are expected to supply it (see lib/graph-layout). */
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight?: number;
}

export interface GraphStructure {
  kind: "graph";
  label?: string;
  directed: boolean;
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeStatus: Record<string, NodeStatus>;
  edgeStatus: Record<string, EdgeStatus>;
  /** Short per-node annotation, e.g. a tentative distance "d=4". */
  annotations: Record<string, string>;
}

export interface SequenceStructure {
  kind: "sequence";
  label?: string;
  discipline: SequenceDiscipline;
  items: Scalar[];
}

export interface GridStructure {
  kind: "grid";
  label?: string;
  rows: number;
  cols: number;
  cells: Scalar[][];
  marks: (GridMark | null)[][];
  rowHeaders?: string[];
  colHeaders?: string[];
}

export interface TreeNodeData {
  value: Scalar;
  /**
   * Ordered child ids. Binary trees always have exactly two slots, [left, right],
   * with null for an empty slot, so a node's shape (left vs right child) is kept.
   */
  children: (string | null)[];
  /** Label drawn on the edge from the parent, e.g. a trie character. */
  edgeLabel?: string;
}

export interface TreeStructure {
  kind: "tree";
  label?: string;
  binary: boolean;
  root: string | null;
  nodes: Record<string, TreeNodeData>;
  nodeStatus: Record<string, NodeStatus>;
  /** Short per-node annotation, e.g. a segment "[0,3]" or a height. */
  annotations: Record<string, string>;
}

export type Structure =
  ArrayStructure | GraphStructure | SequenceStructure | GridStructure | TreeStructure;
export type StructureKind = Structure["kind"];

/* -------------------------------------------------------------------- events */

/** Fields every event may carry. They drive the pseudocode, variables and narration panels. */
export interface EventMeta {
  /** 1-based pseudocode line the algorithm is executing. Persists until another event changes it. */
  line?: number;
  /** Plain-language narration of this step. Transient: shown only for this event. */
  note?: string;
  /** Variable updates merged into the inspector. `null` removes a variable. */
  vars?: Record<string, VarValue | null>;
  /** Custom counter increments, e.g. { relaxations: 1 }. */
  count?: Record<string, number>;
}

export type TraceEvent = EventMeta &
  (
    | { type: "array.compare"; s: string; i: number; j?: number; value?: Scalar }
    | { type: "array.read"; s: string; i: number }
    | { type: "array.write"; s: string; i: number; value: Scalar }
    | { type: "array.swap"; s: string; i: number; j: number }
    | { type: "array.mark"; s: string; indices: number[]; mark: ArrayMark | null }
    | { type: "array.pointer"; s: string; name: string; index: number | null }
    | { type: "graph.node"; s: string; node: string; status: NodeStatus }
    | { type: "graph.edge"; s: string; edge: string; status: EdgeStatus }
    | { type: "graph.annotate"; s: string; node: string; text: string | null }
    | { type: "seq.push"; s: string; value: Scalar }
    | { type: "seq.pop"; s: string; index?: number }
    | { type: "grid.write"; s: string; r: number; c: number; value: Scalar }
    | { type: "grid.read"; s: string; cells: [number, number][] }
    | { type: "grid.mark"; s: string; cells: [number, number][]; mark: GridMark | null }
    | {
        type: "tree.add";
        s: string;
        node: string;
        value: Scalar;
        /** null makes the node the root (the tree must be empty). */
        parent: string | null;
        /** Child slot: 0 = left, 1 = right for binary trees; insertion index otherwise (default: append). */
        slot?: number;
        edgeLabel?: string;
      }
    | { type: "tree.set"; s: string; node: string; value: Scalar }
    | { type: "tree.compare"; s: string; node: string; value: Scalar }
    | { type: "tree.node"; s: string; node: string; status: NodeStatus }
    | { type: "tree.annotate"; s: string; node: string; text: string | null }
    /** Delete a node that has no children. */
    | { type: "tree.remove"; s: string; node: string }
    /** Delete a node with at most one child; that child takes its place. */
    | { type: "tree.splice"; s: string; node: string }
    /** Re-attach a non-root node, with its subtree, under another node (not inside the subtree). */
    | { type: "tree.move"; s: string; node: string; parent: string; slot?: number }
    | { type: "structure.create"; s: string; structure: Structure }
    | { type: "structure.remove"; s: string }
    | { type: "step" }
    | { type: "done" }
  );

export type TraceEventType = TraceEvent["type"];

/* --------------------------------------------------------------------- trace */

export interface TraceTruncation {
  /** Number of events that were recorded before recording stopped. */
  afterEvents: number;
  reason: string;
}

export interface Trace {
  protocol: typeof TRACE_PROTOCOL;
  version: typeof TRACE_VERSION;
  algorithm: { id: string; version: number };
  /** The validated input the algorithm ran on. Opaque to the engine. */
  input: unknown;
  initial: {
    structures: Record<string, Structure>;
    /** Display order of structures. */
    order: string[];
    vars: Record<string, VarValue>;
  };
  events: TraceEvent[];
  /** The algorithm's own return value, computed independently of the trace. */
  result: unknown;
  meta: {
    eventCount: number;
    /** Non-null when the event budget ran out. The trace is then explicitly incomplete. */
    truncated: TraceTruncation | null;
    /** Counters over the *whole* execution, including any part after truncation. */
    counters: Record<string, number>;
  };
}

/** Standard counters derived from event types; algorithms add others via `count`. */
export const STANDARD_COUNTERS = ["comparisons", "swaps", "reads", "writes"] as const;
