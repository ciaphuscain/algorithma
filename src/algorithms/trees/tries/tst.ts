import type { TreeStructure } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../../types";
import {
  compareWordResults,
  wordInput,
  wordModel,
  wordOps,
  type WordOp,
  type WordResult,
} from "./words";

/** A ternary search tree as nested letters; `end` marks a node where a word ends. */
export interface TShape {
  ch: string;
  end: boolean;
  lo: TShape | null;
  eq: TShape | null;
  hi: TShape | null;
}

export interface TstOutput {
  results: WordResult[];
  tree: TShape | null;
  nodes: number;
}

/** "c(<a =a(=t*) >d)": letter, * at a word end, then the present children by branch. */
export function showTst(s: TShape | null): string {
  if (!s) return "∅";
  const kids = (["lo", "eq", "hi"] as const)
    .filter((k) => s[k])
    .map((k) => `${k === "lo" ? "<" : k === "eq" ? "=" : ">"}${showTst(s[k])}`);
  return `${s.ch}${s.end ? "*" : ""}${kids.length ? `(${kids.join(" ")})` : ""}`;
}

/** Independent recursive model (Bentley and Sedgewick's insert). */
export function tstModel(ops: WordOp[]): TShape | null {
  const insert = (n: TShape | null, w: string, i: number): TShape => {
    const c = w[i]!;
    const x = n ?? { ch: c, end: false, lo: null, eq: null, hi: null };
    if (c < x.ch) x.lo = insert(x.lo, w, i);
    else if (c > x.ch) x.hi = insert(x.hi, w, i);
    else if (i < w.length - 1) x.eq = insert(x.eq, w, i + 1);
    else x.end = true;
    return x;
  };
  let root: TShape | null = null;
  for (const op of ops) if (op.name === "insert") root = insert(root, op.word, 0);
  return root;
}

export function tstFromState(T: TreeStructure): TShape | null {
  const read = (id: string): TShape => {
    const n = T.nodes[id]!;
    const by = (label: string) => {
      const c = n.children.find((k) => T.nodes[k!]!.edgeLabel === label);
      return c ? read(c) : null;
    };
    return {
      ch: String(n.value),
      end: T.annotations[id] != null,
      lo: by("<"),
      eq: by("="),
      hi: by(">"),
    };
  };
  return T.root ? read(T.root) : null;
}

const input = wordInput({
  allow: ["insert", "search", "prefix"],
  presets: [
    {
      id: "classic",
      label: "Letters branch three ways",
      value: wordOps("+cat +cup +at +as +he +us +i ?cup ?cu ^cu ?it"),
    },
    {
      id: "order",
      label: "Sorted insertion order makes long < > chains",
      value: wordOps("+a +b +c +d +e ?e ^d"),
    },
    {
      id: "shared",
      label: "Shared prefixes share = paths",
      value: wordOps("+she +sells +sea +shells +by +the +shore ?shell ^shel"),
    },
  ],
});

interface XNode {
  id: string;
  ch: string;
  end: boolean;
  lo: XNode | null;
  eq: XNode | null;
  hi: XNode | null;
}

const LABEL = { lo: "<", eq: "=", hi: ">" } as const;

/**
 * A ternary search tree (Bentley and Sedgewick, 1997): a trie whose nodes each hold one
 * letter and three links — to letters smaller than it, to the next letter of words that
 * have it here, and to larger letters. Each node is a little binary search tree over the
 * alternatives at that position, so the structure uses far less space than a trie with
 * an array of 26 children per node, at the cost of a few extra comparisons.
 */
