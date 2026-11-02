import type { AlgorithmEntry } from "../types";

export const heldKarpEntry: AlgorithmEntry = {
  slug: "held-karp",
  name: "Held–Karp (Travelling Salesman by Dynamic Programming)",
  aliases: ["Bellman–Held–Karp", "TSP bitmask DP", "Travelling salesman problem", "Subset DP"],
  curriculum: [296],
  domain: "dynamic-programming",
  subcategory: "Bitmask DP",
  difficulty: "advanced",
  summary:
    "Solves the travelling salesman problem exactly in O(2ⁿ · n²) time by remembering, for every set of visited cities and every last city, the cheapest path. Still exponential, but far below the (n − 1)! tours of brute force.",
  tags: ["tsp", "bitmask", "subset dp", "np-hard", "hamiltonian cycle", "exact algorithm"],
  prerequisites: ["Memoization vs Tabulation (Top-Down and Bottom-Up DP)", "Bit manipulation"],
  related: ["assignment-dp", "memoization-tabulation", "dijkstra"],
  problem: {
    input: "A matrix of distances w[i][j] between n cities (not necessarily symmetric).",
    output:
      "The shortest tour that starts at city A, visits every city exactly once and returns to A.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Brute force tries every order of the cities, (n − 1)! of them. But the best way to finish a tour does not depend on the order in which the earlier cities were visited, only on **which** cities are done and **where** you stand now. So store one number per (set of visited cities, current city): the cheapest way to get into that situation.",
      },
      {
        kind: "p",
        text: "There are $2^{n-1} \\cdot n$ such situations, each computed from at most n smaller ones. For 20 cities that is about $4 \\cdot 10^8$ steps instead of $10^{17}$ tours.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[{A}][A] = 0.",
          "For sets S containing A, in increasing size, and each city j ≠ A in S: $dp[S][j] = \\min_{k \\in S \\setminus \\{j\\}} dp[S \\setminus \\{j\\}][k] + w[k][j]$.",
          "The answer is $\\min_j dp[\\text{all}][j] + w[j][A]$; remember the minimising k at each step to rebuild the tour.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset, four cities, asymmetric distances).",
      },
      {
        kind: "table",
        head: ["S", "end B", "end C", "end D"],
        rows: [
          ["{A, B}", "2", "—", "—"],
          ["{A, C}", "—", "9", "—"],
          ["{A, D}", "—", "—", "10"],
          ["{A, B, C}", "16 (via C)", "8 (via B)", "—"],
          ["{A, B, D}", "13 (via D)", "—", "6 (via B)"],
          ["{A, C, D}", "—", "22 (via D)", "17 (via C)"],
          ["{A, B, C, D}", "20 (via D)", "18 (via D)", "16 (via C)"],
        ],
      },
      {
        kind: "p",
        text: "Closing the tour: 20 + w[B][A] = 21, 18 + w[C][A] = 33, 16 + w[D][A] = 22. The best ends at B with 21; following the choices back gives A → C → D → B → A (9 + 8 + 3 + 1).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Represent S as a bitmask; iterating masks in increasing numeric order also works, since S \\ {j} < S.",
          "Memory is $O(2^n \\cdot n)$: about 20 million entries for n = 20, which is usually the practical limit.",
          "Store the argmin (or recompute it) to recover the tour.",
          "For symmetric distances, fixing the start city already removes rotations; reflections remain but do not change the asymptotics.",
          "For larger instances use branch and bound, integer programming (Concorde solves instances with thousands of cities), or heuristics such as 2-opt and Lin–Kernighan.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Optimal substructure.** If the best path through S ending at j enters j from k, its first part is the best path through S \\ {j} ending at k; otherwise replacing it would give a cheaper path. Hence the recurrence.",
      },
      {
        kind: "p",
        text: "**Cost.** Sets containing A: $2^{n-1}$; end cities: up to n; predecessors: up to n.",
      },
      { kind: "math", tex: "T(n) = O(2^n n^2), \\qquad S(n) = O(2^n n)" },
      {
        kind: "p",
        text: "TSP is NP-hard, and no algorithm with running time $O(1.9999^n)$ is known for general distances: Held–Karp's bound has stood since 1962. The property tests compare every result with brute force over all tours and count the transitions exactly.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The same subset DP solves Hamiltonian path, the shortest superstring, and scheduling with setup costs.",
          "For metric distances, Christofides' algorithm (1976) guarantees a tour at most 1.5 times optimal in polynomial time.",
          "Euclidean TSP has a polynomial-time approximation scheme (Arora; Mitchell).",
          "Bitmask DP needs exponential memory; inclusion–exclusion methods count Hamiltonian cycles in $2^n \\cdot \\text{poly}(n)$ time with only polynomial space.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(2^n n^2)", average: "O(2^n n^2)", worst: "O(2^n n^2)" },
    space: "O(2^n n)",
    worstClass: "2^n",
  },
  properties: [
    { label: "Exact", value: "Yes: an optimal tour, not an approximation" },
    { label: "Practical limit", value: "About 20 cities (memory)" },
  ],
  implementations: [
    {
      language: "python",
      entry: "tsp",
      code: `def tsp(w):
    n = len(w)
    INF = float("inf")
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0                          # visited {0}, standing at 0
    for mask in range(1 << n):
        if not mask & 1:
            continue
        for j in range(n):
            if dp[mask][j] == INF:
                continue
            for k in range(n):
                if mask & (1 << k):
                    continue
                nxt = mask | (1 << k)
                dp[nxt][k] = min(dp[nxt][k], dp[mask][j] + w[j][k])
    full = (1 << n) - 1
    return min(dp[full][j] + w[j][0] for j in range(n)) if n > 1 else 0
`,
      tests: [
        {
          args: [
            [
              [0, 2, 9, 10],
              [1, 0, 6, 4],
              [15, 7, 0, 8],
              [6, 3, 12, 0],
            ],
          ],
          expected: 21,
        },
        {
          args: [
            [
              [0, 3, 9, 9, 4],
              [3, 0, 2, 9, 9],
              [9, 2, 0, 5, 9],
              [9, 9, 5, 0, 1],
              [4, 9, 9, 1, 0],
            ],
          ],
          expected: 15,
        },
      ],
    },
    {
      language: "javascript",
      entry: "tspTour",
      code: `// Held–Karp with the tour: [cost, cities starting and ending at 0].
function tspTour(w) {
  const n = w.length, full = (1 << n) - 1;
  const dp = Array.from({ length: 1 << n }, () => new Array(n).fill(Infinity));
  const from = Array.from({ length: 1 << n }, () => new Array(n).fill(-1));
  dp[1][0] = 0;
  for (let mask = 1; mask <= full; mask += 2)
    for (let j = 0; j < n; j++) {
      if (dp[mask][j] === Infinity) continue;
      for (let k = 0; k < n; k++) {
        if (mask & (1 << k)) continue;
        const next = mask | (1 << k), c = dp[mask][j] + w[j][k];
        if (c < dp[next][k]) { dp[next][k] = c; from[next][k] = j; }
      }
    }
  if (n === 1) return [0, [0, 0]];
  let last = 1;
  for (let j = 2; j < n; j++)
    if (dp[full][j] + w[j][0] < dp[full][last] + w[last][0]) last = j;
  const tour = [0];
  for (let mask = full, j = last; j !== 0; ) {
    tour.push(j);
    const k = from[mask][j];
    mask ^= 1 << j;
    j = k;
  }
  tour.push(0);
  return [dp[full][last] + w[last][0], tour.reverse()];
}
`,
      tests: [
        {
          args: [
            [
              [0, 2, 9, 10],
              [1, 0, 6, 4],
              [15, 7, 0, 8],
              [6, 3, 12, 0],
            ],
          ],
          expected: [21, [0, 2, 3, 1, 0]],
        },
      ],
    },
  ],
  visualizer: "held-karp",
  practice: [
    {
      id: "hk-states",
      kind: "numeric",
      prompt:
        "With 4 cities and tours starting at A, how many sets S (containing A) does the table have rows for?",
      answer: 8,
      explanation: "Every subset of the other 3 cities, plus A: 2³ = 8.",
      hints: ["Each of the other cities is either in S or not."],
      objective: "Count the DP states",
    },
    {
      id: "hk-why",
      kind: "mcq",
      prompt: "Why is it enough to remember the set of visited cities and the current city?",
      options: [
        "The cheapest way to finish depends only on which cities are left and where you are, not on the order so far",
        "Because every tour visits the cities in alphabetical order",
        "Because the distances are symmetric",
        "Because the optimal tour never revisits a set",
      ],
      answer: 0,
      explanation:
        "That is optimal substructure: any two partial paths with the same set and end can be completed in exactly the same ways.",
      distractors: {
        1: "The order is exactly what the algorithm optimises.",
        2: "The method works for asymmetric distances too (the preset is asymmetric).",
        3: "The statement is vague and not the reason.",
      },
      hints: ["What information does the rest of the tour need?"],
      objective: "Understand the state",
    },
  ],
  exam: {
    definition:
      "Held–Karp solves TSP exactly with dynamic programming over subsets: dp[S][j] is the cheapest path from the start through exactly the cities in S, ending at j.",
    steps: [
      "dp[{0}][0] = 0.",
      "dp[S][j] = min over k ∈ S∖{j} of dp[S∖{j}][k] + w[k][j], sets in increasing size.",
      "Answer: min over j of dp[V][j] + w[j][0]; backtrack for the tour.",
    ],
    timeComplexity: "$O(2^n n^2)$.",
    spaceComplexity: "$O(2^n n)$.",
    correctness:
      "Optimal substructure: the prefix of an optimal path through S ending at j is optimal for S∖{j} and its own end.",
    applications: [
      "Exact TSP for small n",
      "Hamiltonian paths",
      "Job sequencing with setup costs",
      "Shortest superstring",
    ],
    limitations: ["Exponential time and memory", "Practical only up to about 20 cities"],
    faq: [
      {
        q: "Is there a polynomial algorithm?",
        a: "Not unless P = NP: TSP is NP-hard. Approximation algorithms and heuristics handle large instances.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Subset DP over (visited set, last city).", "$O(2^n n^2)$."] },
      {
        marks: 5,
        outline: [
          "State and recurrence (2).",
          "Base case and answer (1).",
          "Complexity (1).",
          "Comparison with brute force (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "TSP and its hardness (1).",
          "State, recurrence and order of evaluation (3).",
          "Worked example table (3).",
          "Correctness (1).",
          "Complexity and practical limits (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "M. Held, R. M. Karp, “A dynamic programming approach to sequencing problems,” Journal of the Society for Industrial and Applied Mathematics, 10(1), 1962.",
      supports: "The subset recurrence and its O(2ⁿn²) bound.",
    },
    {
      citation:
        "R. Bellman, “Dynamic programming treatment of the travelling salesman problem,” Journal of the ACM, 9(1), 1962.",
      supports: "The same dynamic programme, found independently.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
