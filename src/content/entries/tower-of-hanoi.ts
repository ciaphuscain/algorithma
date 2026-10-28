import type { AlgorithmEntry } from "../types";

export const towerOfHanoiEntry: AlgorithmEntry = {
  slug: "tower-of-hanoi",
  name: "Tower of Hanoi",
  aliases: ["Towers of Hanoi", "Tower of Brahma", "Lucas' tower"],
  curriculum: [122],
  domain: "linear-structures",
  subcategory: "Stacks and queues",
  difficulty: "beginner",
  summary:
    "Moves a stack of n disks between three pegs, one disk at a time and never a larger disk on a smaller one. The recursive solution, move n − 1 aside, move the largest, move n − 1 back, takes 2ⁿ − 1 moves, and no solution takes fewer.",
  tags: ["recursion", "stack", "puzzle", "divide and conquer", "exponential"],
  prerequisites: ["Recursion", "Stacks"],
  related: ["balanced-brackets", "memoization-tabulation"],
  problem: {
    input: "A number of disks $n$, stacked on peg A from largest (bottom) to smallest (top).",
    output:
      "A shortest sequence of moves that transfers them all to peg C, moving one top disk at a time and never placing a disk on a smaller one.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The largest disk is the key. It can only move when it is alone on its peg and the target peg is empty, so all the other $n - 1$ disks must then be stacked on the third peg. That gives the plan: move the $n - 1$ smaller disks to the spare peg (a smaller instance of the same puzzle), move the largest disk, and move the $n - 1$ disks on top of it. Each peg behaves as a stack: only its top disk can move.",
      },
    ],
    mechanics: [
      {
        kind: "code",
        language: "text",
        code: `hanoi(n, from, to, spare):
    if n = 0: return
    hanoi(n − 1, from, spare, to)
    move the top disk of from to to
    hanoi(n − 1, spare, to, from)`,
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): three disks, from A to C.",
      },
      {
        kind: "table",
        head: ["move", "disk", "from → to", "A", "B", "C"],
        rows: [
          ["", "", "start", "3 2 1", "", ""],
          ["1", "1", "A → C", "3 2", "", "1"],
          ["2", "2", "A → B", "3", "2", "1"],
          ["3", "1", "C → B", "3", "2 1", ""],
          ["4", "3", "A → C", "", "2 1", "3"],
          ["5", "1", "B → A", "1", "2", "3"],
          ["6", "2", "B → C", "1", "", "3 2"],
          ["7", "1", "A → C", "", "", "3 2 1"],
        ],
      },
      {
        kind: "p",
        text: "Moves 1–3 put the two smaller disks on B, move 4 moves the largest disk, and moves 5–7 bring the two disks onto it: $2^3 - 1 = 7$ moves. Four disks take 15 moves, and one disk takes 1.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The recursion depth is only $n$, but the output has $2^n - 1$ moves: 64 disks would need about $1.8 \\times 10^{19}$, so the visualizer stops at 6 disks (63 moves).",
          "**Iterative solution:** on odd-numbered moves, move the smallest disk one peg in a fixed cyclic direction (A → C → B → A when $n$ is odd, A → B → C → A when $n$ is even); on even-numbered moves, make the only legal move that does not involve the smallest disk.",
          "**Which disk moves at move $m$?** The disk numbered one more than the number of trailing zero bits of $m$ (counting disks from 1, smallest first), so disk 1 moves on every odd move. This is the ruler sequence 1, 2, 1, 3, 1, 2, 1, ….",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Number of moves.** The recursion makes $T(n) = 2T(n - 1) + 1$ moves with $T(0) = 0$, so $T(n) = 2^n - 1$ (adding 1 to both sides gives $T(n) + 1 = 2(T(n-1) + 1)$).",
      },
      {
        kind: "p",
        text: "**Optimality.** Any solution must at some point move the largest disk for the first time; at that moment the other $n - 1$ disks are all on the third peg, which took at least $T(n - 1)$ moves. After the largest disk's last move, the other disks must be moved onto it: at least $T(n - 1)$ more. So any solution takes at least $2T(n - 1) + 1$ moves, and the recursive one is the shortest. The tests replay every move sequence, checking that each move is legal and that the count is exactly $2^n - 1$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The puzzle was published by the French mathematician Édouard Lucas in 1883; the legend of the 64-disk Tower of Brahma came with it.",
          "With **four or more pegs** (Reve's puzzle), the Frame–Stewart algorithm is conjectured optimal; for four pegs its optimality was proved by Bousch in 2014.",
          "The states of the puzzle with $n$ disks form a graph that approximates the Sierpiński triangle; the shortest solution is a path between two of its corners.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(2^n)", average: "O(2^n)", worst: "O(2^n)" },
    space: "O(n)",
    worstClass: "2^n",
    note: "Exactly 2ⁿ − 1 moves; the recursion is n calls deep.",
  },
  properties: [
    { label: "Moves", value: "$2^n - 1$, the minimum possible" },
    { label: "Recursion depth", value: "$n$" },
  ],
  implementations: [
    {
      language: "python",
      entry: "hanoi",
      code: `def hanoi(n, source="A", target="C", spare="B"):
    """List of (from, to) moves transferring n disks from source to target."""
    if n == 0:
        return []
    return (hanoi(n - 1, source, spare, target)
            + [source + target]
            + hanoi(n - 1, spare, target, source))
`,
      tests: [
        { args: [3], expected: ["AC", "AB", "CB", "AC", "BA", "BC", "AC"] },
        { args: [1], expected: ["AC"] },
        { args: [0], expected: [] },
      ],
    },
    {
      language: "javascript",
      entry: "diskAtMove",
      code: `// Which disk (1 = smallest) moves at move m of the optimal solution: one more than
// the number of trailing zero bits of m.
function diskAtMove(m) {
  let disk = 1;
  while (m % 2 === 0) {
    m /= 2;
    disk++;
  }
  return disk;
}
`,
      tests: [
        { args: [1], expected: 1 },
        { args: [4], expected: 3 },
        { args: [6], expected: 2 },
        { args: [8], expected: 4 },
      ],
    },
  ],
  visualizer: "tower-of-hanoi",
  practice: [
    {
      id: "hanoi-moves",
      kind: "numeric",
      prompt: "How many moves does the shortest solution for 5 disks take?",
      answer: 31,
      explanation: "$2^5 - 1 = 31$.",
      hints: ["$T(n) = 2T(n-1) + 1$."],
      objective: "Count moves",
    },
    {
      id: "hanoi-largest",
      kind: "numeric",
      prompt: "With 4 disks, at which move (counting from 1) does the largest disk move?",
      answer: 8,
      explanation:
        "First the 3 smaller disks move aside in $2^3 - 1 = 7$ moves; the largest moves on move 8.",
      hints: ["How many moves clear the smaller disks out of the way?"],
      objective: "Recursive structure",
    },
    {
      id: "hanoi-why-exponential",
      kind: "mcq",
      prompt: "Why can no cleverer method solve the puzzle in fewer than $2^n - 1$ moves?",
      options: [
        "Before and after the largest disk moves, the other n − 1 disks must each time be moved as a whole tower",
        "Each disk must move exactly once",
        "Recursion always takes exponential time",
        "Only the smallest disk can move",
      ],
      answer: 0,
      explanation:
        "Moving the largest disk needs the other $n - 1$ stacked on the third peg, and afterwards they must be moved onto it: at least $2T(n-1) + 1$.",
      distractors: {
        1: "Smaller disks move many times: disk 1 moves $2^{n-1}$ times.",
        2: "Many recursive algorithms are polynomial; the lower bound comes from the puzzle.",
        3: "Every disk moves at some point.",
      },
      hints: ["Think about the first move of the largest disk."],
      objective: "Lower bound",
    },
  ],
  exam: {
    definition:
      "The Tower of Hanoi moves n disks between three pegs, one at a time, never placing a larger disk on a smaller one; the recursive solution takes the minimum 2ⁿ − 1 moves.",
    steps: [
      "Move n − 1 disks from the source to the spare peg (recursively).",
      "Move the largest disk to the target.",
      "Move the n − 1 disks from the spare to the target (recursively).",
    ],
    timeComplexity: "$\\Theta(2^n)$: exactly $2^n - 1$ moves.",
    spaceComplexity: "$O(n)$ recursion depth.",
    correctness:
      "By induction on n; the moves are legal because the largest disk is never on top of a moving smaller tower.",
    applications: [
      "Teaching recursion and recurrences",
      "Backup rotation schemes (the Tower of Hanoi rotation)",
      "Gray codes: the disk moved at each step follows the binary reflected Gray code",
    ],
    limitations: ["Exponential output: impractical beyond small n"],
    faq: [
      {
        q: "Is the recurrence $T(n) = 2T(n-1) + 1$ the same as for merge sort?",
        a: "No: merge sort halves the problem ($2T(n/2) + n$, giving $n \\log n$); here the problem only shrinks by one, which doubles the work at each level.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Three recursive steps.", "$2^n - 1$ moves."] },
      {
        marks: 10,
        outline: [
          "Algorithm (2).",
          "Trace for n = 3 (3).",
          "Solve the recurrence (2).",
          "Optimality argument (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "R. L. Graham, D. E. Knuth, O. Patashnik, Concrete Mathematics, 2nd ed., Addison-Wesley, 1994, Section 1.1.",
      supports:
        "The recursive solution, the recurrence and its solution, and the optimality argument.",
    },
    {
      citation:
        "T. Bousch, “La quatrième tour de Hanoï,” Bulletin of the Belgian Mathematical Society – Simon Stevin, 21, 2014.",
      supports: "Optimality of the Frame–Stewart algorithm for four pegs.",
    },
    {
      citation:
        "A. M. Hinz, S. Klavžar, U. Milutinović, C. Petr, The Tower of Hanoi – Myths and Maths, Birkhäuser, 2013.",
      supports: "History (Lucas, 1883), the iterative solution, and the state graphs.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
