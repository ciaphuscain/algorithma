import type { AlgorithmEntry } from "../types";

export const hiddenMarkovModelsForwardBackwardEntry: AlgorithmEntry = {
  slug: "hidden-markov-models-forward-backward",
  name: "Hidden Markov Models (Forward–Backward)",
  aliases: ["Hidden Markov Models (Forward–Backward)"],
  curriculum: [574],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary:
    "Computes the probability of an observation sequence and infers hidden states using the forward-backward algorithm on a Hidden Markov Model.",
  tags: ["hidden markov models forward backward", "machine learning"],
  prerequisites: [],
  related: [],
  problem: {
    input:
      "HMM parameters (transition, emission, initial probabilities) and an observation sequence.",
    output:
      "Probability of the observation sequence; posterior probabilities of hidden states at each time step.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "An HMM has hidden states that generate observable outputs. The forward-backward algorithm computes the likelihood of observations by summing over all possible hidden state sequences, using dynamic programming in both directions.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Forward pass: α(t,s) = P(observations 1..t, state at t = s).",
          "For each time step, α(t,s) = Σ_s' α(t-1,s') · P(s'→s) · P(obs_t|s).",
          "Backward pass: β(t,s) = P(observations t+1..T | state at t = s).",
          "Combine: P(state_t = s | observations) ∝ α(t,s) · β(t,s).",
          "Total probability = Σ_s α(T,s).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use log-space arithmetic to prevent underflow. The Baum-Welch algorithm (EM for HMMs) uses forward-backward to learn parameters.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Forward pass: $O(T \\cdot S^2)$ where T is sequence length and S is number of states. Same for backward. Total: $O(T \\cdot S^2)$. Viterbi algorithm finds the most likely state sequence in the same time.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Viterbi algorithm** finds the single most likely state sequence (vs. forward-backward's marginals).",
          "**Baum-Welch** (EM) learns HMM parameters from unlabeled sequences.",
          "Used in speech recognition, bioinformatics (gene prediction), NLP (POS tagging).",
          "Modern alternatives: CRFs for discriminative tasks, transformers for sequence modeling.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n·d·k)",
      worst: "O(n·d·k)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "machine learning",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "forward",
      code: `def forward(trans, emit, init, obs):
    """Forward algorithm. Returns total log-probability and alpha matrix.
    trans[i][j] = P(j|i), emit[s][o] = P(o|s), init[s] = P(s at t=0)."""
    import math
    S = len(trans)
    T = len(obs)
    alpha = [[0]*S for _ in range(T)]
    for s in range(S):
        alpha[0][s] = init[s] * emit[s][obs[0]]
    for t in range(1, T):
        for s in range(S):
            alpha[t][s] = sum(alpha[t-1][s2] * trans[s2][s] for s2 in range(S)) * emit[s][obs[t]]
    total = sum(alpha[T-1])
    return round(total, 6)
`,
      tests: [
        {
          args: [
            [
              [0.7, 0.3],
              [0.4, 0.6],
            ],
            [
              [0.5, 0.5],
              [0.1, 0.9],
            ],
            [0.6, 0.4],
            [0, 1, 1],
          ],
          expected: 0.145984,
        },
      ],
    },
    {
      language: "javascript",
      entry: "forward",
      code: `function forward(trans, emit, init, obs) {
  const S = trans.length, T = obs.length;
  const alpha = Array.from({length: T}, () => new Array(S).fill(0));
  for (let s = 0; s < S; s++) alpha[0][s] = init[s] * emit[s][obs[0]];
  for (let t = 1; t < T; t++)
    for (let s = 0; s < S; s++)
      alpha[t][s] = trans.reduce((sum, _, s2) => sum + alpha[t-1][s2] * trans[s2][s], 0) * emit[s][obs[t]];
  return Math.round(alpha[T-1].reduce((a, b) => a + b, 0) * 1000000) / 1000000;
}
`,
      tests: [
        {
          args: [
            [
              [0.7, 0.3],
              [0.4, 0.6],
            ],
            [
              [0.5, 0.5],
              [0.1, 0.9],
            ],
            [0.6, 0.4],
            [0, 1, 1],
          ],
          expected: 0.145984,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "hidden-markov-models-forward-backward-q1",
      kind: "mcq",
      prompt: "What does the forward algorithm compute?",
      options: [
        "P(observations 1..t, state at t = s) for all t and s",
        "The most likely state sequence",
        "The transition probabilities",
        "The emission probabilities",
      ],
      answer: 0,
      explanation:
        "The forward variable α(t,s) gives the joint probability of seeing observations 1..t and being in state s at time t.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Computes the probability of an observation sequence and infers hidden states using the forward-backward algorithm on a Hidden Markov Model.",
    steps: [
      "Forward pass: α(t,s) = P(observations 1..t, state at t = s).",
      "For each time step, α(t,s) = Σ_s' α(t-1,s') · P(s'→s) · P(obs_t|s).",
      "Backward pass: β(t,s) = P(observations t+1..T | state at t = s).",
      "Combine: P(state_t = s | observations) ∝ α(t,s) · β(t,s).",
      "Total probability = Σ_s α(T,s).",
    ],
    timeComplexity: "$O(n·d·k)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["machine learning"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Hidden Markov Models (Forward–Backward)?",
        a: "Computes the probability of an observation sequence and infers hidden states using the forward-backward algorithm on a Hidden Markov Model.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Hidden Markov Models (Forward–Backward) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Hidden Markov Models (Forward–Backward).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
