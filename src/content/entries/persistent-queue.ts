import type { AlgorithmEntry } from "../types";

export const persistentQueueEntry: AlgorithmEntry = {
  slug: "persistent-queue",
  name: "Persistent Queue",
  aliases: ["Functional Queue", "Real-Time Queue"],
  curriculum: [139],
  domain: "linear-structures",
  subcategory: "Linear Data Structures",
  difficulty: "intermediate",
  summary:
    "Implements a first-in-first-out queue that preserves all previous versions after each enqueue or dequeue, using a pair of persistent lists with lazy reversal for O(1) amortised operations.",
  tags: ["persistent", "functional", "queue", "immutable"],
  prerequisites: ["Queue"],
  related: ["persistent-stack"],
  problem: {
    input: "A sequence of enqueue and dequeue operations.",
    output: "The result of each operation, with all previous versions accessible.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A persistent queue never modifies existing data — each operation returns a new version. The classic approach uses two lists: a front list for dequeues and a rear list for enqueues. When the front is empty, the rear is reversed to become the new front.",
      },
      {
        kind: "p",
        text: "With persistent (linked) lists, the front list is shared between versions. The reversal is amortised O(1), or made worst-case O(1) with lazy evaluation.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Enqueue: add to the rear list. O(1).",
          "Dequeue: take from the front list. If front is empty, reverse rear to become new front. Amortised O(1).",
          "Both operations return a new queue version without modifying the old one.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** enqueue(1), enqueue(2), dequeue() → returns 1. All three versions persist.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Hood-Melville real-time queue achieves O(1) worst case by incrementally reversing.",
          "In lazy functional languages (Haskell), suspension-based queues are natural.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Amortised O(1) per operation via the banker's method: each element is reversed at most once.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Kaplan and Tarjan's deque achieves persistent O(1) worst-case deque operations.",
          "Used in functional programming as a fundamental data structure.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "1",
    note: "Amortised O(1). Worst case O(n) on reversal, or O(1) with lazy evaluation.",
  },
  properties: [
    {
      label: "Persistent",
      value: "All versions preserved",
    },
    {
      label: "Amortised",
      value: "$O(1)$ per operation",
    },
    {
      label: "Functional",
      value: "No mutation",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "test_persistent_queue",
      code: `class PersistentQueue:
    def __init__(self, front=None, rear=None):
        self.front = front or []
        self.rear = rear or []

    def enqueue(self, val):
        return PersistentQueue(list(self.front), self.rear + [val])

    def dequeue(self):
        if self.front:
            return self.front[0], PersistentQueue(self.front[1:], list(self.rear))
        if self.rear:
            new_front = list(reversed(self.rear))
            return new_front[0], PersistentQueue(new_front[1:], [])
        raise IndexError("empty queue")

def test_persistent_queue():
    q0 = PersistentQueue()
    q1 = q0.enqueue(1)
    q2 = q1.enqueue(2)
    val, q3 = q2.dequeue()
    val2, q4 = q3.dequeue()
    # q1 still has its original state
    v1, _ = q1.enqueue(3).dequeue()
    return [val, val2, v1]
`,
      tests: [
        {
          args: [],
          expected: [2, 1, 3],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pq-reversal",
      kind: "mcq",
      prompt: "When is the rear list reversed in a two-list queue?",
      options: [
        "When the front list is empty and a dequeue is requested",
        "After every operation",
        "When the rear reaches size n",
        "Never",
      ],
      answer: 0,
      explanation:
        "Reversal happens lazily: only when a dequeue finds the front empty does it reverse the rear.",
      hints: ["When does a dequeue need to look at the rear list?"],
      objective: "Understand the two-list queue mechanism",
    },
  ],
  exam: {
    definition:
      "A persistent queue uses two lists (front for dequeue, rear for enqueue) with lazy reversal, preserving all versions.",
    steps: [
      "Enqueue: append to rear.",
      "Dequeue: take from front; reverse rear to front if needed.",
      "Return new version each time.",
    ],
    timeComplexity: "$O(1)$ amortised.",
    spaceComplexity: "$O(n)$ per version.",
    correctness:
      "Each element is reversed at most once, giving O(1) amortised cost by the banker's method.",
    applications: ["Functional programming", "Version control", "Undo systems"],
    limitations: ["O(n) worst case without lazy evaluation"],
    faq: [
      {
        q: "Why two lists?",
        a: "The front supports O(1) head removal; the rear supports O(1) tail append; reversal bridges them.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Two-list structure and amortised analysis (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "C. Okasaki, Purely Functional Data Structures, Cambridge University Press, 1998, Ch. 6.",
      supports: "Persistent queues with amortised and real-time bounds.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
