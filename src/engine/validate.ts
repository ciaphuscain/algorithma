import {
  ARRAY_MARKS,
  EDGE_STATUSES,
  GRID_MARKS,
  MAX_GRAPH_EDGES,
  MAX_PLANE_SHAPES,
  MAX_TIMELINE_ITEMS,
  NODE_STATUSES,
  SEQUENCE_DISCIPLINES,
  TRACE_PROTOCOL,
  TRACE_VERSION,
  type Structure,
  type Trace,
  type TraceEvent,
} from "./protocol";
import { TracePlayer } from "./player";
import { checkTreeShape } from "./tree";
import { TraceReplayError } from "./reduce";

/**
 * Resource limits for traces from untrusted sources (imports, Studio). Generated
 * traces are additionally bounded by the tracer's event budget.
 */
export const TRACE_LIMITS = {
  maxEvents: 200_000,
  maxArrayLength: 2_000,
  maxGraphNodes: 500,
  maxGraphEdges: MAX_GRAPH_EDGES,
  maxGridCells: 40_000,
  maxStructures: 32,
  maxTreeNodes: 500,
  maxPlanePoints: 500,
  maxPlaneShapes: MAX_PLANE_SHAPES,
  maxTimelineLanes: 16,
  maxTimelineItems: MAX_TIMELINE_ITEMS,
  maxTime: 1_000_000,
  maxStringLength: 500,
} as const;

export type ValidationResult =
  { ok: true; trace: Trace; player: TracePlayer } | { ok: false; errors: string[] };

class Collector {
  errors: string[] = [];
  add(path: string, message: string): void {
    if (this.errors.length < 50) this.errors.push(`${path}: ${message}`);
  }
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isScalar = (v: unknown): boolean =>
  v === null ||
  typeof v === "boolean" ||
  (typeof v === "number" && Number.isFinite(v)) ||
  (typeof v === "string" && v.length <= TRACE_LIMITS.maxStringLength);
const isInt = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v);
const isStr = (v: unknown): v is string =>
  typeof v === "string" && v.length <= TRACE_LIMITS.maxStringLength;
const isCellList = (v: unknown): boolean =>
  Array.isArray(v) &&
  v.every((c) => Array.isArray(c) && c.length === 2 && isInt(c[0]) && isInt(c[1]));
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const GEOMETRY_FIELDS: Record<string, string[]> = {
  segment: ["x1", "y1", "x2", "y2"],
  rect: ["x1", "y1", "x2", "y2"],
  circle: ["x", "y", "r"],
};
/** A plane shape's geometry: exactly the numeric fields its kind needs. */
const isGeometry = (v: unknown): boolean => {
  if (!isObject(v) || typeof v.kind !== "string") return false;
  const fields = GEOMETRY_FIELDS[v.kind];
  if (!fields || Object.keys(v).length !== fields.length + 1) return false;
  if (!fields.every((f) => isNum(v[f]))) return false;
  return v.kind !== "circle" || (v.r as number) >= 0;
};
const isTime = (v: unknown): v is number => isInt(v) && v >= 0 && v <= TRACE_LIMITS.maxTime;
const oneOf =
  <T extends string>(values: readonly T[]) =>
  (v: unknown): v is T =>
    typeof v === "string" && (values as readonly string[]).includes(v);

