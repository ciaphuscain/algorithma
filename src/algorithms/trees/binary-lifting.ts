import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { rootTree, treeQueryInput, type TreeQueryInput } from "./rooted";

export interface BinaryLiftingOutput {
  /** The lowest common ancestor of each query pair. */
  lca: string[];
  /** up[v][k]: the 2^k-th ancestor of v (the root when there is none). */
  up: Record<string, string[]>;
}

/** Number of table rows: enough powers of two to cover the deepest vertex. */
export const liftRows = (maxDepth: number) => Math.max(1, Math.ceil(Math.log2(maxDepth + 1)));

/**
 * Binary lifting: store each vertex's 2^k-th ancestor, built from the row before
 * (the 2^k-th ancestor is the 2^(k−1)-th ancestor of the 2^(k−1)-th ancestor). An
 * ancestor at any distance is then a sum of powers of two, and the lowest common
 * ancestor of two vertices takes O(log n) table lookups.
 */
export const binaryLifting: AlgorithmModule<TreeQueryInput, BinaryLiftingOutput> = {
  id: "binary-lifting",
  version: 1,
  pseudocode: [
    "procedure Preprocess(tree, root)",
    "  in breadth-first order: depth[child] ← depth[v] + 1;  up[0][child] ← v   (up[0][root] ← root)",
    "  for k ← 1 to K − 1: for every v: up[k][v] ← up[k − 1][ up[k − 1][v] ]",
    "procedure LCA(u, v)",
    "  if depth[u] < depth[v]: swap u and v",
    "  for each bit k set in depth[u] − depth[v]: u ← up[k][u]   // now at equal depth",
    "  if u = v: return u",
    "  for k ← K − 1 down to 0: if up[k][u] ≠ up[k][v]: u ← up[k][u];  v ← up[k][v]",
    "  return up[0][u]",
  ],
  input: treeQueryInput({
    queryLabel: "LCA queries",
    withValues: false,
    presets: [
      {
        id: "classic",
        label: "Twelve vertices, three queries",
        value: {
          edges: [
            ["A", "B"],
            ["A", "C"],
            ["B", "D"],
            ["B", "E"],
            ["C", "F"],
            ["E", "G"],
            ["E", "H"],
            ["G", "I"],
            ["I", "J"],
            ["F", "K"],
            ["K", "L"],
          ],
          root: "A",
          queries: [
            ["J", "D"],
            ["H", "J"],
            ["L", "J"],
          ],
        },
      },
      {
        id: "path",
        label: "A path (deep lifts)",
        value: {
          edges: [
            ["A", "B"],
            ["B", "C"],
            ["C", "D"],
            ["D", "E"],
            ["E", "F"],
            ["F", "G"],
            ["G", "H"],
            ["H", "I"],
            ["I", "J"],
          ],
          root: "A",
          queries: [
            ["J", "C"],
            ["E", "E"],
          ],
        },
      },
    ],
  }),

  run(input, t) {
    const tree = rootTree(input.edges, input.root);
    const { order, parent, depth } = tree;
    const maxDepth = Math.max(...order.map((v) => depth[v]!));
    const K = liftRows(maxDepth);
    const T = t.tree("T", { binary: false, label: "Rooted tree (depth below each vertex)" });
    for (const v of order) {
      const p = parent[v] ?? null;
      T.add(v, p, undefined, { line: 2 }, { id: v });
      T.annotate(v, `d=${depth[v]}`, { line: 2 });
    }
    const col = new Map(order.map((v, i) => [v, i]));
    const G = t.grid("up", K, order.length, null, {
      label: "up[k][v]: the 2^k-th ancestor of v",
      rowHeaders: Array.from({ length: K }, (_, k) => `k=${k} (2^${k} = ${2 ** k})`),
      colHeaders: [...order],
    });
    const up: string[][] = Array.from({ length: K }, () => order.map(() => input.root));
    for (const v of order) {
      up[0]![col.get(v)!] = parent[v] ?? v;
      G.write(0, col.get(v)!, parent[v] ?? v, {
        line: 2,
        note:
          parent[v] === null
            ? `${v} is the root: its ancestors are taken to be ${v} itself.`
            : undefined,
      });
    }
    for (let k = 1; k < K; k++) {
      for (const v of order) {
        const c = col.get(v)!;
        const mid = up[k - 1]![c]!;
        G.read(
          [
            [k - 1, c],
            [k - 1, col.get(mid)!],
          ],
          { line: 3, vars: { k, v } },
        );
        up[k]![c] = up[k - 1]![col.get(mid)!]!;
        G.write(k, c, up[k]![c]!, {
          line: 3,
          note: `${2 ** k} up from ${v} = ${2 ** (k - 1)} up from ${mid} (${2 ** (k - 1)} up from ${v}): ${up[k]![c]}.`,
        });
      }
    }

    const at = (k: number, v: string) => up[k]![col.get(v)!]!;
    const lookup = (k: number, v: string, line: number) => {
      G.read([[k, col.get(v)!]], { line });
      return at(k, v);
    };
    const lca: string[] = [];
    for (const [a, b] of input.queries) {
      for (const v of order) T.status(v, "unvisited", { line: 4 });
      let u = a;
      let w = b;
      T.status(u, "current", { line: 4, vars: { u, v: w, k: null }, note: `LCA(${a}, ${b})?` });
      T.status(w, "frontier", { line: 4 });
      if (depth[u]! < depth[w]!) {
        [u, w] = [w, u];
        t.step({ line: 5, vars: { u, v: w }, note: `${u} is deeper: lift ${u}.` });
      }
      const diff = depth[u]! - depth[w]!;
      for (let k = 0; k < K; k++) {
        if (((diff >> k) & 1) === 0) continue;
        const next = lookup(k, u, 6);
        T.status(u, "visited", { line: 6 });
        u = next;
        T.status(u, "current", {
          line: 6,
          vars: { u, k },
          note: `Bit ${k} of the depth difference ${diff} is set: jump ${2 ** k} up to ${u}.`,
        });
      }
      let answer: string;
      if (u === w) {
        answer = u;
        t.step({ line: 7, note: `Both are at ${u}: it is the ancestor.` });
      } else {
        for (let k = K - 1; k >= 0; k--) {
          const [nu, nw] = [lookup(k, u, 8), lookup(k, w, 8)];
          if (nu === nw) {
            t.step({
              line: 8,
              vars: { k },
              note: `Jumping ${2 ** k} would land both on ${nu}: too far (or exactly there). Do not jump.`,
            });
            continue;
          }
          T.status(u, "visited", { line: 8 });
          T.status(w, "visited", { line: 8 });
          [u, w] = [nu, nw];
          T.status(u, "current", { line: 8, vars: { u, v: w, k } });
          T.status(w, "frontier", {
            line: 8,
            note: `Their 2^${k}-th ancestors differ: jump both, to ${u} and ${w}.`,
          });
        }
        answer = lookup(0, u, 9);
      }
      lca.push(answer);
      T.status(answer, "path", { line: 9, note: `LCA(${a}, ${b}) = ${answer}.` });
    }
    const output: BinaryLiftingOutput = {
      lca,
      up: Object.fromEntries(order.map((v) => [v, up.map((row) => row[col.get(v)!]!)])),
    };
    t.finish(input, output, {
      line: 9,
      vars: { u: null, v: null, k: null },
      note: `Answers: ${input.queries.map(([x, y], i) => `LCA(${x}, ${y}) = ${lca[i]}`).join("; ")}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: walk parent pointers.
    const { parent, order, depth } = rootTree(input.edges, input.root);
    const climb = (v: string, steps: number) => {
      let x = v;
      for (let s = 0; s < steps && parent[x] !== null; s++) x = parent[x]!;
      return x;
    };
    for (const [i, [a, b]] of input.queries.entries()) {
      const ancestors = new Set<string>();
      for (let x: string | null = a; x !== null; x = parent[x] ?? null) ancestors.add(x);
      let y = b;
      while (!ancestors.has(y)) y = parent[y]!;
      if (out.lca[i] !== y) return `LCA(${a}, ${b}) = ${out.lca[i]}, expected ${y}`;
    }
    const K = Math.max(1, Math.ceil(Math.log2(Math.max(...order.map((v) => depth[v]!)) + 1)));
    for (const v of order)
      for (let k = 0; k < K; k++)
        if (out.up[v]?.[k] !== climb(v, 2 ** k))
          return `up[${k}][${v}] = ${out.up[v]?.[k]}, expected ${climb(v, 2 ** k)}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.up;
    if (g?.kind !== "grid") return "no table up";
    const cols = g.colHeaders ?? [];
    for (const [c, v] of cols.entries())
      for (let k = 0; k < g.rows; k++)
        if (g.cells[k]![c] !== out.up[v]![k]) return `up[${k}][${v}] shows ${g.cells[k]![c]}`;
    return null;
  },

  describeOutput: (out) => `LCAs: ${out.lca.join(", ")}`,
};
