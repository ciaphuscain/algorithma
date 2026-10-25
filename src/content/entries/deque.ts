import type { AlgorithmEntry } from "../types";

export const dequeEntry: AlgorithmEntry = {
  slug: "deque",
  name: "Deque (Double-Ended Queue)",
  aliases: ["Double-ended queue", "Dequeue", "ArrayDeque"],
  curriculum: [124],
  domain: "linear-structures",
  subcategory: "Stacks and queues",
  difficulty: "beginner",
  summary:
    "A sequence that adds and removes at both ends in O(1). Stored in a ring buffer that doubles when full, every operation is O(1) amortised: pushing at the front just steps the head index back one slot, wrapping around.",
  tags: ["deque", "queue", "stack", "ring buffer", "dynamic array", "amortized analysis"],
  prerequisites: ["Queues", "Stacks", "Arrays"],
  related: ["circular-queue", "monotonic-queue", "queue-using-stacks"],
  problem: {
    input: "A sequence of pushFront x, pushBack x, popFront, popBack, front and back operations.",
    output: "What each operation returns, with O(1) amortised work per operation.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A deque is a stack and a queue at once: both ends are open. The circular queue already wraps its back end around the array; letting the front move backwards too (wrapping from slot 0 to the last slot) gives O(1) at both ends. To remove the fixed capacity, grow like a dynamic array: when it is full, copy everything into an array twice as large.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Keep head (the front slot), count and the array A (capacity $c$).",
          "pushFront(x): head ← (head − 1) mod $c$; A[head] ← x. pushBack(x): A[(head + count) mod $c$] ← x.",
          "popFront(): take A[head]; head ← (head + 1) mod $c$. popBack(): take A[(head + count − 1) mod $c$].",
          "Before a push into a full array: copy the items, front first, into slots 0, 1, … of an array of capacity $2c$, and set head ← 0.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset), starting with capacity 2.",
      },
      {
        kind: "table",
        head: ["operation", "result", "array (slots from 0)", "head", "front → back"],
        rows: [
          ["pushBack 1", "—", "1 ·", "0", "1"],
          ["pushBack 2", "—", "1 2", "0", "1 2"],
          ["pushFront 0", "grow to 4 (copy 2), then push", "1 2 · 0", "3", "0 1 2"],
          ["pushFront 9", "—", "1 2 9 0", "2", "9 0 1 2"],
          ["pushBack 3", "grow to 8 (copy 4), then push", "9 0 1 2 3 · · ·", "0", "9 0 1 2 3"],
          ["popFront", "9", "· 0 1 2 3 · · ·", "1", "0 1 2 3"],
          ["popBack", "3", "· 0 1 2 · · · ·", "1", "0 1 2"],
          ["front", "0", "", "", "0 1 2"],
          ["back", "2", "", "", "0 1 2"],
        ],
      },
      {
        kind: "p",
        text: "Two growths copied 2 + 4 = 6 items in total for 5 pushes. In the second preset the array stays at capacity 2, and head swings between the two slots as items are pushed at the front and popped at the back.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Python's `collections.deque` is a doubly linked list of fixed-size blocks; Java's `ArrayDeque` and Rust's `VecDeque` are growable ring buffers like this one. C++'s `std::deque` uses a map of fixed-size blocks, so pushes never move existing elements.",
          "Growing by a constant factor (2 here) is essential: growing by a fixed number of slots makes $n$ pushes cost $\\Theta(n^2)$.",
          "Shrinking (halving when a quarter full) keeps the space $O(\\text{count})$ without losing the amortised bound; halving when half full would not.",
          "Deques power the monotonic-queue sliding-window maximum, 0-1 BFS (push weight-0 edges at the front) and work-stealing schedulers (owners use one end, thieves the other).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Amortised cost of growth.** Starting from capacity 2 and doubling, the copies made before reaching capacity $c$ total $2 + 4 + \\dots + c/2 = c - 2$. The capacity is the smallest power of two at least the peak size $p$, so $c < 2p$ and the copies number fewer than $2p$ — fewer than two per push. Each push therefore costs $O(1)$ amortised (and every other operation $O(1)$ worst case).",
      },
      {
        kind: "p",
        text: "**Invariant.** The deque, front to back, is A[head], A[head + 1], …, A[head + count − 1] modulo the capacity. Growth copies the items in that order to slots 0 to count − 1, preserving it. The tests compare every result with a plain array model and check the capacity and copy count against the formulas above.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Purely functional deques with $O(1)$ worst-case operations exist (Kaplan and Tarjan, 1999), as do catenable deques that also concatenate in $O(1)$.",
          "The Chase–Lev deque is a lock-free work-stealing deque used in task-parallel runtimes.",
          "With a deque as its frontier, 0-1 BFS finds shortest paths in graphs whose edge weights are 0 or 1 in $O(V + E)$.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(1) amortised", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "A push that triggers growth copies every item; averaged over all pushes, fewer than two copies each.",
  },
  properties: [
    { label: "Copies while growing", value: "capacity − 2 in total, fewer than 2 × peak size" },
    { label: "Ends", value: "Both support push, pop and peek" },
  ],
  implementations: [
    {
      language: "python",
      entry: "run",
      code: `class ArrayDeque:
    def __init__(self):
        self.a, self.head, self.count = [None] * 2, 0, 0

    def _grow(self):
        c = len(self.a)
        self.a = [self.a[(self.head + i) % c] for i in range(self.count)] + [None] * c
        self.head = 0

    def push_front(self, x):
        if self.count == len(self.a):
            self._grow()
        self.head = (self.head - 1) % len(self.a)
        self.a[self.head] = x
        self.count += 1

    def push_back(self, x):
        if self.count == len(self.a):
            self._grow()
        self.a[(self.head + self.count) % len(self.a)] = x
        self.count += 1

    def pop_front(self):
        x = self.a[self.head]
        self.head = (self.head + 1) % len(self.a)
        self.count -= 1
        return x

    def pop_back(self):
        self.count -= 1
        return self.a[(self.head + self.count) % len(self.a)]

def run(ops):
    d, out = ArrayDeque(), []
    for op in ops:
        name, *arg = op.split()
        if name == "pushFront":
            d.push_front(int(arg[0]))
        elif name == "pushBack":
            d.push_back(int(arg[0]))
        elif name == "popFront":
            out.append(d.pop_front())
        else:
            out.append(d.pop_back())
    return [out, len(d.a)]
`,
      tests: [
        {
          args: [
            [
              "pushBack 1",
              "pushBack 2",
              "pushFront 0",
              "pushFront 9",
              "pushBack 3",
              "popFront",
              "popBack",
              "popFront",
            ],
          ],
          expected: [[9, 3, 0], 8],
        },
      ],
    },
    {
      language: "javascript",
      entry: "slidingMax",
      code: `// Maximum of every window of size k, with a deque of indices (values decreasing).
function slidingMax(a, k) {
  const dq = []; // used only at its two ends
  const out = [];
  for (let i = 0; i < a.length; i++) {
    while (dq.length && a[dq[dq.length - 1]] <= a[i]) dq.pop(); // back
    dq.push(i);
    if (dq[0] <= i - k) dq.shift(); // front
    if (i >= k - 1) out.push(a[dq[0]]);
  }
  return out;
}
`,
      tests: [
        { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
        { args: [[4, 2], 1], expected: [4, 2] },
      ],
    },
  ],
  visualizer: "deque",
  practice: [
    {
      id: "deque-head",
      kind: "numeric",
      prompt:
        "A deque in an array of capacity 8 has head = 0 and count = 3. After pushFront, which slot holds the new front?",
      answer: 7,
      explanation: "$(0 - 1) \\bmod 8 = 7$: the front wraps around to the last slot.",
      hints: ["head moves back one slot, modulo the capacity."],
      objective: "Ring-buffer index arithmetic",
    },
    {
      id: "deque-copies",
      kind: "numeric",
      prompt:
        "Starting from capacity 2 and doubling when full, how many items are copied in total while pushing 9 items (no pops)?",
      answer: 14,
      explanation:
        "Growths happen at sizes 2, 4 and 8, copying $2 + 4 + 8 = 14$ items; the final capacity is 16.",
      hints: ["Growth happens on the push that finds the array full."],
      objective: "Amortised growth",
    },
  ],
  exam: {
    definition:
      "A deque supports insertion and removal at both ends; a growable ring buffer gives O(1) amortised pushes and O(1) pops and peeks.",
    steps: [
      "pushFront: head ← (head − 1) mod c, write there.",
      "pushBack: write at (head + count) mod c.",
      "popFront / popBack: read A[head] or A[(head + count − 1) mod c].",
      "Full: copy into an array of twice the capacity, front first.",
    ],
    timeComplexity: "$O(1)$ amortised per push; $O(1)$ for pops and peeks.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "The items are always the count slots from head, modulo the capacity; growth preserves their order.",
    applications: [
      "Sliding-window maximum and minimum",
      "0-1 BFS",
      "Work-stealing schedulers",
      "Undo histories with a size limit",
    ],
    limitations: ["Random access in the middle is O(1) but insertion in the middle is O(n)"],
    faq: [
      {
        q: "Why not a doubly linked list?",
        a: "A linked list also gives O(1) at both ends, worst case, but uses extra pointers per item and has poor cache locality; array deques are usually faster.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Operations at both ends.", "Ring buffer that doubles."] },
      {
        marks: 10,
        outline: [
          "Index formulas for all four operations (4).",
          "Trace with wrap-around and growth (3).",
          "Amortised analysis of doubling (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 1: Fundamental Algorithms, 3rd ed., Addison-Wesley, 1997, Section 2.2.1.",
      supports: "Definitions of stacks, queues and deques.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Section 17.4.",
      supports: "Amortised analysis of tables that double (and halve).",
    },
    {
      citation:
        "H. Kaplan, R. E. Tarjan, “Purely functional, real-time deques with catenation,” Journal of the ACM, 46(5), 1999.",
      supports: "Worst-case O(1) functional deques.",
    },
    {
      citation:
        "D. Chase, Y. Lev, “Dynamic circular work-stealing deque,” Proceedings of the 17th ACM Symposium on Parallelism in Algorithms and Architectures (SPAA), 2005.",
      supports: "The lock-free work-stealing deque.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
