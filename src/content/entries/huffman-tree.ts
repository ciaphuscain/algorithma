import type { AlgorithmEntry } from "../types";

export const huffmanTreeEntry: AlgorithmEntry = {
  slug: "huffman-tree",
  name: "Huffman Tree",
  aliases: ["Huffman Coding", "Huffman Encoding"],
  curriculum: [171],
  domain: "compression",
  subcategory: "Entropy Coding",
  difficulty: "intermediate",
  summary:
    "Builds an optimal prefix-free binary code by repeatedly merging the two least-frequent symbols.",
  tags: ["prefix code", "compression", "greedy", "binary tree"],
  prerequisites: [],
  related: ["arithmetic-coding"],
  problem: {
    input: "A set of symbols with frequencies.",
    output: "A prefix-free binary code minimizing expected code length.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Frequent symbols get short codes, rare symbols get long codes. Build a binary tree bottom-up: merge the two least frequent nodes at each step.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Create a leaf node for each symbol.",
          "Insert all nodes into a min-heap by frequency.",
          "While heap has more than one node:",
          "  Extract two minimum-frequency nodes.",
          "  Create a new internal node with these as children.",
          "  Insert the new node with combined frequency.",
          "The remaining node is the root. Assign 0/1 to left/right edges.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use a priority queue (min-heap) for efficient extraction. Code lengths are the depth of each leaf.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Huffman coding is optimal among prefix codes: expected length is between $H$ and $H+1$ where $H$ is the entropy.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Adaptive Huffman coding updates the tree as symbols are processed, allowing single-pass compression without a priori frequency knowledge.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n \\log n)", average: "O(n \\log n)", worst: "O(n \\log n)" },
    space: "O(n)",
    worstClass: "n log n",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "huffman_codes_simple",
      code: `import heapq

def huffman_codes(freq: dict[str, int]) -> dict[str, str]:
    if not freq:
        return {}
    if len(freq) == 1:
        return {list(freq.keys())[0]: "0"}
    heap = [(f, i, c) for i, (c, f) in enumerate(freq.items())]
    heapq.heapify(heap)
    idx = len(heap)
    tree: dict[int, tuple] = {}
    while len(heap) > 1:
        f1, i1, c1 = heapq.heappop(heap)
        f2, i2, c2 = heapq.heappop(heap)
        tree[idx] = (i1, c1, i2, c2)
        heapq.heappush(heap, (f1 + f2, idx, idx))
        idx += 1
    codes: dict[str, str] = {}
    def traverse(node_id, code):
        if node_id not in tree:
            symbol = [c for i, (c, f) in enumerate(freq.items()) if i == node_id]
            if symbol:
                codes[symbol[0]] = code
            return
        i1, c1, i2, c2 = tree[node_id]
        if isinstance(c1, str) and c1 in freq:
            codes[c1] = code + "0"
        else:
            traverse(i1, code + "0")
        if isinstance(c2, str) and c2 in freq:
            codes[c2] = code + "1"
        else:
            traverse(i2, code + "1")
    if heap:
        _, root_id, _ = heap[0]
        if root_id in tree:
            traverse(root_id, "")
    return codes

def huffman_codes_simple(freq: dict[str, int]) -> dict[str, str]:
    if not freq:
        return {}
    if len(freq) == 1:
        return {list(freq.keys())[0]: "0"}
    heap = [[f, [c, ""]] for c, f in freq.items()]
    heapq.heapify(heap)
    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        for pair in lo[1:]:
            pair[1] = "0" + pair[1]
        for pair in hi[1:]:
            pair[1] = "1" + pair[1]
        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])
    return {c: code for c, code in heap[0][1:]}
`,
      tests: [
        {
          args: [
            {
              a: 1,
            },
          ],
          expected: { a: "0" },
        },
      ],
    },
    {
      language: "javascript",
      entry: "huffmanCodes",
      code: `function huffmanCodes(freq) {
  const entries = Object.entries(freq);
  if (entries.length <= 1) return entries.length ? {[entries[0][0]]: "0"} : {};
  let heap = entries.map(([c, f]) => ({f, pairs: [[c, ""]]}));
  heap.sort((a, b) => a.f - b.f);
  while (heap.length > 1) {
    const lo = heap.shift(), hi = heap.shift();
    lo.pairs.forEach(p => p[1] = "0" + p[1]);
    hi.pairs.forEach(p => p[1] = "1" + p[1]);
    const merged = {f: lo.f + hi.f, pairs: [...lo.pairs, ...hi.pairs]};
    let i = 0;
    while (i < heap.length && heap[i].f < merged.f) i++;
    heap.splice(i, 0, merged);
  }
  const codes = {};
  heap[0].pairs.forEach(([c, code]) => codes[c] = code);
  return codes;
}
`,
      tests: [
        {
          args: [{ a: 1 }],
          expected: { a: "0" },
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "huff-q1",
      kind: "mcq",
      prompt: "Huffman coding guarantees:",
      options: [
        "Optimal prefix-free code",
        "Optimal non-prefix code",
        "Minimum tree height",
        "Balanced tree",
      ],
      answer: 0,
      explanation: "Among all prefix codes, Huffman minimizes expected code length.",
      hints: ["Prefix + optimal."],
      objective: "Optimality",
    },
  ],
  exam: {
    definition: "Greedy algorithm building an optimal prefix-free binary code.",
    steps: ["Create leaf nodes.", "Merge two least-frequent.", "Repeat until one tree."],
    timeComplexity: "$O(n \\log n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Exchange argument: swapping to Huffman never increases cost.",
    applications: ["JPEG", "MP3", "DEFLATE"],
    limitations: ["Minimum 1 bit per symbol; arithmetic coding can do better"],
    faq: [
      {
        q: "Why prefix-free?",
        a: "Ensures unique decodability without delimiters.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Algorithm (2).", "Optimality proof sketch (2).", "Applications (1)."],
      },
    ],
  },
  references: [
    {
      citation: "D. A. Huffman, 'A Method for the Construction of Minimum-Redundancy Codes', 1952.",
      supports: "Original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
