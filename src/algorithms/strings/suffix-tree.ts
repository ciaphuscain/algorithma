import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { wordInput } from "./common";

export interface SuffixTreeOutput {
  /** Leaf suffix starts in depth-first, alphabetical order: the suffix array of s$. */
  order: number[];
  /** All nodes, including the root and the leaves. */
  nodes: number;
  /** Distinct non-empty substrings of s: the edge-label lengths, not counting "$". */
  distinct: number;
}

const ROOT = "root";
const leafId = (i: number) => `leaf-${i}`;

/**
 * A suffix tree built the simple way: insert the suffixes of s$ one at a time,
 * longest first, walking down from the root and splitting an edge where the new
 * suffix leaves it. That costs O(n²); Ukkonen's algorithm (described in the lesson)
 * builds the same tree in O(n). Each node shows the label of the edge into it.
 */
export const suffixTree: AlgorithmModule<string, SuffixTreeOutput> = {
  id: "suffix-tree",
  version: 1,
  pseudocode: [
    "procedure SuffixTree(s)",
    "  append the terminator $ (it occurs nowhere else, so no suffix is a prefix of another)",
    "  for i ← 0 to n:  insert the suffix s[i..] starting from the root",
    "    v ← root;  rest ← s[i..]",
    "    while v has an edge starting with rest[0]",
    "      m ← the number of letters rest shares with that edge's label",
    "      if m = the label's length: v ← the edge's child;  rest ← rest[m..];  continue",
    "      split the edge after m letters: a new inner node u takes the first m letters",
    "      v ← u;  rest ← rest[m..];  stop walking",
    "    add a leaf for suffix i under v, labelled rest",
  ],
  input: wordInput({
    label: "Text",
    minLength: 1,
    maxLength: 8,
    placeholder: "e.g. banana",
    randomAlphabet: "ab",
    presets: [
      { id: "classic", label: "banana", value: "banana" },
      { id: "gusfield", label: "xabxac", value: "xabxac" },
      { id: "repeat", label: "aaaa", value: "aaaa" },
    ],
  }),

  run(input, t) {
    const s = `${input}$`;
    const T = t.tree("T", {
      binary: false,
      label: "Suffix tree of s$ (each node shows its edge's label)",
    });
    // Mirror of the drawing: node → [label, children ordered by first letter].
    const label = new Map<string, string>([[ROOT, ""]]);
    const kids = new Map<string, string[]>([[ROOT, []]]);
    T.add(
      "·",
      null,
      undefined,
      { line: 1, note: `Build the suffix tree of "${s}".` },
      { id: ROOT },
    );
    t.step({ line: 2, note: "The terminator $ makes every suffix end at its own leaf." });
    let inner = 0;
    const slotFor = (v: string, first: string) =>
      kids.get(v)!.filter((c) => label.get(c)![0]! < first).length;
    const attach = (v: string, id: string, text: string) => {
      const list = kids.get(v)!;
      list.splice(slotFor(v, text[0]!), 0, id);
      label.set(id, text);
      kids.set(id, kids.get(id) ?? []);
    };

    for (let i = 0; i < s.length; i++) {
      for (const id of label.keys()) if (id !== ROOT) T.status(id, "unvisited", { line: 3 });
      let v = ROOT;
      let rest = s.slice(i);
      T.status(ROOT, "current", { line: 4, vars: { i, rest } });
      for (;;) {
        const edge = kids.get(v)!.find((c) => label.get(c)![0] === rest[0]);
        if (edge === undefined) {
          t.step({ line: 5, note: `No edge from here starts with “${rest[0]}”.` });
          break;
        }
        const text = label.get(edge)!;
        let m = 0;
        while (m < text.length && text[m] === rest[m]) m++;
        t.tally("letter comparisons", Math.min(m + 1, text.length));
        if (m === text.length) {
          T.status(v, "visited", { line: 7 });
          v = edge;
          rest = rest.slice(m);
          T.status(v, "current", {
            line: 7,
            vars: { rest },
            note: `All of “${text}” matches: go down it; “${rest}” is left.`,
          });
          continue;
        }
        const u = `node-${inner++}`;
        const at = kids.get(v)!.indexOf(edge);
        kids.get(v)!.splice(at, 1);
        T.add(
          text.slice(0, m),
          v,
          at,
          {
            line: 8,
            vars: { m },
            note: `“${rest}” leaves the edge “${text}” after ${m} letter${m === 1 ? "" : "s"}: split it.`,
          },
          { id: u },
        );
        attach(v, u, text.slice(0, m));
        attach(u, edge, text.slice(m));
        T.move(edge, u, 0, { line: 8 });
        T.set(edge, text.slice(m), { line: 8 });
        T.status(v, "visited", { line: 9 });
        v = u;
        rest = rest.slice(m);
        T.status(v, "current", { line: 9, vars: { rest } });
        break;
      }
      const leaf = leafId(i);
      const slot = slotFor(v, rest[0]!);
      attach(v, leaf, rest);
      T.add(
        rest,
        v,
        slot,
        { line: 10, note: `Suffix ${i} (“${s.slice(i)}”) ends at a new leaf.` },
        { id: leaf },
      );
      T.annotate(leaf, `i=${i}`, { line: 10 });
      T.status(leaf, "highlight", { line: 10 });
      T.status(v, "visited", { line: 10 });
    }

    const order: number[] = [];
    const walk = (v: string) => {
      if (v.startsWith("leaf-")) order.push(Number(v.slice(5)));
      for (const c of kids.get(v)!) walk(c);
    };
    walk(ROOT);
    for (const id of label.keys()) T.status(id, "unvisited", { line: 10 });
    let total = 0;
    for (const [id, text] of label) if (id !== ROOT) total += text.length;
    const output: SuffixTreeOutput = { order, nodes: label.size, distinct: total - s.length };
    t.finish(input, output, {
      line: 10,
      vars: { i: null, rest: null, m: null },
      note: `${label.size} nodes. Reading the leaves left to right lists the suffixes in sorted order: ${order.join(", ")}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracles, by brute force over the substrings of s$.
    const s = `${input}$`;
    const want = Array.from({ length: s.length }, (_, i) => i).sort((a, b) =>
      s.slice(a) < s.slice(b) ? -1 : 1,
    );
    if (JSON.stringify(out.order) !== JSON.stringify(want))
      return `leaf order ${out.order}, expected ${want}`;
    const subs = new Set<string>();
    for (let i = 0; i < input.length; i++)
      for (let j = i + 1; j <= input.length; j++) subs.add(input.slice(i, j));
    if (out.distinct !== subs.size)
      return `${out.distinct} distinct substrings, expected ${subs.size}`;
    // Inner nodes: the non-empty substrings followed by two or more different letters.
    const next = new Map<string, Set<string>>();
    for (let i = 0; i < s.length; i++)
      for (let j = i + 1; j < s.length; j++) {
        const w = s.slice(i, j);
        if (!next.has(w)) next.set(w, new Set());
        next.get(w)!.add(s[j]!);
      }
    const branching = [...next.values()].filter((set) => set.size >= 2).length;
    const nodes = 1 + branching + s.length;
    if (out.nodes !== nodes) return `${out.nodes} nodes, expected ${nodes}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const tr = state.structures.T;
    if (tr?.kind !== "tree" || tr.root === null) return "no tree T";
    // Every root-to-leaf path must spell its leaf's suffix, in the reported order.
    const found: number[] = [];
    const spelled = new Map<number, string>();
    const walk = (id: string, path: string) => {
      const node = tr.nodes[id]!;
      const here = id === tr.root ? "" : path + String(node.value);
      const kids = node.children.filter((c): c is string => c !== null);
      if (kids.length === 0) {
        const start = Number(tr.annotations[id]?.slice(2));
        found.push(start);
        spelled.set(start, here);
      }
      for (const c of kids) walk(c, here);
    };
    walk(tr.root, "");
    if (JSON.stringify(found) !== JSON.stringify(out.order)) return `leaves read ${found}`;
    const whole = spelled.get(0) ?? "";
    for (const [start, p] of spelled)
      if (p !== whole.slice(start) || !p.endsWith("$")) return `leaf ${start} spells “${p}”`;
    return null;
  },

  describeOutput: (out) =>
    `${out.nodes} nodes; leaves in order ${out.order.join(", ")}; ${out.distinct} distinct substrings`,
};
