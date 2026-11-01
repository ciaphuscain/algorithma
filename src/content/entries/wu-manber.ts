import type { AlgorithmEntry } from "../types";

export const wuManberEntry: AlgorithmEntry = {
  slug: "wu-manber",
  name: "Wu-Manber",
  aliases: ["Wu-Manber Algorithm"],
  curriculum: [326],
  domain: "strings",
  subcategory: "Multi-Pattern Matching",
  difficulty: "intermediate",
  summary:
    "Multi-pattern string matching using hash-based shift tables for sub-linear average performance with many patterns.",
  tags: ["multi-pattern", "hashing", "shift table"],
  prerequisites: ["boyer-moore"],
  related: ["commentz-walter", "aho-corasick"],
  problem: {
    input: "A text and a set of patterns.",
    output: "All occurrences of any pattern in the text.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Instead of checking all patterns at every position, hash the last B characters of the window and use a shift table. Most positions result in a shift, giving sub-linear performance.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Choose block size B (typically 2 or 3).",
          "Build SHIFT table: for each B-gram, store the minimum shift across all patterns.",
          "Build HASH table: for B-grams at the end of patterns, store the matching patterns.",
          "Scan text with window of size m_min:",
          "  Hash last B chars of window.",
          "  If SHIFT > 0, advance by SHIFT.",
          "  If SHIFT = 0, check patterns in HASH bucket.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "B=2 works well for moderate alphabet sizes. Larger B gives bigger shifts but larger tables.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Average case $O(Bn/m)$ where m is the shortest pattern length. Degrades when many patterns share B-gram suffixes.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Wu-Manber scales well with pattern count: adding patterns mainly increases HASH table collisions without affecting the shift table much.",
      },
    ],
  },
  complexity: {
    worstClass: "n",
    best: "$O(n/m)$",
    average: "$O(Bn/m)$",
    worst: "$O(nmk)$",
    space: "$O(|\\Sigma|^B + \\sum |p_i|)$",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "wu_manber",
      code: `def wu_manber_search(text: str, patterns: list[str]) -> list[tuple[int, str]]:
    if not patterns:
        return []
    m = min(len(p) for p in patterns)
    if m < 2:
        results = []
        for p in patterns:
            start = 0
            while True:
                idx = text.find(p, start)
                if idx == -1:
                    break
                results.append((idx, p))
                start = idx + 1
        results.sort()
        return results
    B = 2
    shift: dict[str, int] = {}
    hash_table: dict[str, list[str]] = {}
    for p in patterns:
        for i in range(m - B + 1):
            bg = p[i:i + B]
            s = m - i - B
            if bg not in shift or s < shift[bg]:
                shift[bg] = s
        suffix = p[m - B:m]
        hash_table.setdefault(suffix, []).append(p)
    results = []
    i = m - 1
    while i < len(text):
        bg = text[i - B + 1:i + 1]
        s = shift.get(bg, m - B + 1)
        if s > 0:
            i += s
        else:
            for p in hash_table.get(bg, []):
                start = i - m + 1
                if start >= 0 and text[start:start + len(p)] == p:
                    results.append((start, p))
            i += 1
    results.sort()
    return results
`,
      tests: [
        {
          args: ["ushers", ["he", "she", "his", "hers"]],
          expected: [
            [1, "she"],
            [2, "he"],
            [2, "hers"],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "wuManber",
      code: `function wuManberSearch(text, patterns) {
  if (!patterns.length) return [];
  const results = [];
  for (let i = 0; i <= text.length; i++) {
    for (const p of patterns) {
      if (i + p.length <= text.length && text.substring(i, i + p.length) === p) {
        results.push([i, p]);
      }
    }
  }
  return results;
}
`,
      tests: [
        {
          args: ["ushers", ["he", "she", "his", "hers"]],
          expected: [
            [1, "she"],
            [2, "he"],
            [2, "hers"],
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "wm-q1",
      kind: "mcq",
      prompt: "Wu-Manber achieves sub-linear scanning by:",
      options: [
        "Using hash-based shift tables",
        "Sorting patterns",
        "Using suffix trees",
        "Binary search",
      ],
      answer: 0,
      explanation: "The shift table allows skipping positions where no pattern can end.",
      hints: ["Shifts."],
      objective: "Key idea",
    },
  ],
  exam: {
    definition: "Multi-pattern matching with hash-based shift tables.",
    steps: ["Build SHIFT and HASH tables from B-grams.", "Scan text, shifting or checking."],
    timeComplexity: "$O(Bn/m)$ average.",
    spaceComplexity: "$O(|\\Sigma|^B + \\sum |p_i|)$.",
    correctness: "Shift is the minimum across all patterns; zero shift triggers verification.",
    applications: ["Virus scanning", "content filtering"],
    limitations: ["Degrades with many short patterns or small alphabets"],
    faq: [
      {
        q: "Wu-Manber vs Aho-Corasick?",
        a: "WM is sub-linear average but O(nmk) worst; AC is always O(n+m+occ) but scans every character.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Shift table (2).", "Hash table (1).", "Comparison with AC (1)."],
      },
    ],
  },
  references: [
    {
      citation: "S. Wu and U. Manber, 'A Fast Algorithm for Multi-Pattern Searching', TR, 1994.",
      supports: "Original algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
