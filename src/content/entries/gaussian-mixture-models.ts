import type { AlgorithmEntry } from "../types";

export const gaussianMixtureModelsEntry: AlgorithmEntry = {
  slug: "gaussian-mixture-models",
  name: "Gaussian Mixture Models",
  aliases: ["Gaussian Mixture Models"],
  curriculum: [573],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary:
    "Models data as a mixture of k Gaussian distributions, estimating means, covariances, and mixing weights via EM.",
  tags: ["gaussian mixture models", "machine learning"],
  prerequisites: [],
  related: [],
  problem: {
    input: "A set of data points and number of components k.",
    output: "Mixture parameters (means, covariances, weights) and soft cluster assignments.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "GMM assumes data comes from k Gaussian blobs. Unlike K-means (which makes hard assignments), GMM gives soft probabilities: each point has a probability of belonging to each cluster, allowing overlapping clusters.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize k Gaussian components with random means, identity covariances, equal weights.",
          "E-step: for each point, compute responsibility (probability of belonging to each component).",
          "M-step: update means, covariances, and weights using responsibilities.",
          "Repeat until log-likelihood converges.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Responsibilities: γ(k) = π_k·N(x|μ_k,Σ_k) / Σ_j π_j·N(x|μ_j,Σ_j). Add a small regularization to covariance matrices to prevent singularity.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Each EM iteration takes $O(nkd^2)$ time. GMM with full covariances has $O(kd^2)$ parameters. The BIC/AIC criterion helps choose k.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "GMM is the soft version of K-means.",
          "Full covariance allows elliptical clusters; diagonal restricts to axis-aligned.",
          "Used in speech recognition, image segmentation, anomaly detection.",
          "Bayesian GMMs (via Dirichlet process) automatically determine k.",
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
      entry: "gmm_1d",
      code: `def gmm_1d(data, k, n_iter=50):
    """1D Gaussian Mixture Model. Returns means (sorted)."""
    import math, random
    random.seed(42)
    n = len(data)
    means = sorted(random.sample(data, k))
    variances = [1.0] * k
    weights = [1.0/k] * k
    def gauss(x, mu, var):
        return math.exp(-0.5 * (x-mu)**2 / max(var, 1e-6)) / math.sqrt(2 * math.pi * max(var, 1e-6))
    for _ in range(n_iter):
        # E-step
        resp = []
        for x in data:
            r = [weights[j] * gauss(x, means[j], variances[j]) for j in range(k)]
            s = sum(r) or 1e-10
            resp.append([rj/s for rj in r])
        # M-step
        for j in range(k):
            nk = sum(resp[i][j] for i in range(n)) or 1e-10
            weights[j] = nk / n
            means[j] = sum(resp[i][j] * data[i] for i in range(n)) / nk
            variances[j] = sum(resp[i][j] * (data[i] - means[j])**2 for i in range(n)) / nk + 1e-6
    return sorted([round(m, 1) for m in means])
`,
      tests: [
        {
          args: [[0.1, 0.2, -0.1, 10.0, 10.1, 9.9], 2],
          expected: [0.1, 10.0],
        },
      ],
    },
    {
      language: "javascript",
      entry: "gmm1d",
      code: `function gmm1d(data, k, nIter = 50) {
  const n = data.length;
  let means = data.slice().sort((a,b)=>a-b).filter((_,i,a) => i % Math.ceil(a.length/k) === 0).slice(0,k);
  if (means.length < k) means = data.slice(0, k);
  let vars = new Array(k).fill(1), weights = new Array(k).fill(1/k);
  function gauss(x, mu, v) { return Math.exp(-0.5*(x-mu)**2/Math.max(v,1e-6))/Math.sqrt(2*Math.PI*Math.max(v,1e-6)); }
  for (let it = 0; it < nIter; it++) {
    const resp = data.map(x => {
      const r = means.map((mu, j) => weights[j]*gauss(x, mu, vars[j]));
      const s = r.reduce((a,b)=>a+b,0) || 1e-10;
      return r.map(v => v/s);
    });
    for (let j = 0; j < k; j++) {
      const nk = resp.reduce((s, r) => s + r[j], 0) || 1e-10;
      weights[j] = nk / n;
      means[j] = resp.reduce((s, r, i) => s + r[j]*data[i], 0) / nk;
      vars[j] = resp.reduce((s, r, i) => s + r[j]*(data[i]-means[j])**2, 0) / nk + 1e-6;
    }
  }
  return means.map(m => Math.round(m*10)/10).sort((a,b)=>a-b);
}
`,
      tests: [
        {
          args: [[0.1, 0.2, -0.1, 10.0, 10.1, 9.9], 2],
          expected: [0.1, 10.0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "gaussian-mixture-models-q1",
      kind: "mcq",
      prompt: "How does GMM differ from K-means?",
      options: [
        "GMM gives soft probabilistic assignments; K-means gives hard assignments",
        "GMM is faster",
        "K-means handles more clusters",
        "GMM doesn't use EM",
      ],
      answer: 0,
      explanation:
        "GMM assigns each point a probability of belonging to each cluster, while K-means assigns each point to exactly one cluster.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Models data as a mixture of k Gaussian distributions, estimating means, covariances, and mixing weights via EM.",
    steps: [
      "Initialize k Gaussian components with random means, identity covariances, equal weights.",
      "E-step: for each point, compute responsibility (probability of belonging to each component).",
      "M-step: update means, covariances, and weights using responsibilities.",
      "Repeat until log-likelihood converges.",
    ],
    timeComplexity: "$O(n·d·k)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["machine learning"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Gaussian Mixture Models?",
        a: "Models data as a mixture of k Gaussian distributions, estimating means, covariances, and mixing weights via EM.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Gaussian Mixture Models (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Gaussian Mixture Models.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
