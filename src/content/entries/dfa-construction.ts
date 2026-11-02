import type { AlgorithmEntry } from "../types";

export const dfaConstructionEntry: AlgorithmEntry = {
  slug: "dfa-construction",
  name: "DFA Construction",
  aliases: ["Subset construction", "NFA to DFA", "Powerset construction"],
  curriculum: [339],
  domain: "compilers",
  subcategory: "Compiler Algorithms",
  difficulty: "intermediate",
  summary:
    "Converts a nondeterministic finite automaton (NFA) to an equivalent deterministic finite automaton (DFA) via the subset (powerset) construction, where each DFA state represents a set of NFA states.",
  tags: ["automata", "NFA", "DFA", "subset construction", "compilers"],
  prerequisites: ["Graphs"],
  related: [],
  problem: {
    input: "An NFA with states, alphabet, transition function, start state, and accept states.",
    output: "An equivalent DFA that accepts the same language.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "An NFA can be in multiple states at once (nondeterminism). A DFA must be in exactly one state. The subset construction resolves this by making each DFA state represent the *set* of NFA states the NFA could be in after reading the input so far.",
      },
      {
        kind: "p",
        text: "Starting from the set containing the NFA's start state (plus its epsilon-closure), we compute transitions for each input symbol by taking the union of NFA transitions from all states in the current set. Each new set becomes a new DFA state.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute the epsilon-closure of the NFA start state — this is the DFA start state.",
          "For each unprocessed DFA state (set of NFA states) and each input symbol, compute the set of NFA states reachable via that symbol (including epsilon-closures).",
          "If this set is new, add it as a new DFA state.",
          "A DFA state is accepting if it contains any NFA accept state.",
          "Repeat until no new states are generated.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example:** NFA with states {0,1,2}, alphabet {a,b}, transitions 0→a→{0,1}, 1→b→{2}, start=0, accept={2}. DFA: {0}→a→{0,1}, {0}→b→∅, {0,1}→a→{0,1}, {0,1}→b→{2}, {2}→a→∅, {2}→b→∅.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Represent each DFA state as a frozenset of NFA state indices for hashability.",
          "Use a BFS/worklist approach to explore reachable DFA states.",
          "The worst case is 2^n DFA states for an n-state NFA, but most practical NFAs produce far fewer.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Correctness:** By construction, the DFA state after reading string w is exactly the set of NFA states reachable from the start via w. Since a DFA state is accepting iff it contains an NFA accept state, the DFA accepts the same language.",
      },
      {
        kind: "p",
        text: "**Complexity:** O(2^n × |Σ|) in the worst case, where n is the number of NFA states and |Σ| is the alphabet size.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Hopcroft's algorithm can minimize the resulting DFA in O(n log n) time.",
          "The exponential blowup is unavoidable in general: there exist NFAs of size n whose minimal DFA has 2^n states.",
          "Lazy DFA construction builds states on demand, useful for regular expression matching.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n × |Σ|)",
      average: "O(2^n × |Σ|)",
      worst: "O(2^n × |Σ|)",
    },
    space: "O(2^n)",
    worstClass: "2^n",
    note: "n = number of NFA states, |Σ| = alphabet size.",
  },
  properties: [
    {
      label: "Input",
      value: "NFA (possibly with ε-transitions)",
    },
    {
      label: "Output",
      value: "Equivalent DFA",
    },
    {
      label: "Worst case",
      value: "Exponential in NFA state count",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "nfa_to_dfa",
      code: `def nfa_to_dfa(n_states, trans_list, start, accept, alphabet):
    """Subset construction. trans_list: list of [state, symbol, [targets]].
    Returns the number of DFA states."""
    transitions = {}
    for s, sym, targets in trans_list:
        transitions.setdefault((s, sym), set()).update(targets)
    def move(states, sym):
        result = set()
        for s in states:
            result |= transitions.get((s, sym), set())
        return frozenset(result)
    dfa_start = frozenset([start])
    worklist = [dfa_start]
    visited = {dfa_start}
    while worklist:
        current = worklist.pop()
        for sym in alphabet:
            nxt = move(current, sym)
            if nxt not in visited:
                visited.add(nxt)
                worklist.append(nxt)
    return len(visited)
`,
      tests: [
        {
          args: [
            3,
            [
              [0, "a", [0, 1]],
              [1, "b", [2]],
            ],
            0,
            [2],
            ["a", "b"],
          ],
          expected: 4,
        },
        {
          args: [
            2,
            [
              [0, "a", [1]],
              [1, "a", [0]],
            ],
            0,
            [1],
            ["a"],
          ],
          expected: 2,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "dfa-construction-worst",
      kind: "mcq",
      prompt: "What is the worst-case number of DFA states from an n-state NFA?",
      options: ["2^n", "n^2", "n!", "n × |Σ|"],
      answer: 0,
      explanation: "Each DFA state is a subset of NFA states, and there are 2^n subsets.",
      hints: ["Each DFA state is a set of NFA states."],
      objective: "Know the exponential blowup of subset construction",
    },
  ],
  exam: {
    definition:
      "Subset construction converts an NFA to a DFA by representing each DFA state as a set of NFA states.",
    steps: [
      "Start with ε-closure of NFA start state.",
      "For each DFA state and symbol, compute target set.",
      "New sets become new DFA states.",
      "DFA state is accepting if it intersects NFA accept states.",
    ],
    timeComplexity: "O(2^n × |Σ|) worst case",
    spaceComplexity: "O(2^n)",
    correctness:
      "The DFA simulates all NFA paths simultaneously; it accepts w iff some NFA path does.",
    applications: ["Compilers (lexer generation)", "Regular expression engines"],
    limitations: ["Exponential state blowup in worst case"],
    faq: [
      {
        q: "Can the blowup be avoided?",
        a: "No; there exist NFAs whose minimal DFA is exponentially larger.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Describe subset construction.", "State worst-case complexity."],
      },
    ],
  },
  references: [
    {
      citation:
        "J. E. Hopcroft, R. Motwani, J. D. Ullman, Introduction to Automata Theory, Languages, and Computation, 3rd ed., Pearson, 2006.",
      supports: "Subset construction and DFA minimization.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
