import type { AlgorithmEntry } from "../types";

export const dpOnBrokenLinesConnectivityDpEntry: AlgorithmEntry = {
  slug: "dp-on-broken-lines-connectivity-dp",
  name: "DP on Broken Lines / Connectivity DP",
  aliases: ["Broken profile DP", "Profile DP", "Plug DP"],
  curriculum: [527],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary:
    "Solves grid problems (tiling, Hamiltonian paths, connectivity) by processing cells left-to-right, top-to-bottom, maintaining a bitmask or connectivity profile of the boundary between processed and unprocessed regions.",
  tags: ["dynamic programming", "bitmask", "grid", "profile", "connectivity"],
  prerequisites: ["Dynamic Programming Basics"],
  related: ["broken-profile-dp"],
  problem: {
    input: "A grid of size n×m with constraints (tiles, connections, etc.).",
    output: "The number of valid configurations (tilings, Hamiltonian paths, etc.).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "When filling a grid cell by cell, the 'broken line' or 'profile' is the jagged boundary between filled and unfilled cells. The DP state encodes what happens at this boundary — which cells have open connections, which plugs connect to which.",
      },
      {
        kind: "p",
        text: "For simple problems like domino tiling, a bitmask suffices. For Hamiltonian path problems, we need a connectivity encoding (which boundary plugs are connected) to track path fragments.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Process cells left-to-right, top-to-bottom.",
          "The state is the profile: a description of the boundary between processed and unprocessed cells.",
          "For each cell, try all valid placements and transition to the new profile.",
          "Count the number of ways to reach each final profile.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** For 2×3 domino tiling, the profile is a 2-bit mask of which cells in the current column are already covered by horizontal dominoes from the previous column.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "For tiling: profile is a bitmask of width m, giving 2^m states.",
          "For Hamiltonian paths: profile encodes connectivity of boundary plugs, typically using a compact encoding.",
          "Keep m as the smaller dimension to minimize the number of states.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**State count:** O(2^m) for bitmask profiles, O(C_m) (Catalan-like) for connectivity profiles where C_m ≈ 4^m/m^(3/2).",
      },
      {
        kind: "p",
        text: "**Complexity:** O(n × states × transitions_per_state). For bitmask tiling: O(n × 2^m × 2^m) = O(n × 4^m).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The transfer matrix method converts profile DP to matrix exponentiation, useful when n is huge.",
          "Connectivity profiles can be encoded efficiently using bracket sequences or hash maps.",
          "These techniques solve #P-hard counting problems on grids in pseudo-polynomial time.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n × 2^m)",
      average: "O(n × 4^m)",
      worst: "O(n × 4^m)",
    },
    space: "O(2^m)",
    worstClass: "2^n",
    note: "m = min dimension of the grid.",
  },
  properties: [
    {
      label: "Profile",
      value: "Bitmask or connectivity encoding",
    },
    {
      label: "Grid scan",
      value: "Left-to-right, top-to-bottom",
    },
    {
      label: "Applications",
      value: "Tiling, Hamiltonian paths, matching on grids",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "domino_tiling",
      code: `def domino_tiling(n, m):
    """Count ways to tile an n×m grid with 1×2 dominoes (0 if impossible)."""
    if (n * m) % 2 == 1:
        return 0
    if n < m:
        n, m = m, n  # keep m small
    dp = {0: 1}
    for row in range(n):
        for col in range(m):
            new_dp = {}
            for mask, ways in dp.items():
                bit = 1 << col
                if mask & bit:
                    # Cell already filled by vertical domino from above
                    key = mask ^ bit
                    new_dp[key] = new_dp.get(key, 0) + ways
                else:
                    # Place vertical domino (fills this cell and next row's cell)
                    key = mask | bit
                    new_dp[key] = new_dp.get(key, 0) + ways
                    # Place horizontal domino (if next column is free)
                    if col + 1 < m and not (mask & (1 << (col + 1))):
                        key2 = mask | (1 << (col + 1))
                        new_dp[key2] = new_dp.get(key2, 0) + ways
            dp = new_dp
    return dp.get(0, 0)
`,
      tests: [
        {
          args: [2, 3],
          expected: 3,
        },
        {
          args: [2, 2],
          expected: 2,
        },
        {
          args: [1, 1],
          expected: 0,
        },
        {
          args: [3, 4],
          expected: 11,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "profile-dp-state",
      kind: "mcq",
      prompt: "In profile DP for grid tiling, what does the bitmask represent?",
      options: [
        "Which boundary cells are already covered",
        "The number of dominoes placed",
        "Which rows are complete",
        "The color of each cell",
      ],
      answer: 0,
      explanation:
        "The bitmask tracks which cells at the boundary between processed and unprocessed regions are already occupied.",
      hints: ["Think about what information carries forward when processing cell by cell."],
      objective: "Understand the profile DP state",
    },
  ],
  exam: {
    definition:
      "Profile DP processes grid cells sequentially, maintaining a bitmask or connectivity encoding of the boundary.",
    steps: [
      "Scan cells left-to-right, top-to-bottom.",
      "State = boundary profile.",
      "Transition by placing tiles/connections.",
      "Count valid completions.",
    ],
    timeComplexity: "O(n × 4^m)",
    spaceComplexity: "O(2^m)",
    correctness:
      "The profile captures all information needed from processed cells to determine valid completions.",
    applications: ["Grid tiling", "Hamiltonian path counting on grids"],
    limitations: ["Exponential in the smaller grid dimension"],
    faq: [
      {
        q: "Why use the smaller dimension for m?",
        a: "The state space is 2^m, so smaller m gives fewer states.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Define the profile concept.", "Explain transitions for domino tiling."],
      },
    ],
  },
  references: [
    {
      citation: "A. V. Aho, J. D. Ullman, Foundations of Computer Science, W. H. Freeman, 1994.",
      supports: "Grid DP techniques.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
