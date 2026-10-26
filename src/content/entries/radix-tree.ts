import type { AlgorithmEntry } from "../types";

export const radixTreeEntry: AlgorithmEntry = {
  slug: "radix-tree",
  name: "Radix Tree (Compressed Trie)",
  aliases: ["Compressed trie", "Radix trie", "Compact prefix tree"],
  curriculum: [166, 168],
  domain: "trees",
  subcategory: "Tries",
  difficulty: "intermediate",
  summary:
    "A trie in which every chain of single-child nodes is squeezed into one edge labelled with a whole string. Lookups still cost time proportional to the word's length, but the tree has at most about two nodes per word instead of one per letter.",
  tags: ["tree", "trie", "strings", "prefix", "dictionary", "path compression"],
  prerequisites: ["Tries"],
  related: ["trie", "patricia-trie", "ternary-search-tree", "suffix-tree"],
  problem: {
    input: "A sequence of insert, delete, search and prefix operations on lowercase words.",
    output:
      "Whether each operation succeeded, and the radix tree of the words that remain — which depends only on the set of words, not on the order they arrived in.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In a plain trie, a long word that shares no letters with anything else costs one node per letter, each with a single child. A radix tree stores such a stretch once, as a string on one edge: “romane” is one edge, not six nodes. A node is kept only where words actually branch apart or where a word ends. Each node here shows the label of the edge leading into it, and a word is the concatenation of labels from the root.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Walk:** from the root, pick the child whose label starts with the next letter (children start with different letters). If its whole label matches, consume it and continue; otherwise the word leaves the tree part-way along that edge.",
          "**Insert:** if the word ends exactly at a node, mark it. If no child starts with the next letter, add a leaf labelled with the rest of the word. If the word leaves an edge part-way, **split** the edge there: a new node takes the common part, the old child keeps the rest of its label, and the new word's remainder (if any) becomes a second child.",
          "**Delete:** unmark the word's node; remove it if it is a leaf. Any node other than the root left with no word and one child is **merged** into that child, whose label grows.",
          "**Search** succeeds if the word ends exactly at a marked node; **prefix** succeeds if the prefix runs out anywhere on the path, even inside an edge label.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): insert romane, romanus, romulus, rubens, ruber, rubicon.",
      },
      {
        kind: "table",
        head: ["insert", "what happens", "tree afterwards"],
        rows: [
          ["romane", "the tree is empty: one leaf", "romane"],
          ["romanus", "leaves “romane” after “roman”: split", "roman(e us)"],
          ["romulus", "leaves “roman” after “rom”: split", "rom(an(e us) ulus)"],
          ["rubens", "leaves “rom” after “r”: split", "r(om(…) ubens)"],
          ["ruber", "leaves “ubens” after “ube”: split", "r(om(…) ube(ns r))"],
          ["rubicon", "leaves “ube” after “ub”: split", "r(om(…) ub(e(ns r) icon))"],
        ],
      },
      {
        kind: "p",
        text: "Six words, five splits and 11 nodes besides the root — a plain trie of the same words needs 22. Searching for “rom” then fails (the path exists but no word ends there), while the prefix query “rom” succeeds. In the second preset, deleting “cart” leaves “car” with a single child, but “car” is a word, so it stays; deleting “car” too lets it merge with its child into “re”.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store each edge label as a (start, length) slice of a stored key rather than a copied string, so splitting an edge is O(1) apart from the new node.",
          "Children can be a sorted array, a small map, or — for byte strings — an array of 256 pointers; compact node layouts (as in the adaptive radix tree) choose among these by the number of children.",
          "Real uses include HTTP request routers (Go's httprouter, for example), the radix tree behind Redis streams, and in-memory database indexes.",
          "Without deletion merges the tree is still correct, but it is no longer the canonical, minimal radix tree for its set.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Size.** Every node except the root and the word ends has at least two children, and every leaf is a word end. A tree with n words therefore has at most n leaves and fewer than n branching nodes that are not word ends: at most $2n - 1$ nodes besides the root, against one node per distinct prefix in a plain trie. The letters themselves still have to be stored, but only once per edge.",
      },
      {
        kind: "p",
        text: "**Time.** A search, insert or delete for a word of length L compares O(L) letters, plus one child lookup per node visited, independent of the number of words. **Uniqueness:** a radix tree is determined by its set of words — group the words by first letter, take each group's longest common prefix as an edge, and recurse — so the order of insertions does not matter. The tests rebuild that unique tree independently after every run and require the traced tree to equal it.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "“Compressed trie”, “radix tree”, “radix trie” and even “Patricia trie” are used loosely and often interchangeably. This lesson uses radix tree for the letter-labelled form; the Patricia lesson shows the binary, bit-indexed form from Morrison's 1968 paper.",
          "The adaptive radix tree (Leis, Kemper and Neumann, 2013) uses node types of different fan-out to make radix trees competitive with hash tables as database indexes.",
          "A suffix tree is the radix tree of all suffixes of a text; it has O(n) nodes where the plain suffix trie can have Θ(n²).",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(L)", average: "O(L)", worst: "O(L)" },
    space: "O(n) nodes plus the stored letters",
    worstClass: "n",
    note: "L is the length of the word; n is the number of words. At most 2n − 1 nodes besides the root.",
  },
  properties: [
    { label: "Edges", value: "Labelled with strings; siblings start with different letters" },
    { label: "Nodes", value: "Only where words branch or end" },
    { label: "Shape", value: "Determined by the set of words" },
  ],
  implementations: [
    {
      language: "python",
      entry: "build",
      code: `def build(words):
    """Radix tree of a set of words as nested dicts {label: (is_word, children)}."""
    tree = {}
    for w in sorted(set(words)):
        node = tree
        while True:
            label = next((l for l in node if l[0] == w[0]), None)
            if label is None:
                node[w] = (True, {})
                break
            k = 0
            while k < min(len(label), len(w)) and label[k] == w[k]:
                k += 1
            is_word, kids = node[label]
            if k < len(label):                   # split the edge
                del node[label]
                node[label[:k]] = (k == len(w), {label[k:]: (is_word, kids)})
                if k < len(w):
                    node[label[:k]][1][w[k:]] = (True, {})
                break
            w = w[k:]
            if not w:
                node[label] = (True, kids)
                break
            node = kids
    def show(node):
        return " ".join(l + ("*" if t else "") + (f"({show(c)})" if c else "")
                        for l, (t, c) in sorted(node.items()))
    return show(tree)
`,
      tests: [
        {
          args: [["romane", "romanus", "romulus", "rubens", "ruber", "rubicon"]],
          expected: "r(om(an(e* us*) ulus*) ub(e(ns* r*) icon*))",
        },
        { args: [["car", "care", "cat"]], expected: "ca(r*(e*) t*)" },
      ],
    },
    {
      language: "javascript",
      entry: "nodeCount",
      code: `// Nodes (besides the root) in the radix tree of a set of words.
function nodeCount(words) {
  const count = (ws) => {
    const groups = new Map();
    for (const w of ws) if (w) groups.set(w[0], [...(groups.get(w[0]) ?? []), w]);
    let n = 0;
    for (const g of groups.values()) {
      let lcp = g[0];
      for (const w of g) while (!w.startsWith(lcp)) lcp = lcp.slice(0, -1);
      n += 1 + count(g.map((w) => w.slice(lcp.length)));
    }
    return n;
  };
  return count([...new Set(words)]);
}
`,
      tests: [
        { args: [["romane", "romanus", "romulus", "rubens", "ruber", "rubicon"]], expected: 11 },
        { args: [["test", "tester", "team", "toast"]], expected: 6 },
        { args: [["a"]], expected: 1 },
      ],
    },
  ],
  visualizer: "radix-tree",
  practice: [
    {
      id: "radix-split",
      kind: "mcq",
      prompt:
        "A radix tree holds only “romane” (one edge from the root). What does inserting “rose” do?",
      options: [
        "Splits the edge into “ro”, with children “mane” and “se”",
        "Adds “rose” as a second child of the root",
        "Splits the edge into “r”, with children “omane” and “ose”",
        "Extends the edge to “romanerose”",
      ],
      answer: 0,
      explanation:
        "The two words agree on “ro” and differ at the third letter, so the edge is split after “ro”.",
      distractors: {
        1: "Siblings must start with different letters; both start with r.",
        2: "The split is at the longest common prefix, which is “ro”, not “r”.",
        3: "Labels are never concatenated across different words.",
      },
      hints: ["Find the longest common prefix of the two words."],
      objective: "Splitting an edge",
    },
    {
      id: "radix-count",
      kind: "numeric",
      prompt:
        "How many nodes, besides the root, does the radix tree of {car, care, cart, cat} have?",
      answer: 5,
      explanation: "ca(r*(e* t*) t*): “ca”, “r”, “e”, “t” under r, and “t” under ca — five nodes.",
      hints: ["Which words branch apart, and where?"],
      objective: "Shape of a radix tree",
    },
  ],
  exam: {
    definition:
      "A radix tree (compressed trie) is a trie in which each maximal chain of single-child, non-word nodes is replaced by one edge labelled with the string of their letters.",
    steps: [
      "Walk: follow the child starting with the next letter; consume its label if it matches fully.",
      "Insert: mark an existing node, add a leaf, or split an edge at the point of divergence.",
      "Delete: unmark; remove a leaf; merge a non-word node with one child into that child.",
    ],
    timeComplexity: "O(L) for search, insert and delete of a word of length L.",
    spaceComplexity: "At most 2n − 1 nodes besides the root for n words, plus the stored letters.",
    correctness:
      "Siblings start with different letters, so each word has exactly one path; splits and merges keep every non-word internal node branching.",
    applications: ["HTTP routers", "IP routing (bitwise variants)", "In-memory database indexes"],
    limitations: [
      "Splitting and merging labels complicates the code",
      "Ordered children per node still need a lookup structure",
    ],
    faq: [
      {
        q: "Is a radix tree the same as a Patricia trie?",
        a: "The names are often used interchangeably. Strictly, Patricia (Morrison, 1968) is the binary version that stores the index of the bit to test instead of edge strings.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Trie with single-child chains compressed into string edges.", "O(L) lookup."],
      },
      {
        marks: 10,
        outline: [
          "Definition and comparison with a trie (2).",
          "Insert with an edge split, worked example (4).",
          "Delete with a merge (2).",
          "Size bound and complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. R. Morrison, “PATRICIA—Practical Algorithm To Retrieve Information Coded in Alphanumeric,” Journal of the ACM, 15(4), 1968.",
      supports: "Compressing single-child chains of a trie.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 6.3.",
      supports: "Digital searching, tries and their compressed forms.",
    },
    {
      citation:
        "V. Leis, A. Kemper, T. Neumann, “The adaptive radix tree: ARTful indexing for main-memory databases,” Proceedings of the IEEE International Conference on Data Engineering (ICDE), 2013.",
      supports: "Radix trees as database indexes.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
