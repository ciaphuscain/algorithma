import type { TreeStructure } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import { compareResults, type Op } from "../../ops";
import type { AlgorithmModule } from "../../types";
import { ops, setInput, setModel, type SetResult } from "../balanced/common";

/** Keys are 0–99, written with BITS bits; bit 0 is the most significant. */
export const BITS = 7;

export const binary = (k: number) => k.toString(2).padStart(BITS, "0");
export const bitOf = (k: number, i: number) => (k >> (BITS - 1 - i)) & 1;

/** A Patricia trie: internal nodes test one bit (0 → first child, 1 → second); leaves hold keys. */
export type PShape = { bit: number; zero: PShape; one: PShape } | { key: number };

export interface PatriciaOutput {
  results: SetResult[];
  tree: PShape | null;
  bitTests: number;
}

export function showPatricia(s: PShape | null): string {
  if (!s) return "∅";
  return "key" in s ? String(s.key) : `[${s.bit}](${showPatricia(s.zero)} ${showPatricia(s.one)})`;
}

/** The unique Patricia trie of a set of keys: split at the first bit where they differ. */
export function patriciaOf(keys: number[]): PShape | null {
  const build = (ks: number[], from: number): PShape => {
    if (ks.length === 1) return { key: ks[0]! };
    let b = from;
    while (ks.every((k) => bitOf(k, b) === bitOf(ks[0]!, b))) b++;
    return {
      bit: b,
      zero: build(
        ks.filter((k) => bitOf(k, b) === 0),
        b + 1,
      ),
      one: build(
        ks.filter((k) => bitOf(k, b) === 1),
        b + 1,
      ),
    };
  };
  return keys.length
    ? build(
        [...keys].sort((a, b) => a - b),
        0,
      )
    : null;
}

export function patriciaFromState(T: TreeStructure): PShape | null {
  const read = (id: string): PShape => {
    const n = T.nodes[id]!;
    const v = String(n.value);
    if (v.startsWith("bit ")) {
      const [z, o] = n.children;
      return { bit: Number(v.slice(4)), zero: read(z!), one: read(o!) };
    }
    return { key: parseInt(v, 2) };
  };
  const top = T.nodes[T.root!]!.children[0];
  return top ? read(top) : null;
}

const input = setInput({
  presets: [
    {
      id: "build",
      label: "Each insert adds one bit test",
      value: ops("i19 i23 i82 i81 i40 i63 s82 s60"),
    },
    {
      id: "delete",
      label: "Deleting a key removes its bit test too",
      value: ops("i12 i13 i44 i45 i99 d13 d44 s12 s45"),
    },
    {
      id: "skip",
      label: "Keys that agree on many bits",
      value: ops("i64 i65 i67 i71 i79 s66 d65"),
    },
  ],
});

interface PNode {
  id: string;
  bit: number;
  key: number;
  kids: PNode[];
  parent: PNode | null;
}

/**
 * A Patricia trie (Morrison, 1968), in the form with separate leaves used by crit-bit
 * trees: a binary trie on the bits of the keys in which every node with one child is
 * skipped, so each internal node records which bit it tests. A search tests only those
 * bits and then compares the whole key once, at the leaf it reaches. Inserting adds one
 * leaf and one bit test at the first bit where the new key differs from its nearest
 * stored key; deleting removes both again. With n keys there are n − 1 bit tests.
 */
