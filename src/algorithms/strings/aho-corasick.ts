import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { clamp } from "../inputs";

export interface AhoInput {
  patterns: string[];
  text: string;
}

export interface AhoOutput {
  /** Every occurrence, in the order the scan reports them. */
  matches: { word: string; start: number }[];
  /** Failure link of every non-root trie node, by prefix ("" is the root). */
  fail: Record<string, string>;
}

const MAX_PATTERNS = 5;
const MAX_PATTERN_LENGTH = 6;
const MAX_TEXT = 16;
const ROOT = "";
const nodeId = (prefix: string) => (prefix === ROOT ? "root" : `p-${prefix}`);
const show = (prefix: string) => (prefix === ROOT ? "·" : prefix);

const ahoInput: InputSpec<AhoInput> = {
  fields: [
    { name: "patterns", label: "Patterns", placeholder: "e.g. he, she, his, hers" },
    { name: "text", label: "Text", placeholder: "e.g. ushers" },
  ],
  constraints: `1–${MAX_PATTERNS} distinct patterns of 1–${MAX_PATTERN_LENGTH} letters; a text of 1–${MAX_TEXT} letters; lowercase a–z.`,
  parse(fields) {
    const patterns = (fields.patterns ?? "")
      .split(/[\s,;]+/)
      .map((w) => w.trim())
      .filter(Boolean);
    const text = (fields.text ?? "").trim();
    const errors: string[] = [];
    if (patterns.length === 0) errors.push("Enter at least one pattern");
    if (patterns.length > MAX_PATTERNS)
      errors.push(`${patterns.length} patterns; the limit is ${MAX_PATTERNS}`);
    for (const w of patterns)
      if (!/^[a-z]+$/.test(w) || w.length > MAX_PATTERN_LENGTH)
        errors.push(`"${w}": patterns are 1–${MAX_PATTERN_LENGTH} lowercase letters`);
    if (new Set(patterns).size !== patterns.length) errors.push("Patterns must be distinct");
    if (!/^[a-z]+$/.test(text) || text.length > MAX_TEXT)
      errors.push(`The text must be 1–${MAX_TEXT} lowercase letters`);
    return errors.length
      ? { ok: false, errors: errors.slice(0, 5) }
      : { ok: true, value: { patterns, text } };
  },
  format: (v) => ({ patterns: v.patterns.join(", "), text: v.text }),
  presets: [
    {
      id: "classic",
      label: "he, she, his, hers",
      value: { patterns: ["he", "she", "his", "hers"], text: "ushers" },
    },
    {
      id: "overlap",
      label: "Overlapping matches",
      value: { patterns: ["a", "aa", "aaa"], text: "aaaa" },
    },
    { id: "none", label: "No match", value: { patterns: ["xyz", "yy"], text: "xyxyx" } },
  ],
  random(rng, size) {
    const word = (n: number) => Array.from({ length: n }, () => "ab"[rng.int(0, 1)]).join("");
    const patterns = [...new Set(Array.from({ length: 3 }, () => word(rng.int(1, 3))))];
    return { patterns, text: word(clamp(size ?? 8, 1, MAX_TEXT)) };
  },
};

/**
 * Aho–Corasick: a trie of the patterns plus failure links (the longest proper suffix
 * of a node's string that is also a trie node), computed breadth-first. Scanning the
 * text then follows trie edges, falling back along failure links on a mismatch, and
 * reports every pattern ending at each position: O(text + total pattern length +
 * number of matches).
 */
