import type { AlgorithmEntry } from "../types";

export const ahoCorasickEntry: AlgorithmEntry = {
  slug: "aho-corasick",
  name: "Aho–Corasick (Multiple Pattern Matching)",
  aliases: ["Aho-Corasick automaton", "Dictionary matching", "Multi-pattern search"],
  curriculum: [325],
  domain: "strings",
  subcategory: "Pattern matching",
  difficulty: "advanced",
  summary:
    "Finds every occurrence of many patterns in one pass over the text. The patterns go into a trie; failure links, computed breadth-first, say where to continue after a mismatch, like KMP's prefix function generalised to a set of words.",
  tags: ["multiple patterns", "trie", "failure links", "automaton", "dictionary matching"],
  prerequisites: ["Trie", "Knuth–Morris–Pratt", "Breadth-First Search"],
  related: ["kmp", "trie", "bfs"],
  problem: {
    input: "A set of patterns (total length m) and a text (length n).",
    output: "Every position where some pattern occurs in the text.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Searching for each pattern separately costs one pass per pattern. Instead, read the text once while walking down a trie of all the patterns. When the next letter has no edge, you do not restart: the letters you have just read end with some shorter string that is also in the trie, so you jump to it and try again. That jump is the **failure link**.",
      },
      {
        kind: "p",
        text: "Matches can hide inside other matches: after reading she you have also read he. Each node therefore also reports the patterns reachable through its failure links.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Insert every pattern into a trie and mark the node where each one ends.",
          "Failure links, breadth-first: the root's children fail to the root. For a child $w$ of $v$ by letter $c$, follow failure links from $fail(v)$ until a node with a $c$-child is found (or the root is reached); $fail(w)$ is that child, or the root.",
          "Outputs: $out(w)$ is the patterns ending at $w$ plus $out(fail(w))$.",
          "Scan: from the current node, follow failure links until the next letter has an edge (or the root is reached), take the edge if there is one, and report $out$ of the node reached.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): patterns he, she, his, hers; text ushers. Breadth-first, the failure links come out as h → root, s → root, he → root, hi → root, sh → h, her → root, his → s, she → he, hers → s. Because she fails to he, $out(she) = \\{she, he\\}$.",
      },
      {
        kind: "table",
        head: ["i", "Letter", "Moves", "Node", "Reported"],
        rows: [
          ["0", "u", "the root has no u-edge: stay", "root", "—"],
          ["1", "s", "root → s", "s", "—"],
          ["2", "h", "s → sh", "sh", "—"],
          ["3", "e", "sh → she", "she", "she at 1, he at 2"],
          ["4", "r", "she has no r-edge: fail to he; he → her", "her", "—"],
          ["5", "s", "her → hers", "hers", "hers at 2"],
        ],
      },
      {
        kind: "p",
        text: "One failure step in the whole scan, and three matches. A match's start is $i - |word| + 1$.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Compute failure links in breadth-first order: $fail(w)$ is shallower than $w$, so it is final before $w$ is processed.",
          "Store children in a hash map (sparse alphabets) or an array of size σ (fast, $O(m\\sigma)$ memory).",
          "Copying output lists can cost a lot when many patterns nest. The usual fix is a **dictionary link**: from each node, a pointer to the nearest node on its failure chain where a pattern ends. Reporting then costs $O(1)$ per match.",
          "Filling in the missing edges ($\\delta(v, c) = \\delta(fail(v), c)$) turns the trie into a full DFA: the scan never follows failure links, at the cost of σ entries per node.",
          "Duplicate patterns end at the same node; decide whether to report them once or once each.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Invariant.** After reading $text[0..i]$, the current node spells the longest suffix of $text[0..i]$ that is a prefix of some pattern. Every pattern ending at $i$ is a suffix of that string, so it is reported through the outputs inherited along failure links.",
      },
      {
        kind: "p",
        text: "**Scan cost.** Each letter makes the current depth grow by at most one; each failure step makes it shrink by at least one. Depth never goes below zero, so the scan takes at most $n$ failure steps. The same argument along each pattern bounds the construction by $m$ failure steps. With $z$ matches reported:",
      },
      { kind: "math", tex: "T = O(n + m + z) \\quad \\text{(constant-time edge lookups)}" },
      {
        kind: "p",
        text: "The property tests check that the failure steps counted in a run never exceed $n + m$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "With one pattern, the failure links are exactly KMP's prefix function, laid out along a single path.",
          "The original Unix fgrep was built on this algorithm; Aho and Corasick developed it for searching bibliographies.",
          "Commentz-Walter's algorithm combines the trie with Boyer–Moore-style skipping, which can be faster on long patterns; Wu–Manber hashes blocks of letters.",
          "Network intrusion detection and virus scanning match thousands of signatures at once with automata of this kind.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n + m)", average: "O(n + m + z)", worst: "O(n + m + z)" },
    space: "O(m)",
    worstClass: "n + m",
    note: "n = text length, m = total pattern length, z = number of matches; hash-map children.",
  },
  properties: [
    { label: "Passes over the text", value: "One" },
    { label: "Generalises", value: "KMP to a set of patterns" },
  ],
  implementations: [
    {
      language: "python",
      entry: "aho_corasick",
      code: `def aho_corasick(patterns, text):
    goto, fail, out = [{}], [0], [[]]
    for word in patterns:
        v = 0
        for c in word:
            if c not in goto[v]:
                goto.append({})
                fail.append(0)
                out.append([])
                goto[v][c] = len(goto) - 1
            v = goto[v][c]
        out[v].append(word)
    queue = list(goto[0].values())
    while queue:
        v = queue.pop(0)
        for c, w in goto[v].items():
            f = fail[v]
            while f and c not in goto[f]:
                f = fail[f]
            fail[w] = goto[f].get(c, 0)
            out[w] = out[w] + out[fail[w]]
            queue.append(w)
    found, v = [], 0
    for i, c in enumerate(text):
        while v and c not in goto[v]:
            v = fail[v]
        v = goto[v].get(c, 0)
        for word in out[v]:
            found.append([i - len(word) + 1, word])
    return sorted(found)
`,
      tests: [
        {
          args: [["he", "she", "his", "hers"], "ushers"],
          expected: [
            [1, "she"],
            [2, "he"],
            [2, "hers"],
          ],
        },
        {
          args: [["a", "aa"], "aaa"],
          expected: [
            [0, "a"],
            [0, "aa"],
            [1, "a"],
            [1, "aa"],
            [2, "a"],
          ],
        },
        { args: [["xyz"], "xyxy"], expected: [] },
      ],
    },
    {
      language: "javascript",
      entry: "countMatches",
      code: `function countMatches(patterns, text) {
  const next = [new Map()], fail = [0], hits = [0];
  for (const word of patterns) {
    let v = 0;
    for (const c of word) {
      if (!next[v].has(c)) {
        next.push(new Map()); fail.push(0); hits.push(0);
        next[v].set(c, next.length - 1);
      }
      v = next[v].get(c);
    }
    hits[v]++;
  }
  const queue = [...next[0].values()];
  while (queue.length) {
    const v = queue.shift();
    for (const [c, w] of next[v]) {
      let f = fail[v];
      while (f && !next[f].has(c)) f = fail[f];
      fail[w] = next[f].get(c) ?? 0;
      hits[w] += hits[fail[w]]; // patterns ending here as shorter suffixes
      queue.push(w);
    }
  }
  let v = 0, total = 0;
  for (const c of text) {
    while (v && !next[v].has(c)) v = fail[v];
    v = next[v].get(c) ?? 0;
    total += hits[v];
  }
  return total;
}
`,
      tests: [
        { args: [["he", "she", "his", "hers"], "ushers"], expected: 3 },
        { args: [["a", "aa", "aaa"], "aaaa"], expected: 9 },
      ],
    },
  ],
  visualizer: "aho-corasick",
  practice: [
    {
      id: "aho-fail",
      kind: "mcq",
      prompt: "In the trie of he, she, his, hers, where does the node she fail to?",
      options: ["he", "the root", "h", "hers"],
      answer: 0,
      explanation:
        "The proper suffixes of she are he and e. he is in the trie (e is not), so she fails to he.",
      distractors: {
        1: "The root is the fallback only when no proper suffix is in the trie.",
        2: "h is a suffix of sh, not of she.",
        3: "A failure link points to a proper suffix, so it is always shallower.",
      },
      hints: ["List the proper suffixes of she, longest first."],
      objective: "Compute a failure link",
    },
    {
      id: "aho-overlap",
      kind: "numeric",
      prompt:
        "How many matches does Aho–Corasick report for the patterns a, aa, aaa in the text aaaa?",
      answer: 9,
      explanation:
        "a occurs 4 times, aa 3 times and aaa twice: 4 + 3 + 2 = 9. Overlapping matches all count.",
      hints: ["Count each pattern's occurrences separately; overlaps are allowed."],
      objective: "Account for nested and overlapping matches",
    },
  ],
  exam: {
    definition:
      "Aho–Corasick builds a trie of the patterns with failure links (to the longest proper suffix that is also in the trie) and output sets, then scans the text once, reporting every occurrence of every pattern.",
    steps: [
      "Build the trie; mark pattern ends.",
      "BFS: fail(root's children) = root; fail(w) for w = v·c is found by following fail from fail(v) until a c-edge exists.",
      "out(w) = patterns ending at w ∪ out(fail(w)).",
      "Scan: follow fail on a mismatch, take the edge, report out(current).",
    ],
    timeComplexity: "$O(n + m + z)$.",
    spaceComplexity: "$O(m)$ nodes (times σ with array children).",
    correctness:
      "The current node is always the longest suffix of the text read so far that is a prefix of a pattern; every pattern ending here is on its failure chain.",
    applications: [
      "Dictionary and keyword search (fgrep)",
      "Intrusion detection signatures",
      "Spam and content filters",
      "DNA motif search",
    ],
    limitations: ["Memory grows with the alphabet when children are arrays", "Exact matching only"],
    faq: [
      {
        q: "How is it related to KMP?",
        a: "With a single pattern the trie is a path and the failure links are KMP's prefix function.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Trie + failure links + outputs; one pass.", "$O(n + m + z)$."] },
      {
        marks: 5,
        outline: [
          "Trie construction (1).",
          "Failure links by BFS (2).",
          "Scanning with outputs (1).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Problem and naive cost (1).",
          "Trie and failure-link definition (2).",
          "BFS construction (2).",
          "Worked example: he, she, his, hers on ushers (2).",
          "Invariant and amortised analysis (2).",
          "Relation to KMP (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "A. V. Aho, M. J. Corasick, “Efficient string matching: an aid to bibliographic search,” Communications of the ACM, 18(6), 1975.",
      supports: "The automaton, failure and output functions, and the linear-time bounds.",
    },
    {
      citation:
        "D. Gusfield, Algorithms on Strings, Trees, and Sequences, Cambridge University Press, 1997.",
      supports: "Exact matching with a set of patterns; the relation to KMP.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
