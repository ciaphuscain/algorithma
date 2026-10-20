import { layoutGraph } from "@/lib/graph-layout";
import type { Rng } from "@/lib/random";
import type { InputPreset, InputSpec, ParseResult } from "./types";

/* ------------------------------------------------------------ number arrays */

export interface NumberArrayLimits {
  minLength: number;
  maxLength: number;
  min: number;
  max: number;
}

export function parseNumberList(
  text: string,
  limits: NumberArrayLimits,
  label = "Array",
): ParseResult<number[]> {
  const tokens = text
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  const errors: string[] = [];
  const values: number[] = [];
  for (const token of tokens) {
    if (!/^-?\d+$/.test(token)) {
      errors.push(`"${token}" is not a whole number`);
      continue;
    }
    const v = Number(token);
    if (v < limits.min || v > limits.max)
      errors.push(`${v} is outside ${limits.min}…${limits.max}`);
    values.push(v);
  }
  if (values.length < limits.minLength)
    errors.push(`${label} needs at least ${limits.minLength} element(s)`);
  if (values.length > limits.maxLength) {
    errors.push(
      `${label} has ${values.length} elements; the visualizer supports at most ${limits.maxLength}`,
    );
  }
  return errors.length > 0
    ? { ok: false, errors: errors.slice(0, 5) }
    : { ok: true, value: values };
}

export function randomNumbers(rng: Rng, length: number, min: number, max: number): number[] {
  return Array.from({ length }, () => rng.int(min, max));
}

export function numberArrayInput(options: {
  limits: NumberArrayLimits;
  presets: InputPreset<number[]>[];
  defaultRandomLength?: number;
}): InputSpec<number[]> {
  const { limits } = options;
  return {
    fields: [
      {
        name: "values",
        label: "Array",
        placeholder: "e.g. 5, 2, 9, 1, 6",
        help: "Whole numbers separated by commas or spaces.",
      },
    ],
    constraints: `${limits.minLength}–${limits.maxLength} whole numbers between ${limits.min} and ${limits.max}.`,
    parse: (fields) => parseNumberList(fields.values ?? "", limits),
    format: (value) => ({ values: value.join(", ") }),
    presets: options.presets,
    random: (rng, size) => {
      const n = clamp(
        size ?? options.defaultRandomLength ?? 10,
        limits.minLength,
        limits.maxLength,
      );
      return randomNumbers(rng, n, Math.max(limits.min, 1), Math.min(limits.max, 99));
    },
  };
}

/* ---------------------------------------------------- sorted array + target */

export interface SearchInput {
  values: number[];
  target: number;
}

export function sortedSearchInput(options: {
  limits: NumberArrayLimits;
  presets: InputPreset<SearchInput>[];
}): InputSpec<SearchInput> {
  const { limits } = options;
  return {
    fields: [
      {
        name: "values",
        label: "Sorted array",
        placeholder: "e.g. 2, 5, 8, 12, 16",
        help: "Must be in non-decreasing order.",
      },
      { name: "target", label: "Target", placeholder: "e.g. 12" },
    ],
    constraints: `${limits.minLength}–${limits.maxLength} whole numbers in non-decreasing order; integer target.`,
    parse: (fields) => {
      const list = parseNumberList(fields.values ?? "", limits, "Sorted array");
      const errors = list.ok ? [] : [...list.errors];
      const targetText = (fields.target ?? "").trim();
      if (!/^-?\d+$/.test(targetText)) errors.push("Target must be a whole number");
      if (list.ok) {
        for (let i = 1; i < list.value.length; i++) {
          if (list.value[i]! < list.value[i - 1]!) {
            errors.push(`Array is not sorted: ${list.value[i - 1]} comes before ${list.value[i]}`);
            break;
          }
        }
      }
      if (errors.length > 0 || !list.ok) return { ok: false, errors };
      return { ok: true, value: { values: list.value, target: Number(targetText) } };
    },
    format: (v) => ({ values: v.values.join(", "), target: String(v.target) }),
    presets: options.presets,
    random: (rng, size) => {
      const n = clamp(size ?? 12, limits.minLength, limits.maxLength);
      const values = randomNumbers(rng, n, 1, 99).sort((a, b) => a - b);
      // Half the time search for a present value, otherwise any value.
      const target = rng.next() < 0.5 ? values[rng.int(0, n - 1)]! : rng.int(1, 99);
      return { values, target };
    },
  };
}

/* ------------------------------------------------------------------ graphs */

export interface GraphInputValue {
  directed: boolean;
  weighted: boolean;
  nodes: { id: string; x: number; y: number }[];
  edges: { from: string; to: string; weight?: number }[];
  source: string;
}

export interface GraphLimits {
  maxNodes: number;
  maxEdges: number;
  minWeight?: number;
  maxWeight?: number;
}

const NODE_ID = /^[A-Za-z0-9]{1,3}$/;

