import type { TreeStructure } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../../types";
import {
  commonPrefix,
  compareWordResults,
  wordInput,
  wordModel,
  wordOps,
  type WordOp,
  type WordResult,
} from "./words";

/** A radix tree as nested labels; `end` marks a node where a word ends. */
export interface RShape {
  label: string;
  end: boolean;
  children: RShape[];
}

export interface RadixOutput {
  results: WordResult[];
  tree: RShape;
  splits: number;
  merges: number;
}

/** "ca(r*(e* t*) t*) dog*": label, * when a word ends there, children in brackets. */
export function showRadix(s: RShape): string {
  const inner = s.children.map(showRadix).join(" ");
  const self = `${s.label || "·"}${s.end ? "*" : ""}`;
  return inner ? `${self}(${inner})` : self;
}

/** The unique radix tree of a set of words, built directly from the sorted set. */
export function radixOf(words: string[]): RShape {
  const build = (strings: string[]): RShape[] => {
    const groups = new Map<string, string[]>();
    for (const s of [...strings].sort()) {
      if (!s) continue;
      groups.set(s[0]!, [...(groups.get(s[0]!) ?? []), s]);
    }
    return [...groups.values()].map((g) => {
      const lcp = g.reduce((p, s) => p.slice(0, commonPrefix(p, s)));
      return {
        label: lcp,
        end: g.includes(lcp),
        children: build(g.map((s) => s.slice(lcp.length))),
      };
    });
  };
  return { label: "", end: false, children: build(words) };
}

export function radixFromState(T: TreeStructure): RShape {
  const read = (id: string): RShape => {
    const n = T.nodes[id]!;
    return {
      label: id === T.root ? "" : String(n.value),
      end: T.annotations[id] != null,
      children: n.children.map((c) => read(c!)),
    };
  };
  return read(T.root!);
}

const input = wordInput({
  allow: ["insert", "delete", "search", "prefix"],
  presets: [
    {
      id: "split",
      label: "Inserting splits edges",
      value: wordOps("+romane +romanus +romulus +rubens +ruber +rubicon ?rom ^rom"),
    },
    {
      id: "delete",
      label: "Deleting merges a lone child back",
      value: wordOps("+car +cart +care +cat +dog -cart -car ?care ^ca -dog"),
    },
    {
      id: "nested",
      label: "A word inside another",
      value: wordOps("+test +tester +team +toast ?tes ^tes -test ?tester"),
    },
  ],
});

interface RNode {
  id: string;
  label: string;
  end: boolean;
  kids: RNode[];
  parent: RNode | null;
}

/**
 * A radix tree (compressed trie): a trie in which every chain of nodes with a single
 * child and no word ending is merged into one edge labelled with a string. Each node
 * shows the label of the edge that leads to it. Inserting may split an edge where the
 * new word leaves it; deleting may merge a node that is left with one child back into
 * that child. The shape depends only on the set of words, not on the order.
 */
