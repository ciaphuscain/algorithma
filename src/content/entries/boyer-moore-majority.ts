import type { AlgorithmEntry } from "../types";

export const boyerMooreMajorityEntry: AlgorithmEntry = {
  slug: "boyer-moore-majority",
  name: "Boyer-Moore Majority Vote",
  aliases: ["Boyer–Moore majority vote", "MJRTY", "Majority element"],
  curriculum: [57],
  domain: "arrays-hashing",
  subcategory: "Array Techniques",
  difficulty: "intermediate",
  summary:
    "Find the value that occurs more than n/2 times, if there is one, in two passes and O(1) memory. The first pass pairs off different values and cancels them; a majority cannot be cancelled entirely, so it survives as the candidate. The second pass checks the candidate.",
  tags: ["majority", "voting", "streaming", "one pass", "cancellation"],
  prerequisites: ["Arrays"],
  related: ["reservoir-sampling", "quickselect"],
  problem: {
    input: "An array of n values.",
    output: "The value occurring more than n/2 times, or none.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In a room full of supporters of different candidates, ask any two people who support different candidates to leave together. Keep going until everyone left supports the same candidate. If some candidate had more than half the room, their supporters cannot all have been paired off, so the remaining people support them. If nobody had a majority, whoever remains proves nothing — hence a count at the end.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "count = 0. For each x: if count = 0, x becomes the candidate with count 1; else if x = candidate, count++; else count−−.",
          "Second pass: count the candidate's occurrences.",
          "It is the majority if it occurs more than n/2 times; otherwise there is none.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): [2, 2, 1, 1, 1, 2, 2]. The count goes 1, 2, 1, 0; the next 1 becomes the candidate, count 1; then 2 cancels it (0); the final 2 becomes the candidate. The second pass finds 4 of 7: a majority. For [3, 1, 3, 2, 1, 2] the survivor is 1, which occurs only twice: no majority.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The second pass is essential unless a majority is guaranteed.",
          "The first pass works on a stream, one element at a time, with two variables.",
          "Misra and Gries generalised it: with k − 1 counters, every value occurring more than n/k times survives as a candidate.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Correctness.** Each decrement cancels one occurrence of the candidate against one different value; each ‘new candidate’ step starts after everything so far has been cancelled in pairs of different values. If v occurs m > n/2 times, at most n − m < m of its occurrences can be cancelled (each cancellation uses a non-v value or an occurrence of v that cancels a non-v), so v must be the survivor. **Cost:** two passes, O(n) time, O(1) space. The tests compare with a frequency count.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Boyer and Moore devised it in 1980 and used it as a case study in mechanical verification of programs.",
          "The Misra–Gries summary is a basic streaming algorithm for heavy hitters.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(1)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Passes",
      value: "Two (one to find, one to verify)",
    },
    {
      label: "Memory",
      value: "One candidate and one counter",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "majority",
      code: `def majority(a):
    candidate, count = None, 0
    for x in a:
        if count == 0:
            candidate, count = x, 1
        elif x == candidate:
            count += 1
        else:
            count -= 1
    return candidate if a.count(candidate) * 2 > len(a) else None
`,
      tests: [
        {
          args: [[2, 2, 1, 1, 1, 2, 2]],
          expected: 2,
        },
        {
          args: [[3, 1, 3, 2, 1, 2]],
          expected: null,
        },
      ],
    },
    {
      language: "javascript",
      entry: "survivor",
      code: `// The first pass only: the survivor is the majority if there is one.
function survivor(a) {
  let candidate = null, count = 0;
  for (const x of a) {
    if (count === 0) { candidate = x; count = 1; }
    else if (x === candidate) count++;
    else count--;
  }
  return candidate;
}
`,
      tests: [
        {
          args: [[4, 5, 6, 7, 7, 7, 7]],
          expected: 7,
        },
        {
          args: [[3, 1, 3, 2, 1, 2]],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: "boyer-moore-majority",
  practice: [
    {
      id: "bm-verify",
      kind: "mcq",
      prompt: "Why is a second pass needed?",
      options: [
        "Without a majority, the survivor can be any value",
        "To find the majority's position",
        "Because the first pass may miss the majority",
        "To sort the array",
      ],
      answer: 0,
      explanation: "A majority always survives, but a survivor need not be a majority.",
      distractors: {
        "1": "Positions are not the goal.",
        "2": "A true majority is never missed.",
        "3": "No sorting is involved.",
      },
      hints: ["Try [1, 2, 3]."],
      objective: "Verification",
    },
    {
      id: "bm-run",
      kind: "numeric",
      prompt: "What is the count after the first pass on [1, 1, 2, 1, 3, 1, 1]?",
      answer: 3,
      explanation: "1, 2, 1, 2, 1, 2, 3.",
      hints: ["Track count element by element."],
      objective: "Run the algorithm",
    },
  ],
  exam: {
    definition:
      "The Boyer–Moore majority vote algorithm finds a value occurring more than n/2 times using one candidate and one counter.",
    steps: [
      "Pair off different values by incrementing and decrementing.",
      "The survivor is the only possible majority.",
      "Verify by counting.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "A majority has more occurrences than all other values together, so it cannot be cancelled entirely.",
    applications: ["Majority in streams", "Fault-tolerant voting"],
    limitations: ["Only the > n/2 majority (Misra–Gries for > n/k)"],
    faq: [
      {
        q: "Does it need the values to be comparable?",
        a: "Only equality tests are needed.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Algorithm (2).",
          "Cancellation argument (1).",
          "Verification pass (1).",
          "Complexity (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "R. S. Boyer, J S. Moore, “MJRTY — a fast majority vote algorithm,” in Automated Reasoning: Essays in Honor of Woody Bledsoe, Kluwer, 1991, pp. 105–117.",
      supports: "The algorithm and its correctness.",
    },
    {
      citation:
        "J. Misra, D. Gries, “Finding repeated elements,” Science of Computer Programming, 2(2), 1982, pp. 143–152.",
      supports: "The generalisation to values occurring more than n/k times.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