function checkStructure(raw: unknown, path: string, c: Collector): void {
  if (!isObject(raw)) return c.add(path, "must be an object");
  if (raw.label !== undefined && !isStr(raw.label)) c.add(`${path}.label`, "must be a string");
  switch (raw.kind) {
    case "array": {
      const { values, marks, pointers } = raw;
      if (!Array.isArray(values) || !values.every(isScalar))
        return c.add(`${path}.values`, "must be an array of scalars");
      if (values.length > TRACE_LIMITS.maxArrayLength)
        c.add(`${path}.values`, `exceeds ${TRACE_LIMITS.maxArrayLength} elements`);
      if (
        !Array.isArray(marks) ||
        marks.length !== values.length ||
        !marks.every((m) => m === null || oneOf(ARRAY_MARKS)(m))
      ) {
        c.add(`${path}.marks`, "must be an array of marks (or null) matching values");
      }
      if (!isObject(pointers) || !Object.values(pointers).every(isInt))
        c.add(`${path}.pointers`, "must map names to integers");
      if (raw.display !== undefined && !["bars", "cells", "heap"].includes(raw.display as string))
        c.add(`${path}.display`, "must be bars, cells or heap");
      return;
    }
    case "graph": {
      const { nodes, edges, nodeStatus, edgeStatus, annotations, directed } = raw;
      if (typeof directed !== "boolean") c.add(`${path}.directed`, "must be boolean");
      if (!Array.isArray(nodes)) return c.add(`${path}.nodes`, "must be an array");
      if (!Array.isArray(edges)) return c.add(`${path}.edges`, "must be an array");
      if (nodes.length > TRACE_LIMITS.maxGraphNodes)
        c.add(`${path}.nodes`, `exceeds ${TRACE_LIMITS.maxGraphNodes} nodes`);
      if (edges.length > TRACE_LIMITS.maxGraphEdges)
        c.add(`${path}.edges`, `exceeds ${TRACE_LIMITS.maxGraphEdges} edges`);
      const ids = new Set<string>();
      nodes.forEach((n, i) => {
        if (!isObject(n) || !isStr(n.id) || typeof n.x !== "number" || typeof n.y !== "number") {
          c.add(`${path}.nodes[${i}]`, "needs string id and numeric x, y");
        } else if (ids.has(n.id)) {
          c.add(`${path}.nodes[${i}]`, `duplicate id "${n.id}"`);
        } else ids.add(n.id);
      });
      const edgeIds = new Set<string>();
      edges.forEach((e, i) => {
        if (!isObject(e) || !isStr(e.id) || !isStr(e.from) || !isStr(e.to)) {
          return c.add(`${path}.edges[${i}]`, "needs string id, from, to");
        }
        if (!ids.has(e.from) || !ids.has(e.to))
          c.add(`${path}.edges[${i}]`, "references an unknown node");
        if (edgeIds.has(e.id)) c.add(`${path}.edges[${i}]`, `duplicate id "${e.id}"`);
        edgeIds.add(e.id);
        if (
          e.weight !== undefined &&
          (typeof e.weight !== "number" || !Number.isFinite(e.weight))
        ) {
          c.add(`${path}.edges[${i}].weight`, "must be a finite number");
        }
      });
      if (!isObject(nodeStatus) || !Object.values(nodeStatus).every(oneOf(NODE_STATUSES)))
        c.add(`${path}.nodeStatus`, "invalid");
      if (!isObject(edgeStatus) || !Object.values(edgeStatus).every(oneOf(EDGE_STATUSES)))
        c.add(`${path}.edgeStatus`, "invalid");
      if (!isObject(annotations) || !Object.values(annotations).every(isStr))
        c.add(`${path}.annotations`, "invalid");
      return;
    }
    case "sequence": {
      if (!oneOf(SEQUENCE_DISCIPLINES)(raw.discipline)) c.add(`${path}.discipline`, "invalid");
      if (!Array.isArray(raw.items) || !raw.items.every(isScalar))
        c.add(`${path}.items`, "must be an array of scalars");
      return;
    }
    case "grid": {
      const { rows, cols, cells, marks, rowHeaders, colHeaders } = raw;
      if (!isInt(rows) || !isInt(cols) || rows < 1 || cols < 1)
        return c.add(path, "rows and cols must be positive integers");
      if (rows * cols > TRACE_LIMITS.maxGridCells)
        return c.add(path, `exceeds ${TRACE_LIMITS.maxGridCells} cells`);
      const shaped = (m: unknown, ok: (x: unknown) => boolean) =>
        Array.isArray(m) &&
        m.length === rows &&
        m.every((row) => Array.isArray(row) && row.length === cols && row.every(ok));
      if (!shaped(cells, isScalar))
        c.add(`${path}.cells`, `must be a ${rows}×${cols} matrix of scalars`);
      if (!shaped(marks, (m) => m === null || oneOf(GRID_MARKS)(m)))
        c.add(`${path}.marks`, `must be a ${rows}×${cols} matrix of marks`);
      if (
        rowHeaders !== undefined &&
        !(Array.isArray(rowHeaders) && rowHeaders.length === rows && rowHeaders.every(isStr))
      ) {
        c.add(`${path}.rowHeaders`, "must have one string per row");
      }
      if (
        colHeaders !== undefined &&
        !(Array.isArray(colHeaders) && colHeaders.length === cols && colHeaders.every(isStr))
      ) {
        c.add(`${path}.colHeaders`, "must have one string per column");
      }
      return;
    }
    case "tree": {
      const { nodes, root, binary, nodeStatus, annotations } = raw;
      if (typeof binary !== "boolean") c.add(`${path}.binary`, "must be boolean");
      if (!isObject(nodes)) return c.add(`${path}.nodes`, "must be an object");
      const ids = Object.keys(nodes);
      if (ids.length > TRACE_LIMITS.maxTreeNodes)
        return c.add(`${path}.nodes`, `exceeds ${TRACE_LIMITS.maxTreeNodes} nodes`);
      if (!(root === null || (isStr(root) && root in nodes)))
        c.add(`${path}.root`, "must be null or a node id");
      for (const id of ids) {
        const n = nodes[id];
        if (!isStr(id) || !isObject(n) || !isScalar(n.value) || !Array.isArray(n.children)) {
          c.add(`${path}.nodes.${id}`, "needs a scalar value and a children array");
          continue;
        }
        if (!n.children.every((ch) => ch === null || (isStr(ch) && ch in nodes))) {
          c.add(`${path}.nodes.${id}.children`, "must reference existing nodes or be null");
        }
        if (n.edgeLabel !== undefined && !isStr(n.edgeLabel))
          c.add(`${path}.nodes.${id}.edgeLabel`, "must be a string");
        for (const k of Object.keys(n)) {
          if (!["value", "children", "edgeLabel"].includes(k))
            c.add(`${path}.nodes.${id}.${k}`, "unknown field");
        }
      }
      if (!isObject(nodeStatus) || !Object.values(nodeStatus).every(oneOf(NODE_STATUSES)))
        c.add(`${path}.nodeStatus`, "invalid");
      if (!isObject(annotations) || !Object.values(annotations).every(isStr))
        c.add(`${path}.annotations`, "invalid");
      if (c.errors.length === 0 && typeof binary === "boolean") {
        const shape = checkTreeShape(raw as unknown as Parameters<typeof checkTreeShape>[0]);
        if (shape) c.add(path, shape);
      }
      return;
    }
    case "plane": {
      const { bounds, points, pointStatus, annotations, shapes } = raw;
      if (
        !isObject(bounds) ||
        ![bounds.minX, bounds.minY, bounds.maxX, bounds.maxY].every(isNum) ||
        !((bounds.minX as number) < (bounds.maxX as number)) ||
        !((bounds.minY as number) < (bounds.maxY as number))
      ) {
        c.add(`${path}.bounds`, "needs finite minX < maxX and minY < maxY");
      }
      if (!Array.isArray(points)) return c.add(`${path}.points`, "must be an array");
      if (points.length > TRACE_LIMITS.maxPlanePoints)
        return c.add(`${path}.points`, `exceeds ${TRACE_LIMITS.maxPlanePoints} points`);
      const ids = new Set<string>();
      points.forEach((p, i) => {
        if (!isObject(p) || !isStr(p.id) || !isNum(p.x) || !isNum(p.y)) {
          c.add(`${path}.points[${i}]`, "needs string id and finite x, y");
        } else if (ids.has(p.id)) {
          c.add(`${path}.points[${i}]`, `duplicate id "${p.id}"`);
        } else ids.add(p.id);
        if (isObject(p) && p.label !== undefined && !isStr(p.label))
          c.add(`${path}.points[${i}].label`, "must be a string");
      });
      if (
        !isObject(pointStatus) ||
        !Object.entries(pointStatus).every(([k, v]) => ids.has(k) && oneOf(NODE_STATUSES)(v))
      )
        c.add(`${path}.pointStatus`, "must map known points to statuses");
      if (
        !isObject(annotations) ||
        !Object.entries(annotations).every(([k, v]) => ids.has(k) && isStr(v))
      )
        c.add(`${path}.annotations`, "must map known points to strings");
      if (!Array.isArray(shapes)) return c.add(`${path}.shapes`, "must be an array");
      if (shapes.length > TRACE_LIMITS.maxPlaneShapes)
        return c.add(`${path}.shapes`, `exceeds ${TRACE_LIMITS.maxPlaneShapes} shapes`);
      const shapeIds = new Set<string>();
      shapes.forEach((sh, i) => {
        if (!isObject(sh) || !isStr(sh.id) || !oneOf(EDGE_STATUSES)(sh.status))
          return c.add(`${path}.shapes[${i}]`, "needs string id and an edge status");
        if (shapeIds.has(sh.id)) c.add(`${path}.shapes[${i}]`, `duplicate id "${sh.id}"`);
        shapeIds.add(sh.id);
        const { id: _id, status: _status, label, ...geometry } = sh;
        if (label !== undefined && !isStr(label))
          c.add(`${path}.shapes[${i}].label`, "must be a string");
        if (!isGeometry(geometry)) c.add(`${path}.shapes[${i}]`, "invalid geometry");
      });
      return;
    }
    case "timeline": {
      const { lanes, laneStatus, annotations, now, horizon, messages, marks } = raw;
      if (!Array.isArray(lanes) || lanes.length === 0)
        return c.add(`${path}.lanes`, "must be a non-empty array");
      if (lanes.length > TRACE_LIMITS.maxTimelineLanes)
        return c.add(`${path}.lanes`, `exceeds ${TRACE_LIMITS.maxTimelineLanes} lanes`);
      const ids = new Set<string>();
      lanes.forEach((l, i) => {
        if (!isObject(l) || !isStr(l.id) || (l.label !== undefined && !isStr(l.label)))
          c.add(`${path}.lanes[${i}]`, "needs a string id and an optional string label");
        else if (ids.has(l.id)) c.add(`${path}.lanes[${i}]`, `duplicate id "${l.id}"`);
        else ids.add(l.id);
      });
      if (
        !isObject(laneStatus) ||
        !Object.entries(laneStatus).every(([k, v]) => ids.has(k) && oneOf(NODE_STATUSES)(v))
      )
        c.add(`${path}.laneStatus`, "must map known lanes to statuses");
      if (
        !isObject(annotations) ||
        !Object.entries(annotations).every(([k, v]) => ids.has(k) && isStr(v))
      )
        c.add(`${path}.annotations`, "must map known lanes to strings");
      if (!isTime(now))
        c.add(`${path}.now`, `must be a whole number from 0 to ${TRACE_LIMITS.maxTime}`);
      if (horizon !== undefined && !isTime(horizon))
        c.add(`${path}.horizon`, `must be a whole number from 0 to ${TRACE_LIMITS.maxTime}`);
      if (!Array.isArray(messages) || !Array.isArray(marks))
        return c.add(path, "messages and marks must be arrays");
      if (messages.length + marks.length > TRACE_LIMITS.maxTimelineItems)
        return c.add(path, `exceeds ${TRACE_LIMITS.maxTimelineItems} messages and marks`);
      const seen = new Set<string>();
      messages.forEach((m, i) => {
        const at = `${path}.messages[${i}]`;
        if (
          !isObject(m) ||
          !isStr(m.id) ||
          !ids.has(m.from as string) ||
          !ids.has(m.to as string) ||
          !isTime(m.sent) ||
          !(m.received === null || (isTime(m.received) && m.received >= m.sent)) ||
          !oneOf(EDGE_STATUSES)(m.status) ||
          (m.label !== undefined && !isStr(m.label)) ||
          (m.lost !== undefined && m.lost !== true)
        )
          return c.add(at, "needs an id, known lanes, sent ≤ received (or null) and a status");
        if (seen.has(m.id)) c.add(at, `duplicate id "${m.id}"`);
        seen.add(m.id);
      });
      const markIds = new Set<string>();
      marks.forEach((m, i) => {
        const at = `${path}.marks[${i}]`;
        if (
          !isObject(m) ||
          !isStr(m.id) ||
          !ids.has(m.lane as string) ||
          !isTime(m.time) ||
          !isStr(m.label)
        )
          return c.add(at, "needs an id, a known lane, a time and a label");
        if (markIds.has(m.id)) c.add(at, `duplicate id "${m.id}"`);
        markIds.add(m.id);
      });
      return;
    }
    default:
      c.add(`${path}.kind`, `unknown structure kind ${JSON.stringify(raw.kind)}`);
  }
}