/**
 * Parse the compact edge-list notation used by graph inputs:
 *   "A-B, B-C:4, D"   (undirected; ":4" is a weight; a bare id is an isolated node)
 *   "A->B, B->C:4"    (directed)
 */
export function parseGraph(
  text: string,
  sourceText: string,
  options: { directed: boolean; weighted: boolean; limits: GraphLimits },
): ParseResult<GraphInputValue> {
  const { directed, weighted, limits } = options;
  const errors: string[] = [];
  const nodes: string[] = [];
  const seen = new Set<string>();
  const addNode = (id: string) => {
    if (!seen.has(id)) {
      seen.add(id);
      nodes.push(id);
    }
  };
  const edges: GraphInputValue["edges"] = [];
  const edgeKeys = new Set<string>();
  const sep = directed ? "->" : "-";
  const tokens = text
    .split(/[,\n;]+/)
    .map((t) => t.replace(/\s+/g, ""))
    .filter(Boolean);

  for (const token of tokens) {
    const [pair, weightText, ...rest] = token.split(":");
    if (rest.length > 0 || pair === undefined) {
      errors.push(`Cannot read "${token}"`);
      continue;
    }
    if (!pair.includes("-")) {
      if (!NODE_ID.test(pair)) errors.push(`"${pair}" is not a valid node id (1–3 letters/digits)`);
      else addNode(pair);
      if (weightText !== undefined) errors.push(`"${token}": a lone node cannot have a weight`);
      continue;
    }
    if (directed && !pair.includes("->")) {
      errors.push(`"${token}": use "->" for directed edges, e.g. A->B`);
      continue;
    }
    if (!directed && pair.includes(">")) {
      errors.push(`"${token}": this graph is undirected; write A-B`);
      continue;
    }
    const ends = pair.split(sep);
    if (ends.length !== 2 || !NODE_ID.test(ends[0]!) || !NODE_ID.test(ends[1]!)) {
      errors.push(`"${token}" is not an edge like A${sep}B`);
      continue;
    }
    const [from, to] = ends as [string, string];
    if (from === to) {
      errors.push(`"${token}": self-loops are not supported`);
      continue;
    }
    const key = directed ? `${from}>${to}` : [from, to].sort().join("-");
    if (edgeKeys.has(key)) {
      errors.push(`Duplicate edge ${from}${sep}${to}`);
      continue;
    }
    edgeKeys.add(key);
    let weight: number | undefined;
    if (weighted) {
      if (weightText === undefined || !/^-?\d+$/.test(weightText)) {
        errors.push(`"${token}" needs an integer weight, e.g. ${from}${sep}${to}:4`);
        continue;
      }
      weight = Number(weightText);
      if (limits.minWeight !== undefined && weight < limits.minWeight) {
        errors.push(
          `Weight ${weight} on ${from}${sep}${to} is below the minimum ${limits.minWeight}`,
        );
      }
      if (limits.maxWeight !== undefined && weight > limits.maxWeight) {
        errors.push(
          `Weight ${weight} on ${from}${sep}${to} exceeds the maximum ${limits.maxWeight}`,
        );
      }
    } else if (weightText !== undefined) {
      errors.push(`"${token}": this graph is unweighted`);
      continue;
    }
    addNode(from);
    addNode(to);
    edges.push(weight === undefined ? { from, to } : { from, to, weight });
  }

  if (nodes.length === 0) errors.push("The graph needs at least one node");
  if (nodes.length > limits.maxNodes)
    errors.push(`${nodes.length} nodes; the visualizer supports at most ${limits.maxNodes}`);
  if (edges.length > limits.maxEdges)
    errors.push(`${edges.length} edges; the visualizer supports at most ${limits.maxEdges}`);
  const source = sourceText.trim();
  if (!seen.has(source))
    errors.push(source ? `Start node "${source}" is not in the graph` : "Choose a start node");
  if (errors.length > 0) return { ok: false, errors: errors.slice(0, 5) };

  return {
    ok: true,
    value: { directed, weighted, nodes: layoutGraph(nodes, edges), edges, source },
  };
}

export function formatGraph(value: GraphInputValue): Record<string, string> {
  const sep = value.directed ? "->" : "-";
  const inEdge = new Set(value.edges.flatMap((e) => [e.from, e.to]));
  const parts = value.edges.map(
    (e) => `${e.from}${sep}${e.to}${e.weight !== undefined ? `:${e.weight}` : ""}`,
  );
  for (const n of value.nodes) if (!inEdge.has(n.id)) parts.push(n.id);
  return { edges: parts.join(", "), source: value.source };
}

/** Build a graph value from edge notation with automatic layout (used for presets). */
export function graphPreset(
  text: string,
  source: string,
  options: { directed: boolean; weighted: boolean; limits: GraphLimits },
): GraphInputValue {
  const parsed = parseGraph(text, source, options);
  if (!parsed.ok) throw new Error(`invalid graph preset: ${parsed.errors.join("; ")}`);
  return parsed.value;
}

