import type { AlgorithmEntry } from "../types";

export const trieEntry: AlgorithmEntry = {
  slug: "trie",
  name: "Trie (Prefix Tree)",
  aliases: ["Prefix tree", "Digital tree", "Trie construction"],
  curriculum: [165],
  domain: "trees",
  subcategory: "Tries",
  difficulty: "intermediate",
  summary:
    "Stores a set of strings as paths of characters from a shared root, so lookups and prefix queries cost time proportional to the word length, not the number of words.",
  tags: ["tree", "strings", "prefix", "dictionary", "autocomplete"],
  prerequisites: ["Trees", "Strings"],
  related: ["kmp", "bst"],
  problem: {
    input: "Words to insert; then words to look up and prefixes to check.",
    output:
      "Whether each word was inserted, and whether any inserted word starts with each prefix.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A printed dictionary groups words by their first letter, then their second, and so on. A trie does exactly that: each node is a prefix, and each child adds one more letter. Words that share a beginning share a path, and a mark on a node says “a word ends here”.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        items: [
          "**Insert:** from the root, follow the child for each letter, creating it if missing; mark the last node as a word end.",
          "**Search a word:** follow the letters; fail if a child is missing; succeed only if the last node is marked.",
          "**Check a prefix:** the same walk, but any node reached counts as success.",
        ],
      },
      {
        kind: "p",
        text: "**Example.** Inserting car, cart, care, cat, dog creates nodes for the prefixes c, ca, car, cart, care, cat, d, do, dog — 9 nodes plus the root. “car” is found; “ca” is a prefix but not a word; “dot” fails at the third letter.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Children can be an array of 26 slots (fast, memory-hungry), a hash map (flexible alphabets) or a sorted list (compact).",
          "Store the end-of-word flag on the node, not as a special child, so “car” and “cart” can both exist.",
          "Deleting a word unmarks its node and prunes nodes left with no children and no mark.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Insert, search and prefix check each take $O(L)$ steps for a word of length $L$ (times the child-lookup cost: $O(1)$ for an array or hash map, $O(\\log \\sigma)$ for a sorted list over an alphabet of size $\\sigma$) — independent of how many words are stored.",
      },
      {
        kind: "p",
        text: "The number of nodes is one per distinct prefix plus the root, at most $1 + \\sum_i L_i$. With 26-slot arrays memory is $O(26 \\cdot \\text{nodes})$, which is why compressed tries merge single-child chains.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Compressed tries / radix trees** label edges with strings, so no node has a single child.",
          "**Aho–Corasick** adds failure links to a trie of patterns to find all of them in a text in one pass.",
          "**Suffix tries and trees** index every suffix of a text for substring queries.",
          "Applications: autocomplete, spell checking, IP routing (longest-prefix match on bit strings).",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(L)", average: "O(L)", worst: "O(L)" },
    space: "O(\\textstyle\\sum L_i)",
    worstClass: "n",
    note: "Per operation, for a word of length $L$; space counts nodes over all inserted words.",
  },
  properties: [
    { label: "Lookup cost", value: "Independent of the number of words" },
    { label: "Prefix queries", value: "Natural" },
  ],
  implementations: [
    {
      language: "python",
      entry: "trie_queries",
      code: `def trie_queries(words, queries):
    """Insert words into a trie; for each query return (is_word, is_prefix)."""
    root = {}
    END = "$"
    for w in words:
        node = root
        for ch in w:
            node = node.setdefault(ch, {})
        node[END] = True
    out = []
    for q in queries:
        node = root
        for ch in q:
            node = node.get(ch)
            if node is None:
                break
        out.append([node is not None and END in node, node is not None])
    return out
`,
      tests: [
        {
          args: [
            ["car", "cart", "care", "cat", "dog"],
            ["car", "ca", "dot"],
          ],
          expected: [
            [true, true],
            [false, true],
            [false, false],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "countTrieNodes",
      code: `function countTrieNodes(words) {
  const root = new Map();
  let count = 1;
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node.has(ch)) {
        node.set(ch, new Map());
        count++;
      }
      node = node.get(ch);
    }
  }
  return count;
}
`,
      tests: [{ args: [["car", "cart", "care", "cat", "dog"]], expected: 10 }],
    },
  ],
  visualizer: "trie",
  practice: [
    {
      id: "trie-nodes",
      kind: "numeric",
      prompt:
        "How many nodes (including the root) does a trie need for the words “to”, “tea”, “ten”, “in”?",
      answer: 8,
      explanation: "Distinct prefixes: t, to, te, tea, ten, i, in — 7, plus the root.",
      hints: ["Count distinct prefixes, then add one for the root."],
      objective: "Count trie nodes",
    },
    {
      id: "trie-why",
      kind: "mcq",
      prompt:
        "Why can a trie answer “does any word start with ab?” faster than a hash set of the words?",
      options: [
        "All words with that prefix share one path, so one walk of 2 steps answers it",
        "Hashing is slow",
        "Tries use less memory",
        "Hash sets cannot store strings",
      ],
      answer: 0,
      explanation:
        "A hash set answers exact lookups only; a prefix query would have to examine every word.",
      distractors: {
        1: "Hashing is fast for exact lookups.",
        2: "Tries usually use more memory.",
        3: "They can.",
      },
      hints: ["What would a hash set have to do for a prefix query?"],
      objective: "Know when tries help",
    },
  ],
  exam: {
    definition:
      "A trie is a rooted tree storing a set of strings, where each edge adds one character, each node represents a prefix, and nodes where words end are marked.",
    steps: [
      "Insert: walk from the root by characters, creating missing children; mark the final node.",
      "Search: walk by characters; fail on a missing child; succeed if the final node is marked.",
      "Prefix: walk by characters; succeed if the walk completes.",
    ],
    timeComplexity: "$O(L)$ per operation for a word of length $L$.",
    spaceComplexity:
      "One node per distinct prefix; up to $O(\\sigma \\sum L_i)$ with array children.",
    correctness:
      "Each prefix has exactly one node, so a word is present exactly when its path exists and ends at a marked node.",
    applications: ["Autocomplete", "Spell checking", "IP longest-prefix matching", "Word games"],
    limitations: ["Memory-heavy without compression"],
    faq: [
      {
        q: "Trie or hash table?",
        a: "Hash tables win for exact lookups and memory; tries win for prefix queries and sorted iteration.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Tree of prefixes; one character per edge; word-end marks.",
          "$O(L)$ operations.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Insert and search (2).",
          "Diagram for 4–5 words (1).",
          "Complexity and applications (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "E. Fredkin, “Trie memory,” Communications of the ACM, 3(9), 1960.",
      supports: "The trie and its name (from retrieval).",
    },
    {
      citation: "R. Sedgewick, K. Wayne, Algorithms, 4th ed., Addison-Wesley, 2011, §5.2.",
      supports: "R-way tries, ternary search tries and their costs.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-21",
};