/** Required payload fields per event type, with their checks. Unknown fields are rejected. */
const EVENT_FIELDS: Record<TraceEvent["type"], Record<string, (v: unknown) => boolean>> = {
  "array.compare": { s: isStr, i: isInt },
  "array.read": { s: isStr, i: isInt },
  "array.write": { s: isStr, i: isInt, value: isScalar },
  "array.swap": { s: isStr, i: isInt, j: isInt },
  "array.mark": {
    s: isStr,
    indices: (v) => Array.isArray(v) && v.every(isInt),
    mark: (v) => v === null || oneOf(ARRAY_MARKS)(v),
  },
  "array.pointer": { s: isStr, name: isStr, index: (v) => v === null || isInt(v) },
  "graph.node": { s: isStr, node: isStr, status: oneOf(NODE_STATUSES) },
  "graph.edge": { s: isStr, edge: isStr, status: oneOf(EDGE_STATUSES) },
  "graph.annotate": { s: isStr, node: isStr, text: (v) => v === null || isStr(v) },
  "graph.link": { s: isStr, id: isStr, from: isStr, to: isStr, status: oneOf(EDGE_STATUSES) },
  "graph.unlink": { s: isStr, id: isStr },
  "seq.push": { s: isStr, value: isScalar },
  "seq.pop": { s: isStr },
  "grid.write": { s: isStr, r: isInt, c: isInt, value: isScalar },
  "grid.read": { s: isStr, cells: isCellList },
  "grid.mark": { s: isStr, cells: isCellList, mark: (v) => v === null || oneOf(GRID_MARKS)(v) },
  "tree.add": { s: isStr, node: isStr, value: isScalar, parent: (v) => v === null || isStr(v) },
  "tree.set": { s: isStr, node: isStr, value: isScalar },
  "tree.compare": { s: isStr, node: isStr, value: isScalar },
  "tree.node": { s: isStr, node: isStr, status: oneOf(NODE_STATUSES) },
  "tree.annotate": { s: isStr, node: isStr, text: (v) => v === null || isStr(v) },
  "tree.remove": { s: isStr, node: isStr },
  "tree.splice": { s: isStr, node: isStr },
  "tree.move": { s: isStr, node: isStr, parent: isStr },
  "plane.point": { s: isStr, point: isStr, status: oneOf(NODE_STATUSES) },
  "plane.annotate": { s: isStr, point: isStr, text: (v) => v === null || isStr(v) },
  "plane.draw": { s: isStr, id: isStr, shape: isGeometry, status: oneOf(EDGE_STATUSES) },
  "plane.erase": { s: isStr, id: isStr },
  "timeline.tick": { s: isStr, time: isTime },
  "timeline.send": { s: isStr, id: isStr, from: isStr, to: isStr },
  "timeline.deliver": { s: isStr, id: isStr, status: oneOf(EDGE_STATUSES) },
  "timeline.lose": { s: isStr, id: isStr },
  "timeline.lane": { s: isStr, lane: isStr, status: oneOf(NODE_STATUSES) },
  "timeline.annotate": { s: isStr, lane: isStr, text: (v) => v === null || isStr(v) },
  "timeline.mark": { s: isStr, id: isStr, lane: isStr, label: isStr },
  "structure.create": { s: isStr, structure: isObject },
  "structure.remove": { s: isStr },
  step: {},
  done: {},
};
const OPTIONAL_EVENT_FIELDS: Partial<
  Record<TraceEvent["type"], Record<string, (v: unknown) => boolean>>
