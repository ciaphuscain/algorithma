import type { AlgorithmEntry } from "../types";

export const persistentStackEntry: AlgorithmEntry = {
  slug: "persistent-stack",
  name: "Persistent Stack",
  aliases: ["Functional Stack", "Immutable Stack"],
  curriculum: [138],
  domain: "linear-structures",
  subcategory: "Linear Data Structures",
  difficulty: "intermediate",
  summary:
    "A stack that preserves all previous versions after each push or pop, implemented as a singly linked list where push creates a new head node and pop returns the tail — both O(1) and sharing structure with existing versions.",
  tags: ["persistent", "functional", "stack", "immutable", "linked list"],
  prerequisites: ["Stack"],
  related: ["persistent-queue"],
  problem: {
    input: "A sequence of push and pop operations on a stack.",
    output: "The result of each operation, with all previous versions still accessible.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A singly linked list is already naturally persistent: pushing creates a new node pointing to the old head (which is unchanged), and popping just returns the tail pointer. No existing nodes are modified, so all old versions are still valid.",
      },
      {
        kind: "p",
        text: "This is the simplest persistent data structure and the foundation for persistent queues, deques, and more.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Push: create a new node whose next pointer is the current head. Return the new node as the new version.",
          "Pop: return the head's value and the head's next pointer (the previous version).",
          "The old head is still accessible from any reference to the old version.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** push(1) → [1]. push(2) → [2→1]. pop() → 2, back to [1]. Both versions [2→1] and [1] exist.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "In garbage-collected languages, unreferenced versions are automatically freed.",
          "Each version is just a pointer to a linked list node.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Push and pop are both $O(1)$ time and space. Each version shares its tail with previous versions, so n pushes use O(n) total space.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Persistent stacks can represent version trees where each branch is a different sequence of operations.",
          "Used in backtracking algorithms to save and restore state efficiently.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
    },
    space: "O(1)",
    worstClass: "1",
    note: "O(1) per operation. Total O(n) for n pushes.",
  },
  properties: [
    {
      label: "Push/Pop",
      value: "$O(1)$",
    },
    {
      label: "Persistent",
      value: "All versions share structure",
    },
    {
      label: "Space per push",
      value: "$O(1)$ (one new node)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "PersistentStack",
      code: `class PersistentStack:
    def __init__(self, val=None, rest=None):
        self.val = val
        self.rest = rest
        self.size = 0 if val is None else (1 + (rest.size if rest else 0))

    def push(self, val):
        return PersistentStack(val, self if self.val is not None else None)

    def pop(self):
        if self.val is None:
            raise IndexError("empty stack")
        return self.val, self.rest or PersistentStack()

    def peek(self):
        if self.val is None:
            raise IndexError("empty stack")
        return self.val

def test_persistent_stack():
    s0 = PersistentStack()
    s1 = s0.push(1)
    s2 = s1.push(2)
    s3 = s2.push(3)
    top, s4 = s3.pop()
    # s2 is still [2, 1]
    return [top, s2.peek(), s4.peek()]
`,
      tests: [
        {
          args: [],
          expected: [3, 2, 2],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ps-sharing",
      kind: "mcq",
      prompt: "How does a persistent stack achieve O(1) push without copying?",
      options: [
        "The new node points to the old head; no existing nodes change",
        "It copies the entire list",
        "It uses a hash table",
        "It compresses the data",
      ],
      answer: 0,
      explanation:
        "Push just creates one new node pointing to the existing head — structural sharing.",
      hints: ["What does the new node's 'next' pointer point to?"],
      objective: "Understand structural sharing",
    },
  ],
  exam: {
    definition:
      "A persistent stack uses a singly linked list where push/pop create or follow pointers without modifying existing nodes.",
    steps: [
      "Push: new node → old head.",
      "Pop: return head value and tail pointer.",
      "Old versions remain accessible.",
    ],
    timeComplexity: "$O(1)$ per operation.",
    spaceComplexity: "$O(1)$ per push.",
    correctness:
      "No mutation means old references remain valid; structural sharing keeps space linear.",
    applications: ["Backtracking", "Functional programming", "Version control"],
    limitations: ["No random access"],
    faq: [
      {
        q: "Why is this naturally persistent?",
        a: "A singly linked list with no mutation is inherently persistent — push and pop never change existing nodes.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Structural sharing and O(1) operations (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "C. Okasaki, Purely Functional Data Structures, Cambridge University Press, 1998, Ch. 2.",
      supports: "Persistent stacks and lists.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
