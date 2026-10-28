import type { AlgorithmEntry } from "../types";

export const interpolationSearchEntry: AlgorithmEntry = {
  slug: "interpolation-search",
  name: "Interpolation Search",
  aliases: ["Phone-book search"],
  curriculum: [6],
  domain: "searching-sorting",
  subcategory: "Searching",
  difficulty: "intermediate",
  summary:
    "Searches a sorted array by estimating where the target should be from its value, as you would open a phone book near “S” for Smith. On evenly spread keys it takes about log log n probes; on skewed keys it can take n.",
  tags: ["searching", "sorted array", "interpolation", "average case"],
  prerequisites: ["Binary search"],
  related: ["binary-search", "exponential-search"],
  problem: {
    input: "A sorted array of numbers and a target $x$.",
    output: "An index $k$ with $A[k] = x$, or $-1$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Binary search always looks in the middle, ignoring the values. If the keys run from 10 to 100 and you want 70, the middle is a poor guess — about two thirds of the way along is much better. Interpolation search draws a straight line between the first and last keys of the range and probes where the target would lie on it.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Keep lo and hi; stop if the range is empty or x lies outside [A[lo], A[hi]].",
          "Probe pos = lo + ⌊(x − A[lo]) · (hi − lo) / (A[hi] − A[lo])⌋ (or lo if A[hi] = A[lo]).",
          "If A[pos] = x, return pos; if smaller, lo = pos + 1; if larger, hi = pos − 1.",
        ],
      },
      {
        kind: "p",
        text: "**Worked examples.** In [10, 20, …, 100], searching for 70 probes 0 + ⌊60 · 9 / 90⌋ = 6 and finds it at once. In the skewed array [1, 2, …, 9, 999] the line from 1 to 999 is so flat that searching for 9 probes positions 0, 1, 2, …, 8 in turn — 9 probes, worse than binary search's 4.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Guard the division when A[hi] = A[lo], and use wide integers for (x − A[lo]) · (hi − lo).",
          "Keys must be numbers (or mapped to numbers); interpolation needs to measure distances, not just compare.",
          "Hybrids such as interpolation-sequential or interpolation–binary search alternate the two to cap the worst case at O(log n).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Average case.** For keys drawn independently and uniformly at random, the expected number of probes is $\\log_2 \\log_2 n + O(1)$ (Perl, Itai and Avni, 1978; Yao and Yao, 1976). **Worst case:** if the keys grow exponentially, each probe may advance by one position, giving $\\Theta(n)$. The tests check every result against the array, including skewed random inputs.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Interpolation search is the idea behind learned indexes, which fit a model of the key distribution to predict positions.",
          "Database B-tree pages sometimes use interpolation within a page when keys are dense integers.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log log n)", worst: "O(n)" },
    space: "O(1)",
    worstClass: "n",
    note: "The average assumes uniformly distributed keys.",
  },
  properties: [
    { label: "Probe", value: "Linear interpolation between the ends" },
    { label: "Needs", value: "Numeric keys" },
  ],
  implementations: [
    {
      language: "python",
      entry: "probes",
      code: `def probes(a, x):
    """Number of probes interpolation search makes, and the index found (or -1)."""
    lo, hi, count = 0, len(a) - 1, 0
    while lo <= hi and a[lo] <= x <= a[hi]:
        pos = lo if a[hi] == a[lo] else lo + (x - a[lo]) * (hi - lo) // (a[hi] - a[lo])
        count += 1
        if a[pos] == x:
            return [count, pos]
        if a[pos] < x:
            lo = pos + 1
        else:
            hi = pos - 1
    return [count, -1]
`,
      tests: [
        { args: [[10, 20, 30, 40, 50, 60, 70, 80, 90, 100], 70], expected: [1, 6] },
        { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 999], 9], expected: [9, 8] },
      ],
    },
    {
      language: "javascript",
      entry: "firstProbe",
      code: `// The first position interpolation search probes.
function firstProbe(a, x) {
  const lo = 0, hi = a.length - 1;
  return lo + Math.floor(((x - a[lo]) * (hi - lo)) / (a[hi] - a[lo]));
}
`,
      tests: [
        { args: [[10, 20, 30, 40, 50, 60, 70, 80, 90, 100], 70], expected: 6 },
        { args: [[3, 9, 14, 22, 27, 31, 40, 46, 52, 59, 63, 71], 46], expected: 6 },
      ],
    },
  ],
  visualizer: "interpolation-search",
  practice: [
    {
      id: "interp-probe",
      kind: "numeric",
      prompt:
        "A has 11 keys from A[0] = 0 to A[10] = 200. Where does interpolation search first probe for 120?",
      answer: 6,
      explanation: "0 + ⌊120 · 10 / 200⌋ = 6.",
      hints: ["pos = lo + ⌊(x − A[lo]) · (hi − lo) / (A[hi] − A[lo])⌋."],
      objective: "Probe formula",
    },
    {
      id: "interp-worst",
      kind: "mcq",
      prompt: "When does interpolation search perform worst?",
      options: [
        "When the keys are very unevenly spread, e.g. growing exponentially",
        "When the keys are evenly spaced",
        "When the target is the first key",
        "When the array has an odd length",
      ],
      answer: 0,
      explanation:
        "Skewed keys make the linear estimate poor, so probes advance only a step at a time.",
      distractors: {
        1: "That is its best case.",
        2: "The target equal to A[lo] is found by the first probe.",
        3: "Length parity does not matter.",
      },
      hints: ["What assumption does the straight line make?"],
      objective: "Worst case",
    },
  ],
  exam: {
    definition:
      "Interpolation search probes the position predicted by linear interpolation between the range's end keys.",
    steps: ["Check x within [A[lo], A[hi]].", "Interpolate pos.", "Compare and shrink the range."],
    timeComplexity: "$O(\\log\\log n)$ expected for uniform keys; $O(n)$ worst case.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "The probe always lies in [lo, hi] when A[lo] ≤ x ≤ A[hi], and the range shrinks every step.",
    applications: [
      "Uniformly distributed numeric keys",
      "Learned indexes",
      "Dictionary-style lookups",
    ],
    limitations: ["Linear worst case", "Numeric keys only"],
    faq: [
      {
        q: "Why is the probe always in range?",
        a: "A[lo] ≤ x ≤ A[hi] makes the fraction (x − A[lo]) / (A[hi] − A[lo]) lie between 0 and 1.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Formula (2).",
          "Average and worst case (2).",
          "Comparison with binary search (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "Y. Perl, A. Itai, H. Avni, “Interpolation search — a log log N search,” Communications of the ACM, 21(7), 1978.",
      supports: "The log log n expected probes for uniform keys.",
    },
    {
      citation:
        "A. C. Yao, F. F. Yao, “The complexity of searching an ordered random table,” Proceedings of the 17th IEEE Symposium on Foundations of Computer Science, 1976.",
      supports: "Analysis of interpolation search on random tables.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