> = {
  "array.compare": { j: isInt, value: isScalar },
  "seq.pop": { index: isInt },
  "tree.add": { slot: isInt, edgeLabel: isStr, view: (v) => v === true },
  "tree.move": { slot: isInt },
  "plane.draw": { label: isStr },
  "timeline.send": { label: isStr },
};
const META_FIELDS = new Set(["type", "line", "note", "vars", "count"]);

function checkEvent(raw: unknown, path: string, c: Collector): void {
  if (!isObject(raw)) return c.add(path, "must be an object");
  const type = raw.type as TraceEvent["type"];
  const required = EVENT_FIELDS[type];
  if (!required) return c.add(`${path}.type`, `unknown event type ${JSON.stringify(raw.type)}`);
  const optional = OPTIONAL_EVENT_FIELDS[type] ?? {};
  for (const [field, check] of Object.entries(required)) {
    if (!check(raw[field])) c.add(`${path}.${field}`, "missing or invalid");
  }
  for (const [field, value] of Object.entries(raw)) {
    if (META_FIELDS.has(field) || field in required) continue;
    const check = optional[field];
    if (!check) c.add(`${path}.${field}`, "unknown field");
    else if (!check(value)) c.add(`${path}.${field}`, "invalid");
  }
  if (raw.line !== undefined && !(isInt(raw.line) && raw.line >= 1))
    c.add(`${path}.line`, "must be a positive integer");
  if (raw.note !== undefined && !isStr(raw.note)) c.add(`${path}.note`, "must be a string");
  if (raw.vars !== undefined) {
    if (!isObject(raw.vars)) c.add(`${path}.vars`, "must be an object");
    else
      for (const [k, v] of Object.entries(raw.vars)) {
        if (!(
          isScalar(v) ||
          (Array.isArray(v) && v.length <= TRACE_LIMITS.maxArrayLength && v.every(isScalar))
        )) {
          c.add(`${path}.vars.${k}`, "must be a scalar or array of scalars");
        }
      }
  }
  if (raw.count !== undefined && !(isObject(raw.count) && Object.values(raw.count).every(isInt))) {
    c.add(`${path}.count`, "must map counter names to integers");
  }
  if (type === "structure.create") checkStructure(raw.structure, `${path}.structure`, c);
}

