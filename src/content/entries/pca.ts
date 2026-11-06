import type { AlgorithmEntry } from "../types";

export const pcaEntry: AlgorithmEntry = {
  slug: "pca",
  name: "PCA",
  aliases: ["PCA"],
  curriculum: [570],
  domain: "machine-learning",
  subcategory: "Dimensionality Reduction",
  difficulty: "intermediate",
  summary:
    "Finds the directions of maximum variance in high-dimensional data and projects it onto a lower-dimensional subspace.",
  tags: ["PCA", "principal component analysis", "dimensionality reduction", "machine learning"],
  prerequisites: [],
  related: ["singular-value-decomposition"],
  problem: {
    input: "An n×d data matrix X and target dimension k ≤ d.",
    output: "The projected n×k matrix and the k principal components (eigenvectors).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "PCA finds the axes along which the data varies most. Imagine a cloud of 3D points that looks flat — PCA finds the 2D plane that captures the most spread. It does this by computing eigenvectors of the covariance matrix.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Center the data by subtracting the mean of each feature.",
          "Compute the covariance matrix C = XᵀX / (n-1).",
          "Find the eigenvalues and eigenvectors of C.",
          "Sort eigenvectors by eigenvalue (largest first).",
          "Project: X_reduced = X · V_k (top k eigenvectors).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "For large d, use SVD instead of explicit eigendecomposition. Centering is essential — PCA on uncentered data finds directions from the origin, not from the data center.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "PCA maximizes variance captured: the top k eigenvectors of the covariance matrix span the subspace that minimizes reconstruction error in the L2 sense. Time: $O(nd^2 + d^3)$ for eigendecomposition, or $O(ndk)$ with truncated SVD.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Kernel PCA** handles nonlinear structure via the kernel trick.",
          "**Incremental PCA** processes data in batches for large datasets.",
          "Explained variance ratio tells how much information each component captures.",
          "PCA is equivalent to truncated SVD on centered data.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n * d * k)",
      average: "O(n * d^2 + d^3)",
      worst: "O(n * d^2 + d^3)",
    },
    space: "O(n * d)",
    worstClass: "n^2",
  },
  properties: [
    {
      label: "Type",
      value: "Linear dimensionality reduction",
    },
    {
      label: "Unsupervised",
      value: "Yes",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "pca",
      code: `def pca(X, k):
    """Reduce n×d matrix X to n×k. Returns projected data."""
    n = len(X)
    d = len(X[0])
    # Center
    mean = [sum(X[i][j] for i in range(n)) / n for j in range(d)]
    Xc = [[X[i][j] - mean[j] for j in range(d)] for i in range(n)]
    # Covariance (simplified: use XᵀX)
    cov = [[0]*d for _ in range(d)]
    for i in range(n):
        for a in range(d):
            for b in range(d):
                cov[a][b] += Xc[i][a] * Xc[i][b]
    for a in range(d):
        for b in range(d):
            cov[a][b] /= (n - 1) if n > 1 else 1
    # Power iteration for top k eigenvectors (simplified)
    import math
    vecs = []
    for _ in range(k):
        v = [1.0 if j == len(vecs) else 0.0 for j in range(d)]
        for __ in range(100):
            nv = [sum(cov[i][j] * v[j] for j in range(d)) for i in range(d)]
            # Remove projection onto previous eigenvectors
            for prev in vecs:
                dot = sum(nv[j] * prev[j] for j in range(d))
                nv = [nv[j] - dot * prev[j] for j in range(d)]
            norm = math.sqrt(sum(x*x for x in nv)) or 1
            v = [x / norm for x in nv]
        vecs.append(v)
    # Project
    result = []
    for i in range(n):
        row = [round(sum(Xc[i][j] * vecs[c][j] for j in range(d)), 4) for c in range(k)]
        result.append(row)
    return result
`,
      tests: [
        {
          args: [
            [
              [1, 2],
              [3, 4],
              [5, 6],
            ],
            1,
          ],
          expected: [[-2.8284], [0.0], [2.8284]],
        },
      ],
    },
    {
      language: "javascript",
      entry: "pca",
      code: `function pca(X, k) {
  const n = X.length, d = X[0].length;
  const mean = Array(d).fill(0);
  for (const row of X) for (let j = 0; j < d; j++) mean[j] += row[j] / n;
  const Xc = X.map(row => row.map((v, j) => v - mean[j]));
  const cov = Array.from({length: d}, () => Array(d).fill(0));
  for (const row of Xc)
    for (let a = 0; a < d; a++)
      for (let b = 0; b < d; b++) cov[a][b] += row[a] * row[b] / (n > 1 ? n - 1 : 1);
  const vecs = [];
  for (let vi = 0; vi < k; vi++) {
    let v = Array(d).fill(0); v[vi] = 1;
    for (let it = 0; it < 100; it++) {
      let nv = cov.map(row => row.reduce((s, c, j) => s + c * v[j], 0));
      for (const prev of vecs) {
        const dot = nv.reduce((s, x, j) => s + x * prev[j], 0);
        nv = nv.map((x, j) => x - dot * prev[j]);
      }
      const norm = Math.sqrt(nv.reduce((s, x) => s + x * x, 0)) || 1;
      v = nv.map(x => x / norm);
    }
    vecs.push(v);
  }
  return Xc.map(row => vecs.map(vec =>
    Math.round(row.reduce((s, v, j) => s + v * vec[j], 0) * 10000) / 10000));
}
`,
      tests: [
        {
          args: [
            [
              [1, 2],
              [3, 4],
              [5, 6],
            ],
            1,
          ],
          expected: [[-2.8284], [0.0], [2.8284]],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pca-q1",
      kind: "mcq",
      prompt: "What does PCA maximize?",
      options: [
        "Variance captured in the projected subspace",
        "The number of dimensions",
        "Classification accuracy",
        "The distance between points",
      ],
      answer: 0,
      explanation:
        "PCA finds directions that maximize variance in the data, preserving as much information as possible in fewer dimensions.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Finds the directions of maximum variance in high-dimensional data and projects it onto a lower-dimensional subspace.",
    steps: [
      "Center the data by subtracting the mean of each feature.",
      "Compute the covariance matrix C = XᵀX / (n-1).",
      "Find the eigenvalues and eigenvectors of C.",
      "Sort eigenvectors by eigenvalue (largest first).",
      "Project: X_reduced = X · V_k (top k eigenvectors).",
    ],
    timeComplexity: "$O(n * d^2 + d^3)$.",
    spaceComplexity: "$O(n * d)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["machine learning"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use PCA?",
        a: "Finds the directions of maximum variance in high-dimensional data and projects it onto a lower-dimensional subspace.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define PCA (1).", "Describe the algorithm (2).", "Analyze complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for PCA.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
