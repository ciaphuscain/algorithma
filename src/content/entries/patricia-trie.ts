import type { AlgorithmEntry } from "../types";

export const patriciaTrieEntry: AlgorithmEntry = {
  slug: "patricia-trie",
  name: "Patricia Trie",
  aliases: ["PATRICIA", "Crit-bit tree", "Binary radix trie"],
  curriculum: [167],
  domain: "trees",
  subcategory: "Tries",
  difficulty: "advanced",
  summary:
    "A binary trie on the bits of the keys that skips every one-way branch: each internal node records which bit to test next. A search tests only the bits that matter and compares the whole key once at the end. n keys need exactly n − 1 bit tests, whatever the key length.",
  tags: ["tree", "trie", "binary", "bits", "radix", "path compression", "routing"],
  prerequisites: ["Tries", "Binary numbers"],
  related: ["radix-tree", "trie", "bst"],
  problem: {
    input:
      "A sequence of insert, delete and search operations on keys 0–99, viewed as 7-bit strings.",
    output: "Whether each operation succeeded, and the Patricia trie of the keys that remain.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A binary trie branches on bit 0 of the key, then bit 1, and so on — but with few keys most of those branches go only one way. Patricia drops them: an internal node says “test bit 4 next”, jumping straight to the first bit where the keys below it actually differ. Because the skipped bits were never looked at, a search ends by comparing the whole key with the one stored at the leaf it reaches.",
      },
      {
        kind: "p",
        text: "Here keys are numbers 0–99 written with 7 bits, bit 0 being the most significant (64). Each internal node shows the bit it tests; its first child holds keys with a 0 there, its second keys with a 1. A placeholder labelled “top” sits above the trie, so the trie's top node can be replaced like any other.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Descend(k):** at each internal node, test the bit it names and go to the first (0) or second (1) child, until a leaf is reached.",
          "**Search(k):** descend, then compare k with the key at the leaf: found only if they are equal.",
          "**Insert(k):** descend to a leaf ℓ. If ℓ holds k, stop. Otherwise let c be the first bit where k and ℓ's key differ. Descend again from the top, stopping before the first node that tests a bit greater than c (or a leaf). Put a new node testing bit c there: the subtree that was there becomes one child, and a new leaf for k the other, according to bit c of k.",
          "**Delete(k):** descend; if the leaf holds k, remove it and its parent, whose other child takes the parent's place.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): insert 19, 23, 82, 81, 40, 63. A node testing bit b is written [b](first second).",
      },
      {
        kind: "table",
        head: ["insert", "binary", "nearest leaf; first differing bit", "trie afterwards"],
        rows: [
          ["19", "0010011", "— (empty)", "19"],
          ["23", "0010111", "19; bit 4", "[4](19 23)"],
          ["82", "1010010", "19; bit 0", "[0]([4](19 23) 82)"],
          ["81", "1010001", "82; bit 5", "[0]([4](19 23) [5](81 82))"],
          ["40", "0101000", "23; bit 1", "[0]([1]([4](19 23) 40) [5](81 82))"],
          ["63", "0111111", "40; bit 2", "[0]([1]([4](19 23) [2](40 63)) [5](81 82))"],
        ],
      },
      {
        kind: "p",
        text: "Inserting 82 puts a new test of bit 0 above everything, since bit 0 is smaller than every bit already tested. Inserting 40 puts bit 1 between bit 0 and bit 4. Searching for 60 = 0111100 then tests bits 0, 1 and 2 (0, 1, 1), reaches 63 and fails on the single full comparison. Read left to right, the leaves are in increasing order.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Morrison's original stores each key in an internal node and uses upward links instead of separate leaves, so n keys need exactly n nodes. This lesson uses the separate-leaf form popularised as crit-bit trees, which is easier to draw.",
          "For strings, the bit index is split into a byte offset and a mask within that byte; keys of different lengths need a convention, such as treating missing bytes as zero plus a terminator.",
          "Routing tables use Patricia-style tries for longest-prefix matching; the BSD Unix kernels' routing table, for example, was built on one.",
          "Every internal node has exactly two children, so there are no empty branches to allocate.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Shape.** The trie of a set of keys is unique: its top node tests the first bit where any two keys differ, splitting them into those with 0 and those with 1, and each half is built the same way. Bits tested strictly increase along every path, every internal node has two children, and with n keys there are n leaves and $n - 1$ internal nodes. The tests rebuild this unique trie independently after every run and require the traced one to equal it.",
      },
      {
        kind: "p",
        text: "**Cost.** A search tests at most min(b, n − 1) bits for b-bit keys, then makes one full key comparison; the number of tests is the depth of the leaf, which for random keys averages about $\\log_2 n$. Insertion descends twice and deletion once, so all three are O(b) bit operations — independent of n for fixed-length keys.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Knuth (Vol. 3, §6.3) analyses Patricia in detail: for random keys the average search depth is about log₂ n plus a small constant.",
          "Level-compressed tries (LC-tries, Nilsson and Karlsson) replace the top levels of a Patricia trie by wide nodes to cut the depth for IP lookups.",
          "Because the leaves are in key order, Patricia tries support predecessor, successor and range queries like a search tree.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n) bit tests", worst: "O(b)" },
    space: "O(n)",
    worstClass: "n",
    note: "b is the number of bits in a key (7 here); each search ends with one full key comparison. Worst-case depth is min(b, n − 1).",
  },
  properties: [
    { label: "Internal nodes", value: "n − 1 for n keys; each tests one bit" },
    { label: "Bits along a path", value: "Strictly increasing" },
    { label: "Full comparisons", value: "One per search" },
  ],
  implementations: [
    {
      language: "python",
      entry: "patricia",
      code: `def patricia(keys, bits=7):
    """The Patricia trie of a set of keys, as nested [bit](zero one) text."""
    def bit(k, i):
        return (k >> (bits - 1 - i)) & 1

    def build(ks, start):
        if len(ks) == 1:
            return str(ks[0])
        b = start
        while len({bit(k, b) for k in ks}) == 1:
            b += 1                                 # skip bits that do not separate
        zero = [k for k in ks if bit(k, b) == 0]
        one = [k for k in ks if bit(k, b) == 1]
        return f"[{b}]({build(zero, b + 1)} {build(one, b + 1)})"

    return build(sorted(set(keys)), 0) if keys else "∅"
`,
      tests: [
        {
          args: [[19, 23, 82, 81, 40, 63]],
          expected: "[0]([1]([4](19 23) [2](40 63)) [5](81 82))",
        },
        { args: [[64, 67, 71, 79]], expected: "[3]([4]([5](64 67) 71) 79)" },
        { args: [[5]], expected: "5" },
      ],
    },
    {
      language: "javascript",
      entry: "firstDifferingBit",
      code: `// The bit a new node tests when k is inserted next to key: bit 0 is the most significant.
function firstDifferingBit(k, key, bits = 7) {
  return bits - (k ^ key).toString(2).length;
}
`,
      tests: [
        { args: [23, 19], expected: 4 },
        { args: [82, 19], expected: 0 },
        { args: [63, 40], expected: 2 },
      ],
    },
  ],
  visualizer: "patricia-trie",
  practice: [
    {
      id: "patricia-nodes",
      kind: "numeric",
      prompt:
        "A Patricia trie (with separate leaves) holds 12 keys. How many internal nodes does it have?",
      answer: 11,
      explanation:
        "Every internal node has exactly two children, so a tree with n leaves has n − 1 internal nodes.",
      hints: ["Can an internal node have only one child?"],
      objective: "Shape",
    },
    {
      id: "patricia-compare",
      kind: "mcq",
      prompt: "Why does a Patricia search finish by comparing the whole key with the leaf's key?",
      options: [
        "Skipped bits were never tested, so the leaf may differ from the key in one of them",
        "To decide which child to take at the leaf",
        "Because leaves store keys in reverse bit order",
        "It does not need to; reaching a leaf proves the key is present",
      ],
      answer: 0,
      explanation:
        "The trie only tests bits where stored keys differ. A key that is not stored can agree with a leaf on all of those bits and still differ elsewhere.",
      distractors: {
        1: "Leaves have no children.",
        2: "Keys are stored as they are.",
        3: "Searching for 60 in the worked example reaches 63, which is a different key.",
      },
      hints: ["Which bits did the search never look at?"],
      objective: "Search",
    },
  ],
  exam: {
    definition:
      "A Patricia trie is a binary trie on key bits in which one-way branches are skipped; each internal node stores the index of the bit it tests, and keys sit at the leaves.",
    steps: [
      "Search: follow tested bits to a leaf; compare the full key once.",
      "Insert: find the nearest leaf; c = first differing bit; insert a node testing c at the right depth.",
      "Delete: remove the leaf and its parent; the sibling moves up.",
    ],
    timeComplexity:
      "O(b) bit tests per operation for b-bit keys; about log₂ n on average for random keys.",
    spaceComplexity: "$O(n)$: n leaves and n − 1 internal nodes.",
    correctness:
      "Bit indices increase down each path and every internal node separates its keys, so each key has a unique leaf; the final comparison rejects keys that only agree on the tested bits.",
    applications: [
      "IP routing tables",
      "Ordered in-memory key sets",
      "Indexes on fixed-length keys",
    ],
    limitations: [
      "Needs a full key comparison at the end",
      "Bit-level code for variable-length strings",
    ],
    faq: [
      {
        q: "What does PATRICIA stand for?",
        a: "Practical Algorithm To Retrieve Information Coded In Alphanumeric — the title of Morrison's 1968 paper.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Binary trie that skips one-way branches.", "Nodes store the bit index to test."],
      },
      {
        marks: 10,
        outline: [
          "Structure and why a final comparison is needed (3).",
          "Insertion with an example (4).",
          "n − 1 internal nodes; O(b) operations (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. R. Morrison, “PATRICIA—Practical Algorithm To Retrieve Information Coded in Alphanumeric,” Journal of the ACM, 15(4), 1968.",
      supports: "The Patricia trie.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 6.3.",
      supports: "Analysis of Patricia and digital searching.",
    },
    {
      citation:
        "R. Sedgewick, Algorithms in C, Parts 1–4, 3rd ed., Addison-Wesley, 1998, Chapter 15.",
      supports: "Patricia tries and radix search.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