/**
 * Upgrade older protocol versions to the current one, one step at a time, so saved
 * traces keep loading. Newer versions than this application are rejected: they may
 * contain structures it cannot draw.
 */
const MIGRATIONS: Record<number, (raw: Record<string, unknown>) => Record<string, unknown>> = {
  // v2 only added kinds, events and statuses; every v1 trace is a valid v2 trace.
  1: (raw) => ({ ...raw, version: 2 }),
};

export function migrateTrace(input: Record<string, unknown>): {
  trace?: Record<string, unknown>;
  error?: string;
} {
  if (input.protocol !== TRACE_PROTOCOL)
    return { error: `not an ALGORITHMA trace (protocol ${JSON.stringify(input.protocol)})` };
  let raw = input;
  while (isInt(raw.version) && raw.version < TRACE_VERSION && MIGRATIONS[raw.version]) {
    raw = MIGRATIONS[raw.version]!(raw);
  }
  if (raw.version === TRACE_VERSION) return { trace: raw };
  if (isInt(raw.version) && raw.version > TRACE_VERSION) {
    return {
      error: `trace version ${raw.version} is newer than this application supports (${TRACE_VERSION})`,
    };
  }
  return { error: `unsupported trace version ${JSON.stringify(raw.version)}` };
}

/**
 * Validate untrusted trace data: structural schema checks, resource limits, then a
 * full semantic replay. Never throws; returns either a ready player or error messages.
 */