export const ahoCorasick: AlgorithmModule<AhoInput, AhoOutput> = {
  id: "aho-corasick",
  version: 1,
  pseudocode: [
    "insert every pattern into a trie; mark the node where each one ends",
    "for each node v in breadth-first order (the root's children first)",
    "  every child of the root fails to the root",
    "  for each child w of v, reached by letter c: f ← fail[v];  while f ≠ root and f has no child c: f ← fail[f]",
    "    fail[w] ← child c of f if it exists, else the root;  out[w] ← out[w] ∪ out[fail[w]]",
    "scan: v ← root;  for each position i of the text, with letter c",
    "  while v ≠ root and v has no child c: v ← fail[v]",
    "  v ← child c of v if it exists, else the root",
    "  report every pattern in out[v] as ending at i",
  ],
  input: ahoInput,

  run(input, t) {
    const T = t.tree("T", {
      binary: false,
      label: "Trie with failure links (↪) and pattern ends (✓)",
    });
    const children = new Map<string, Map<string, string>>([[ROOT, new Map()]]);
    const ends = new Set(input.patterns);
    T.add("·", null, undefined, { line: 1 }, { id: nodeId(ROOT) });
    for (const word of input.patterns) {
      let prefix = ROOT;
      for (const c of word) {
        const next = prefix + c;
        const kids = children.get(prefix)!;
        if (!kids.has(next)) {
          const slot = [...kids.keys()].filter((k) => k < next).length;
          kids.set(next, next);
          children.set(next, new Map());
          // Keep children alphabetical so the drawing reads like a dictionary.
          const ordered = new Map([...kids].sort(([a], [b]) => (a < b ? -1 : 1)));
          children.set(prefix, ordered);
          T.add(
            c,
            nodeId(prefix),
            slot,
            { line: 1, vars: { pattern: word } },
            { id: nodeId(next) },
          );
        }
        prefix = next;
      }
      T.annotate(nodeId(prefix), "✓", { line: 1, note: `“${word}” ends here.` });
    }

    const Q = t.sequence("Q", "queue", { label: "Breadth-first queue" });
    const fail: Record<string, string> = {};
    const out = new Map<string, string[]>();
    const label = (p: string) =>
      [ends.has(p) ? "✓" : "", `↪${show(fail[p]!)}`].filter(Boolean).join(" ");
    out.set(ROOT, []);
    const queue: string[] = [];
    for (const w of children.get(ROOT)!.keys()) {
      fail[w] = ROOT;
      out.set(w, ends.has(w) ? [w] : []);
      T.annotate(nodeId(w), label(w), {
        line: 3,
        note: `“${w}” has no proper suffix in the trie: it fails to the root.`,
      });
      queue.push(w);
      Q.push(show(w), { line: 3 });
    }
    while (queue.length > 0) {
      const v = queue.shift()!;
      Q.pop({ line: 2, vars: { v: show(v) } });
      T.status(nodeId(v), "current", { line: 2 });
      for (const w of children.get(v)!.keys()) {
        const c = w[w.length - 1]!;
        let f = fail[v]!;
        while (f !== ROOT && !children.get(f)!.has(f + c)) {
          f = fail[f]!;
          t.tally("failure steps");
        }
        const target = children.get(f)!.has(f + c) ? f + c : ROOT;
        fail[w] = target;
        out.set(w, [...(ends.has(w) ? [w] : []), ...out.get(target)!]);
        T.annotate(nodeId(w), label(w), {
          line: 5,
          vars: { w: show(w) },
          note:
            target === ROOT
              ? `No proper suffix of “${w}” is in the trie: “${w}” fails to the root.`
              : `The longest proper suffix of “${w}” in the trie is “${target}”: on a mismatch after “${w}”, continue from there.${
                  out.get(target)!.length
                    ? ` Matches of ${out
                        .get(target)!
                        .map((x) => `“${x}”`)
                        .join(", ")} are inherited.`
                    : ""
                }`,
        });
        queue.push(w);
        Q.push(show(w), { line: 5 });
      }
      T.status(nodeId(v), "visited", { line: 2 });
    }

    const S = t.array("S", [...input.text] as Scalar[], { label: "Text", display: "cells" });
    const M = t.sequence("M", "queue", { label: "Matches (pattern@start)" });
    const matches: AhoOutput["matches"] = [];
    let v = ROOT;
    T.status(nodeId(ROOT), "current", { line: 6, vars: { v: "·", w: null } });
    for (let i = 0; i < input.text.length; i++) {
      const c = input.text[i]!;
      S.pointer("i", i, { line: 6, vars: { i } });
      while (v !== ROOT && !children.get(v)!.has(v + c)) {
        T.status(nodeId(v), "visited", { line: 7 });
        v = fail[v]!;
        t.tally("failure steps");
        T.status(nodeId(v), "current", {
          line: 7,
          note: `No “${c}” after this node: follow the failure link to “${show(v)}”.`,
        });
      }
      T.status(nodeId(v), "visited", { line: 8 });
      v = children.get(v)!.has(v + c) ? v + c : ROOT;
      T.status(nodeId(v), "current", { line: 8, vars: { v: show(v) } });
      for (const word of out.get(v)!) {
        const start = i - word.length + 1;
        matches.push({ word, start });
        S.mark(
          Array.from({ length: word.length }, (_, k) => start + k),
          "found",
          { line: 9 },
        );
        M.push(`${word}@${start}`, { line: 9, note: `“${word}” ends at position ${i}.` });
      }
    }
    S.pointer("i", null, { line: 9 });
    T.status(nodeId(v), "visited", { line: 9 });
    const output: AhoOutput = { matches, fail };
    t.finish(input, output, {
      vars: { i: null, v: null, pattern: null },
      note: `${matches.length} match${matches.length === 1 ? "" : "es"} in one pass over the text.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracles: naive search for matches; brute force for failure links.
    const want: string[] = [];
    for (const w of input.patterns)
      for (let s = 0; s + w.length <= input.text.length; s++)
        if (input.text.startsWith(w, s)) want.push(`${w}@${s}`);
    const got = out.matches.map((m) => `${m.word}@${m.start}`);
    if (JSON.stringify([...want].sort()) !== JSON.stringify([...got].sort()))
      return `matches ${got}, expected ${want}`;
    const prefixes = new Set(
      input.patterns.flatMap((w) => [...w].map((_, k) => w.slice(0, k + 1))),
    );
    for (const p of prefixes) {
      let best = ROOT;
      for (let k = 1; k < p.length; k++)
        if (prefixes.has(p.slice(k))) {
          best = p.slice(k);
          break;
        }
      if (out.fail[p] !== best) return `fail("${p}") = "${out.fail[p]}", expected "${best}"`;
    }
    return null;
  },

  fidelity(state: TraceState, out) {
    const tr = state.structures.T;
    if (tr?.kind !== "tree") return "no tree T";
    for (const [p, f] of Object.entries(out.fail))
      if (!tr.annotations[nodeId(p)]?.endsWith(`↪${show(f)}`))
        return `${p} shows ${tr.annotations[nodeId(p)]}`;
    return null;
  },

  describeOutput: (out) =>
    out.matches.length
      ? `Matches: ${out.matches.map((m) => `${m.word}@${m.start}`).join(", ")}`
      : "No matches",
};
