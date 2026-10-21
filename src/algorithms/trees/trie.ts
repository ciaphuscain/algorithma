import type { TreeStructure } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec, ParseResult } from "../types";
import { clamp } from "../inputs";

export interface TrieInput {
  words: string[];
  search: string[];
  prefixes: string[];
}

export interface TrieOutput {
  found: boolean[];
  prefixFound: boolean[];
  /** Nodes including the root: one per distinct prefix, plus one. */
  nodes: number;
}

function parseWords(text: string, label: string, min: number, max: number): ParseResult<string[]> {
  const words = text
    .split(/[\s,;]+/)
    .map((w) => w.trim())
    .filter(Boolean);
  const errors: string[] = [];
  for (const w of words) {
    if (!/^[a-z]{1,8}$/.test(w)) errors.push(`"${w}" must be 1–8 lowercase letters a–z`);
  }
  if (words.length < min) errors.push(`${label} needs at least ${min} word${min === 1 ? "" : "s"}`);
  if (words.length > max) errors.push(`${label} has ${words.length} words; the limit is ${max}`);
  return errors.length ? { ok: false, errors: errors.slice(0, 5) } : { ok: true, value: words };
}

const trieInput: InputSpec<TrieInput> = {
  fields: [
    { name: "words", label: "Words to insert", placeholder: "e.g. car, cart, care, cat, dog" },
    { name: "search", label: "Search for whole words", placeholder: "e.g. car, ca" },
    { name: "prefixes", label: "Check prefixes", placeholder: "e.g. ca, do, z" },
  ],
  constraints:
    "Up to 8 words to insert and 4 each to search and check; 1–8 lowercase letters each.",
  parse(fields) {
    const w = parseWords(fields.words ?? "", "Words", 1, 8);
    const s = parseWords(fields.search ?? "", "Search", 0, 4);
    const p = parseWords(fields.prefixes ?? "", "Prefixes", 0, 4);
    if (!w.ok || !s.ok || !p.ok)
      return { ok: false, errors: [w, s, p].flatMap((r) => (r.ok ? [] : r.errors)) };
    return { ok: true, value: { words: w.value, search: s.value, prefixes: p.value } };
  },
  format: (v) => ({
    words: v.words.join(", "),
    search: v.search.join(", "),
    prefixes: v.prefixes.join(", "),
  }),
  presets: [
    {
      id: "classic",
      label: "car, cart, care, cat, dog",
      value: {
        words: ["car", "cart", "care", "cat", "dog"],
        search: ["car", "ca", "dot"],
        prefixes: ["ca", "do", "z"],
      },
    },
    {
      id: "shared",
      label: "Shared prefixes",
      value: {
        words: ["in", "inn", "inside", "into", "tea", "ten"],
        search: ["ins", "into"],
        prefixes: ["ins", "te"],
      },
    },
  ],
  random(rng, size) {
    const letters = "abc";
    const word = () => Array.from({ length: rng.int(1, 4) }, () => letters[rng.int(0, 2)]).join("");
    const n = clamp(size ?? 5, 1, 8);
    const words = Array.from({ length: n }, word);
    return { words, search: [word(), words[0]!], prefixes: [word()] };
  },
};

