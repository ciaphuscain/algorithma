import type { AlgorithmEntry } from "../types";

export const viterbiDecodingEntry: AlgorithmEntry = {
  slug: "viterbi-decoding",
  name: "Viterbi Decoding",
  aliases: ["Viterbi Algorithm"],
  curriculum: [545],
  domain: "compression",
  subcategory: "Error-Correcting Codes",
  difficulty: "intermediate",
  summary:
    "Finds the most likely sequence of hidden states in an HMM or the most likely transmitted codeword in a convolutional code using dynamic programming on a trellis.",
  tags: ["Viterbi", "trellis", "convolutional codes", "dynamic programming"],
  prerequisites: [],
  related: ["hidden-markov-models-forward-backward"],
  problem: {
    input: "Observed sequence and HMM/trellis parameters.",
    output: "Most likely state sequence.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Track the best path to each state at each time step. At each step, extend each path by one transition, keeping only the best path to each state (survivor path).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize: probability of starting in each state.",
          "For each observation:",
          "  For each state: find the previous state that maximizes P(path) * P(transition) * P(emission).",
          "  Store the best predecessor (backpointer) and score.",
          "Traceback from the highest-scoring final state.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use log-probabilities to avoid underflow. The trellis has |S| columns per time step, where |S| is the number of states.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(T \\cdot |S|^2)$ time where T is sequence length and |S| is state count. Space $O(T \\cdot |S|)$ for traceback.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "For convolutional codes, the Viterbi algorithm is maximum likelihood decoding on the code trellis. Soft-decision Viterbi uses continuous channel outputs for ~2dB gain over hard-decision.",
      },
    ],
  },
  complexity: {
    time: { best: "O(T \\cdot S^2)", average: "O(T \\cdot S^2)", worst: "O(T \\cdot S^2)" },
    space: "O(T \\cdot S)",
    worstClass: "n",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "viterbi",
      code: `import math

def viterbi(obs: list[int], states: list[int], start_p: list[float],
            trans_p: list[list[float]], emit_p: list[list[float]]) -> list[int]:
    T = len(obs)
    S = len(states)
    dp = [[float("-inf")] * S for _ in range(T)]
    bp = [[0] * S for _ in range(T)]
    for s in range(S):
        dp[0][s] = math.log(start_p[s] + 1e-10) + math.log(emit_p[s][obs[0]] + 1e-10)
    for t in range(1, T):
        for s in range(S):
            for ps in range(S):
                score = dp[t - 1][ps] + math.log(trans_p[ps][s] + 1e-10) + math.log(emit_p[s][obs[t]] + 1e-10)
                if score > dp[t][s]:
                    dp[t][s] = score
                    bp[t][s] = ps
    best = max(range(S), key=lambda s: dp[T - 1][s])
    path = [best]
    for t in range(T - 1, 0, -1):
        path.append(bp[t][path[-1]])
    return path[::-1]
`,
      tests: [
        {
          args: [
            [0, 1, 0],
            [0, 1],
            [0.6, 0.4],
            [
              [0.7, 0.3],
              [0.4, 0.6],
            ],
            [
              [0.5, 0.5],
              [0.1, 0.9],
            ],
          ],
          expected: [0, 0, 0],
        },
      ],
    },
    {
      language: "javascript",
      entry: "viterbi",
      code: `function viterbi(obs, states, startP, transP, emitP) {
  const T = obs.length, S = states.length;
  const dp = Array.from({length: T}, () => new Array(S).fill(-Infinity));
  const bp = Array.from({length: T}, () => new Array(S).fill(0));
  for (let s = 0; s < S; s++) dp[0][s] = Math.log(startP[s]+1e-10) + Math.log(emitP[s][obs[0]]+1e-10);
  for (let t = 1; t < T; t++) for (let s = 0; s < S; s++) for (let ps = 0; ps < S; ps++) {
    const score = dp[t-1][ps] + Math.log(transP[ps][s]+1e-10) + Math.log(emitP[s][obs[t]]+1e-10);
    if (score > dp[t][s]) { dp[t][s] = score; bp[t][s] = ps; }
  }
  let best = 0;
  for (let s = 1; s < S; s++) if (dp[T-1][s] > dp[T-1][best]) best = s;
  const path = [best];
  for (let t = T-1; t > 0; t--) path.push(bp[t][path[path.length-1]]);
  return path.reverse();
}
`,
      tests: [
        {
          args: [
            [0, 1, 0],
            [0, 1],
            [0.6, 0.4],
            [
              [0.7, 0.3],
              [0.4, 0.6],
            ],
            [
              [0.5, 0.5],
              [0.1, 0.9],
            ],
          ],
          expected: [0, 0, 0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "vit-q1",
      kind: "mcq",
      prompt: "Viterbi algorithm finds:",
      options: [
        "Most likely state sequence",
        "Sum of all path probabilities",
        "Random sample path",
        "Shortest path",
      ],
      answer: 0,
      explanation: "Viterbi does MAP decoding: the single most probable path.",
      hints: ["MAP."],
      objective: "Objective",
    },
  ],
  exam: {
    definition: "DP on trellis to find the most likely hidden state sequence.",
    steps: ["Initialize.", "Forward pass: best predecessor per state per time.", "Traceback."],
    timeComplexity: "$O(T \\cdot S^2)$.",
    spaceComplexity: "$O(T \\cdot S)$.",
    correctness: "Optimal substructure: best path to state s at time t extends a best path at t-1.",
    applications: ["Convolutional decoding", "speech recognition", "HMM inference"],
    limitations: ["Quadratic in state count; beam search for large state spaces"],
    faq: [
      {
        q: "Viterbi vs forward algorithm?",
        a: "Viterbi finds the single best path (max); forward sums over all paths.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Trellis structure (1).",
          "DP recurrence (2).",
          "Traceback (1).",
          "Applications (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "A. J. Viterbi, 'Error Bounds for Convolutional Codes and an Asymptotically Optimum Decoding Algorithm', IEEE IT, 1967.",
      supports: "Original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