/** Random connected-ish graph: a random spanning tree plus extra edges. */
export function randomGraph(
  rng: Rng,
  options: {
    directed: boolean;
    weighted: boolean;
    nodes: number;
    extraEdges: number;
    minWeight?: number;
    maxWeight?: number;
  },
): GraphInputValue {
  const ids = Array.from(
    { length: options.nodes },
    (_, i) => String.fromCharCode(65 + (i % 26)) + (i >= 26 ? String(Math.floor(i / 26)) : ""),
  );
  const edges: GraphInputValue["edges"] = [];
  const keys = new Set<string>();
  const weight = () => rng.int(options.minWeight ?? 1, options.maxWeight ?? 9);
  const add = (a: string, b: string) => {
    const key = options.directed ? `${a}>${b}` : [a, b].sort().join("-");
    if (a === b || keys.has(key)) return false;
    keys.add(key);
    edges.push(options.weighted ? { from: a, to: b, weight: weight() } : { from: a, to: b });
    return true;
  };
  for (let i = 1; i < ids.length; i++) add(ids[rng.int(0, i - 1)]!, ids[i]!);
  let attempts = 0;
  let extra = 0;
  while (extra < options.extraEdges && attempts < options.extraEdges * 10) {
    attempts++;
    if (add(ids[rng.int(0, ids.length - 1)]!, ids[rng.int(0, ids.length - 1)]!)) extra++;
  }
  return {
    directed: options.directed,
    weighted: options.weighted,
    nodes: layoutGraph(ids, edges),
    edges,
    source: ids[0]!,
  };
}

export function graphInput(options: {
  directed: boolean;
  weighted: boolean;
  limits: GraphLimits;
  presets: InputPreset<GraphInputValue>[];
}): InputSpec<GraphInputValue> {
  const { directed, weighted, limits } = options;
  const example = directed
    ? weighted
      ? "A->B:4, B->C:1, A->C:7"
      : "A->B, B->C, A->C"
    : weighted
      ? "A-B:4, B-C:1, A-C:7"
      : "A-B, B-C, A-C, C-D";
  return {
    fields: [
      {
        name: "edges",
        label: directed ? "Directed edges" : "Edges",
        placeholder: `e.g. ${example}`,
        multiline: true,
        help: `Separate edges with commas or new lines.${weighted ? " Add a weight after a colon." : ""} A lone id adds an isolated node.`,
      },
      { name: "source", label: "Start node", placeholder: "e.g. A" },
    ],
    constraints: `Up to ${limits.maxNodes} nodes and ${limits.maxEdges} edges; node ids are 1–3 letters or digits.${
      weighted && limits.minWeight !== undefined
        ? ` Weights ${limits.minWeight}–${limits.maxWeight}.`
        : ""
    }`,
    parse: (fields) =>
      parseGraph(fields.edges ?? "", fields.source ?? "", { directed, weighted, limits }),
    format: formatGraph,
    presets: options.presets,
    random: (rng, size) => {
      const nodes = clamp(size ?? 8, 2, Math.min(limits.maxNodes, 26));
      return randomGraph(rng, {
        directed,
        weighted,
        nodes,
        extraEdges: Math.min(Math.floor(nodes / 2), limits.maxEdges - nodes + 1),
        ...(limits.minWeight !== undefined ? { minWeight: Math.max(limits.minWeight, 1) } : {}),
        ...(limits.maxWeight !== undefined ? { maxWeight: Math.min(limits.maxWeight, 9) } : {}),
      });
    },
  };
}

/** Graph structure for the tracer, with stable edge ids "from-to". */
export function toTraceGraph(value: GraphInputValue) {
  return {
    directed: value.directed,
    nodes: value.nodes.map((n) => ({ id: n.id, x: n.x, y: n.y })),
    edges: value.edges.map((e) => ({
      id: edgeId(e.from, e.to),
      from: e.from,
      to: e.to,
      ...(e.weight !== undefined ? { weight: e.weight } : {}),
    })),
  };
}

export const edgeId = (from: string, to: string) => `${from}-${to}`;

/** Adjacency lists in input order. For undirected graphs each edge appears in both lists. */
export function adjacency(
  value: GraphInputValue,
): Map<string, { to: string; edge: string; weight: number }[]> {
  const adj = new Map<string, { to: string; edge: string; weight: number }[]>();
  for (const n of value.nodes) adj.set(n.id, []);
  for (const e of value.edges) {
    const id = edgeId(e.from, e.to);
    adj.get(e.from)!.push({ to: e.to, edge: id, weight: e.weight ?? 1 });
    if (!value.directed) adj.get(e.to)!.push({ to: e.from, edge: id, weight: e.weight ?? 1 });
  }
  // Visit neighbours in id order so traces are deterministic and match textbook examples.
  for (const list of adj.values()) list.sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : 0));
  return adj;
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(Math.max(v, lo), hi);
}
