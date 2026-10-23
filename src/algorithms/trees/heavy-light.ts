import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { rootTree, treeQueryInput, type TreeQueryInput } from "./rooted";

export interface HeavyLightOutput {
  /** Sum of the vertex values on each queried path (both ends included). */
  sums: number[];
  /** Position of each vertex in the base array. */
  pos: Record<string, number>;
  /** Top vertex of each vertex's heavy chain. */
  head: Record<string, string>;
  /** How many contiguous ranges of the base array each query used. */
  ranges: number[];
}

/**
 * Heavy-light decomposition: every vertex continues the chain of its child with the
 * largest subtree. Numbering vertices depth-first, heavy child first, makes every
 * chain a contiguous block of the base array, and any path crosses O(log n) chains,
 * so a path query becomes O(log n) range queries (here prefix-sum lookups).
 */
export const heavyLight: AlgorithmModule<TreeQueryInput, HeavyLightOutput> = {
  id: "heavy-light",
  version: 1,
  pseudocode: [
    "procedure Decompose(tree, root)",
    "  size[v] ← 1 + the sizes of v's children   (children before parents)",
    "  heavy[v] ← the child of v with the largest subtree",
    "  number the vertices depth-first, heavy child first: pos[v] ← next;  head[v] ← head[parent] if v is heavy, else v",
    "  base[pos[v]] ← value[v];  prefix sums of base",
    "procedure PathSum(u, v)",
    "  while head[u] ≠ head[v]",
    "    if depth[head[u]] < depth[head[v]]: swap u and v",
    "    total += sum of base[pos[head[u]] .. pos[u]];  u ← parent[head[u]]",
    "  total += sum of base between pos[u] and pos[v]   // same chain now",
    "  return total",
  ],
  input: treeQueryInput({
    queryLabel: "Path queries",
    withValues: true,
    presets: [
      {
        id: "classic",
        label: "Twelve vertices, three paths",
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
          values: { A: 3, B: 1, C: 4, D: 1, E: 5, F: 9, G: 2, H: 6, I: 5, J: 3, K: 5, L: 8 },
          queries: [
            ["J", "D"],
            ["H", "L"],
            ["I", "G"],
          ],
        },
      },
      {
        id: "star",
        label: "A star (all light edges)",
        value: {
          edges: [
            ["A", "B"],
            ["A", "C"],
            ["A", "D"],
            ["A", "E"],
          ],
          root: "A",
          values: { A: 1, B: 2, C: 3, D: 4, E: 5 },
          queries: [
            ["B", "E"],
            ["C", "C"],
          ],
        },
      },
    ],
  }),

  run(input, t) {
    const tree = rootTree(input.edges, input.root);
    const { order, parent, depth, children } = tree;
    const values = input.values ?? {};
    const T = t.tree("T", {
      binary: false,
      label: "Tree (subtree size, then base-array position)",
    });
    for (const v of order) T.add(v, parent[v] ?? null, undefined, { line: 1 }, { id: v });

    const size: Record<string, number> = {};
    for (const v of [...order].reverse()) {
      size[v] = 1 + children[v]!.reduce((s, c) => s + size[c]!, 0);
      T.annotate(v, `sz=${size[v]}`, { line: 2, vars: { v } });
    }
    const heavy: Record<string, string | null> = {};
    for (const v of order) {
      let best: string | null = null;
      for (const c of children[v]!) if (best === null || size[c]! > size[best]!) best = c;
      heavy[v] = best;
    }
    t.step({
      line: 3,
      vars: { v: null },
      note: "Each vertex's heavy child is the one with the largest subtree (the first alphabetically on a tie).",
    });

    const n = order.length;
    const B = t.array(
      "B",
      order.map((): Scalar => null),
      { label: "base: vertex values in position order", display: "cells" },
    );
    const N = t.array(
      "N",
      order.map((): Scalar => null),
      { label: "vertex at each position", display: "cells" },
    );
    const pos: Record<string, number> = {};
    const head: Record<string, string> = {};
    let next = 0;
    const visit = (v: string, h: string) => {
      pos[v] = next++;
      head[v] = h;
      N.write(pos[v]!, v, { line: 4 });
      B.write(pos[v]!, values[v]!, { line: 4 });
      T.annotate(v, `#${pos[v]}`, { line: 4, vars: { v, head: h } });
      if (h === v) T.status(v, "highlight", { line: 4, note: `${v} starts a new chain.` });
      const hc = heavy[v];
      if (hc) visit(hc, h);
      for (const c of children[v]!) if (c !== hc) visit(c, c);
    };
    visit(input.root, input.root);

    const prefix = [0];
    for (let i = 0; i < n; i++) prefix.push(prefix[i]! + values[N.get(i) as string]!);
    const P = t.array("P", prefix, {
      label: "prefix sums of base (P[i] = sum of base[0 .. i − 1])",
      display: "cells",
    });
    t.step({
      line: 5,
      vars: { v: null, head: null },
      note: "Each chain is a contiguous block of the base array.",
    });
    const rangeSum = (l: number, r: number, line: number) => {
      P.read(r + 1, { line });
      P.read(l, { line });
      B.mark(
        Array.from({ length: r - l + 1 }, (_, k) => l + k),
        "found",
        {
          line,
          note: `base[${l} .. ${r}] = P[${r + 1}] − P[${l}] = ${prefix[r + 1]! - prefix[l]!}.`,
        },
      );
      return prefix[r + 1]! - prefix[l]!;
    };

    const sums: number[] = [];
    const ranges: number[] = [];
    for (const [a, b] of input.queries) {
      B.mark(
        Array.from({ length: n }, (_, i) => i),
        null,
        { line: 6 },
      );
      for (const v of order) T.status(v, head[v] === v ? "highlight" : "unvisited", { line: 6 });
      let u = a;
      let w = b;
      let total = 0;
      let used = 0;
      t.step({
        line: 6,
        vars: { u, v: w, total },
        note: `Sum of the values on the path ${a} … ${b}.`,
      });
      while (head[u] !== head[w]) {
        if (depth[head[u]!]! < depth[head[w]!]!) [u, w] = [w, u];
        const h = head[u]!;
        for (let x: string = u; ; x = parent[x]!) {
          T.status(x, "path", { line: 9 });
          if (x === h) break;
        }
        total += rangeSum(pos[h]!, pos[u]!, 9);
        used++;
        u = parent[h]!;
        t.step({
          line: 9,
          vars: { u, v: w, total },
          note: `Leave the chain of ${h}: continue from ${u}.`,
        });
      }
      const [l, r] = [Math.min(pos[u]!, pos[w]!), Math.max(pos[u]!, pos[w]!)];
      for (let i = l; i <= r; i++) T.status(N.get(i) as string, "path", { line: 10 });
      total += rangeSum(l, r, 10);
      used++;
      sums.push(total);
      ranges.push(used);
      t.step({
        line: 11,
        vars: { total },
        note: `Path ${a} … ${b}: total ${total}, from ${used} range${used === 1 ? "" : "s"} of the base array.`,
      });
    }
    const output: HeavyLightOutput = { sums, pos, head, ranges };
    t.finish(input, output, {
      line: 11,
      vars: { u: null, v: null, total: null },
      note: `Path sums: ${sums.join(", ")}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracles: path sums by walking parents; decomposition invariants.
    const { parent, depth, order, children } = rootTree(input.edges, input.root);
    const values = input.values ?? {};
    for (const [i, [a, b]] of input.queries.entries()) {
      let [u, w] = [a, b];
      let total = 0;
      while (u !== w) {
        if (depth[u]! >= depth[w]!) {
          total += values[u]!;
          u = parent[u]!;
        } else {
          total += values[w]!;
          w = parent[w]!;
        }
      }
      total += values[u]!;
      if (out.sums[i] !== total) return `path ${a}…${b}: ${out.sums[i]}, expected ${total}`;
    }
    const size: Record<string, number> = {};
    for (const v of [...order].reverse())
      size[v] = 1 + children[v]!.reduce((s, c) => s + size[c]!, 0);
    const positions = order.map((v) => out.pos[v]).sort((x, y) => x! - y!);
    if (JSON.stringify(positions) !== JSON.stringify(order.map((_, i) => i)))
      return "positions are not 0..n−1";
    for (const v of order) {
      const kids = children[v]!;
      if (kids.length === 0) continue;
      const largest = Math.max(...kids.map((c) => size[c]!));
      const heavy = kids.find((c) => size[c] === largest)!;
      if (out.pos[heavy] !== out.pos[v]! + 1 || out.head[heavy] !== out.head[v])
        return `${heavy} should continue ${v}'s chain`;
      for (const c of kids)
        if (c !== heavy && out.head[c] !== c) return `${c} should start a chain`;
    }
    // At most ⌊log₂ n⌋ light edges lie above any vertex, so at most that many chain
    // jumps on each side, plus the final range.
    const bound = 2 * Math.floor(Math.log2(order.length)) + 1;
    for (const r of out.ranges) if (r > bound) return `${r} ranges exceed 2⌊log₂ n⌋ + 1 = ${bound}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const names = state.structures.N;
    const tr = state.structures.T;
    if (names?.kind !== "array" || tr?.kind !== "tree") return "missing the base array or tree";
    for (const [v, p] of Object.entries(out.pos)) {
      if (names.values[p] !== v) return `position ${p} shows ${names.values[p]}`;
      if (tr.annotations[v] !== `#${p}`) return `${v} is annotated ${tr.annotations[v]}`;
    }
    return null;
  },

  describeOutput: (out) => `Path sums: ${out.sums.join(", ")}`,
};
