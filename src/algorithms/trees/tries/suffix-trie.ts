import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec, ParseResult } from "../../types";

export interface SuffixTrieInput {
  text: string;
  patterns: string[];
}

export interface SuffixTrieOutput {
  /** Start positions of each pattern in the text, in increasing order. */
  occurrences: number[][];
  /** Nodes including the root. */
  nodes: number;
}

const MAX_TEXT = 8;

function words(text: string, label: string, max: number, len: number): ParseResult<string[]> {
  const ws = text.split(/[\s,;]+/).filter(Boolean);
  const errors: string[] = [];
  for (const w of ws)
    if (!new RegExp(`^[a-z]{1,${len}}$`).test(w))
      errors.push(`"${w}" must be 1–${len} lowercase letters a–z`);
  if (ws.length > max) errors.push(`${label} has ${ws.length} entries; the limit is ${max}`);
  return errors.length ? { ok: false, errors } : { ok: true, value: ws };
}

const input: InputSpec<SuffixTrieInput> = {
  fields: [
    { name: "text", label: "Text", placeholder: "e.g. banana" },
    { name: "patterns", label: "Patterns to find", placeholder: "e.g. ana, nab, a" },
  ],
  constraints: `A text of 1–${MAX_TEXT} lowercase letters and up to 4 patterns of 1–${MAX_TEXT} letters.`,
  parse(f) {
    const t = words(f.text ?? "", "Text", 1, MAX_TEXT);
    const p = words(f.patterns ?? "", "Patterns", 4, MAX_TEXT);
    const errors = [t, p].flatMap((r) => (r.ok ? [] : r.errors));
    if (t.ok && t.value.length !== 1) errors.unshift("Give exactly one text");
    if (errors.length) return { ok: false, errors: errors.slice(0, 5) };
    return { ok: true, value: { text: t.ok ? t.value[0]! : "", patterns: p.ok ? p.value : [] } };
  },
  format: (v) => ({ text: v.text, patterns: v.patterns.join(", ") }),
  presets: [
    { id: "banana", label: "banana", value: { text: "banana", patterns: ["ana", "nab", "a"] } },
    {
      id: "abab",
      label: "Repeats share paths",
      value: { text: "ababab", patterns: ["abab", "ba"] },
    },
    {
      id: "distinct",
      label: "All letters different",
      value: { text: "abcd", patterns: ["bc", "db"] },
    },
  ],
  random(rng, size) {
    const n = Math.min(MAX_TEXT, Math.max(1, size ?? 6));
    const text = Array.from({ length: n }, () => "ab"[rng.int(0, 1)]).join("");
    const pat = () => {
      const i = rng.int(0, n - 1);
      return rng.int(0, 2) === 0
        ? Array.from({ length: rng.int(1, 3) }, () => "abc"[rng.int(0, 2)]).join("")
        : text.slice(i, rng.int(i + 1, n));
    };
    return { text, patterns: [pat(), pat()] };
  },
};

/**
 * A suffix trie: the plain (uncompressed) trie of every suffix of the text, each ending
 * with a terminator $ that occurs nowhere else, so every suffix ends at its own leaf. A
 * pattern occurs in the text exactly when it spells a path from the root, and the leaves
 * below that path give its start positions. Built here naively, one suffix at a time,
 * in O(n²) time and space — the reason suffix trees compress it.
 */
