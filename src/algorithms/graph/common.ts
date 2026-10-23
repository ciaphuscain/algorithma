import type { TraceState } from "@/engine/state";

/**
 * The graph's final annotations must show "d=<distance>" (or "d=∞") for every node,
 * matching the algorithm's returned distances.
 */
export const distanceFidelity =
  <O>(name: string, distances: (output: O) => Record<string, number | null>) =>
  (state: TraceState, output: O): string | null => {
    const g = state.structures[name];
    if (!g || g.kind !== "graph") return `final state has no graph "${name}"`;
    for (const [node, d] of Object.entries(distances(output))) {
      const want = `d=${d === null ? "∞" : d}`;
      if (g.annotations[node] !== want)
        return `node ${node} shows ${g.annotations[node] ?? "nothing"}, expected ${want}`;
    }
    return null;
  };

interface WeightedGraph {
  nodes: { id: string }[];
  edges: { from: string; to: string; weight?: number }[];
}

/** Vertices reachable from `s` along undirected edges. */
function componentOf(g: WeightedGraph, s: string): Set<string> {
  const seen = new Set([s]);
  for (let changed = true; changed;) {
    changed = false;
    for (const e of g.edges) {
      if (seen.has(e.from) !== seen.has(e.to)) {
        seen.add(e.from);
        seen.add(e.to);
        changed = true;
      }
    }
  }
  return seen;
}

/** Minimum spanning tree weight of `within` by a naive O(V·E) Prim (an oracle for Kruskal). */
function primWeight(g: WeightedGraph, within: Set<string>): number {
  const [start] = within;
  const inTree = new Set(start === undefined ? [] : [start]);
  let total = 0;
  while (inTree.size < within.size) {
    let best = Infinity;
    let next = "";
    for (const e of g.edges) {
      const w = e.weight ?? 1;
      if (inTree.has(e.from) !== inTree.has(e.to) && w < best) {
        best = w;
        next = inTree.has(e.from) ? e.to : e.from;
      }
    }
    inTree.add(next);
    total += best;
  }
  return total;
}

/** Minimum spanning forest weight by a naive Kruskal with relabelling (an oracle for Prim). */
function kruskalWeight(g: WeightedGraph, within: Set<string>): number {
  const label = new Map([...within].map((v) => [v, v]));
  let total = 0;
  const edges = g.edges
    .filter((e) => within.has(e.from))
    .sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1));
  for (const e of edges) {
    const [a, b] = [label.get(e.from)!, label.get(e.to)!];
    if (a === b) continue;
    for (const [v, l] of label) if (l === b) label.set(v, a);
    total += e.weight ?? 1;
  }
  return total;
}

/**
 * Check a claimed minimum spanning forest: real edges with their weights, no cycle,
 * spanning every component (or only `source`'s component), and optimal weight by an
 * independent algorithm (Prim's for a forest, Kruskal's for one component).
 */
export function spanningForestCheck(
  g: WeightedGraph,
  out: { edges: [string, string, number][]; total: number },
  source: string | null,
): string | null {
  const label = new Map<string, string>(g.nodes.map((n) => [n.id, n.id]));
  let sum = 0;
  for (const [a, b, w] of out.edges) {
    const e = g.edges.find((x) => (x.from === a && x.to === b) || (x.from === b && x.to === a));
    if (!e || (e.weight ?? 1) !== w) return `${a}–${b} (${w}) is not an edge of the graph`;
    const [la, lb] = [label.get(a)!, label.get(b)!];
    if (la === lb) return `${a}–${b} closes a cycle`;
    for (const [v, l] of label) if (l === lb) label.set(v, la);
    sum += w;
  }
  if (sum !== out.total) return `edge weights sum to ${sum}, reported ${out.total}`;
  const components: Set<string>[] = [];
  const placed = new Set<string>();
  for (const n of g.nodes) {
    if (placed.has(n.id)) continue;
    const c = componentOf(g, n.id);
    c.forEach((v) => placed.add(v));
    components.push(c);
  }
  const wanted = source === null ? components : components.filter((c) => c.has(source));
  const size = wanted.reduce((k, c) => k + c.size - 1, 0);
  if (out.edges.length !== size) return `${out.edges.length} edges, expected ${size}`;
  if (source !== null) {
    const comp = wanted[0]!;
    for (const [a] of out.edges) if (!comp.has(a)) return `${a} is outside ${source}'s component`;
  }
  const best = wanted.reduce(
    (k, c) => k + (source === null ? primWeight(g, c) : kruskalWeight(g, c)),
    0,
  );
  if (out.total !== best) return `total ${out.total} is not minimal (${best})`;
  return null;
}

/** The chosen edges are exactly the graph edges drawn with the "tree" status. */
export function mstEdgesFidelity(
  state: TraceState,
  out: { edges: [string, string, number][] },
): string | null {
  const g = state.structures.G;
  if (!g || g.kind !== "graph") return "final state has no graph G";
  const drawn = g.edges.filter((e) => g.edgeStatus[e.id] === "tree");
  if (drawn.length !== out.edges.length)
    return `${drawn.length} edges drawn as chosen, expected ${out.edges.length}`;
  for (const [a, b] of out.edges) {
    if (!drawn.some((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a)))
      return `${a}–${b} is not drawn as chosen`;
  }
  return null;
}

export interface SccOutput {
  /** Strongly connected components in the order the algorithm found them. */
  components: string[][];
}

/**
 * Check a claimed partition into strongly connected components against mutual
 * reachability (transitive closure), and the order in which the components came
 * out: Kosaraju finds them in topological order of the component graph, Tarjan in
 * reverse topological order.
 */
export function sccCheck(
  g: { nodes: { id: string }[]; edges: { from: string; to: string }[] },
  out: SccOutput,
  order: "topological" | "reverse-topological",
): string | null {
  const ids = g.nodes.map((n) => n.id);
  const ix = new Map(ids.map((v, i) => [v, i]));
  const reach = ids.map((_, i) => ids.map((_, j) => i === j));
  for (const e of g.edges) reach[ix.get(e.from)!]![ix.get(e.to)!] = true;
  for (let k = 0; k < ids.length; k++)
    for (let i = 0; i < ids.length; i++)
      if (reach[i]![k]) for (let j = 0; j < ids.length; j++) if (reach[k]![j]) reach[i]![j] = true;
  const compOf = new Map<string, number>();
  out.components.forEach((c, k) => c.forEach((v) => compOf.set(v, k)));
  if (compOf.size !== ids.length || out.components.flat().length !== ids.length)
    return "the components do not partition the vertices";
  for (const a of ids)
    for (const b of ids) {
      const same = reach[ix.get(a)!]![ix.get(b)!]! && reach[ix.get(b)!]![ix.get(a)!]!;
      if (same !== (compOf.get(a) === compOf.get(b)))
        return `${a} and ${b} are ${same ? "mutually reachable but split" : "grouped but not mutually reachable"}`;
    }
  for (const e of g.edges) {
    const [ca, cb] = [compOf.get(e.from)!, compOf.get(e.to)!];
    if (ca === cb) continue;
    if (order === "topological" ? ca > cb : ca < cb)
      return `edge ${e.from}→${e.to} goes against the ${order} order of components`;
  }
  return null;
}
