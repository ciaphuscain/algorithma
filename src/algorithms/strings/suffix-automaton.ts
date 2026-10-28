import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { wordInput } from "./common";

export interface SuffixAutomatonOutput {
  /** len[v]: the length of the longest string that reaches state v. */
  len: number[];
  /** link[v]: the suffix link (−1 for the start state). */
  link: number[];
  /** Transitions of each state, by letter. */
  next: Record<string, number>[];
  /** States that accept, i.e. end a suffix of s. */
  terminal: number[];
  /** Distinct non-empty substrings: the sum of len[v] − len[link[v]]. */
  distinct: number;
}

interface Automaton {
  len: number[];
  link: number[];
  next: Map<string, number>[];
  /** End of the first occurrence of each state's strings (for showing its longest string). */
  firstEnd: number[];
}

const stateId = (v: number) => `s${v}`;

/** The construction itself, without tracing; `on` receives each step for the trace. */
function build(s: string, on?: (step: Step, a: Automaton) => void): Automaton {
  const a: Automaton = { len: [0], link: [-1], next: [new Map()], firstEnd: [-1] };
  let last = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i]!;
    const cur = a.len.length;
    a.len.push(a.len[last]! + 1);
    a.link.push(-1);
    a.next.push(new Map());
    a.firstEnd.push(i);
    on?.({ kind: "new", i, c, state: cur }, a);
    let p = last;
    while (p !== -1 && !a.next[p]!.has(c)) {
      a.next[p]!.set(c, cur);
      on?.({ kind: "edge", from: p, c, to: cur, line: 5 }, a);
      p = a.link[p]!;
    }
    if (p === -1) {
      a.link[cur] = 0;
      on?.({ kind: "link", state: cur, to: 0, line: 6, why: "root" }, a);
    } else {
      const q = a.next[p]!.get(c)!;
      if (a.len[p]! + 1 === a.len[q]) {
        a.link[cur] = q;
        on?.({ kind: "link", state: cur, to: q, line: 8, why: "solid", p }, a);
      } else {
        const clone = a.len.length;
        a.len.push(a.len[p]! + 1);
        a.link.push(a.link[q]!);
        a.next.push(new Map(a.next[q]!));
        a.firstEnd.push(a.firstEnd[q]!);
        on?.({ kind: "clone", q, clone, p }, a);
        while (p !== -1 && a.next[p]!.get(c) === q) {
          a.next[p]!.set(c, clone);
          on?.({ kind: "edge", from: p, c, to: clone, line: 10 }, a);
          p = a.link[p]!;
        }
        a.link[q] = clone;
        a.link[cur] = clone;
        on?.({ kind: "relink", q, clone, cur }, a);
      }
    }
    last = cur;
  }
  return a;
}

type Step =
  | { kind: "new"; i: number; c: string; state: number }
  | { kind: "edge"; from: number; c: string; to: number; line: number }
  | { kind: "link"; state: number; to: number; line: number; why: "root" | "solid"; p?: number }
  | { kind: "clone"; q: number; clone: number; p: number }
  | { kind: "relink"; q: number; clone: number; cur: number };

/**
 * The suffix automaton (directed acyclic word graph): the smallest automaton that
 * accepts exactly the suffixes of s. Every substring of s is a path from the start
 * state, and states group substrings that end at the same set of positions. The
 * online construction adds one letter at a time, cloning a state when a group splits;
 * it has at most 2n − 1 states and runs in linear time for a fixed alphabet.
 */
