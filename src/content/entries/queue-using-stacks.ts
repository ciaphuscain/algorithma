import type { AlgorithmEntry } from "../types";

export const queueUsingStacksEntry: AlgorithmEntry = {
  slug: "queue-using-stacks",
  name: "Queue Using Stacks and Stack Using Queues",
  aliases: ["Two-stack queue", "Queue from two stacks", "Stack from a queue"],
  curriculum: [111, 112],
  domain: "linear-structures",
  subcategory: "Stacks and queues",
  difficulty: "beginner",
  summary:
    "Builds each container from the other. Two stacks make a queue whose operations cost O(1) amortised: items wait on one stack and are reversed onto the second only when it runs empty. One queue makes a stack by rotating the older items behind each new one, which costs O(n) per push.",
  tags: ["stack", "queue", "amortized analysis", "data structure design"],
  prerequisites: ["Stacks", "Queues"],
  related: ["min-stack", "circular-queue", "deque"],
  problem: {
    input:
      "A sequence of operations: enqueue x / dequeue / front for a queue, or push x / pop / top for a stack.",
    output:
      "What each operation returns, using only the other container's operations to store the items.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A stack reverses order; reversing twice restores it. Pour new items into stack In. When you need the oldest item, pour all of In into stack Out: the oldest is now on top. Keep serving from Out until it is empty, and only then pour again. Each item is poured at most once, so the occasional big pour is paid for by the cheap operations around it.",
      },
      {
        kind: "p",
        text: "The other way round: a queue serves its oldest item, but a stack must serve its newest. So after enqueuing a new item, take every older item off the front and put it back at the end. The new item is now at the front, where the next pop will find it.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Queue from two stacks.** enqueue(x): push x onto In.",
          "dequeue(): if Out is empty, pop every item of In and push it onto Out. Then pop Out. (front() looks at Out's top the same way.)",
          "**Stack from one queue.** push(x): enqueue x, then dequeue and re-enqueue the size − 1 older items.",
          "pop(): dequeue. top(): look at the front.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): enqueue 1, 2, 3; dequeue; enqueue 4; dequeue; dequeue; front; dequeue; dequeue.",
      },
      {
        kind: "table",
        head: [
          "operation",
          "result",
          "In (bottom → top)",
          "Out (bottom → top)",
          "transfers so far",
        ],
        rows: [
          ["enqueue 1, 2, 3", "—", "1 2 3", "", "0"],
          ["dequeue", "1 (after moving 3 items)", "", "3 2", "3"],
          ["enqueue 4", "—", "4", "3 2", "3"],
          ["dequeue", "2", "4", "3", "3"],
          ["dequeue", "3", "4", "", "3"],
          ["front", "4 (after moving 1 item)", "", "4", "4"],
          ["dequeue", "4", "", "", "4"],
          ["dequeue", "empty", "", "", "4"],
        ],
      },
      {
        kind: "p",
        text: "Four items, four transfers: each item moved from In to Out exactly once. In the second preset (a stack from one queue), pushing 1, 2 and 3 costs 0 + 1 + 2 = 3 rotations; after a pop, pushing 4 costs 2 more, so the run makes 5 transfers.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Move items only when Out is **empty**. Moving on every dequeue, or moving back after each one, breaks the order or the amortised bound.",
          "The queue from two stacks is a classic way to build a FIFO queue in a purely functional language, where lists are stacks: the Okasaki-style “banker's queue” keeps a front list and a reversed back list.",
          "A stack from queues is mainly an exercise: its push is $O(n)$. The two-queue variant (enqueue into an empty queue, then move the other queue's items behind it) has the same cost.",
          "Both adapters expose only the target interface; callers cannot tell how the items are stored.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Amortised cost of the two-stack queue.** Each item is pushed onto In once, moved to Out at most once, and popped from Out at most once: at most 4 stack operations per item over its lifetime. So any sequence of $m$ operations costs $O(m)$, which is $O(1)$ amortised per operation, even though a single dequeue may move $n$ items. (Potential method: let $\\Phi$ = 2 × the size of In. An enqueue raises $\\Phi$ by 2; a transfer of $k$ items costs $2k$ and lowers $\\Phi$ by $2k$.)",
      },
      {
        kind: "p",
        text: "**Correctness.** Invariant: the queue, front to back, is Out from top to bottom followed by In from bottom to top. Pushing onto In appends at the back; popping Out removes the front; moving In onto Out when Out is empty keeps the invariant because the reversal puts In's bottom (its oldest item) on Out's top.",
      },
      {
        kind: "p",
        text: "**Cost of the one-queue stack.** Pushing onto a stack of $s$ items makes $s$ rotations, so $n$ pushes make $0 + 1 + \\dots + (n-1) = n(n-1)/2$: $\\Theta(n)$ per push. The tests check this exact count and the two-stack bound (transfers never exceed enqueues) on every run.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Amortised $O(1)$ can be made worst-case $O(1)$: the real-time queue of Hood and Melville (1981) moves a few items on every operation instead of all at once.",
          "Two stacks also give a queue that answers “minimum of all items” in $O(1)$ amortised, by using min-stacks for In and Out — the basis of one sliding-window-minimum technique.",
          "Two stacks back to back in one array (one growing from each end) share space; three or more stacks in one array need moving boundaries.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(1) amortised", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "Two-stack queue: O(1) amortised per operation, O(n) for one dequeue that moves In. One-queue stack: O(n) per push.",
  },
  properties: [
    { label: "Transfers (queue from stacks)", value: "At most one per enqueued item" },
    { label: "Rotations (stack from a queue)", value: "$s$ for a push onto $s$ items" },
  ],
  implementations: [
    {
      language: "python",
      entry: "run_queue",
      code: `class TwoStackQueue:
    def __init__(self):
        self.inbox, self.outbox = [], []

    def enqueue(self, x):
        self.inbox.append(x)

    def dequeue(self):
        if not self.outbox:
            while self.inbox:                 # reverse In onto Out, once per item
                self.outbox.append(self.inbox.pop())
        return self.outbox.pop() if self.outbox else None

def run_queue(ops):
    """ops like ["enqueue 1", "dequeue"]; returns what each dequeue gave."""
    q, out = TwoStackQueue(), []
    for op in ops:
        if op.startswith("enqueue"):
            q.enqueue(int(op.split()[1]))
        else:
            out.append(q.dequeue())
    return out
`,
      tests: [
        {
          args: [
            [
              "enqueue 1",
              "enqueue 2",
              "enqueue 3",
              "dequeue",
              "enqueue 4",
              "dequeue",
              "dequeue",
              "dequeue",
              "dequeue",
            ],
          ],
          expected: [1, 2, 3, 4, null],
        },
      ],
    },
    {
      language: "javascript",
      entry: "runStack",
      code: `// A stack from one queue: rotate older items behind each new one.
class QueueStack {
  constructor() { this.q = []; }
  push(x) {
    this.q.push(x);
    for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift());
  }
  pop() { return this.q.length ? this.q.shift() : null; }
}

function runStack(ops) {
  const s = new QueueStack();
  const out = [];
  for (const op of ops) {
    if (op.startsWith("push")) s.push(Number(op.split(" ")[1]));
    else out.push(s.pop());
  }
  return out;
}
`,
      tests: [
        {
          args: [["push 1", "push 2", "push 3", "pop", "push 4", "pop", "pop"]],
          expected: [3, 4, 2],
        },
        { args: [["pop"]], expected: [null] },
      ],
    },
  ],
  visualizer: "queue-using-stacks",
  practice: [
    {
      id: "two-stack-transfers",
      kind: "numeric",
      prompt:
        "A two-stack queue receives enqueue 1, enqueue 2, dequeue, enqueue 3, dequeue, dequeue. How many items are moved from In to Out in total?",
      answer: 3,
      explanation:
        "The first dequeue moves 1 and 2 (2 transfers); the second finds 2 on Out; the third finds Out empty and moves 3 (1 transfer).",
      hints: ["Items move only when Out is empty."],
      objective: "Trace the two-stack queue",
    },
    {
      id: "two-stack-amortised",
      kind: "mcq",
      prompt:
        "Why is the two-stack queue $O(1)$ amortised even though one dequeue can move $n$ items?",
      options: [
        "Each item is moved from In to Out at most once in its lifetime",
        "Out never holds more than one item",
        "Moving items is free",
        "Dequeues are rarer than enqueues",
      ],
      answer: 0,
      explanation:
        "The expensive moves are paid for by the enqueues that created the moved items: at most one move per item overall.",
      distractors: {
        1: "Out can hold every item at once.",
        2: "Each move is a pop and a push.",
        3: "The bound holds for any mix of operations.",
      },
      hints: ["Count the moves per item, not per operation."],
      objective: "Amortised analysis",
    },
    {
      id: "queue-stack-rotations",
      kind: "numeric",
      prompt:
        "A stack built from one queue receives push 1, push 2, push 3, push 4. How many rotations (dequeue and re-enqueue) does it make?",
      answer: 6,
      explanation: "0 + 1 + 2 + 3 = 6: each push rotates every item already there.",
      hints: ["Push number $k$ rotates $k - 1$ items."],
      objective: "Cost of the queue-based stack",
    },
  ],
  exam: {
    definition:
      "A queue can be built from two stacks (In and Out, moving In to Out only when Out is empty) with O(1) amortised operations; a stack can be built from a queue by rotating the older items behind each pushed item, at O(n) per push.",
    steps: [
      "Queue: enqueue pushes onto In.",
      "Queue: dequeue pops Out, first moving all of In onto Out if Out is empty.",
      "Stack: push enqueues, then rotates size − 1 items; pop dequeues.",
    ],
    timeComplexity:
      "Two-stack queue: $O(1)$ amortised; queue-based stack: $O(n)$ push, $O(1)$ pop.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Out (top to bottom) followed by In (bottom to top) is always the queue in order; the rotation keeps the newest item at the front.",
    applications: [
      "Functional (immutable) queues",
      "Sliding-window minimum with two min-stacks",
      "Interview-style interface design",
    ],
    limitations: ["The two-stack queue has an O(n) worst case for a single dequeue"],
    faq: [
      {
        q: "Can the stack from queues be made cheap instead?",
        a: "Making pop expensive instead of push is possible (move all but the last item to a second queue on each pop), but one of the two operations is $O(n)$ either way.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Two stacks; move In to Out when Out is empty."] },
      {
        marks: 10,
        outline: [
          "Both constructions (4).",
          "Trace of an example (3).",
          "Amortised analysis by counting moves per item (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Exercises 10.1-6 and 10.1-7, and Chapter 17.",
      supports:
        "Implementing a queue with two stacks and a stack with two queues; amortised analysis.",
    },
    {
      citation:
        "C. Okasaki, Purely Functional Data Structures, Cambridge University Press, 1998, Chapter 5.",
      supports: "Queues as a pair of lists and their amortised analysis.",
    },
    {
      citation:
        "R. Hood, R. Melville, “Real-time queue operations in pure LISP,” Information Processing Letters, 13(2), 1981.",
      supports: "Worst-case O(1) queues from stacks.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
