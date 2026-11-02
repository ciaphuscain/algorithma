import type { AlgorithmEntry } from "../types";

export const minStackEntry: AlgorithmEntry = {
  slug: "min-stack",
  name: "Min Stack and Max Stack",
  aliases: ["Stack with getMin", "Stack with getMax", "Minimum stack"],
  curriculum: [113, 114],
  domain: "linear-structures",
  subcategory: "Stacks and queues",
  difficulty: "beginner",
  summary:
    "A stack that also reports its minimum (or maximum) in O(1): a second stack keeps the running minimums, pushed when a new value is at most the current minimum and popped when that value leaves.",
  tags: ["stack", "auxiliary stack", "minimum", "maximum", "data structure design"],
  prerequisites: ["Stacks"],
  related: ["queue-using-stacks", "monotonic-stack", "monotonic-queue"],
  problem: {
    input: "A sequence of operations: push x, pop, top, and min (or max).",
    output: "What each operation returns; every operation, including min, must take O(1) time.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Scanning the stack for its minimum costs $O(n)$. But a stack only changes at the top, so the minimum of the items below a given item never changes while that item is there. Remember, next to the stack, the history of minimums: a new value becomes the minimum if it is no larger than the current one, and when that value is popped, the previous minimum comes back — it is the next one down in the history.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "push(x): push x onto S. If M is empty or $x \\le$ top(M), push x onto M too.",
          "pop(): pop x from S. If $x$ = top(M), pop M too.",
          "top(): top(S). min(): top(M).",
          "For a max stack, use $\\ge$ instead of $\\le$.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): push 5, 3, 7, 3; then min, pop, min, pop, pop, min.",
      },
      {
        kind: "table",
        head: ["operation", "result", "S (bottom → top)", "M (bottom → top)"],
        rows: [
          ["push 5", "—", "5", "5"],
          ["push 3", "—", "5 3", "5 3"],
          ["push 7", "—", "5 3 7", "5 3"],
          ["push 3", "—", "5 3 7 3", "5 3 3"],
          ["min", "3", "5 3 7 3", "5 3 3"],
          ["pop", "3", "5 3 7", "5 3"],
          ["min", "3", "5 3 7", "5 3"],
          ["pop", "7", "5 3", "5 3"],
          ["pop", "3", "5", "5"],
          ["min", "5", "5", "5"],
        ],
      },
      {
        kind: "p",
        text: "The second 3 goes onto M because the test is $\\le$, not $<$. Had it been skipped, popping it would have removed the only 3 from M while a 3 was still on the stack, and the next min would wrongly answer 5. M never held more than 3 values, and the run made 6 comparisons, one per push after the first and one per pop.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Simplest version:** store pairs (value, minimum so far) on one stack. It always doubles the space but has no edge cases.",
          "**Space-saving version** (shown here): M only grows when the minimum does not increase; with a rising sequence of pushes, M stays at one item.",
          "**Duplicates:** use $\\le$ when pushing, or store (value, count) pairs on M. Using $<$ is the classic bug.",
          "**One-stack trick:** store $x - \\min$ differences and a single current minimum; it saves space but needs care with overflow.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Invariant.** M, read bottom to top, is the sequence of values of S that are no larger than every value below them in S (the “prefix minimums”, with repeats). So top(M) is the minimum of S. A push keeps the invariant: $x$ is a prefix minimum exactly when $x \\le$ the current minimum. A pop of $x$ removes $x$ from M exactly when $x$ was a prefix minimum, which (by the invariant) is exactly when $x$ = top(M).",
      },
      {
        kind: "p",
        text: "**Cost.** Each operation does at most one comparison and a constant number of stack operations: $O(1)$ worst case. M holds at most as many items as S. The tests compare every answer with a scan of the whole stack.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Two min-stacks make a **min-queue** (see the two-stack queue): $O(1)$ amortised minimum of a sliding window. The monotonic deque is the other standard solution.",
          "The same idea works for any associative operation with an identity: a stack can report the sum, gcd or maximum of its items by storing running aggregates.",
          "For both min and max at once, keep two auxiliary stacks.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    space: "O(n)",
    worstClass: "1",
    note: "Per operation; the auxiliary stack holds at most n values.",
  },
  properties: [
    { label: "Auxiliary stack", value: "The prefix minimums of the stack, with repeats" },
    { label: "Comparisons", value: "At most one per operation" },
  ],
  implementations: [
    {
      language: "python",
      entry: "run",
      code: `class MinStack:
    def __init__(self):
        self.s, self.m = [], []

    def push(self, x):
        self.s.append(x)
        if not self.m or x <= self.m[-1]:   # <= keeps repeated minimums
            self.m.append(x)

    def pop(self):
        x = self.s.pop()
        if x == self.m[-1]:
            self.m.pop()
        return x

    def get_min(self):
        return self.m[-1]

def run(ops):
    st, out = MinStack(), []
    for op in ops:
        if op.startswith("push"):
            st.push(int(op.split()[1]))
        elif op == "pop":
            out.append(st.pop())
        else:
            out.append(st.get_min())
    return out
`,
      tests: [
        {
          args: [
            ["push 5", "push 3", "push 7", "push 3", "min", "pop", "min", "pop", "pop", "min"],
          ],
          expected: [3, 3, 3, 7, 3, 5],
        },
      ],
    },
    {
      language: "javascript",
      entry: "run",
      code: `// A max stack storing (value, max so far) pairs: twice the space, no edge cases.
function run(ops) {
  const s = [];
  const out = [];
  for (const op of ops) {
    if (op.startsWith("push")) {
      const x = Number(op.split(" ")[1]);
      s.push([x, s.length ? Math.max(x, s[s.length - 1][1]) : x]);
    } else if (op === "pop") out.push(s.pop()[0]);
    else out.push(s[s.length - 1][1]);
  }
  return out;
}
`,
      tests: [
        {
          args: [["push 2", "push 9", "push 4", "max", "pop", "pop", "max"]],
          expected: [9, 4, 9, 2],
        },
      ],
    },
  ],
  visualizer: "min-stack",
  practice: [
    {
      id: "min-stack-aux",
      kind: "numeric",
      prompt:
        "Push 4, 6, 2, 2, 8 onto an empty min stack (with ≤). How many values does the auxiliary stack hold?",
      answer: 3,
      explanation:
        "4 (first), 2 (2 ≤ 4) and the second 2 (2 ≤ 2); 6 and 8 are larger than the minimum.",
      hints: ["A value goes onto M when it is at most the current minimum."],
      objective: "Trace the auxiliary stack",
    },
    {
      id: "min-stack-bug",
      kind: "mcq",
      prompt: "What goes wrong if the push test is $x <$ top(M) instead of $x \\le$ top(M)?",
      options: [
        "After pushing a repeated minimum and popping it, min reports a value larger than one still on the stack",
        "Pushes become $O(n)$",
        "Nothing: the two tests are equivalent",
        "The stack can no longer be popped",
      ],
      answer: 0,
      explanation:
        "The repeat is not recorded on M, but popping it pops M's only copy, so the minimum is forgotten while it is still on the stack.",
      distractors: {
        1: "Every operation stays $O(1)$.",
        2: "They differ exactly when values repeat.",
        3: "Pops still work on S.",
      },
      hints: ["Try push 3, push 3, pop, min."],
      objective: "Handle duplicates",
    },
  ],
  exam: {
    definition:
      "A min stack keeps, beside the stack, an auxiliary stack of prefix minimums, so push, pop, top and min all run in O(1).",
    steps: [
      "push x: push onto S; if M is empty or x ≤ top(M), push onto M.",
      "pop: pop x from S; if x = top(M), pop M.",
      "min: top(M).",
    ],
    timeComplexity: "$O(1)$ per operation.",
    spaceComplexity: "$O(n)$ extra in the worst case (a non-increasing sequence).",
    correctness: "M holds exactly the prefix minimums of S, so its top is the minimum.",
    applications: [
      "Undo histories that report a running best",
      "Min-queues for sliding windows",
      "Stock span style queries",
    ],
    limitations: [
      "Only the top can be removed; deleting arbitrary items needs a heap or a balanced tree",
    ],
    faq: [
      {
        q: "Max stack or min stack?",
        a: "Identical with the comparison reversed ($\\ge$); the curriculum lists both and this lesson covers both.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Auxiliary stack of minimums.", "Use ≤ for duplicates."] },
      {
        marks: 5,
        outline: ["Operations (2).", "Trace with a repeated minimum (2).", "$O(1)$ (1)."],
      },
    ],
  },
  references: [
    {
      citation: "R. Sedgewick, K. Wayne, Algorithms, 4th ed., Addison-Wesley, 2011, Section 1.3.",
      supports: "Stack implementations and their APIs.",
    },
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Stacks and queues that report minimums, and sliding-window minimums.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