export const suffixAutomaton: AlgorithmModule<string, SuffixAutomatonOutput> = {
  id: "suffix-automaton",
  version: 1,
  pseudocode: [
    "start with state 0: len 0, link −1;  last ← 0",
    "for each letter c of s: extend(c)",
    "procedure extend(c)",
    "  cur ← new state with len[cur] ← len[last] + 1;  p ← last",
    "  while p ≠ −1 and p has no transition on c: δ(p, c) ← cur;  p ← link[p]",
    "  if p = −1: link[cur] ← 0",
    "  else q ← δ(p, c)",
    "    if len[p] + 1 = len[q]: link[cur] ← q",
    "    else clone ← a copy of q (transitions and link) with len[clone] ← len[p] + 1",
    "      while p ≠ −1 and δ(p, c) = q: δ(p, c) ← clone;  p ← link[p]",
    "      link[q] ← clone;  link[cur] ← clone",
    "  last ← cur",
    "accepting states: last and every state on its suffix-link path",
  ],
  input: wordInput({
    label: "Text",
    minLength: 1,
    maxLength: 8,
    placeholder: "e.g. abcbc",
    randomAlphabet: "ab",
    presets: [
      { id: "classic", label: "abcbc (needs a clone)", value: "abcbc" },
      { id: "abab", label: "abbab", value: "abbab" },
      { id: "repeat", label: "aaaa (no clones)", value: "aaaa" },
    ],
  }),

  run(input, t) {
    const letters = [...new Set(input)].sort();
    // The table needs a fixed number of rows: one per state the construction creates.
    const states = build(input).len.length;
    const LEN = letters.length;
    const LINK = letters.length + 1;
    const G = t.grid("D", states, letters.length + 2, null, {
      label: "Transitions δ, len and suffix link of each state",
      rowHeaders: Array.from({ length: states }, (_, v) => `state ${v}`),
      colHeaders: [...letters.map((c) => `δ(·, ${c})`), "len", "link"],
    });
    const L = t.tree("L", {
      binary: false,
      label: "Suffix-link tree (each state shows its longest string)",
    });
    let a: Automaton = { len: [0], link: [-1], next: [new Map()], firstEnd: [-1] };
    const longest = (v: number) =>
      v === 0 ? "ε" : input.slice(a.firstEnd[v]! - a.len[v]! + 1, a.firstEnd[v]! + 1);
    const col = (c: string) => letters.indexOf(c);

    G.write(0, LEN, 0, { line: 1, vars: { last: 0 } });
    G.write(0, LINK, -1, { line: 1 });
    L.add(
      0,
      null,
      undefined,
      { line: 1, note: "State 0 is the start: it stands for the empty string." },
      { id: stateId(0) },
    );
    L.annotate(stateId(0), "ε", { line: 1 });
    let lastShown = 0;

    const touched = new Set<number>();
    const status = (v: number, s: "current" | "visited" | "highlight", line: number) => {
      touched.add(v);
      L.status(stateId(v), s, { line });
    };
    a = build(input, (step, partial) => {
      a = partial;
      switch (step.kind) {
        case "new": {
          for (const v of touched) L.status(stateId(v), "unvisited", { line: 2 });
          touched.clear();
          t.step({
            line: 2,
            vars: { i: step.i, c: step.c, last: lastShown, q: null, clone: null },
            note: `Add “${step.c}”: the automaton now has to accept the suffixes of “${input.slice(0, step.i + 1)}”.`,
          });
          G.write(step.state, LEN, step.i + 1, {
            line: 4,
            vars: { cur: step.state, p: lastShown },
            note: `New state ${step.state} for the whole prefix “${input.slice(0, step.i + 1)}” (len ${step.i + 1}).`,
          });
          break;
        }
        case "edge": {
          L.status(stateId(step.from), "current", { line: step.line, vars: { p: step.from } });
          touched.add(step.from);
          G.write(step.from, col(step.c), step.to, {
            line: step.line,
            note:
              step.line === 5
                ? `State ${step.from} had no “${step.c}” transition: point it at state ${step.to}.`
                : `State ${step.from} led to the old state on “${step.c}”: redirect it to the clone ${step.to}.`,
          });
          L.status(stateId(step.from), "visited", { line: step.line });
          break;
        }
        case "link": {
          G.write(step.state, LINK, step.to, {
            line: step.line,
            vars: { p: step.why === "root" ? -1 : step.p! },
            note:
              step.why === "root"
                ? `The walk fell off the start state: no shorter suffix repeats, so link ${step.state} to state 0.`
                : `len[${step.p}] + 1 = len[${step.to}]: state ${step.to} holds exactly the longest repeated suffix, so link to it.`,
          });
          L.add(
            step.state,
            stateId(step.to),
            undefined,
            { line: step.line },
            { id: stateId(step.state) },
          );
          L.annotate(stateId(step.state), longest(step.state), { line: step.line });
          status(step.state, "highlight", step.line);
          lastShown = step.state;
          break;
        }
        case "clone": {
          const { q, clone, p } = step;
          touched.add(q);
          L.status(stateId(q), "current", {
            line: 9,
            vars: { q, p },
            note: `len[${p}] + 1 = ${a.len[p]! + 1} but len[${q}] = ${a.len[q]}: state ${q} mixes strings that now end at different places. Split off the shorter ones into a clone.`,
          });
          for (const [c, to] of a.next[q]!) G.write(clone, col(c), to, { line: 9 });
          G.write(clone, LEN, a.len[clone]!, { line: 9, vars: { clone } });
          G.write(clone, LINK, a.link[clone]!, { line: 9 });
          L.add(clone, stateId(a.link[clone]!), undefined, { line: 9 }, { id: stateId(clone) });
          L.annotate(stateId(clone), longest(clone), { line: 9 });
          break;
        }
        case "relink": {
          const { q, clone, cur } = step;
          G.write(q, LINK, clone, { line: 11 });
          L.move(stateId(q), stateId(clone), undefined, {
            line: 11,
            note: `State ${q} now links to the clone ${clone}.`,
          });
          G.write(cur, LINK, clone, { line: 11 });
          L.add(cur, stateId(clone), undefined, { line: 11 }, { id: stateId(cur) });
          L.annotate(stateId(cur), longest(cur), { line: 11 });
          status(cur, "highlight", 11);
          lastShown = cur;
          break;
        }
      }
    });

    const terminal: number[] = [];
    for (let v = lastShown; v !== -1; v = a.link[v]!) terminal.push(v);
    for (const v of touched) L.status(stateId(v), "unvisited", { line: 13 });
    for (const v of terminal) L.status(stateId(v), "path", { line: 13 });
    G.mark(
      terminal.map((v) => [v, LEN] as [number, number]),
      "path",
      {
        line: 13,
        vars: { last: lastShown, p: null, q: null, clone: null, cur: null, c: null, i: null },
        note: `Accepting states (the suffixes of “${input}”): ${terminal.join(" → ")}.`,
      },
    );
    let distinct = 0;
    for (let v = 1; v < states; v++) distinct += a.len[v]! - a.len[a.link[v]!]!;
    const output: SuffixAutomatonOutput = {
      len: a.len,
      link: a.link,
      next: a.next.map((m) => Object.fromEntries([...m].sort())),
      terminal: [...terminal].sort((x, y) => x - y),
      distinct,
    };
    t.finish(input, output, {
      line: 13,
      note: `${states} states for ${input.length} letter${input.length === 1 ? "" : "s"}; ${distinct} distinct substrings, counted as the sum of len[v] − len[link[v]].`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: enumerate the automaton's language and compare it with the
    // substrings, then compare its states with the end-position classes.
    const n = input.length;
    const subs = new Set<string>([""]);
    for (let i = 0; i < n; i++) for (let j = i + 1; j <= n; j++) subs.add(input.slice(i, j));
    const reached = new Map<string, number>();
    const explore = (v: number, w: string): string | null => {
      if (w.length > n) return `the automaton accepts “${w}”, longer than s`;
      reached.set(w, v);
      for (const [c, to] of Object.entries(out.next[v] ?? {})) {
        const r = explore(to, w + c);
        if (r) return r;
      }
      return null;
    };
    const bad = explore(0, "");
    if (bad) return bad;
    if (reached.size !== subs.size || [...subs].some((w) => !reached.has(w)))
      return `the automaton's paths spell ${reached.size} strings; s has ${subs.size} substrings (with ε)`;
    const endpos = (w: string) => {
      const ends: number[] = [];
      for (let e = w.length - 1; e < n; e++)
        if (input.slice(e - w.length + 1, e + 1) === w) ends.push(e);
      return ends.join(",");
    };
    const classOf = new Map<string, number>();
    for (const [w, v] of reached) {
      const key = w === "" ? "ε" : endpos(w);
      if (classOf.has(key) && classOf.get(key) !== v)
        return `“${w}” is split from its end-position class`;
      classOf.set(key, v);
    }
    if (classOf.size !== out.len.length)
      return `${out.len.length} states, but ${classOf.size} classes`;
    for (let v = 0; v < out.len.length; v++) {
      const words = [...reached].filter(([, s]) => s === v).map(([w]) => w);
      const longestWord = words.reduce((x, y) => (y.length > x.length ? y : x), "");
      if (out.len[v] !== longestWord.length)
        return `len[${v}] = ${out.len[v]}, expected ${longestWord.length}`;
      if (v === 0) continue;
      const shortest = Math.min(...words.map((w) => w.length));
      const linkWord = longestWord.slice(longestWord.length - shortest + 1);
      if (out.link[v] !== reached.get(linkWord))
        return `link[${v}] = ${out.link[v]}, expected ${reached.get(linkWord)}`;
    }
    const suffixStates = new Set(
      Array.from({ length: n + 1 }, (_, k) => reached.get(input.slice(k))!),
    );
    if (JSON.stringify([...suffixStates].sort((x, y) => x - y)) !== JSON.stringify(out.terminal))
      return `accepting states ${out.terminal}, expected ${[...suffixStates]}`;
    if (out.distinct !== subs.size - 1)
      return `${out.distinct} distinct substrings, expected ${subs.size - 1}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.D;
    const tr = state.structures.L;
    if (g?.kind !== "grid" || tr?.kind !== "tree") return "missing the table or the link tree";
    const letters = [...new Set(out.next.flatMap((m) => Object.keys(m)))].sort();
    for (let v = 0; v < out.len.length; v++) {
      const row = g.cells[v]!;
      for (const [k, c] of letters.entries())
        if ((row[k] ?? undefined) !== out.next[v]![c]) return `row ${v}, ${c}`;
      if (row[letters.length] !== out.len[v] || row[letters.length + 1] !== out.link[v])
        return `row ${v} len/link`;
      for (const child of tr.nodes[stateId(v)]?.children ?? [])
        if (child !== null && out.link[Number(child.slice(1))] !== v)
          return `${child} drawn under ${v}`;
    }
    return null;
  },

  describeOutput: (out) => `${out.len.length} states; ${out.distinct} distinct substrings`,
};
