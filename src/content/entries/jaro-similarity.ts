import type { AlgorithmEntry } from "../types";

export const jaroSimilarityEntry: AlgorithmEntry = {
  slug: "jaro-similarity",
  name: "Jaro Similarity",
  aliases: ["Jaro Similarity", "Jaro Distance"],
  curriculum: [333],
  domain: "strings",
  subcategory: "String Metrics",
  difficulty: "intermediate",
  summary:
    "Measures similarity between two strings based on matching characters and transpositions, giving a value between 0 (no match) and 1 (exact match).",
  tags: ["jaro", "string similarity", "fuzzy matching", "string metric"],
  prerequisites: [],
  related: ["jaro-winkler-distance", "edit-distance", "hamming-distance"],
  problem: {
    input: "Two strings s₁ and s₂.",
    output: "Jaro similarity score between 0 and 1.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Two characters from s₁ and s₂ 'match' if they are the same and within a match window of ⌊max(|s₁|,|s₂|)/2⌋ - 1 positions. The similarity accounts for the number of matches and the number of transpositions (matched characters in different order).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute match window: w = ⌊max(|s₁|,|s₂|)/2⌋ - 1.",
          "Find matching characters: s₁[i] matches s₂[j] if s₁[i]=s₂[j] and |i-j| ≤ w.",
          "Count transpositions: matched characters that appear in different order.",
          "Jaro = (m/|s₁| + m/|s₂| + (m-t/2)/m) / 3, where m = matches, t = transpositions.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Track which positions in each string have been matched to avoid double-counting.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(n \\cdot m)$ where n and m are string lengths (bounded by the match window). For strings of similar length, effectively $O(n^2)$ worst case but fast in practice.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Jaro-Winkler adds a bonus for common prefixes.",
          "Used in record linkage, deduplication, and fuzzy name matching.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n * m)",
      worst: "O(n * m)",
    },
    space: "O(n + m)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Range",
      value: "[0, 1]",
    },
    {
      label: "Metric",
      value: "Yes (Jaro distance = 1 - similarity)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "jaro_similarity",
      code: `def jaro_similarity(s1, s2):
    if s1 == s2: return 1.0
    n1, n2 = len(s1), len(s2)
    if n1 == 0 or n2 == 0: return 0.0
    w = max(n1, n2) // 2 - 1
    if w < 0: w = 0
    m1 = [False] * n1
    m2 = [False] * n2
    matches = 0
    for i in range(n1):
        lo = max(0, i - w)
        hi = min(n2, i + w + 1)
        for j in range(lo, hi):
            if not m2[j] and s1[i] == s2[j]:
                m1[i] = m2[j] = True
                matches += 1
                break
    if matches == 0: return 0.0
    t = 0
    k = 0
    for i in range(n1):
        if m1[i]:
            while not m2[k]: k += 1
            if s1[i] != s2[k]: t += 1
            k += 1
    return (matches / n1 + matches / n2 + (matches - t / 2) / matches) / 3
`,
      tests: [
        {
          args: ["martha", "marhta"],
          expected: 0.9444444444444445,
        },
        {
          args: ["abc", "xyz"],
          expected: 0.0,
        },
        {
          args: ["abc", "abc"],
          expected: 1.0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "jaroSimilarity",
      code: `function jaroSimilarity(s1, s2) {
  if (s1 === s2) return 1;
  const n1 = s1.length, n2 = s2.length;
  if (n1 === 0 || n2 === 0) return 0;
  const w = Math.max(0, Math.floor(Math.max(n1, n2) / 2) - 1);
  const m1 = new Array(n1).fill(false), m2 = new Array(n2).fill(false);
  let matches = 0;
  for (let i = 0; i < n1; i++) {
    for (let j = Math.max(0, i - w); j < Math.min(n2, i + w + 1); j++) {
      if (!m2[j] && s1[i] === s2[j]) { m1[i] = m2[j] = true; matches++; break; }
    }
  }
  if (matches === 0) return 0;
  let t = 0, k = 0;
  for (let i = 0; i < n1; i++) {
    if (m1[i]) { while (!m2[k]) k++; if (s1[i] !== s2[k]) t++; k++; }
  }
  return (matches / n1 + matches / n2 + (matches - t / 2) / matches) / 3;
}
`,
      tests: [
        {
          args: ["martha", "marhta"],
          expected: 0.9444444444444445,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "jaro-q1",
      kind: "mcq",
      prompt: "What is the match window in Jaro similarity?",
      options: ["⌊max(|s₁|,|s₂|)/2⌋ - 1", "The string length", "1", "Unlimited"],
      answer: 0,
      explanation: "Characters must be within this window distance to be considered matching.",
      hints: ["Think about the formula."],
      objective: "Match window",
    },
  ],
  exam: {
    definition:
      "Jaro similarity scores string similarity based on matches within a window and transpositions.",
    steps: [
      "Compute match window.",
      "Find matching characters.",
      "Count transpositions.",
      "Apply Jaro formula.",
    ],
    timeComplexity: "$O(n \\cdot m)$.",
    spaceComplexity: "$O(n + m)$.",
    correctness: "The formula accounts for both matching characters and their order.",
    applications: ["record linkage", "name matching", "deduplication"],
    limitations: ["Slower than edit distance for very long strings"],
    faq: [
      {
        q: "What's a transposition?",
        a: "Two matched characters that appear in different relative order in the two strings.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define matching and transpositions (2).",
          "Jaro formula (2).",
          "Applications (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "M. A. Jaro, 'Advances in Record-Linkage Methodology', J. American Statistical Association, 1989.",
      supports: "Original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