export const trie: AlgorithmModule<TrieInput, TrieOutput> = {
  id: "trie",
  version: 1,
  pseudocode: [
    "procedure insert(word)",
    "  v ← root",
    "  for each character c of word",
    "    if v has no child for c: create one",
    "    v ← child(v, c)",
    "  mark v as the end of a word",
    "procedure find(word, prefixOnly)",
    "  v ← root;  for each character c: if v has no child for c, return false; v ← child(v, c)",
    "  return prefixOnly or v marks the end of a word",
  ],
  input: trieInput,

  run(input, t) {
    const T = t.tree("T", { binary: false, label: "Trie" });
    const root = T.add("·", null, undefined, { line: 2, note: "Start with an empty root." });
    const isEnd = new Set<string>();
    const touched = new Set<string>();
    const reset = (line: number) => {
      for (const id of touched) T.status(id, isEnd.has(id) ? "visited" : "unvisited", { line });
      touched.clear();
    };
    const childFor = (v: string, c: string) =>
      T.children(v).find((id) => id !== null && T.value(id) === c) ?? null;

    for (const word of input.words) {
      reset(1);
      t.step({ line: 1, vars: { op: "insert", word }, note: `Insert "${word}".` });
      let v = root;
      for (const [i, c] of [...word].entries()) {
        let next = childFor(v, c);
        if (next === null) {
          // Keep children in alphabetical order, as in a printed dictionary.
          const pos = T.children(v).filter((id) => id !== null && String(T.value(id)) < c).length;
          next = T.add(c, v, pos, {
            line: 4,
            vars: { c },
            note: `No branch for '${c}' after "${word.slice(0, i)}": create one.`,
          });
        } else {
          t.step({ line: 5, vars: { c }, note: `Follow the existing branch for '${c}'.` });
        }
        v = next;
        touched.add(v);
        T.status(v, "current", { line: 5 });
      }
      isEnd.add(v);
      T.annotate(v, "end", { line: 6, note: `Mark the node for "${word}" as the end of a word.` });
    }

    const find = (word: string, prefixOnly: boolean, line: number): boolean => {
      reset(line);
      t.step({
        line: 7,
        vars: { op: prefixOnly ? "prefix" : "search", word },
        note: `${prefixOnly ? "Is there a word starting with" : "Is the word"} "${word}"${prefixOnly ? "" : " present"}?`,
      });
      let v = root;
      for (const c of word) {
        const next = childFor(v, c);
        if (next === null) {
          t.step({ line: 8, vars: { c }, note: `No branch for '${c}': not found.` });
          return false;
        }
        v = next;
        touched.add(v);
        T.status(v, "path", { line: 8, vars: { c } });
      }
      const ok = prefixOnly || isEnd.has(v);
      t.step({
        line: 9,
        note: prefixOnly
          ? `Every character matched: "${word}" is a prefix of a stored word.`
          : ok
            ? `"${word}" ends at a marked node: found.`
            : `The path exists, but its last node is not marked as a word end: "${word}" was not inserted.`,
      });
      return ok;
    };

    const found = input.search.map((w) => find(w, false, 7));
    const prefixFound = input.prefixes.map((w) => find(w, true, 7));
    reset(9);
    const output: TrieOutput = { found, prefixFound, nodes: T.size };
    t.finish(input, output, {
      vars: { op: null, word: null, c: null },
      note: `The trie has ${T.size} nodes.`,
    });
    return output;
  },

  check(input, out) {
    const words = new Set(input.words);
    const prefixes = new Set<string>([""]);
    for (const w of words) for (let i = 1; i <= w.length; i++) prefixes.add(w.slice(0, i));
    const found = input.search.map((w) => words.has(w));
    const prefixFound = input.prefixes.map((p) => prefixes.has(p));
    if (JSON.stringify(found) !== JSON.stringify(out.found))
      return `search results ${out.found}, expected ${found}`;
    if (JSON.stringify(prefixFound) !== JSON.stringify(out.prefixFound))
      return `prefix results ${out.prefixFound}, expected ${prefixFound}`;
    if (out.nodes !== prefixes.size)
      return `${out.nodes} nodes, expected ${prefixes.size} (one per distinct prefix plus the root)`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T as TreeStructure | undefined;
    if (!T || T.kind !== "tree") return "no tree";
    if (Object.keys(T.nodes).length !== out.nodes) return "node count differs";
    // Children are kept in alphabetical order.
    for (const n of Object.values(T.nodes)) {
      const letters = n.children.map((c) => String(T.nodes[c!]!.value));
      if (letters.join() !== [...letters].sort().join())
        return "children are not in alphabetical order";
    }
    return null;
  },

  describeOutput: (o) =>
    `Search ${o.found.join(", ") || "—"}; prefixes ${o.prefixFound.join(", ") || "—"}; ${o.nodes} nodes`,
};
