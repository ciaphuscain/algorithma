import type { AlgorithmEntry } from "../types";

export const jaroWinklerDistanceEntry: AlgorithmEntry = {
  slug: "jaro-winkler-distance",
  name: "Jaro-Winkler Distance",
  aliases: ["Jaro-Winkler Distance", "Jaro-Winkler Similarity"],
  curriculum: [334],
  domain: "strings",
  subcategory: "String Metrics",
  difficulty: "intermediate",
  summary:
    "Extends Jaro similarity with a prefix bonus: strings that share a common prefix up to 4 characters get a higher similarity score.",
  tags: ["jaro-winkler", "string similarity", "fuzzy matching"],
  prerequisites: ["Jaro Similarity"],
  related: ["jaro-similarity", "edit-distance"],
  problem: {
    input: "Two strings s₁ and s₂.",
    output: "Jaro-Winkler similarity (0 to 1).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "People are more likely to make errors in the middle or end of a string than at the beginning. Jaro-Winkler boosts the Jaro score for strings that share a common prefix, reflecting this pattern.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute Jaro similarity j.",
          "Find common prefix length ℓ (up to 4).",
          "Jaro-Winkler = j + ℓ · p · (1 - j), where p is the scaling factor (typically 0.1).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The prefix length ℓ is capped at 4. The scaling factor p is usually 0.1 and should not exceed 0.25 (otherwise similarity can exceed 1).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Same complexity as Jaro: $O(n \\cdot m)$ time. The prefix bonus adds $O(\\min(4, |s_1|, |s_2|))$ work.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Widely used in census data, health records, and customer databases.",
          "The U.S. Census Bureau developed this for record linkage.",
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
      label: "Prefix bonus",
      value: "Up to 4 chars, scaling factor 0.1",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "jaro_winkler",
      code: `def jaro_winkler(s1, s2, p=0.1):
    """Jaro-Winkler similarity with prefix scaling factor p."""
    # Jaro
    if s1 == s2: return 1.0
    n1, n2 = len(s1), len(s2)
    if n1 == 0 or n2 == 0: return 0.0
    w = max(0, max(n1, n2) // 2 - 1)
    m1 = [False] * n1
    m2 = [False] * n2
    matches = 0
    for i in range(n1):
        for j in range(max(0, i - w), min(n2, i + w + 1)):
            if not m2[j] and s1[i] == s2[j]:
                m1[i] = m2[j] = True
                matches += 1
                break
    if matches == 0: return 0.0
    t = 0; k = 0
    for i in range(n1):
        if m1[i]:
            while not m2[k]: k += 1
            if s1[i] != s2[k]: t += 1
            k += 1
    j = (matches / n1 + matches / n2 + (matches - t / 2) / matches) / 3
    # Winkler prefix
    l = 0
    for i in range(min(4, n1, n2)):
        if s1[i] == s2[i]: l += 1
        else: break
    return j + l * p * (1 - j)
`,
      tests: [
        {
          args: ["martha", "marhta"],
          expected: 0.9611111111111111,
        },
        {
          args: ["abc", "abc"],
          expected: 1.0,
        },
        {
          args: ["abc", "xyz"],
          expected: 0.0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "jaroWinkler",
      code: `function jaroWinkler(s1, s2, p) {
  if (p === undefined) p = 0.1;
  if (s1 === s2) return 1;
  const n1 = s1.length, n2 = s2.length;
  if (n1 === 0 || n2 === 0) return 0;
  const w = Math.max(0, Math.floor(Math.max(n1, n2) / 2) - 1);
  const m1 = new Array(n1).fill(false), m2 = new Array(n2).fill(false);
  let matches = 0;
  for (let i = 0; i < n1; i++)
    for (let j = Math.max(0, i - w); j < Math.min(n2, i + w + 1); j++)
      if (!m2[j] && s1[i] === s2[j]) { m1[i] = m2[j] = true; matches++; break; }
  if (matches === 0) return 0;
  let t = 0, k = 0;
  for (let i = 0; i < n1; i++)
    if (m1[i]) { while (!m2[k]) k++; if (s1[i] !== s2[k]) t++; k++; }
  const j = (matches / n1 + matches / n2 + (matches - t / 2) / matches) / 3;
  let l = 0;
  for (let i = 0; i < Math.min(4, n1, n2); i++) { if (s1[i] === s2[i]) l++; else break; }
  return j + l * p * (1 - j);
}
`,
      tests: [
        {
          args: ["martha", "marhta"],
          expected: 0.9611111111111111,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "jw-q1",
      kind: "mcq",
      prompt: "What does Jaro-Winkler add to Jaro similarity?",
      options: [
        "A bonus for matching prefixes up to 4 characters",
        "A penalty for long strings",
        "A transposition count",
        "Edit distance normalization",
      ],
      answer: 0,
      explanation: "The Winkler modification adds ℓ·p·(1-j) for common prefix length ℓ.",
      hints: ["Think about the 'Winkler' part."],
      objective: "Prefix bonus",
    },
  ],
  exam: {
    definition: "Jaro-Winkler extends Jaro with a prefix bonus.",
    steps: [
      "Compute Jaro similarity j.",
      "Find common prefix length ℓ (max 4).",
      "JW = j + ℓ·p·(1-j).",
    ],
    timeComplexity: "$O(n \\cdot m)$.",
    spaceComplexity: "$O(n + m)$.",
    correctness: "Prefix bonus increases similarity for strings sharing a prefix.",
    applications: ["record linkage", "census matching", "deduplication"],
    limitations: ["Prefix length capped at 4; scaling factor must be ≤ 0.25"],
    faq: [
      {
        q: "Why cap prefix length at 4?",
        a: "Beyond 4, the prefix bonus could dominate and give misleadingly high scores for unrelated strings.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Jaro similarity (2).", "Winkler prefix bonus (2).", "Applications (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "W. E. Winkler, 'String Comparator Metrics and Enhanced Decision Rules', Proc. Section on Survey Research Methods, 1990.",
      supports: "Winkler extension.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
