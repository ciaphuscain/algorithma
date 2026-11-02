import type { AlgorithmEntry } from "../types";

export const suffixAutomatonEntry: AlgorithmEntry = {
  slug: "suffix-automaton",
  name: "Suffix Automaton",
  aliases: ["DAWG", "Directed acyclic word graph", "Blumer automaton", "SAM"],
  curriculum: [318],
  domain: "strings",
  subcategory: "Suffix structures",
  difficulty: "advanced",
  summary:
    "The smallest deterministic automaton accepting the suffixes of s. Every substring is a path from the start state, and states group substrings that end at the same positions. It is built online, one letter at a time, cloning a state when a group splits; it has at most 2n − 1 states.",
  tags: ["suffix automaton", "dawg", "endpos", "suffix links", "distinct substrings"],
  prerequisites: ["Finite automata", "Suffix Tree"],
  related: ["suffix-tree", "suffix-array", "aho-corasick"],
  problem: {
    input: "A string s of length n.",
    output:
      "States with transitions δ, lengths len and suffix links link, such that the paths from state 0 spell exactly the substrings of s.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Take all substrings of s and group together those that end at exactly the same set of positions (their **endpos** set). In abcbc, the strings c and bc both end at positions 2 and 4, so they behave identically from here on: whatever letters can follow one can follow the other. Each group becomes one state. That is the whole automaton: a state per group, a transition per letter.",
      },
      {
        kind: "p",
        text: "A group is always a run of suffixes of its longest member, of consecutive lengths (bc, c). The **suffix link** points to the group of the next shorter suffix (here, the empty string's group, the start state). Adding a letter only touches the states along the suffix-link path from the last state, which is why the construction is fast.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with state 0 (the empty string): len 0, no suffix link. last = 0.",
          "To add letter c: create cur with $len = len[last] + 1$. Walk $p$ from last along suffix links, adding $\\delta(p, c) = cur$ while $p$ has no c-transition.",
          "If the walk falls off the start, $link[cur] = 0$.",
          "Otherwise let $q = \\delta(p, c)$. If $len[p] + 1 = len[q]$, set $link[cur] = q$.",
          "Otherwise $q$'s group must split: create a clone with $len[p] + 1$, q's transitions and q's link; redirect $\\delta(p, c) = q$ to the clone while walking further up the links; set $link[q] = link[cur] = clone$.",
          "Set last = cur. When all letters are added, the states on the suffix-link path from last accept (they hold the suffixes).",
        ],
      },
      { kind: "p", text: "**Worked example** (the first preset, s = abcbc)." },
      {
        kind: "table",
        head: ["Letter", "New state (len)", "Transitions to it", "Then", "Links set"],
        rows: [
          ["a", "1 (1)", "δ(0, a)", "fell off the start", "1 → 0"],
          ["b", "2 (2)", "δ(1, b), δ(0, b)", "fell off the start", "2 → 0"],
          ["c", "3 (3)", "δ(2, c), δ(0, c)", "fell off the start", "3 → 0"],
          [
            "b",
            "4 (4)",
            "δ(3, b)",
            "δ(0, b) = 2 but len 0 + 1 ≠ 2: clone 5 of state 2 (len 1); δ(0, b) ← 5",
            "2 → 5, 4 → 5, 5 → 0",
          ],
          [
            "c",
            "6 (5)",
            "δ(4, c)",
            "δ(5, c) = 3 but len 1 + 1 ≠ 3: clone 7 of state 3 (len 2); δ(5, c) ← 7, δ(0, c) ← 7",
            "3 → 7, 6 → 7, 7 → 0",
          ],
        ],
      },
      {
        kind: "p",
        text: "The result has 8 states. State 5 is the group {b} (ends at 1 and 3), state 7 is {bc, c} (ends at 2 and 4). The accepting states are 6, 7 and 0: abcbc, bcbc and cbc reach 6, bc and c reach 7, and the empty suffix is state 0. Counting $len[v] - len[link[v]]$ over all states gives 12 distinct substrings.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store transitions in a map per state, or an array of size σ for small alphabets; a clone copies its original's transitions.",
          "Allocate up to $2n$ states in advance: the bound is $2n - 1$ for $n \\ge 2$.",
          "To count occurrences of each substring, give every non-clone state a count of 1 and add counts up the suffix-link tree from the longest states down; a state's total is its $|endpos|$.",
          "To find the longest common substring of s and t, build the automaton of s and feed t through it, following suffix links on a mismatch (the JavaScript sample).",
          "The visualizer sizes its table with one row per state the construction will create; the rows fill in as states appear.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Groups are intervals.** If $u$ is a suffix of $w$ then $endpos(w) \\subseteq endpos(u)$. So a group consists of the suffixes of its longest string $w$ with lengths from $len[link] + 1$ to $len = |w|$, and it contains $len[v] - len[link[v]]$ strings. Summing over states counts each distinct substring once:",
      },
      {
        kind: "math",
        tex: "\\#\\text{distinct substrings} = \\sum_{v \\ne 0} \\big( len[v] - len[link[v]] \\big)",
      },
      {
        kind: "p",
        text: "**Size.** Blumer et al. proved at most $2n - 1$ states ($n \\ge 2$) and at most $3n - 4$ transitions ($n \\ge 3$). The property tests check both bounds on random strings, and check that the automaton's paths spell exactly the substrings, with one state per endpos group.",
      },
      {
        kind: "p",
        text: "**Time.** For a constant alphabet the online construction takes $O(n)$ in total; the amortised argument (in the references) bounds the walks up the suffix links across all letters.",
      },
      {
        kind: "p",
        text: "**Link tree.** The suffix links form a tree rooted at state 0, and it is the suffix tree of the reversed string. The visualizer draws it next to the transition table.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Blumer et al. (1985) introduced the structure as the directed acyclic word graph (DAWG); Crochemore (1986) studied the closely related suffix automaton and its use in pattern matching.",
          "It answers in linear time: number of distinct substrings, occurrences of a pattern, the k-th substring in lexicographic order, and the longest common substring of two strings.",
          "The compact DAWG merges chains of states, combining ideas from suffix trees and automata.",
          "Generalised suffix automata index a set of strings at once.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "Constant alphabet; with map transitions, O(n log σ).",
  },
  properties: [
    { label: "States", value: "At most 2n − 1 (n ≥ 2)" },
    { label: "Transitions", value: "At most 3n − 4 (n ≥ 3)" },
  ],
  implementations: [
    {
      language: "python",
      entry: "count_distinct",
      code: `def count_distinct(s):
    length, link, nxt = [0], [-1], [{}]
    last = 0
    for c in s:
        cur = len(length)
        length.append(length[last] + 1)
        link.append(-1)
        nxt.append({})
        p = last
        while p != -1 and c not in nxt[p]:
            nxt[p][c] = cur
            p = link[p]
        if p == -1:
            link[cur] = 0
        else:
            q = nxt[p][c]
            if length[p] + 1 == length[q]:
                link[cur] = q
            else:
                clone = len(length)
                length.append(length[p] + 1)
                link.append(link[q])
                nxt.append(dict(nxt[q]))
                while p != -1 and nxt[p].get(c) == q:
                    nxt[p][c] = clone
                    p = link[p]
                link[q] = link[cur] = clone
        last = cur
    return sum(length[v] - length[link[v]] for v in range(1, len(length)))
`,
      tests: [
        { args: ["abcbc"], expected: 12 },
        { args: ["banana"], expected: 15 },
        { args: ["aaaa"], expected: 4 },
      ],
    },
    {
      language: "javascript",
      entry: "longestCommonSubstring",
      code: `// Build the automaton of a, then walk b through it.
function longestCommonSubstring(a, b) {
  const len = [0], link = [-1], next = [new Map()];
  let last = 0;
  for (const c of a) {
    const cur = len.length;
    len.push(len[last] + 1); link.push(-1); next.push(new Map());
    let p = last;
    while (p !== -1 && !next[p].has(c)) { next[p].set(c, cur); p = link[p]; }
    if (p === -1) link[cur] = 0;
    else {
      const q = next[p].get(c);
      if (len[p] + 1 === len[q]) link[cur] = q;
      else {
        const clone = len.length;
        len.push(len[p] + 1); link.push(link[q]); next.push(new Map(next[q]));
        while (p !== -1 && next[p].get(c) === q) { next[p].set(c, clone); p = link[p]; }
        link[q] = link[cur] = clone;
      }
    }
    last = cur;
  }
  let v = 0, l = 0, best = 0;
  for (const c of b) {
    while (v !== 0 && !next[v].has(c)) { v = link[v]; l = len[v]; }
    if (next[v].has(c)) { v = next[v].get(c); l++; } else l = 0;
    best = Math.max(best, l);
  }
  return best;
}
`,
      tests: [
        { args: ["xabxac", "abcabxabcd"], expected: 4 },
        { args: ["banana", "ananas"], expected: 5 },
        { args: ["abc", "xyz"], expected: 0 },
      ],
    },
  ],
  visualizer: "suffix-automaton",
  practice: [
    {
      id: "sam-states",
      kind: "numeric",
      prompt: "How many states does the suffix automaton of aaaa have, counting the start state?",
      answer: 5,
      explanation:
        "Each of ε, a, aa, aaa, aaaa ends at a different set of positions, so each has its own state; no clone is ever needed.",
      hints: ["Compare the end positions of a and aa in aaaa."],
      objective: "Relate states to endpos groups",
    },
    {
      id: "sam-clone",
      kind: "mcq",
      prompt: "When does the construction create a clone?",
      options: [
        "When q = δ(p, c) exists but len[p] + 1 ≠ len[q]",
        "Whenever a state already has a transition on c",
        "When the walk falls off the start state",
        "After every letter",
      ],
      answer: 0,
      explanation:
        "Then q's group contains strings longer than len[p] + 1 that do not end at the new position, so the group splits: the shorter strings move to the clone.",
      distractors: {
        1: "If len[p] + 1 = len[q], the link simply goes to q.",
        2: "Then the new state links to state 0 and nothing is split.",
        3: "aaaa never needs a clone.",
      },
      hints: ["Which strings in q's group now end at the new position too?"],
      objective: "Understand state splitting",
    },
  ],
  exam: {
    definition:
      "The suffix automaton of s is the minimal DFA accepting the suffixes of s; its states are the endpos-equivalence classes of the substrings, linked by suffix links.",
    steps: [
      "cur ← new state, len = len[last] + 1.",
      "Walk p up suffix links from last, adding δ(p, c) = cur until p has a c-transition.",
      "None: link[cur] = 0. Else q = δ(p, c): if len[p] + 1 = len[q], link[cur] = q.",
      "Else clone q with len[p] + 1, redirect δ(·, c) = q to the clone up the links, link[q] = link[cur] = clone.",
      "last ← cur.",
    ],
    timeComplexity: "$O(n)$ for a constant alphabet.",
    spaceComplexity: "$O(n)$: at most $2n - 1$ states and $3n - 4$ transitions.",
    correctness:
      "Each state holds one endpos class, a run of suffixes of its longest string; the clone step keeps classes exact when a new letter splits one.",
    applications: [
      "Counting distinct substrings",
      "Longest common substring of two strings",
      "Occurrence counting and pattern search",
      "k-th lexicographic substring",
    ],
    limitations: [
      "Static once built (append-only)",
      "Transition maps cost memory for large alphabets",
    ],
    faq: [
      {
        q: "How does it relate to the suffix tree?",
        a: "Its suffix-link tree is the suffix tree of the reversed string.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Minimal DFA of the suffixes; states = endpos classes.",
          "Online $O(n)$; ≤ 2n − 1 states.",
        ],
      },
      {
        marks: 5,
        outline: [
          "endpos and suffix links (1).",
          "Extension with cloning (2).",
          "Example (1).",
          "Bounds (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "endpos classes and why they are intervals (2).",
          "Construction with the clone case (3).",
          "Worked example on abcbc (2).",
          "Size bounds and distinct-substring formula (2).",
          "An application such as longest common substring (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "A. Blumer, J. Blumer, D. Haussler, A. Ehrenfeucht, M. T. Chen, J. Seiferas, “The smallest automaton recognizing the subwords of a text,” Theoretical Computer Science, 40, 1985.",
      supports:
        "The automaton, its online linear-time construction, and the 2n − 1 and 3n − 4 bounds.",
    },
    {
      citation:
        "M. Crochemore, “Transducers and repetitions,” Theoretical Computer Science, 45, 1986.",
      supports: "The suffix automaton and its use in string matching.",
    },
    {
      citation:
        "M. Crochemore, C. Hancart, T. Lecroq, Algorithms on Strings, Cambridge University Press, 2007.",
      supports: "Textbook treatment of suffix automata alongside suffix trees and arrays.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
