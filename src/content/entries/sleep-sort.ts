import type { AlgorithmEntry } from "../types";

export const sleepSortEntry: AlgorithmEntry = {
  slug: "sleep-sort",
  name: "Sleep Sort",
  aliases: ["Sleepsort"],
  curriculum: [49],
  domain: "searching-sorting",
  subcategory: "Specialized sorting",
  difficulty: "beginner",
  summary:
    "A joke algorithm: start one thread per value that sleeps for that long and then prints it; smaller values wake first. The real sorting is done by the operating system's timer queue (a priority queue), equal or close values can race, and the time taken grows with the largest value. Shown here in simulated time.",
  tags: ["sorting", "joke algorithm", "concurrency", "priority queue", "timers"],
  prerequisites: ["Priority queues"],
  related: ["binary-heap", "heap-sort", "counting-sort"],
  problem: {
    input: "Whole numbers 0–30.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Give every number its own alarm clock set to go off after that many seconds, and write each number down when its alarm rings. The smallest rings first. It looks like magic until you ask who keeps track of all the alarms — the scheduler, with a priority queue of wake-up times. Sleep sort just hands the sorting to it, and pays with time proportional to the largest value.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For each value x, start a thread: sleep(x), then append x to the output.",
          "Wait until all threads have finished.",
          "The output is in order of wake-up times.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the second preset): [20, 5, 12, 0, 8]. In simulated time the threads wake at 0, 5, 8, 12 and 20, writing 0, 5, 8, 12, 20. The run ends at time 20 — the largest value — no matter how few values there are.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "On a real system, threads for equal or nearly equal values may wake in either order, and scheduling delays can reorder values that differ by less than the timer resolution: the output is not guaranteed to be sorted.",
          "Here time is simulated and ties wake in input order, so the result is always correct — which hides exactly the problems that make sleep sort unusable.",
          "It is a popular exercise in explaining why an apparently O(n) algorithm is not: the work moves into the scheduler.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** n threads and a scheduler that keeps wake-ups in a priority queue: O(n log n) work, plus waiting time proportional to max(A) — so the running time depends on the values, not just their number. With a timer wheel or similar bucketed structure the scheduler behaves more like a counting sort. The tests check the output of the simulation.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "It appeared as an anonymous joke post on an internet forum in 2011, so it has no scholarly reference; the priority-queue view is standard (see CLRS, Chapter 6).",
          "Variants divide the sleep time by a constant to run faster — making races more likely.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n + max)",
      average: "O(n log n + max)",
      worst: "O(n log n + max)",
    },
    space: "O(n)",
    worstClass: "other",
    note: "Work done by the scheduler, plus waiting time proportional to the largest value.",
  },
  properties: [
    {
      label: "Correct?",
      value: "Only with ideal timers",
    },
    {
      label: "Who sorts",
      value: "The scheduler's timer queue",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "simulate",
      code: `import heapq

def simulate(a):
    """Simulate sleep sort with an event queue: (wake time, input position, value)."""
    events = [(x, i, x) for i, x in enumerate(a)]
    heapq.heapify(events)
    return [heapq.heappop(events)[2] for _ in range(len(events))]
`,
      tests: [
        {
          args: [[20, 5, 12, 0, 8]],
          expected: [0, 5, 8, 12, 20],
        },
        {
          args: [[3, 1, 4, 1, 5]],
          expected: [1, 1, 3, 4, 5],
        },
      ],
    },
    {
      language: "javascript",
      entry: "finishTime",
      code: `// When the last thread wakes: the largest value, however few values there are.
function finishTime(a) {
  return Math.max(...a);
}
`,
      tests: [
        {
          args: [[20, 5, 12, 0, 8]],
          expected: 20,
        },
      ],
    },
  ],
  visualizer: "sleep-sort",
  practice: [
    {
      id: "sleep-who",
      kind: "mcq",
      prompt: "In sleep sort, what actually orders the values?",
      options: [
        "The scheduler's queue of wake-up times",
        "The threads compare values",
        "The sleep function sorts its argument",
        "Nothing — it only works by chance",
      ],
      answer: 0,
      explanation: "Timers are kept in a priority queue; sleep sort delegates the sorting to it.",
      distractors: {
        "1": "Threads never compare values.",
        "2": "sleep just waits.",
        "3": "It works when timers are exact; the queue does the work.",
      },
      hints: ["Who decides which thread wakes next?"],
      objective: "Hidden priority queue",
    },
    {
      id: "sleep-time",
      kind: "numeric",
      prompt: "Sleep sort on [1, 2, 1000]: how many time units until it finishes?",
      answer: 1000,
      explanation: "The last thread wakes after the largest value.",
      hints: ["When does the last alarm ring?"],
      objective: "Running time",
    },
  ],
  exam: {
    definition: "Sleep sort starts a timer per value and outputs values as their timers expire.",
    steps: ["One sleeping thread per value.", "Output on wake-up."],
    timeComplexity: "O(n log n + max) including the scheduler.",
    spaceComplexity: "$O(n)$.",
    correctness: "Only with exact timers and no races.",
    applications: ["Teaching: hidden costs and concurrency"],
    limitations: ["Races", "Time grows with values", "Negative values"],
    faq: [
      {
        q: "Is it O(n)?",
        a: "No: the scheduler does O(n log n) work, and the wall-clock time grows with the largest value.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Idea (1).", "Hidden priority queue (2).", "Races and value-dependent time (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Chapter 6.",
      supports: "Priority queues, which a timer scheduler uses to order wake-ups.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
