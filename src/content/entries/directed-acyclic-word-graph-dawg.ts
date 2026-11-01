import type { AlgorithmEntry } from "../types";

export const directedAcyclicWordGraphDawgEntry: AlgorithmEntry = {
  slug: "directed-acyclic-word-graph-dawg",
  name: "DAWG (Directed Acyclic Word Graph)",
  aliases: ["Suffix Automaton", "DAWG"],
  curriculum: [319],
  domain: "strings",
  subcategory: "String Automata",
  difficulty: "intermediate",
  summary:
    "Builds a minimal automaton recognizing all suffixes of a string, enabling O(m) substring queries.",
  tags: ["suffix automaton", "DAWG", "substring search"],
  prerequisites: ["dfa-construction"],
  related: ["suffix-array-sa-is-linear-algorithm"],
  problem: {
    input: "A string S.",
    output: "A minimal automaton that accepts all suffixes of S.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The suffix automaton is the smallest DFA recognizing all suffixes. Each state represents an equivalence class of substrings that always appear together (endpos-equivalence).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with initial state.",
          "For each character, extend the automaton:",
          "  Create a new state for the longest suffix.",
          "  Follow suffix links to add transitions.",
          "  Split states if needed to maintain minimality.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Online construction: add characters one by one, maintaining suffix links (analogous to failure links in Aho-Corasick).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "At most $2n-1$ states and $3n-4$ transitions for a string of length $n$. Construction is $O(n)$.",
      },
    ],
    deeper: [
      {
        kind: "p",
        text: "The endpos set of a state is the set of ending positions of all occurrences. States form a tree via suffix links, which is the reverse of the suffix tree's edges.",
      },
    ],
  },
  complexity: {
    worstClass: "n",
    best: "$O(n)$",
    average: "$O(n)$",
    worst: "$O(n)$",
    space: "$O(n)$",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "dawg",
      code: `class State:
    def __init__(self):
        self.link = -1
        self.length = 0
        self.trans: dict[str, int] = {}

def build_suffix_automaton(s: str) -> list[State]:
    sa = [State()]
    sa[0].link = -1
    sa[0].length = 0
    last = 0
    for c in s:
        cur = len(sa)
        sa.append(State())
        sa[cur].length = sa[last].length + 1
        p = last
        while p != -1 and c not in sa[p].trans:
            sa[p].trans[c] = cur
            p = sa[p].link
        if p == -1:
            sa[cur].link = 0
        else:
            q = sa[p].trans[c]
            if sa[p].length + 1 == sa[q].length:
                sa[cur].link = q
            else:
                clone = len(sa)
                sa.append(State())
                sa[clone].length = sa[p].length + 1
                sa[clone].trans = dict(sa[q].trans)
                sa[clone].link = sa[q].link
                while p != -1 and sa[p].trans.get(c) == q:
                    sa[p].trans[c] = clone
                    p = sa[p].link
                sa[q].link = clone
                sa[cur].link = clone
        last = cur
    return sa

def count_distinct_substrings(s: str) -> int:
    sa = build_suffix_automaton(s)
    return sum(st.length - sa[st.link].length for st in sa[1:])
`,
      tests: [
        {
          args: ["abab"],
          expected: 7,
        },
        {
          args: ["aaa"],
          expected: 3,
        },
      ],
    },
    {
      language: "javascript",
      entry: "dawg",
      code: `function countDistinctSubstrings(s) {
  const sa = [{link: -1, len: 0, trans: {}}];
  let last = 0;
  for (const c of s) {
    const cur = sa.length;
    sa.push({link: -1, len: sa[last].len + 1, trans: {}});
    let p = last;
    while (p !== -1 && !(c in sa[p].trans)) { sa[p].trans[c] = cur; p = sa[p].link; }
    if (p === -1) { sa[cur].link = 0; }
    else {
      const q = sa[p].trans[c];
      if (sa[p].len + 1 === sa[q].len) { sa[cur].link = q; }
      else {
        const clone = sa.length;
        sa.push({link: sa[q].link, len: sa[p].len + 1, trans: {...sa[q].trans}});
        while (p !== -1 && sa[p].trans[c] === q) { sa[p].trans[c] = clone; p = sa[p].link; }
        sa[q].link = clone; sa[cur].link = clone;
      }
    }
    last = cur;
  }
  let count = 0;
  for (let i = 1; i < sa.length; i++) count += sa[i].len - sa[sa[i].link].len;
  return count;
}
`,
      tests: [
        {
          args: ["abab"],
          expected: 7,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "dawg-q1",
      kind: "mcq",
      prompt: "How many states can a suffix automaton have at most?",
      options: ["2n-1", "n^2", "n", "n log n"],
      answer: 0,
      explanation: "The suffix automaton of a length-n string has at most 2n-1 states.",
      hints: ["Linear bound."],
      objective: "State count",
    },
  ],
  exam: {
    definition: "The DAWG/suffix automaton is the minimal DFA accepting all suffixes of a string.",
    steps: [
      "Online construction extending one character at a time.",
      "Suffix links maintain equivalence classes.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Endpos-equivalence ensures minimality.",
    applications: ["Distinct substring counting", "longest common substring", "pattern matching"],
    limitations: ["Implementation complexity; suffix arrays are simpler for many tasks"],
    faq: [
      {
        q: "DAWG vs suffix tree?",
        a: "DAWG is the minimal DFA; suffix tree is larger but supports more queries directly.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Construction (2).", "Endpos equivalence (2).", "Applications (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "A. Blumer et al., 'The smallest automaton recognizing the subwords of a text', TCS, 1985.",
      supports: "Foundation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