export const patriciaTrie: AlgorithmModule<Op[], PatriciaOutput> = {
  id: "patricia-trie",
  version: 1,
  pseudocode: [
    "descend(k): from the top, at each internal node test bit b of k: 0 → first child, 1 → second",
    "  stop at a leaf, then compare k with the leaf's key once",
    "insert k: descend; if the leaf holds k, stop",
    "  c ← the first bit where k and the leaf's key differ",
    "  descend again, stopping above the first node whose bit is greater than c (or a leaf)",
    "  put a new node testing bit c there; the old subtree and a new leaf for k are its children",
    "delete k: descend; if the leaf holds k, remove it; its sibling takes its parent's place",
    "search k: descend; found if the leaf holds k",
  ],
  input,

  run(list, t) {
    const T = t.tree("T", {
      binary: false,
      label: `Patricia trie on ${BITS}-bit keys (first child = 0, second = 1)`,
    });
    const headId = T.add("top", null, undefined, { line: 1 }, { view: true });
    // The placeholder above the trie: deletions and inserts at the top need a parent.
    const head: PNode = { id: headId, bit: -2, key: -1, kids: [], parent: null };
    let bitTests = 0;
    const touched = new Set<string>();
    const reset = (line: number) => {
      for (const id of touched) if (T.has(id)) T.status(id, "unvisited", { line });
      touched.clear();
    };
    const isLeaf = (n: PNode) => n.bit === -1;
    /** Descend from the top following k's bits; returns the leaf. */
    const descend = (k: number, line: number): PNode => {
      let x = head.kids[0]!;
      while (!isLeaf(x)) {
        const b = bitOf(k, x.bit);
        bitTests++;
        t.tally("bit tests");
        touched.add(x.id);
        T.status(x.id, "path", {
          line,
          vars: { bit: x.bit },
          note: `Bit ${x.bit} of ${binary(k)} is ${b}: go to the ${b ? "second" : "first"} child.`,
        });
        x = x.kids[b]!;
      }
      touched.add(x.id);
      T.status(x.id, "current", { line: 2 });
      return x;
    };
    const addLeaf = (k: number, parent: PNode, slot: number, line: number, note: string) => {
      const n: PNode = { id: "", bit: -1, key: k, kids: [], parent };
      n.id = T.add(binary(k), parent.id, slot, { line, note });
      T.annotate(n.id, String(k), { line });
      parent.kids.splice(slot, 0, n);
      touched.add(n.id);
      return n;
    };

    const results: SetResult[] = [];
    for (const op of list) {
      reset(1);
      const k = op.value!;
      const line = op.name === "insert" ? 3 : op.name === "delete" ? 7 : 8;
      t.step({
        line,
        vars: { op: op.name, key: k, bit: null },
        note: `${op.name[0]!.toUpperCase()}${op.name.slice(1)} ${k} = ${binary(k)}.`,
      });
      if (head.kids.length === 0) {
        if (op.name === "insert") {
          addLeaf(k, head, 0, 3, `The trie is empty: ${k} becomes its only leaf.`);
          results.push("inserted");
        } else {
          t.step({ line, note: "The trie is empty." });
          results.push("missing");
        }
        continue;
      }
      const leaf = descend(k, 1);
      const same = T.compare(leaf.id, binary(k), {
        line: 2,
        note: `Compare ${binary(k)} with the leaf ${binary(leaf.key)}.`,
      });
      if (op.name === "search") {
        t.step({ line: 8, note: same === 0 ? `${k} is stored: found.` : `${k} is not stored.` });
        results.push(same === 0 ? "found" : "missing");
        continue;
      }
      if (op.name === "delete") {
        if (same !== 0) {
          t.step({ line: 7, note: `${k} is not stored.` });
          results.push("missing");
          continue;
        }
        const p = leaf.parent!;
        p.kids.splice(p.kids.indexOf(leaf), 1);
        T.remove(leaf.id, { line: 7, note: `Remove the leaf ${k}.` });
        touched.delete(leaf.id);
        if (p !== head) {
          const sib = p.kids[0]!;
          const g = p.parent!;
          g.kids[g.kids.indexOf(p)] = sib;
          sib.parent = g;
          T.splice(p.id, {
            line: 7,
            note: `Bit ${p.bit} no longer separates anything: its other subtree takes its place.`,
          });
          touched.delete(p.id);
        }
        results.push("deleted");
        continue;
      }
      if (same === 0) {
        t.step({ line: 3, note: `${k} is already stored.` });
        results.push("present");
        continue;
      }
      const c = BITS - (k ^ leaf.key).toString(2).length;
      t.step({
        line: 4,
        vars: { bit: c },
        note: `${binary(k)} and ${binary(leaf.key)} first differ at bit ${c}.`,
      });
      let p = head;
      let y = head.kids[0]!;
      while (!isLeaf(y) && y.bit < c) {
        const b = bitOf(k, y.bit);
        bitTests++;
        t.tally("bit tests");
        T.status(y.id, "path", {
          line: 5,
          vars: { bit: y.bit },
          note: `Bit ${y.bit} < ${c}: follow bit ${y.bit} of ${k}, which is ${b}.`,
        });
        p = y;
        y = y.kids[b]!;
      }
      const pos = p.kids.indexOf(y);
      const n: PNode = { id: "", bit: c, key: -1, kids: [], parent: p };
      n.id = T.add(`bit ${c}`, p.id, pos, {
        line: 6,
        note: `Insert a test of bit ${c} here, above ${isLeaf(y) ? `the leaf ${y.key}` : `the test of bit ${y.bit}`}.`,
      });
      p.kids[pos] = n;
      touched.add(n.id);
      T.move(y.id, n.id, 0, { line: 6 });
      y.parent = n;
      n.kids.push(y);
      const side = bitOf(k, c);
      addLeaf(
        k,
        n,
        side,
        6,
        `Bit ${c} of ${k} is ${side}: the new leaf goes ${side ? "second" : "first"}, the old subtree ${side ? "first" : "second"}.`,
      );
      results.push("inserted");
    }
    reset(8);
    const shape = (n: PNode): PShape =>
      isLeaf(n) ? { key: n.key } : { bit: n.bit, zero: shape(n.kids[0]!), one: shape(n.kids[1]!) };
    const tree = head.kids[0] ? shape(head.kids[0]) : null;
    const output: PatriciaOutput = { results, tree, bitTests };
    const n = setModel(list).keys.length;
    t.finish(list, output, {
      vars: { op: null, key: null, bit: null },
      note: `${n} key${n === 1 ? "" : "s"} and ${Math.max(0, n - 1)} bit tests; ${bitTests} bits tested in all.`,
    });
    return output;
  },

  check(list, out) {
    const model = setModel(list);
    const r = compareResults(list, out.results, model.results);
    if (r) return r;
    const want = patriciaOf(model.keys);
    return showPatricia(out.tree) === showPatricia(want)
      ? null
      : `trie ${showPatricia(out.tree)}, the Patricia trie of these keys is ${showPatricia(want)}`;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    return showPatricia(patriciaFromState(T)) === showPatricia(out.tree)
      ? null
      : "the drawn trie differs from the result";
  },

  describeOutput: (o) =>
    `${o.results.join(", ")}; ${o.bitTests} bits tested: ${showPatricia(o.tree)}`,
};
