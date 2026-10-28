import type { AlgorithmEntry } from "../types";

export const mctsEntry: AlgorithmEntry = {
  slug: "mcts",
  name: "Monte Carlo Tree Search (MCTS)",
  aliases: ["MCTS", "UCT", "Upper Confidence bounds applied to Trees"],
  curriculum: [455],
  domain: "ai-search",
  subcategory: "Game-tree search",
  difficulty: "advanced",
  summary:
    "Chooses a move by growing a search tree from random playouts: select a path with UCB1, add one node, play the rest of the game at random, and record who won along the path. Visits concentrate on promising moves; with enough iterations the choice approaches the minimax one.",
  tags: ["mcts", "uct", "ucb1", "game tree", "monte carlo", "bandits", "planning"],
  prerequisites: ["Depth-First Search", "Memoization vs Tabulation (Top-Down and Bottom-Up DP)"],
  related: ["dfs", "memoization-tabulation", "quickselect"],
  problem: {
    input:
      "A game position (here: a pile of stones; players alternately take 1, 2 or 3, and whoever takes the last stone wins), an iteration budget and a random seed.",
    output: "The recommended move: the root move visited most often.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Minimax looks at every line of play, which is hopeless for games like Go. MCTS instead **samples**: it plays many quick random games and keeps statistics on which first moves tend to win. It grows a tree as it goes, so the moves it has found promising get explored more deeply, and their statistics become more reliable.",
      },
      {
        kind: "p",
        text: "Each step down the tree balances **exploitation** (pick the child with the best win rate) and **exploration** (try children with few visits, whose win rate is uncertain). UCB1, a rule from multi-armed bandit problems, adds a bonus that shrinks as a child is visited more.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Selection: from the root, while the node has a child for every legal move, go to the child with the largest UCB1 score.",
          "Expansion: add a child for one untried move (here: the smallest untried take).",
          "Simulation: from the new node, play random legal moves until the game ends.",
          "Backpropagation: for the new node and each ancestor, add 1 to visits, and 1 to wins if the player who moved into that node won.",
          "After the budget, play the root move with the most visits.",
        ],
      },
      {
        kind: "math",
        tex: "\\mathrm{UCB1}(c) = \\frac{w_c}{n_c} + \\sqrt{2}\\,\\sqrt{\\frac{\\ln N}{n_c}}",
      },
      {
        kind: "p",
        text: "Here $w_c$ and $n_c$ are the child's wins and visits and N is the parent's visits. **The game's answer**: a position with a multiple of 4 stones is lost for the player to move (whatever they take, the opponent restores a multiple of 4), so from 7 stones the winning move is to take 3.",
      },
      {
        kind: "p",
        text: "**Worked example** (presets): 7 stones. With 40 iterations and seed 0, the visits for taking 1, 2, 3 are 11, 7 and 22, and MCTS takes 3. With seed 1, the same 40 iterations give 19, 5 and 16: it takes 1, a losing move, because random playouts after taking 1 happen to go well (15 wins out of 19). The same seed with 150 iterations gives 34, 9 and 107, and the right move.",
      },
      {
        kind: "table",
        head: ["Run", "Visits (take 1 / 2 / 3)", "Wins for the first player", "Chosen"],
        rows: [
          ["40 iterations, seed 0", "11 / 7 / 22", "5 / 2 / 16", "take 3 (wins)"],
          ["40 iterations, seed 1", "19 / 5 / 16", "15 / 1 / 12", "take 1 (loses)"],
          ["150 iterations, seed 1", "34 / 9 / 107", "", "take 3 (wins)"],
        ],
      },
      {
        kind: "p",
        text: "**Measured reliability** (pinned by the property tests): over 50 seeds for each winnable position from 1 to 11 stones (450 runs), the most visited move was the winning one in 357 runs with 40 iterations and in 393 runs with 150. For 7 stones alone: 44 of 50 seeds at 40 iterations, 50 of 50 at 150.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store wins from the point of view of the player who moved into each node; then every node's parent maximises the same quantity.",
          "Choose the final move by visits, not by win rate: a move with 2 wins from 2 visits is not better than 70 from 100.",
          "Random playouts are the weakest part. Real programs use cheap heuristic policies or, as in AlphaGo, a learned value function instead of (or with) playouts.",
          "The exploration constant √2 comes from UCB1's analysis for rewards in [0, 1]; in practice it is tuned.",
          "MCTS is anytime: stop when time runs out and play the current best move. Keep the subtree of the move actually played for the next turn.",
          "The JavaScript sample solves this small game exactly by dynamic programming, which is how the tests know the right answer.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**UCB1** (Auer, Cesa-Bianchi and Fischer) chooses among bandit arms so that the expected regret grows only logarithmically with the number of plays: each suboptimal arm is tried O(log N) times.",
      },
      {
        kind: "p",
        text: "**UCT** (Kocsis and Szepesvári) applies UCB1 at every node. They proved that, as the number of iterations grows, the probability of choosing a wrong move at the root tends to zero, so the estimate converges to the minimax value. Convergence can be slow: on a fixed budget MCTS is a heuristic, and the second preset shows it choosing a losing move.",
      },
      {
        kind: "p",
        text: "**Why random playouts mislead.** A playout estimates a move's value against random play, not against best play. After taking 1 from 7 stones, a random opponent often leaves a winnable position, so that move looks good until the tree is deep enough for the opponent's best replies to be found.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "AlphaGo and AlphaZero combined MCTS with deep networks: a policy network proposes moves (replacing uniform exploration) and a value network evaluates positions (replacing or supplementing playouts).",
          "Variants: RAVE and all-moves-as-first share statistics between moves; progressive widening handles large or continuous action spaces; information-set MCTS handles hidden information.",
          "Beyond games: planning in Markov decision processes, scheduling, and program synthesis.",
          "Parallel MCTS uses virtual losses so that threads explore different paths.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(I \\cdot d)", average: "O(I \\cdot d)", worst: "O(I \\cdot d)" },
    space: "O(I)",
    worstClass: "other",
    note: "I iterations, each walking a path and a playout of length at most d (the game length), plus the cost of evaluating legal moves. The tree gains at most one node per iteration.",
  },
  properties: [
    { label: "Anytime", value: "Yes: the current best move is always available" },
    {
      label: "Exactness",
      value: "Converges to minimax with enough iterations; heuristic on a fixed budget",
    },
    { label: "Needs", value: "A simulator for the game, not an evaluation function" },
  ],
  implementations: [
    {
      language: "python",
      entry: "mcts_move",
      code: `import math
import random


def mcts_move(stones, iterations, seed=0):
    # UCT for the take-1-2-or-3 game (taking the last stone wins); returns the
    # most visited first move.
    rng = random.Random(seed)
    # node: [stones, visits, wins for the player who moved here, children {move: node}]
    root = [stones, 0, 0, {}]
    for _ in range(iterations):
        node, path = root, [root]
        while node[0] > 0 and len(node[3]) == min(3, node[0]):          # selection
            parent = node
            node = max(parent[3].values(), key=lambda c: c[2] / c[1]
                       + math.sqrt(2 * math.log(parent[1]) / c[1]))
            path.append(node)
        if node[0] > 0:                                                  # expansion
            move = next(m for m in (1, 2, 3) if m <= node[0] and m not in node[3])
            node[3][move] = [node[0] - move, 0, 0, {}]
            node = node[3][move]
            path.append(node)
        left, mover_wins = node[0], True                                 # simulation
        while left > 0:
            left -= rng.randint(1, min(3, left))
            mover_wins = not mover_wins
        for depth, n in enumerate(reversed(path)):                       # backpropagation
            n[1] += 1
            n[2] += (depth % 2 == 0) == mover_wins
    return max(root[3], key=lambda m: (root[3][m][1], -m))
`,
      tests: [
        { args: [7, 2000, 0], expected: 3 },
        { args: [5, 2000, 0], expected: 1 },
        { args: [3, 10, 0], expected: 3 },
      ],
    },
    {
      language: "javascript",
      entry: "winningMove",
      code: `// Solve the take-1-2-or-3 game exactly: win[n] is true when the player to move
// with n stones can force a win. Returns a winning move, or 0 if every move loses.
function winningMove(stones) {
  const win = [false]; // with 0 stones the player to move has already lost
  for (let n = 1; n <= stones; n++) {
    win[n] = [1, 2, 3].some((m) => m <= n && !win[n - m]);
  }
  return [1, 2, 3].find((m) => m <= stones && !win[stones - m]) ?? 0;
}
`,
      tests: [
        { args: [7], expected: 3 },
        { args: [8], expected: 0 },
        { args: [10], expected: 2 },
      ],
    },
  ],
  visualizer: "mcts",
  practice: [
    {
      id: "mcts-game",
      kind: "numeric",
      prompt: "With 10 stones, how many should the first player take to force a win?",
      answer: 2,
      explanation:
        "Leave a multiple of 4: 10 − 2 = 8. Whatever the opponent takes, take 4 minus it.",
      hints: ["Positions with a multiple of 4 stones are lost for the player to move."],
      objective: "Know the exact answer MCTS approximates",
    },
    {
      id: "mcts-final",
      kind: "mcq",
      prompt: "After the search, which root move should be played?",
      options: [
        "The most visited one",
        "The one with the highest UCB1 score",
        "The one with the highest win rate, however few its visits",
        "A random one, weighted by wins",
      ],
      answer: 0,
      explanation:
        "Visits are the robust signal: UCB1 sends most visits to the best move, and a high win rate on few visits is unreliable.",
      distractors: {
        1: "UCB1 includes an exploration bonus meant for choosing what to search, not what to play.",
        2: "Two wins from two visits says little.",
        3: "Randomizing the final choice only weakens play here.",
      },
      hints: ["Which number is least affected by luck?"],
      objective: "Choose the final move",
    },
    {
      id: "mcts-ucb",
      kind: "numeric",
      prompt:
        "A child has 3 wins in 4 visits and its parent has 16 visits. What is its UCB1 score with c = √2, to two decimal places? (ln 16 ≈ 2.7726)",
      answer: 1.93,
      explanation: "3/4 + √2 · √(2.7726 / 4) = 0.75 + 1.4142 · 0.8326 ≈ 0.75 + 1.1774 = 1.93.",
      hints: ["Exploit term + exploration term."],
      objective: "Compute UCB1",
    },
  ],
  exam: {
    definition:
      "Monte Carlo tree search builds a partial game tree by repeated selection (UCB1), expansion, random simulation and backpropagation of results, and plays the most visited root move.",
    steps: [
      "Selection by UCB1",
      "Expansion of one node",
      "Random playout",
      "Backpropagation of the result",
    ],
    timeComplexity: "$O(I \\cdot d)$ for I iterations of depth at most d.",
    spaceComplexity: "$O(I)$ tree nodes.",
    correctness:
      "UCT's failure probability at the root tends to zero as the number of iterations grows (Kocsis and Szepesvári); on a finite budget it is a heuristic.",
    applications: [
      "Go, chess and other games (with learned evaluations)",
      "General game playing",
      "Planning under uncertainty",
      "Scheduling",
    ],
    limitations: [
      "Random playouts can mislead (traps, tactical positions)",
      "Needs many iterations for reliable choices",
      "Results vary with the random seed",
    ],
    faq: [
      {
        q: "Why not plain Monte Carlo (equal playouts for every move)?",
        a: "MCTS spends playouts where they matter and builds a tree, so the opponent's replies are searched too; plain sampling cannot see that a move fails against the best reply.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Four phases.", "UCB1 balances exploration and exploitation."] },
      {
        marks: 5,
        outline: ["Phases (2).", "UCB1 formula and meaning (2).", "Final move choice (1)."],
      },
      {
        marks: 10,
        outline: [
          "Motivation versus minimax (1).",
          "Four phases in detail (3).",
          "UCB1 and the bandit view (2).",
          "Worked example including a failure on a small budget (2).",
          "Convergence and modern variants (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "L. Kocsis, C. Szepesvári, “Bandit based Monte-Carlo planning,” in Machine Learning: ECML 2006, LNCS 4212, Springer, 2006, pp. 282–293.",
      supports: "UCT and its convergence to the minimax value.",
    },
    {
      citation:
        "R. Coulom, “Efficient selectivity and backup operators in Monte-Carlo tree search,” in Computers and Games 2006, LNCS 4630, Springer, 2007, pp. 72–83.",
      supports: "Monte Carlo tree search as a method.",
    },
    {
      citation:
        "P. Auer, N. Cesa-Bianchi, P. Fischer, “Finite-time analysis of the multiarmed bandit problem,” Machine Learning 47(2–3), 2002, pp. 235–256.",
      supports: "The UCB1 rule and its logarithmic regret.",
    },
    {
      citation:
        "C. B. Browne et al., “A survey of Monte Carlo tree search methods,” IEEE Transactions on Computational Intelligence and AI in Games 4(1), 2012, pp. 1–43.",
      supports: "Variants (RAVE, progressive widening, parallelisation) and applications.",
    },
    {
      citation:
        "D. Silver et al., “Mastering the game of Go with deep neural networks and tree search,” Nature 529, 2016, pp. 484–489.",
      supports: "MCTS combined with policy and value networks.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples, the worked example and the reliability measurements are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
