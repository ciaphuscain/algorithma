import type { AlgorithmEntry } from "../types";

export const stateMachineDpEntry: AlgorithmEntry = {
  slug: "state-machine-dp",
  name: "State Machine DP",
  aliases: ["DP with States", "Finite Automaton DP"],
  curriculum: [255],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary:
    "State machine DP models a problem as transitions between a small number of named states, where the DP tracks the optimal value for being in each state at each step.",
  tags: ["dynamic programming", "state machine", "finite automaton"],
  prerequisites: ["Dynamic Programming"],
  related: ["state-compression-dp", "space-optimized-dp"],
  problem: {
    input:
      "A sequential decision problem where at each step you transition between a fixed set of states.",
    output: "The optimal value achievable after processing all steps.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Some DP problems naturally decompose into a few states with transitions. For example, in the stock trading problem with cooldown, at each day you are in one of three states: holding stock, not holding (free to buy), or in cooldown. The transitions between states capture the rules (buy, sell, rest), and the DP tracks the best profit in each state.",
      },
      {
        kind: "p",
        text: "By thinking of the problem as a finite automaton, the recurrence becomes clear: each state's value depends on the previous step's state values, and the number of states is small (constant).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Identify the distinct states (e.g., holding, not_holding, cooldown).",
          "Define the transitions and their costs/rewards.",
          "Initialize: set starting state values (e.g., day 0: not_holding=0, holding=-price[0]).",
          "For each step, compute each state's new value from the previous step's values.",
          "Answer is the best value among the final states.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (buy/sell with cooldown, prices=[1,2,3,0,2]): States: hold, free, cool. Day 0: hold=-1, free=0, cool=0. Day 1: hold=max(-1,0-2)=-1, free=max(0,0)=0, cool=-1+2=1. Day 2: hold=max(-1,0-3)=-1, free=max(0,1)=1, cool=-1+3=2. Day 3: hold=max(-1,1-0)=1, free=max(1,2)=2, cool=-1+0=-1. Day 4: hold=max(1,2-2)=1, free=max(2,-1)=2, cool=1+2=3. Answer: max(2,3)=3.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "O(n·S) time and O(S) space where S is the number of states (constant for most problems).",
          "Each state's update is a simple max/min of a few values.",
          "Works for stock trading, regex matching, sequence parsing, and game rules.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "With S constant states and n steps, time is O(n) and space is O(S) = O(1). The state machine makes the dependency structure explicit and eliminates case analysis errors.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Regex/pattern matching DP is a state machine over NFA states.",
          "Matrix exponentiation can speed up linear recurrences in state machine DP to O(S^3 log n).",
          "State machines compose: product automata handle multiple simultaneous constraints.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(1)",
    worstClass: "n",
    note: "Linear in the number of steps; constant number of states.",
  },
  properties: [
    {
      label: "States",
      value: "Small constant set",
    },
    {
      label: "Transitions",
      value: "Defined by problem rules",
    },
    {
      label: "Space",
      value: "O(S) = O(1) for constant S",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "max_profit_cooldown",
      code: `def max_profit_cooldown(prices):
    """Max profit from stock trading with 1-day cooldown after selling."""
    if not prices:
        return 0
    hold = -prices[0]
    free = 0
    cool = 0
    for i in range(1, len(prices)):
        new_hold = max(hold, free - prices[i])
        new_free = max(free, cool)
        new_cool = hold + prices[i]
        hold, free, cool = new_hold, new_free, new_cool
    return max(free, cool)
`,
      tests: [
        {
          args: [[1, 2, 3, 0, 2]],
          expected: 3,
        },
        {
          args: [[1]],
          expected: 0,
        },
        {
          args: [[1, 2]],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "sm-dp-states",
      kind: "mcq",
      prompt: "In the stock trading with cooldown problem, what are the DP states?",
      options: ["Holding, free, cooldown", "Buy, sell", "Profit, loss", "Long, short, neutral"],
      answer: 0,
      explanation:
        "The three states capture the current position: holding stock, free to buy, or in mandatory cooldown after selling.",
      hints: ["Think about what you can do on each day."],
      objective: "Identify states in a problem",
    },
  ],
  exam: {
    definition:
      "State machine DP tracks optimal values across a constant number of named states, with transitions at each step.",
    steps: [
      "Identify states.",
      "Define transitions and costs.",
      "Initialize.",
      "Iterate steps, updating each state.",
      "Read answer from final states.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) for constant states",
    correctness: "Correctness: transitions cover all legal moves; DP computes optimal per state.",
    applications: ["Stock trading variants", "Regex matching", "Sequence parsing"],
    limitations: ["Must correctly identify all states and transitions"],
    faq: [
      {
        q: "Can matrix exponentiation speed this up?",
        a: "Yes, if transitions are linear and n is huge, matrix exponentiation solves in O(S^3 log n).",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["State identification and transitions (1).", "Worked example (1)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 3rd ed., MIT Press, 2009.",
      supports: "DP techniques and state-based modeling.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
