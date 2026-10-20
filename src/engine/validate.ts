import {
  ARRAY_MARKS,
  EDGE_STATUSES,
  GRID_MARKS,
  NODE_STATUSES,
  SEQUENCE_DISCIPLINES,
  TRACE_PROTOCOL,
  TRACE_VERSION,
  type Structure,
  type Trace,
  type TraceEvent,
} from "./protocol";
import { TracePlayer } from "./player";
import { TraceReplayError } from "./reduce";

/**
 * Resource limits for traces from untrusted sources (imports, Studio). Generated
 * traces are additionally bounded by the tracer's event budget.
 */
export const TRACE_LIMITS = {
  maxEvents: 200_000,
  maxArrayLength: 2_000,
  maxGraphNodes: 500,
  maxGraphEdges: 5_000,
  maxGridCells: 40_000,
  maxStructures: 32,
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
      if (raw.display !== undefined && raw.display !== "bars" && raw.display !== "cells")
        c.add(`${path}.display`, "must be bars or cells");
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
  "seq.push": { s: isStr, value: isScalar },
  "seq.pop": { s: isStr },
  "grid.write": { s: isStr, r: isInt, c: isInt, value: isScalar },
  "grid.read": { s: isStr, cells: isCellList },
  "grid.mark": { s: isStr, cells: isCellList, mark: (v) => v === null || oneOf(GRID_MARKS)(v) },
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
 * Upgrade older protocol versions to the current one. Version 1 is the first
 * published version, so there is nothing to migrate yet; future versions add a step
 * here (v1→v2, v2→v3 …) so that saved traces keep loading.
 */
export function migrateTrace(raw: Record<string, unknown>): {
  trace?: Record<string, unknown>;
  error?: string;
} {
  if (raw.protocol !== TRACE_PROTOCOL)
    return { error: `not an ALGORITHMA trace (protocol ${JSON.stringify(raw.protocol)})` };
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
