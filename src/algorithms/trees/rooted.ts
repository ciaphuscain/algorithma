import type { InputPreset, InputSpec, ParseResult } from "../types";
import { clamp } from "../inputs";

/** A rooted tree given as undirected edges plus a root, with vertex-pair queries. */
export interface TreeQueryInput {
  edges: [string, string][];
  root: string;
  queries: [string, string][];
  /** Vertex values, for path-sum queries. */
  values?: Record<string, number>;
}

export interface RootedTree {
  root: string;
  parent: Record<string, string | null>;
  depth: Record<string, number>;
  /** Children in alphabetical order. */
  children: Record<string, string[]>;
  /** Breadth-first order from the root. */
  order: string[];
}

const ID = /^[A-Za-z0-9]{1,3}$/;
const MAX_NODES = 16;
const MAX_QUERIES = 4;

export function rootTree(edges: [string, string][], root: string): RootedTree {
  const adj = new Map<string, string[]>([[root, []]]);
  for (const [a, b] of edges) {
    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);
    adj.get(a)!.push(b);
    adj.get(b)!.push(a);
  }
  const parent: RootedTree["parent"] = { [root]: null };
  const depth: RootedTree["depth"] = { [root]: 0 };
  const children: RootedTree["children"] = {};
  const order = [root];
  for (let i = 0; i < order.length; i++) {
    const v = order[i]!;
    children[v] = adj
      .get(v)!
      .filter((w) => w !== parent[v])
      .sort();
    for (const w of children[v]!) {
      parent[w] = v;
      depth[w] = depth[v]! + 1;
      order.push(w);
    }
  }
  return { root, parent, depth, children, order };
}

function parsePairs(text: string, what: string, errors: string[]): [string, string][] {
  const pairs: [string, string][] = [];
  for (const token of text
    .split(/[,;\n]+/)
    .map((t) => t.trim())
    .filter(Boolean)) {
    const ends = token.split(/\s*-\s*|\s+/);
    if (ends.length !== 2 || !ID.test(ends[0]!) || !ID.test(ends[1]!)) {
      errors.push(`"${token}" is not ${what} like A-B`);
      continue;
    }
    pairs.push([ends[0]!, ends[1]!]);
  }
  return pairs;
}

/**
 * Tree edges ("A-B, A-C"), a root, vertex-pair queries ("D-E") and, optionally,
 * vertex values ("A:3, B:1"). The edges must form one tree.
 */
export function treeQueryInput(options: {
  queryLabel: string;
  withValues: boolean;
  presets: InputPreset<TreeQueryInput>[];
}): InputSpec<TreeQueryInput> {
  return {
    fields: [
      { name: "edges", label: "Tree edges", placeholder: "e.g. A-B, A-C, B-D, B-E" },
      { name: "root", label: "Root", placeholder: "e.g. A" },
      ...(options.withValues
        ? [{ name: "values", label: "Vertex values", placeholder: "e.g. A:3, B:1, C:4" }]
        : []),
      { name: "queries", label: options.queryLabel, placeholder: "e.g. D-E, D-C" },
    ],
    constraints: `A tree of 1–${MAX_NODES} vertices (ids of 1–3 letters or digits), given by its edges; 1–${MAX_QUERIES} vertex pairs to query${options.withValues ? "; an integer value from −99 to 99 for every vertex" : ""}.`,
    parse(fields): ParseResult<TreeQueryInput> {
      const errors: string[] = [];
      const root = (fields.root ?? "").trim();
      const edges = parsePairs(fields.edges ?? "", "an edge", errors);
      const queries = parsePairs(fields.queries ?? "", "a pair", errors);
      const nodes = new Set([root, ...edges.flat()].filter(Boolean));
      if (!ID.test(root)) errors.push("Give the root as a vertex id, e.g. A");
      if (nodes.size > MAX_NODES) errors.push(`${nodes.size} vertices; the limit is ${MAX_NODES}`);
      for (const [a, b] of edges) if (a === b) errors.push(`"${a}-${b}" is a self-loop`);
      if (errors.length === 0) {
        if (edges.length !== nodes.size - 1)
          errors.push(
            `${nodes.size} vertices need exactly ${nodes.size - 1} edges to form a tree; got ${edges.length}`,
          );
        else if (rootTree(edges, root).order.length !== nodes.size)
          errors.push("The edges do not connect every vertex: they do not form one tree");
      }
      if (queries.length === 0) errors.push("Enter at least one pair to query");
      if (queries.length > MAX_QUERIES)
        errors.push(`${queries.length} pairs; the limit is ${MAX_QUERIES}`);
      for (const q of queries)
        for (const v of q) if (!nodes.has(v)) errors.push(`Query vertex "${v}" is not in the tree`);
      let values: Record<string, number> | undefined;
      if (options.withValues) {
        values = {};
        for (const token of (fields.values ?? "")
          .split(/[,;\n]+/)
          .map((t) => t.trim())
          .filter(Boolean)) {
          const m = /^([A-Za-z0-9]{1,3})\s*[:=]\s*(-?\d+)$/.exec(token);
          if (!m) {
            errors.push(`"${token}" is not a value like A:3`);
            continue;
          }
          const value = Number(m[2]);
          if (value < -99 || value > 99) errors.push(`${m[1]}: ${value} is outside −99..99`);
          values[m[1]!] = value;
        }
        for (const v of nodes) if (!(v in values)) errors.push(`Give a value for vertex ${v}`);
        for (const v of Object.keys(values))
          if (!nodes.has(v)) errors.push(`"${v}" has a value but is not in the tree`);
      }
      if (errors.length) return { ok: false, errors: [...new Set(errors)].slice(0, 5) };
      return { ok: true, value: { edges, root, queries, ...(values ? { values } : {}) } };
    },
    format: (v) => ({
      edges: v.edges.map(([a, b]) => `${a}-${b}`).join(", "),
      root: v.root,
      queries: v.queries.map(([a, b]) => `${a}-${b}`).join(", "),
      ...(v.values
        ? {
            values: Object.entries(v.values)
              .map(([k, x]) => `${k}:${x}`)
              .join(", "),
          }
        : {}),
    }),
    presets: options.presets,
    random(rng, size) {
      const n = clamp(size ?? 10, 1, MAX_NODES);
      const names = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
      const edges = names.slice(1).map((v, i): [string, string] => [names[rng.int(0, i)]!, v]);
      const pick = () => names[rng.int(0, n - 1)]!;
      const queries: [string, string][] = [
        [pick(), pick()],
        [pick(), pick()],
      ];
      const values = options.withValues
        ? Object.fromEntries(names.map((v) => [v, rng.int(-9, 9)]))
        : undefined;
      return { edges, root: "A", queries, ...(values ? { values } : {}) };
    },
  };
}
