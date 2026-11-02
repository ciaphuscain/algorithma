import type { AlgorithmEntry } from "../types";

export const suffixTreeEntry: AlgorithmEntry = {
  slug: "suffix-tree",
  name: "Suffix Tree",
  aliases: [
    "Compressed suffix trie",
    "Ukkonen's algorithm",
    "Weiner's algorithm",
    "PATRICIA tree of suffixes",
  ],
  curriculum: [198],
  domain: "strings",
  subcategory: "Suffix structures",
  difficulty: "advanced",
  summary:
    "A compressed trie of all suffixes of s$: every path from the root spells a substring, and each leaf is one suffix. The visualizer inserts the suffixes one by one (O(n²)); Ukkonen's algorithm, in the Python sample, builds the same tree in O(n).",
  tags: ["suffix tree", "ukkonen", "compressed trie", "substring", "string indexing"],
  prerequisites: ["Trie", "Suffix Array (Prefix Doubling)"],
  related: ["suffix-array", "suffix-automaton", "trie"],
  problem: {
    input: "A string s (a terminator $ that occurs nowhere else is appended).",
    output:
      "A rooted tree whose root-to-leaf paths spell the suffixes of s$, with every inner node (except the root) having at least two children.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Put every suffix of banana$ into a trie and every substring of banana becomes a path from the root: a substring is a prefix of some suffix. A plain trie of suffixes has $O(n^2)$ nodes, though. Compress each chain of single-child nodes into one edge labelled with a substring, and only $O(n)$ nodes remain: at most $n + 1$ leaves (one per suffix of s$) and fewer inner nodes than leaves.",
      },
      {
        kind: "p",
        text: "The terminator $ matters: without it, the suffix a of banana would end in the middle of the edge for ana and have no leaf of its own.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Append $ to s.",
          "For each suffix, longest first, walk down from the root as far as it matches.",
          "If it stops at a node, hang a new leaf there labelled with the rest of the suffix.",
          "If it stops inside an edge, split the edge: a new inner node takes the matched part, the old child keeps the rest, and the new leaf hangs from the inner node.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset, banana$; suffix $i$ starts at position $i$).",
      },
      {
        kind: "table",
        head: ["i", "Suffix", "Walk", "Change"],
        rows: [
          ["0", "banana$", "the root has no b-edge", "new leaf banana$"],
          ["1", "anana$", "no a-edge", "new leaf anana$"],
          ["2", "nana$", "no n-edge", "new leaf nana$"],
          [
            "3",
            "ana$",
            "anana$ matches ana, then n ≠ $",
            "split: ana → {na$ (leaf 1), $ (leaf 3)}",
          ],
          ["4", "na$", "nana$ matches na, then n ≠ $", "split: na → {na$ (leaf 2), $ (leaf 4)}"],
          ["5", "a$", "ana matches a, then n ≠ $", "split: a → {$ (leaf 5), na → …}"],
          ["6", "$", "no $-edge", "new leaf $"],
        ],
      },
      {
        kind: "p",
        text: "The result has 11 nodes: the root, three inner nodes (a, ana, na) and seven leaves. Reading the leaves left to right, with $ sorting first, gives 6, 5, 3, 1, 0, 4, 2: the suffix array of banana$. The inner node ana is the deepest, so ana is the longest substring occurring twice.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store an edge label as two indices (start, end) into s, never as a copied string, or the labels alone take $O(n^2)$ space.",
          "Children: a hash map per node, or an array of size σ for small alphabets.",
          "The visualizer copies labels for readability and inserts suffixes naively: $O(n^2)$ time in the worst case (e.g. aaaa…a).",
          "Ukkonen's algorithm (the Python sample) is notoriously fiddly. Test it against the naive construction, or brute force, on many random strings.",
          "A **generalised** suffix tree indexes several strings at once, each with its own terminator.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Size.** s$ has $n + 1$ suffixes and, since $ is unique, no suffix is a prefix of another, so there are exactly $n + 1$ leaves. Every inner node other than the root has at least two children, so there are at most $n$ inner nodes:",
      },
      { kind: "math", tex: "\\text{nodes} \\le 1 + n + (n + 1) = 2n + 2" },
      {
        kind: "p",
        text: "**Inner nodes** are exactly the right-branching substrings: those followed by at least two different letters somewhere in s$. The tests count these by brute force and compare.",
      },
      {
        kind: "p",
        text: "**Distinct substrings** are the points along the edges, not counting $: $\\sum_{\\text{edges}} |label| - (n + 1)$. For banana that is $22 - 7 = 15$.",
      },
      {
        kind: "p",
        text: "**Ukkonen in $O(n)$.** The tree is built online for s[0..i], one letter (phase) at a time. Three ideas make each phase amortised constant: leaf edges end at a shared, growing end index (“once a leaf, always a leaf”), so extending every leaf is free; suffix links jump from the inner node for $x\\alpha$ to the one for $\\alpha$, so the next extension does not walk from the root; and walking down an edge skips by its length instead of letter by letter. A phase stops at the first suffix that is already present, because every shorter one is then present too.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Weiner (1973) gave the first linear-time construction, McCreight (1976) a more space-economical one, and Ukkonen (1995) the online, left-to-right version.",
          "Farach's algorithm (1997) builds suffix trees in linear time for integer alphabets.",
          "With a generalised suffix tree, the longest common substring of two strings is the deepest inner node with leaves from both.",
          "In practice suffix arrays with LCP arrays, or compressed FM-indexes, have largely replaced suffix trees because they need several times less memory.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "Ukkonen's algorithm, constant alphabet. The naive insertion shown in the visualizer is O(n²).",
  },
  properties: [
    { label: "Nodes", value: "At most 2n + 2 (n + 1 leaves)" },
    { label: "Substring search", value: "O(m) for a pattern of length m" },
  ],
  implementations: [
    {
      language: "python",
      entry: "distinct_substrings",
      code: `def distinct_substrings(s):
    # Ukkonen's algorithm on s + "$"; the answer is the total
    # edge length, minus one "$" per leaf.
    text = s + "$"
    start, end, link, kids = [-1], [-1], [0], [{}]
    leaf_end = 0

    def node(a, b):
        start.append(a)
        end.append(b)
        link.append(0)
        kids.append({})
        return len(start) - 1

    def length(v):
        return (leaf_end if end[v] is None else end[v]) - start[v] + 1

    active, edge, depth, remainder = 0, 0, 0, 0
    for i, c in enumerate(text):
        leaf_end = i            # every leaf grows by one letter for free
        remainder += 1
        last = None
        while remainder:
            if depth == 0:
                edge = i
            if text[edge] not in kids[active]:
                kids[active][text[edge]] = node(i, None)
                if last is not None:
                    link[last], last = active, None
            else:
                nxt = kids[active][text[edge]]
                if depth >= length(nxt):        # skip down by edge length
                    edge, depth, active = edge + length(nxt), depth - length(nxt), nxt
                    continue
                if text[start[nxt] + depth] == c:   # already present: end phase
                    if last is not None and active != 0:
                        link[last], last = active, None
                    depth += 1
                    break
                split = node(start[nxt], start[nxt] + depth - 1)
                kids[active][text[edge]] = split
                kids[split][c] = node(i, None)
                start[nxt] += depth
                kids[split][text[start[nxt]]] = nxt
                if last is not None:
                    link[last] = split
                last = split
            remainder -= 1
            if active == 0 and depth > 0:
                depth -= 1
                edge = i - remainder + 1
            elif active != 0:
                active = link[active]       # follow the suffix link
    leaves = sum(1 for v in range(1, len(start)) if end[v] is None)
    return sum(length(v) for v in range(1, len(start))) - leaves
`,
      tests: [
        { args: ["banana"], expected: 15 },
        { args: ["xabxac"], expected: 18 },
        { args: ["mississippi"], expected: 53 },
        { args: ["aaaa"], expected: 4 },
      ],
    },
    {
      language: "javascript",
      entry: "longestRepeated",
      code: `// Insert the suffixes of s$ one by one (O(n²)); the deepest inner
// node spells the longest substring that occurs at least twice.
function longestRepeated(s) {
  const text = s + "$";
  const root = { label: "", kids: new Map() };
  for (let i = 0; i < text.length; i++) {
    let v = root, rest = text.slice(i);
    for (;;) {
      const child = v.kids.get(rest[0]);
      if (!child) { v.kids.set(rest[0], { label: rest, kids: new Map() }); break; }
      let m = 0;
      while (m < child.label.length && child.label[m] === rest[m]) m++;
      if (m === child.label.length) { v = child; rest = rest.slice(m); continue; }
      const mid = { label: child.label.slice(0, m), kids: new Map() };
      child.label = child.label.slice(m);
      mid.kids.set(child.label[0], child);
      mid.kids.set(rest[m], { label: rest.slice(m), kids: new Map() });
      v.kids.set(mid.label[0], mid);
      break;
    }
  }
  let best = "";
  const walk = (v, path) => {
    if (v.kids.size === 0) return;
    if (path.length > best.length) best = path;
    for (const c of [...v.kids.keys()].sort()) walk(v.kids.get(c), path + v.kids.get(c).label);
  };
  walk(root, "");
  return best;
}
`,
      tests: [
        { args: ["banana"], expected: "ana" },
        { args: ["mississippi"], expected: "issi" },
        { args: ["abcd"], expected: "" },
      ],
    },
  ],
  visualizer: "suffix-tree",
  practice: [
    {
      id: "suffix-tree-nodes",
      kind: "numeric",
      prompt:
        "How many nodes does the suffix tree of banana$ have, counting the root and the leaves?",
      answer: 11,
      explanation:
        "Seven leaves (one per suffix of banana$), three inner nodes (a, ana, na) and the root.",
      hints: ["Inner nodes are the substrings followed by two or more different letters."],
      objective: "Count the parts of a suffix tree",
    },
    {
      id: "suffix-tree-terminator",
      kind: "mcq",
      prompt: "Why is a unique terminator $ appended before building a suffix tree?",
      options: [
        "So that no suffix is a prefix of another, giving every suffix its own leaf",
        "So that the tree becomes binary",
        "To make the alphabet smaller",
        "Because suffix links need it",
      ],
      answer: 0,
      explanation:
        "Without $, a suffix such as a in banana ends inside an edge (it is a prefix of ana) and has no leaf.",
      distractors: {
        1: "Nodes can still have up to σ + 1 children.",
        2: "It adds a letter.",
        3: "The naive construction has no suffix links and still needs $.",
      },
      hints: ["Where would the suffix a of banana end without $?"],
      objective: "Understand the terminator",
    },
  ],
  exam: {
    definition:
      "The suffix tree of s is the compressed trie of all suffixes of s$: edges carry substrings, inner nodes branch at least twice, and each of the n + 1 leaves marks one suffix.",
    steps: [
      "Append a unique terminator $.",
      "Insert suffixes: walk down while letters match; split an edge where they stop matching.",
      "Hang a leaf for the rest of the suffix.",
      "(Ukkonen: build online with implicit leaf ends, suffix links and skip/count.)",
    ],
    timeComplexity:
      "$O(n)$ with Ukkonen's (or Weiner's, McCreight's) algorithm; $O(n^2)$ by naive insertion.",
    spaceComplexity: "$O(n)$ nodes, with labels stored as index pairs.",
    correctness:
      "Every substring is a prefix of a suffix, so it is a path from the root; the terminator makes the n + 1 suffixes end at distinct leaves.",
    applications: [
      "Substring search in O(m)",
      "Longest repeated and longest common substrings",
      "Counting distinct substrings",
      "Bioinformatics (genome repeats)",
    ],
    limitations: [
      "Memory use is many times the size of the text",
      "Linear-time construction is intricate",
    ],
    faq: [
      {
        q: "How does it relate to the suffix array?",
        a: "Visiting children in alphabetical order, the leaves appear in suffix-array order; the string depths of inner nodes are LCP values.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Compressed trie of all suffixes of s$.",
          "$O(n)$ nodes; $O(n)$ construction (Ukkonen).",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition and terminator (1).",
          "Construction by insertion (2).",
          "Example (1).",
          "Size bound (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition, terminator and compression (2).",
          "Naive construction with edge splits (2).",
          "Worked example on banana$ (2).",
          "Size bound and distinct substrings (2).",
          "Ukkonen's ideas: implicit leaves, suffix links, skip/count (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "E. Ukkonen, “On-line construction of suffix trees,” Algorithmica, 14(3), 1995.",
      supports: "The online linear-time construction in the Python sample.",
    },
    {
      citation:
        "P. Weiner, “Linear pattern matching algorithms,” 14th Annual Symposium on Switching and Automata Theory, IEEE, 1973.",
      supports: "Suffix trees and the first linear-time construction.",
    },
    {
      citation:
        "E. M. McCreight, “A space-economical suffix tree construction algorithm,” Journal of the ACM, 23(2), 1976.",
      supports: "A simpler linear-time construction using suffix links.",
    },
    {
      citation:
        "D. Gusfield, Algorithms on Strings, Trees, and Sequences, Cambridge University Press, 1997.",
      supports:
        "Suffix tree definitions, Ukkonen's algorithm explained step by step, and applications.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