export const ternarySearchTree: AlgorithmModule<WordOp[], TstOutput> = {
  id: "ternary-search-tree",
  version: 1,
  pseudocode: [
    "x ← root; i ← 0  (c = letter i of the word)",
    "if c < x.letter: go to x's < child",
    "if c > x.letter: go to x's > child",
    "if c = x.letter: if c is the word's last letter, stop here; else i ← i + 1, go to x's = child",
    "insert: wherever a child is missing, create it with the current letter; mark the last node",
    "search: found if every letter matches and the last node is marked",
    "prefix: found if every letter matches",
  ],
  input,

  run(ops, t) {
    const T = t.tree("T", { binary: false, label: "Ternary search tree (< = > branches)" });
    let root: XNode | null = null;
    const touched = new Set<string>();
    const reset = (line: number) => {
      for (const id of touched) T.status(id, "unvisited", { line });
      touched.clear();
    };
    /** Create x's child on a branch, keeping children in < = > order. */
    const create = (x: XNode, side: "lo" | "eq" | "hi", ch: string): XNode => {
      const pos = side === "lo" ? 0 : side === "eq" ? (x.lo ? 1 : 0) : T.children(x.id).length;
      const n: XNode = { id: "", ch, end: false, lo: null, eq: null, hi: null };
      n.id = T.add(
        ch,
        x.id,
        pos,
        {
          line: 5,
          note: `No ${LABEL[side]} child: create one for '${ch}'.`,
        },
        { edgeLabel: LABEL[side] },
      );
      x[side] = n;
      return n;
    };

    const results: WordResult[] = [];
    for (const op of ops) {
      reset(1);
      const w = op.word;
      const inserting = op.name === "insert";
      t.step({
        line: 1,
        vars: { op: op.name, word: w, i: 0 },
        note:
          op.name === "prefix"
            ? `Is "${w}" a prefix of some stored word?`
            : `${inserting ? "Insert" : "Search for"} "${w}".`,
      });
      if (!root) {
        if (!inserting) {
          t.step({ line: 6, note: "The tree is empty." });
          results.push("missing");
          continue;
        }
        root = { id: "", ch: w[0]!, end: false, lo: null, eq: null, hi: null };
        root.id = T.add(w[0]!, null, undefined, {
          line: 5,
          note: `The tree is empty: '${w[0]}' becomes the root.`,
        });
      }
      let x: XNode | null = root;
      let i = 0;
      let reached: XNode | null = null;
      while (x) {
        const c = w[i]!;
        touched.add(x.id);
        T.status(x.id, "path", { line: 1, vars: { i } });
        const cmp = T.compare(x.id, c, { line: 2, note: `Compare '${c}' with '${x.ch}'.` });
        const side = cmp > 0 ? "lo" : cmp < 0 ? "hi" : "eq";
        if (side === "eq" && i === w.length - 1) {
          reached = x;
          break;
        }
        if (side === "eq") i++;
        const line = side === "lo" ? 2 : side === "hi" ? 3 : 4;
        let next: XNode | null = x[side];
        if (!next && inserting) next = create(x, side, w[i]!);
        if (!next) {
          t.step({ line, note: `No ${LABEL[side]} child: "${w}" is not here.` });
          break;
        }
        t.step({
          line,
          vars: { i },
          note:
            side === "eq"
              ? `'${c}' matches: move on to letter ${i + 1}, '${w[i]}', down the = branch.`
              : `'${c}' ${side === "lo" ? "<" : ">"} '${x.ch}': take the ${LABEL[side]} branch.`,
        });
        x = next;
      }
      if (inserting) {
        if (reached!.end) {
          t.step({ line: 5, note: `"${w}" is already stored.` });
          results.push("present");
        } else {
          reached!.end = true;
          T.annotate(reached!.id, w, { line: 5, note: `Mark the node for "${w}"'s last letter.` });
          results.push("inserted");
        }
        continue;
      }
      const ok = reached !== null && (op.name === "prefix" || reached.end);
      if (reached)
        t.step({
          line: op.name === "prefix" ? 7 : 6,
          note:
            op.name === "prefix"
              ? `Every letter of "${w}" matched: some word starts with it.`
              : ok
                ? `"${w}" ends at a marked node: found.`
                : `Every letter matched, but no word ends here: "${w}" is not stored.`,
        });
      results.push(ok ? "found" : "missing");
    }
    reset(1);
    const shape = (n: XNode | null): TShape | null =>
      n ? { ch: n.ch, end: n.end, lo: shape(n.lo), eq: shape(n.eq), hi: shape(n.hi) } : null;
    const output: TstOutput = { results, tree: shape(root), nodes: T.size };
    t.finish(ops, output, {
      vars: { op: null, word: null, i: null },
      note: `${T.size} nodes, one letter each.`,
    });
    return output;
  },

  check(ops, out) {
    const r = compareWordResults(ops, out.results, wordModel(ops).results);
    if (r) return r;
    const want = tstModel(ops);
    const count = (s: TShape | null): number =>
      s ? 1 + count(s.lo) + count(s.eq) + count(s.hi) : 0;
    if (out.nodes !== count(out.tree))
      return `${out.nodes} nodes reported, ${count(out.tree)} drawn`;
    return showTst(out.tree) === showTst(want)
      ? null
      : `tree ${showTst(out.tree)}, inserting in this order gives ${showTst(want)}`;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    return showTst(tstFromState(T)) === showTst(out.tree)
      ? null
      : "the drawn tree differs from the result";
  },

  describeOutput: (o) => `${o.results.join(", ")}; ${o.nodes} nodes: ${showTst(o.tree)}`,
};
