import type { AlgorithmEntry } from "../types";

export const floydCycleEntry: AlgorithmEntry = {
  slug: "floyd-cycle",
  name: "Floyd's Cycle Detection (Tortoise and Hare)",
  aliases: ["Tortoise and hare", "Detect cycle in a linked list", "Find the start of a cycle"],
  curriculum: [103, 104],
  domain: "linear-structures",
  subcategory: "Linked lists",
  difficulty: "intermediate",
  summary:
    "Detects a cycle in a linked list with two pointers, one moving twice as fast as the other, and then finds the node where the cycle starts, all in constant extra space.",
  tags: ["linked list", "cycle detection", "two pointers", "constant space"],
  prerequisites: ["Reverse a Linked List (and in Groups of k)"],
  related: ["reverse-linked-list", "list-two-pointers", "pollard-rho"],
  problem: {
    input: "A singly linked list whose last node may point back to an earlier node.",
    output: "Whether there is a cycle and, if so, the first node of the cycle.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Two runners start at the head: the tortoise takes one step at a time, the hare two. If the list ends, the hare reaches the end first. If the list loops, both end up running round the loop, and the hare, gaining one node per step, must eventually land on the tortoise.",
      },
      {
        kind: "p",
        text: "Remembering every visited node would also find the cycle, but needs memory proportional to the list. The two-pointer trick needs only two variables.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Phase 1:** slow and fast start at the head. Repeat: slow moves one node, fast two. If fast reaches the end, there is no cycle; if they meet, there is one.",
          "**Phase 2:** put p at the head and q at the meeting node; move both one node at a time. They meet at the first node of the cycle.",
        ],
      },
      {
        kind: "heading",
        text: "Worked example: 3 → 1 → 4 → 1 → 5 → 9 → 2 → 6, and 6 points back to 4",
      },
      {
        kind: "p",
        text: "The tail before the cycle has $\\mu = 2$ nodes (3 and 1) and the cycle has $\\lambda = 6$ nodes (4, 1, 5, 9, 2, 6). Slow and fast meet after 6 steps, at the node 2 (position 6). Phase 2 then takes $\\mu = 2$ steps: p goes 3 → 1 → 4 and q goes 2 → 6 → 4, meeting at 4, position 2, where the cycle starts.",
      },
      {
        kind: "p",
        text: "In the other presets: when the whole list of five is a cycle ($\\mu = 0$, $\\lambda = 5$), the pointers meet back at the head after 5 steps; a list of six with no cycle ends after slow has moved twice, when fast has no two further nodes to jump.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Check `fast` and `fast.next` before jumping**, or the hare dereferences null at the end of an acyclic list.",
          "**Compare nodes, not values:** two different nodes can hold the same value (the example has two nodes with value 1).",
          "**Cycle length:** after meeting, keep one pointer still and count steps of the other until it returns: that is $\\lambda$.",
          "**Brent's algorithm** finds cycles with fewer function evaluations by teleporting the slow pointer at powers of two.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "When they meet" },
      {
        kind: "p",
        text: "Number the nodes along the walk $x_0, x_1, \\dots$ with tail length $\\mu$ and cycle length $\\lambda$, so $x_i = x_j$ for $i, j \\ge \\mu$ exactly when $i \\equiv j \\pmod \\lambda$. After $i$ steps slow is at $x_i$ and fast at $x_{2i}$; they coincide when $i \\ge \\mu$ and $\\lambda$ divides $2i - i = i$. So they first meet at the smallest $i \\ge \\max(\\mu, 1)$ that is a multiple of $\\lambda$, which is at most $\\mu + \\lambda$. In the example, the smallest multiple of 6 that is at least 2 is 6. The checker uses exactly this formula as an independent oracle.",
      },
      { kind: "heading", text: "Why phase 2 finds the start" },
      {
        kind: "p",
        text: "At the meeting, slow is at $x_i$ with $i$ a multiple of $\\lambda$. After $\\mu$ more steps, q is at $x_{i + \\mu}$, and $i + \\mu \\equiv \\mu \\pmod \\lambda$, so $x_{i+\\mu} = x_\\mu$: the cycle's first node. p, starting at the head, reaches $x_\\mu$ after the same $\\mu$ steps. Before that they cannot meet, because p is still in the tail and q is in the cycle.",
      },
      {
        kind: "p",
        text: "Total cost: $O(\\mu + \\lambda)$ steps and $O(1)$ extra space.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Any function iteration.** The same method finds cycles in $x, f(x), f(f(x)), \\dots$ for any function $f$ on a finite set: it is the heart of Pollard's rho factorization.",
          "**Finding a duplicate** in an array of $n + 1$ numbers from $1..n$: treat $i \\mapsto a[i]$ as a linked list; the cycle's start is the duplicate.",
          "**Pseudo-random generators:** cycle detection measures their period.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(\\mu + \\lambda)", worst: "O(n)" },
    space: "O(1)",
    worstClass: "n",
    note: "$\\mu$ = nodes before the cycle, $\\lambda$ = cycle length.",
  },
  properties: [
    { label: "Extra space", value: "Two pointers" },
    {
      label: "Meeting step",
      value: "Smallest multiple of $\\lambda$ that is $\\ge \\max(\\mu, 1)$",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "cycle_start",
      code: `def cycle_start(nxt, head=0):
    """nxt[i] is the index after node i, or None. Returns the cycle's first node or None."""
    slow = fast = head
    while fast is not None and nxt[fast] is not None:
        slow, fast = nxt[slow], nxt[nxt[fast]]
        if slow == fast:
            p, q = head, slow
            while p != q:
                p, q = nxt[p], nxt[q]
            return p
    return None
`,
      tests: [
        { args: [[1, 2, 3, 4, 5, 6, 7, 2]], expected: 2 },
        { args: [[1, 2, 3, 4, 0]], expected: 0 },
        { args: [[1, 2, 3, 4, 5, null]], expected: null },
      ],
    },
    {
      language: "javascript",
      entry: "meetingStep",
      code: `// The step at which slow and fast first meet, for tail length mu and cycle length lambda.
function meetingStep(mu, lambda) {
  let i = Math.max(1, mu);
  while (i % lambda !== 0) i++;
  return i;
}
`,
      tests: [
        { args: [2, 6], expected: 6 },
        { args: [0, 5], expected: 5 },
        { args: [7, 3], expected: 9 },
      ],
    },
  ],
  visualizer: "floyd-cycle",
  practice: [
    {
      id: "floyd-meet",
      kind: "numeric",
      prompt:
        "A list has 4 nodes before its cycle and a cycle of 3 nodes. After how many steps of the slow pointer do slow and fast first meet?",
      answer: 6,
      explanation: "The smallest multiple of $\\lambda = 3$ that is at least $\\mu = 4$ is 6.",
      hints: ["They meet at step $i$ when $i \\ge \\mu$ and $\\lambda$ divides $i$."],
      objective: "Predict the meeting step",
    },
    {
      id: "floyd-phase2",
      kind: "mcq",
      prompt:
        "In phase 2, why do p (from the head) and q (from the meeting node) meet at the cycle's start?",
      options: [
        "Both need exactly μ steps to reach it, because the meeting step is a multiple of λ",
        "Because q moves twice as fast",
        "Because the cycle start always holds the smallest value",
        "Because p and q start at the same node",
      ],
      answer: 0,
      explanation:
        "q is at a position that is a multiple of $\\lambda$; $\\mu$ more steps bring it to position $\\equiv \\mu$, the cycle start, which p also reaches after $\\mu$ steps.",
      distractors: {
        1: "In phase 2 both move one node per step.",
        2: "Values play no role; nodes are compared.",
        3: "p starts at the head and q at the meeting node.",
      },
      hints: ["Where is q after $\\mu$ more steps, modulo $\\lambda$?"],
      objective: "Explain phase 2",
    },
    {
      id: "floyd-null",
      kind: "mcq",
      prompt: "Which check must guard the fast pointer's move?",
      options: [
        "fast ≠ null and fast.next ≠ null",
        "slow ≠ fast",
        "fast.next.next ≠ null only",
        "slow ≠ null",
      ],
      answer: 0,
      explanation: "Fast reads `fast.next.next`, so both `fast` and `fast.next` must exist.",
      distractors: {
        1: "That decides whether a cycle was found, not whether the move is safe.",
        2: "Reading `fast.next.next` already needs `fast.next` to exist.",
        3: "Slow lags behind fast, so fast hits the end first.",
      },
      hints: ["What does the jump `fast.next.next` dereference?"],
      objective: "Guard against null",
    },
  ],
  exam: {
    definition:
      "Floyd's cycle-detection algorithm moves a slow pointer one step and a fast pointer two steps at a time; they meet if and only if the list has a cycle, and a second phase finds the cycle's first node.",
    steps: [
      "slow = fast = head; while fast and fast.next: slow = slow.next; fast = fast.next.next; if slow == fast: cycle.",
      "p = head; q = meeting node; while p ≠ q: advance both by one.",
      "p is the cycle's first node.",
    ],
    timeComplexity: "$O(\\mu + \\lambda) = O(n)$.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "They meet at the first $i \\ge \\mu$ divisible by $\\lambda$; from there, $\\mu$ more steps lead to the cycle start, which is also $\\mu$ steps from the head.",
    applications: [
      "Detecting corrupted or circular linked structures",
      "Pollard's rho factorization; period of pseudo-random generators",
      "Finding a duplicate number with $O(1)$ extra space",
    ],
    limitations: [
      "Needs $O(\\mu + \\lambda)$ steps; Brent's variant makes fewer evaluations of the next function",
    ],
    faq: [
      {
        q: "Can fast skip over slow without meeting?",
        a: "No: inside the cycle the gap shrinks by exactly one node per step.",
      },
      { q: "Why not use a hash set of visited nodes?", a: "That works but needs $O(n)$ memory." },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Slow and fast pointers; meeting means a cycle.", "$O(n)$ time, $O(1)$ space."],
      },
      { marks: 5, outline: ["Phase 1 (2).", "Phase 2 to find the start (2).", "Complexity (1)."] },
      {
        marks: 10,
        outline: [
          "Idea and phase 1 — 2.",
          "Proof that they meet, and when — 3.",
          "Phase 2 and its proof — 3.",
          "Complexity and applications — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 2: Seminumerical Algorithms, 3rd ed., Addison-Wesley, 1997, §3.1, Exercise 6.",
      supports: "The cycle-finding method, attributed there to R. W. Floyd, and its analysis.",
    },
    {
      citation: "R. P. Brent, “An improved Monte Carlo factorization algorithm”, BIT 20, 1980.",
      supports: "Brent's cycle-finding variant and its use in Pollard's rho.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