export const radixTree: AlgorithmModule<WordOp[], RadixOutput> = {
  id: "radix-tree",
  version: 1,
  pseudocode: [
    "walk(w): from the root, follow the child whose label starts with w's next letter",
    "  while that child's whole label matches the next letters of w, consume them and go on",
    "insert w: walk; if w ends at a node: mark it as a word end",
    "  if no child starts with the next letter: add a leaf labelled with the rest of w",
    "  if the rest of w leaves a child's label part-way: split the edge at that point",
    "delete w: walk to w's node and unmark it; remove it if it has no children",
    "  merge any node (other than the root) left with one child and no word into that child",
    "search w: walk; found if w ends exactly at a marked node",
    "prefix p: walk; found if p runs out anywhere on the path, even inside a label",
  ],
  input,

  run(ops, t) {
    const T = t.tree("T", { binary: false, label: "Radix tree (each node shows its edge label)" });
    const root: RNode = { id: "", label: "", end: false, kids: [], parent: null };
    root.id = T.add("·", null, undefined, { line: 1, note: "Start with an empty root." });
    let splits = 0;
    let merges = 0;
    const touched = new Set<string>();
    const reset = (line: number) => {
      for (const id of touched) if (T.has(id)) T.status(id, "unvisited", { line });
      touched.clear();
    };
    const visit = (n: RNode, line: number, note?: string) => {
      touched.add(n.id);
      T.status(n.id, "path", { line, ...(note ? { note } : {}) });
    };
    const wordOf = (n: RNode): string => {
      let s = "";
      for (let x: RNode | null = n; x; x = x.parent) s = x.label + s;
      return s;
    };
    const childFor = (v: RNode, c: string) => {
      // Looking up the child by its first letter counts as one comparison.
      if (v.kids.length) t.tally("comparisons");
      return v.kids.find((k) => k.label[0] === c) ?? null;
    };
    /** Insert a node among v's children, keeping them sorted by first letter. */
    const addChild = (v: RNode, label: string, line: number, note: string): RNode => {
      const pos = v.kids.filter((k) => k.label < label).length;
      const n: RNode = { id: "", label, end: false, kids: [], parent: v };
      n.id = T.add(label, v.id, pos, { line, note });
      v.kids.splice(pos, 0, n);
      return n;
    };
    const markEnd = (n: RNode, end: boolean, line: number, note: string) => {
      n.end = end;
      T.annotate(n.id, end ? wordOf(n) : null, { line, note });
    };
    /** Merge v (no word, one child) into its child: the child's label grows. */
    const merge = (v: RNode, line: number) => {
      const c = v.kids[0]!;
      const p = v.parent!;
      c.label = v.label + c.label;
      c.parent = p;
      p.kids[p.kids.indexOf(v)] = c;
      T.set(c.id, c.label, {
        line,
        note: `"${v.label}" now has one child and no word: merge it into the child, whose label becomes "${c.label}".`,
      });
      T.splice(v.id, { line });
      touched.delete(v.id);
      merges++;
      t.tally("merges");
    };
    /**
     * Follow w from the root. Returns the node where w ends exactly, or where it stops,
     * with what is left of w and the child (if any) that matched only part-way.
     */
    const walk = (w: string, line: number) => {
      let v = root;
      let rest = w;
      visit(v, line);
      while (rest) {
        const c = childFor(v, rest[0]!);
        if (!c) return { v, rest, partial: null, k: 0 };
        const k = commonPrefix(c.label, rest);
        // Letters compared after the first: the matches, plus the mismatch if there is one.
        const more = (k < Math.min(c.label.length, rest.length) ? k + 1 : k) - 1;
        if (more > 0) t.tally("comparisons", more);
        if (k < c.label.length) return { v, rest, partial: c, k };
        rest = rest.slice(k);
        v = c;
        visit(v, 2, `"${c.label}" matches; ${rest ? `"${rest}" is left` : "nothing is left"}.`);
      }
      return { v, rest, partial: null, k: 0 };
    };

    const results: WordResult[] = [];
    for (const op of ops) {
      reset(1);
      const w = op.word;
      t.step({
        line: op.name === "insert" ? 3 : op.name === "delete" ? 6 : op.name === "search" ? 8 : 9,
        vars: { op: op.name, word: w },
        note:
          op.name === "prefix"
            ? `Is "${w}" a prefix of some stored word?`
            : `${op.name[0]!.toUpperCase()}${op.name.slice(1)} "${w}".`,
      });
      const { v, rest, partial, k } = walk(w, 1);

      if (op.name === "insert") {
        if (!rest) {
          if (v.end) {
            t.step({ line: 3, note: `"${w}" is already stored.` });
            results.push("present");
          } else {
            markEnd(v, true, 3, `"${w}" ends at an existing node: mark it as a word end.`);
            results.push("inserted");
          }
          continue;
        }
        if (!partial) {
          const leaf = addChild(
            v,
            rest,
            4,
            `No child starts with '${rest[0]}': add a leaf labelled "${rest}".`,
          );
          touched.add(leaf.id);
          markEnd(leaf, true, 4, `Mark "${w}".`);
          results.push("inserted");
          continue;
        }
        // Split partial's edge after k letters.
        splits++;
        t.tally("splits");
        const pos = v.kids.indexOf(partial);
        const mid: RNode = {
          id: "",
          label: partial.label.slice(0, k),
          end: false,
          kids: [],
          parent: v,
        };
        mid.id = T.add(mid.label, v.id, pos, {
          line: 5,
          note: `"${rest}" leaves "${partial.label}" after "${mid.label}": split the edge there.`,
        });
        v.kids[pos] = mid;
        T.move(partial.id, mid.id, 0, { line: 5 });
        partial.label = partial.label.slice(k);
        partial.parent = mid;
        mid.kids.push(partial);
        T.set(partial.id, partial.label, {
          line: 5,
          note: `The old child keeps the rest of its label, "${partial.label}".`,
        });
        touched.add(mid.id);
        if (k === rest.length) {
          markEnd(mid, true, 5, `"${w}" ends exactly at the split: mark the new node.`);
        } else {
          const leaf = addChild(
            mid,
            rest.slice(k),
            5,
            `Add a leaf for the rest of "${w}", "${rest.slice(k)}".`,
          );
          touched.add(leaf.id);
          markEnd(leaf, true, 5, `Mark "${w}".`);
        }
        results.push("inserted");
        continue;
      }

      if (op.name === "prefix") {
        const ok = !rest || (partial !== null && k === rest.length);
        if (ok && partial) visit(partial, 9);
        t.step({
          line: 9,
          note: ok
            ? `Every letter of "${w}" matched${partial ? `, ending inside "${partial.label}"` : ""}: some word starts with it.`
            : `"${w}" leaves the tree after "${w.slice(0, w.length - rest.length + k)}": no word starts with it.`,
        });
        results.push(ok ? "found" : "missing");
        continue;
      }

      const exact = !rest && v.end;
      if (op.name === "search" || !exact) {
        t.step({
          line: op.name === "search" ? 8 : 6,
          note: exact
            ? `"${w}" ends at a marked node: found.`
            : !rest
              ? `The path for "${w}" exists, but no word ends there.`
              : `"${w}" is not in the tree.`,
        });
        results.push(exact ? "found" : "missing");
        continue;
      }

      // Delete.
      markEnd(v, false, 6, `Unmark "${w}".`);
      if (v.kids.length === 0) {
        const p = v.parent!;
        p.kids.splice(p.kids.indexOf(v), 1);
        T.remove(v.id, { line: 6, note: `"${v.label}" has no children: remove it.` });
        touched.delete(v.id);
        if (p !== root && !p.end && p.kids.length === 1) merge(p, 7);
      } else if (v.kids.length === 1) merge(v, 7);
      results.push("deleted");
    }
    reset(1);
    const shape = (n: RNode): RShape => ({
      label: n.label,
      end: n.end,
      children: n.kids.map(shape),
    });
    const output: RadixOutput = { results, tree: shape(root), splits, merges };
    t.finish(ops, output, {
      vars: { op: null, word: null },
      note: `${T.size} nodes; ${splits} splits, ${merges} merges.`,
    });
    return output;
  },

  check(ops, out) {
    const want = wordModel(ops);
    const r = compareWordResults(ops, out.results, want.results);
    if (r) return r;
    const canonical = showRadix(radixOf(want.words));
    return showRadix(out.tree) === canonical
      ? null
      : `tree ${showRadix(out.tree)}, the radix tree of {${want.words}} is ${canonical}`;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    return showRadix(radixFromState(T)) === showRadix(out.tree)
      ? null
      : "the drawn tree differs from the result";
  },

  describeOutput: (o) =>
    `${o.results.join(", ")}; ${o.splits} splits, ${o.merges} merges: ${showRadix(o.tree)}`,
};
