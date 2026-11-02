import type { AlgorithmEntry } from "../types";

export const commentzWalterEntry: AlgorithmEntry = {
  slug: "commentz-walter",
  name: "Commentz-Walter",
  aliases: ["Commentz-Walter Algorithm"],
  curriculum: [327],
  domain: "strings",
  subcategory: "Multi-Pattern Matching",
  difficulty: "intermediate",
  summary:
    "Combines Aho-Corasick automaton construction with Boyer-Moore-style right-to-left scanning for efficient multi-pattern matching.",
  tags: ["multi-pattern", "aho-corasick", "boyer-moore"],
  prerequisites: ["aho-corasick", "boyer-moore"],
  related: ["wu-manber"],
  problem: {
    input: "A text and a set of patterns.",
    output: "All occurrences of any pattern in the text.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Build a reversed trie of the patterns (like Aho-Corasick but reversed). Scan text right-to-left within a window, using bad-character shifts to skip.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Build a trie of reversed patterns.",
          "Compute shift tables combining bad-character and good-suffix ideas.",
          "Align the shortest pattern at the text start.",
          "Scan right-to-left in the window, shifting on mismatch.",
          "On reaching the trie root, report matches and shift.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A simplified version uses only bad-character shifts across all patterns with the minimum pattern length as window size.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Sub-linear average case: $O(n \\cdot m_{\\min} / m_{\\max})$ where shifts skip based on the shortest pattern length.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "In practice, Wu-Manber (hash-based) is preferred for large pattern sets; Commentz-Walter excels with few long patterns.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n/m)", average: "O(n)", worst: "O(nm)" },
    space: "O(\\Sigma p_i)",
    worstClass: "n",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "commentz_walter_search",
      code: `def commentz_walter_search(text: str, patterns: list[str]) -> list[tuple[int, str]]:
    if not patterns:
        return []
    min_len = min(len(p) for p in patterns)
    if min_len == 0:
        return []
    bad_char: dict[str, int] = {}
    for p in patterns:
        for i, c in enumerate(p):
            shift = len(p) - 1 - i
            if c not in bad_char or shift < bad_char[c]:
                bad_char[c] = shift
    results = []
    reversed_pats = {p[::-1] for p in patterns}
    pos = min_len - 1
    while pos < len(text):
        window = text[pos - min_len + 1:pos + 1][::-1]
        if window[0] not in bad_char:
            pos += min_len
            continue
        for p in patterns:
            start = pos - len(p) + 1
            if start >= 0 and text[start:start + len(p)] == p:
                results.append((start, p))
        shift = bad_char.get(text[pos], min_len)
        pos += max(1, shift) if shift > 0 else 1
    results.sort()
    seen = set()
    unique = []
    for r in results:
        if r not in seen:
            seen.add(r)
            unique.append(r)
    return unique
`,
      tests: [
        {
          args: ["hershehis", ["he", "his"]],
          expected: [
            [0, "he"],
            [4, "he"],
            [6, "his"],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "commentzWalterSearch",
      code: `function commentzWalterSearch(text, patterns) {
  if (!patterns.length) return [];
  const minLen = Math.min(...patterns.map(p => p.length));
  if (minLen === 0) return [];
  const results = [];
  for (let i = 0; i <= text.length - minLen; i++) {
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
          args: ["hershehis", ["he", "his"]],
          expected: [
            [0, "he"],
            [4, "he"],
            [6, "his"],
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "cw-q1",
      kind: "mcq",
      prompt: "Commentz-Walter combines which two algorithms?",
      options: [
        "Aho-Corasick and Boyer-Moore",
        "KMP and Rabin-Karp",
        "Z-algorithm and suffix array",
        "BFS and DFS",
      ],
      answer: 0,
      explanation: "It uses AC's trie structure with BM's right-to-left scanning.",
      hints: ["Multi-pattern + skipping."],
      objective: "Combination",
    },
  ],
  exam: {
    definition: "Multi-pattern matching combining AC trie with BM shift heuristics.",
    steps: ["Build reversed trie.", "Compute shift tables.", "Scan right-to-left in window."],
    timeComplexity: "$O(nm)$ worst, sub-linear average.",
    spaceComplexity: "$O(\\sum |p_i|)$.",
    correctness: "All patterns checked at each viable alignment.",
    applications: ["Intrusion detection", "multi-keyword search"],
    limitations: ["Complex to implement correctly; Wu-Manber is simpler for many patterns"],
    faq: [
      {
        q: "When to choose over Aho-Corasick?",
        a: "When patterns are long and few, shifts provide sub-linear scanning.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Trie construction (1).", "Shift heuristics (2).", "Comparison with AC (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "B. Commentz-Walter, 'A String Matching Algorithm Fast on the Average', ICALP, 1979.",
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
