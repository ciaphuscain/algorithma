import type { AlgorithmEntry } from "../types";

export const sweepLineEntry: AlgorithmEntry = {
  slug: "sweep-line",
  name: "Sweep Line (Intervals)",
  aliases: ["Line sweep", "Event-based sweep", "Interval overlap count"],
  curriculum: [93],
  domain: "arrays-hashing",
  subcategory: "Further Array Techniques",
  difficulty: "intermediate",
  summary:
    "Turn every interval into a start event (+1) and an end event (−1), sort them by position (ends before starts at the same x, since intervals are half-open), and sweep left to right with a running count. The peak count is the most intervals overlapping at one point — for example, the number of meeting rooms needed: O(n log n).",
  tags: ["sweep line", "intervals", "events", "sorting", "overlap"],
  prerequisites: ["Sorting"],
  related: ["prefix-sums", "difference-array", "mo-algorithm"],
  problem: {
    input: "A list of half-open intervals [start, end).",
    output: "The largest number of intervals covering one point, and the first such point.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Imagine a timeline where guests arrive and leave. Instead of checking every minute, note only the arrivals and departures and walk through them in order: each arrival adds one to the room count, each departure subtracts one, and the peak is the answer.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For each interval [s, e), create two events: (s, +1) and (e, −1).",
          "Sort events by position. At equal positions, process −1 before +1 (because [a, b) does not include b).",
          "Sweep left to right: count += δ at each event. Track the maximum count and where it first occurs.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): intervals [1,5), [2,7), [4,9), [8,10), [9,12). The 10 events sorted are 1+, 2+, 4+, 5−, 7−, 8+, 9−, 9+, 10−, 12−. The count peaks at 3 when x = 4 (after the third start). The sweep reads all 10 events, finding that at most 3 intervals overlap, first at position 4.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Half-open intervals: [a, b) covers a but not b, so an end event at x = 5 fires before a start at x = 5. This is why ends sort before starts at the same position.",
          "For closed intervals [a, b], starts should sort before ends at the same position.",
          "The same pattern works for 2-D sweep lines (horizontal segments swept vertically, with an active set of segments): the Bentley–Ottmann algorithm for segment intersection is the classic example.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Creating events is O(n). Sorting is O(n log n). The sweep is O(n). Total O(n log n), dominated by sorting. The tests compare the result with a brute-force check at every integer point, verify that the timeline marks every interval as visited, and check that the reported maximum matches the trace's running count.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Sweep lines extend to 2-D: sweep a vertical line across horizontal intervals, maintaining an active set in a balanced BST or segment tree.",
          "The difference array is a discrete analogue: increment D[s] and decrement D[e], then take prefix sums.",
          "Weighted intervals use +w and −w events.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
    note: "Dominated by sorting the events.",
  },
  properties: [
    {
      label: "Events per interval",
      value: "2",
    },
    {
      label: "Sweep",
      value: "O(n)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "max_overlap",
      code: `def max_overlap(intervals):
    events = []
    for s, e in intervals:
        events.append((s, 1))
        events.append((e, -1))
    events.sort(key=lambda ev: (ev[0], ev[1]))
    count = best = 0
    at = None
    for x, d in events:
        count += d
        if count > best:
            best = count
            at = x
    return best, at
`,
      tests: [
        {
          args: [
            [
              [1, 5],
              [2, 7],
              [4, 9],
              [8, 10],
              [9, 12],
            ],
          ],
          expected: [3, 4],
        },
        {
          args: [
            [
              [0, 3],
              [3, 6],
              [6, 9],
            ],
          ],
          expected: [1, 0],
        },
      ],
    },
    {
      language: "javascript",
      entry: "maxOverlap",
      code: `function maxOverlap(intervals) {
  const events = intervals.flatMap(([s, e]) => [[s, 1], [e, -1]]);
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let count = 0, best = 0, at = null;
  for (const [x, d] of events) {
    count += d;
    if (count > best) { best = count; at = x; }
  }
  return [best, at];
}
`,
      tests: [
        {
          args: [
            [
              [1, 5],
              [2, 7],
              [4, 9],
              [8, 10],
              [9, 12],
            ],
          ],
          expected: [3, 4],
        },
      ],
    },
  ],
  visualizer: "sweep-line",
  practice: [
    {
      id: "sl-half",
      kind: "mcq",
      prompt:
        "For half-open intervals, why do end events sort before start events at the same position?",
      options: [
        "Because [a, b) does not include b, so an interval ending at x and one starting at x do not overlap",
        "To reduce the count faster",
        "It does not matter",
        "Because starts are always first",
      ],
      answer: 0,
      explanation:
        "Half-open: [2, 5) does not cover 5, so an end at 5 and a start at 5 do not overlap.",
      distractors: {
        "1": "The sort order reflects the interval semantics.",
        "2": "Changing the order changes the answer.",
        "3": "That would give a wrong result for half-open intervals.",
      },
      hints: ["Does [2, 5) include 5?"],
      objective: "Interval semantics",
    },
    {
      id: "sl-count",
      kind: "numeric",
      prompt: "Intervals [0,4), [1,3), [2,6), [5,8). What is the maximum overlap?",
      answer: 3,
      explanation: "At x = 2, all of [0,4), [1,3), [2,6) are active: count = 3.",
      hints: ["Check x = 2."],
      objective: "Manual trace",
    },
  ],
  exam: {
    definition:
      "A sweep line processes intervals as sorted events (start: +1, end: −1) to find the maximum overlap in O(n log n).",
    steps: [
      "Create +1 and −1 events from each interval.",
      "Sort events by position (ends before starts at ties for half-open intervals).",
      "Sweep: update a running count, track the maximum.",
    ],
    timeComplexity: "$O(n \\log n)$.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Every interval adds exactly one +1 and one −1; between a start and its end the count includes it.",
    applications: ["Meeting rooms", "Maximum bandwidth usage", "Interval scheduling"],
    limitations: ["Only finds the peak count, not which intervals overlap"],
    faq: [
      {
        q: "What if intervals are closed?",
        a: "Sort starts before ends at equal positions.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Events (1).", "Sort order for half-open (1).", "Sweep (2).", "Complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Sweep line algorithms.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