export function validateTrace(input: unknown): ValidationResult {
  const c = new Collector();
  if (!isObject(input)) return { ok: false, errors: ["trace must be a JSON object"] };
  const migrated = migrateTrace(input);
  if (migrated.error || !migrated.trace)
    return { ok: false, errors: [migrated.error ?? "unreadable trace"] };
  const raw = migrated.trace;

  if (!isObject(raw.algorithm) || !isStr(raw.algorithm.id) || !isInt(raw.algorithm.version)) {
    c.add("algorithm", "needs string id and integer version");
  }
  const initial = raw.initial;
  if (
    !isObject(initial) ||
    !isObject(initial.structures) ||
    !Array.isArray(initial.order) ||
    !isObject(initial.vars)
  ) {
    c.add("initial", "needs structures, order and vars");
  } else {
    const names = Object.keys(initial.structures);
    if (names.length > TRACE_LIMITS.maxStructures)
      c.add("initial.structures", `more than ${TRACE_LIMITS.maxStructures} structures`);
    for (const name of names)
      checkStructure(initial.structures[name], `initial.structures.${name}`, c);
    const order = initial.order;
    if (
      !order.every((n) => isStr(n) && names.includes(n)) ||
      new Set(order).size !== order.length ||
      order.length !== names.length
    ) {
      c.add("initial.order", "must list each initial structure exactly once");
    }
  }
  if (!Array.isArray(raw.events)) {
    c.add("events", "must be an array");
  } else if (raw.events.length > TRACE_LIMITS.maxEvents) {
    c.add("events", `has ${raw.events.length} events; the limit is ${TRACE_LIMITS.maxEvents}`);
  } else {
    raw.events.forEach((e, i) => checkEvent(e, `events[${i}]`, c));
  }
  const meta = raw.meta;
  if (!isObject(meta) || !isInt(meta.eventCount) || !isObject(meta.counters)) {
    c.add("meta", "needs eventCount and counters");
  } else {
    if (Array.isArray(raw.events) && meta.eventCount !== raw.events.length) {
      c.add("meta.eventCount", `says ${meta.eventCount} but trace has ${raw.events.length} events`);
    }
    const t = meta.truncated;
    if (t !== null && !(isObject(t) && isInt(t.afterEvents) && isStr(t.reason)))
      c.add("meta.truncated", "invalid");
  }
  if (c.errors.length > 0) return { ok: false, errors: c.errors };

  const trace = raw as unknown as Trace;
  try {
    const player = new TracePlayer(trace);
    return { ok: true, trace, player };
  } catch (err) {
    if (err instanceof TraceReplayError) return { ok: false, errors: [err.message] };
    return { ok: false, errors: [`replay failed: ${(err as Error).message}`] };
  }
}

export function isStructure(v: unknown): v is Structure {
  const c = new Collector();
  checkStructure(v, "structure", c);
  return c.errors.length === 0;
}