export const suffixTrie: AlgorithmModule<SuffixTrieInput, SuffixTrieOutput> = {
  id: "suffix-trie",
  version: 1,
  pseudocode: [
    "for i ← 0 … n: insert the suffix text[i…] + $ into the trie",
    "  follow existing letters from the root; create nodes for the rest",
    "  the $ leaf records the start position i",
    "find(p): follow p's letters from the root; if a letter is missing, p does not occur",
    "  otherwise every $ leaf below the node is a start position of p",
  ],
  input,

  run(input, t) {
    const T = t.tree("T", { binary: false, label: `Suffix trie of "${input.text}$"` });
    const root = T.add("·", null, undefined, { line: 1, note: "Start with an empty root." });
    const text = `${input.text}$`;
    const childFor = (v: string, c: string) => {
      const kids = T.children(v) as string[];
      if (kids.length) t.tally("comparisons");
      return kids.find((id) => T.value(id) === c) ?? null;
    };
    const leafStart = new Map<string, number>();
    const touched = new Set<string>();
    const reset = (line: number) => {
      for (const id of touched) T.status(id, "unvisited", { line });
      touched.clear();
    };

    for (let i = 0; i < text.length; i++) {
      reset(1);
      const suffix = text.slice(i);
      t.step({
        line: 1,
        vars: { i, suffix, pattern: null },
        note: `Insert suffix ${i}, "${suffix}".`,
      });
      let v = root;
      for (const c of suffix) {
        let next = childFor(v, c);
        if (next === null) {
          // Keep children sorted; $ sorts before the letters.
          const pos = (T.children(v) as string[]).filter((id) => String(T.value(id)) < c).length;
          next = T.add(c, v, pos, {
            line: 2,
            note: c === "$" ? `End suffix ${i} with its own $ leaf.` : `Create a node for '${c}'.`,
          });
        } else t.step({ line: 2, note: `'${c}' is already there: follow it.` });
        v = next;
        touched.add(v);
        T.status(v, "current", { line: 2 });
      }
      leafStart.set(v, i);
      T.annotate(v, String(i), { line: 3, note: `This leaf records start position ${i}.` });
    }
    reset(4);

    const leavesBelow = (v: string): string[] => {
      const kids = T.children(v) as string[];
      return kids.length ? kids.flatMap(leavesBelow) : [v];
    };
    const occurrences = input.patterns.map((p) => {
      reset(4);
      t.step({ line: 4, vars: { i: null, suffix: null, pattern: p }, note: `Find "${p}".` });
      let v = root;
      for (const c of p) {
        const next = childFor(v, c);
        if (next === null) {
          t.step({ line: 4, note: `No '${c}' here: "${p}" does not occur.` });
          return [];
        }
        v = next;
        touched.add(v);
        T.status(v, "path", { line: 4 });
      }
      const leaves = leavesBelow(v);
      for (const l of leaves) {
        touched.add(l);
        T.status(l, "highlight", { line: 5 });
      }
      const starts = leaves.map((l) => leafStart.get(l)!).sort((a, b) => a - b);
      t.step({
        line: 5,
        note: `${starts.length} leaf${starts.length === 1 ? "" : "ves"} below: "${p}" starts at ${starts.join(", ")}.`,
      });
      return starts;
    });
    reset(5);
    const output: SuffixTrieOutput = { occurrences, nodes: T.size };
    t.finish(input, output, {
      vars: { i: null, suffix: null, pattern: null },
      note: `${T.size} nodes for a text of ${input.text.length} letters.`,
    });
    return output;
  },

  check(input, out) {
    const text = input.text;
    const want = input.patterns.map((p) => {
      const at: number[] = [];
      for (let i = 0; i + p.length <= text.length; i++) if (text.startsWith(p, i)) at.push(i);
      return at;
    });
    if (JSON.stringify(want) !== JSON.stringify(out.occurrences))
      return `occurrences ${JSON.stringify(out.occurrences)}, expected ${JSON.stringify(want)}`;
    const subs = new Set<string>();
    const s = `${text}$`;
    for (let i = 0; i < s.length; i++)
      for (let j = i + 1; j <= s.length; j++) subs.add(s.slice(i, j));
    return out.nodes === subs.size + 1
      ? null
      : `${out.nodes} nodes, expected ${subs.size + 1} (one per distinct substring of the text with $, plus the root)`;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    if (Object.keys(T.nodes).length !== out.nodes) return "node count differs";
    const leaves = Object.entries(T.nodes)
      .filter(([, n]) => n.children.length === 0)
      .map(([id, n]) => (n.value === "$" ? Number(T.annotations[id]) : -1))
      .sort((a, b) => a - b);
    return leaves.every((v, i) => v === i) ? null : "the leaves are not one $ per suffix";
  },

  describeOutput: (o) =>
    `${o.occurrences.map((a) => (a.length ? a.join(" ") : "none")).join("; ") || "no patterns"}; ${o.nodes} nodes`,
};
