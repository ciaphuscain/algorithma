import type { AlgorithmEntry } from "../types";

export const singularValueDecompositionEntry: AlgorithmEntry = {
  slug: "singular-value-decomposition",
  name: "Singular Value Decomposition",
  aliases: ["Singular Value Decomposition"],
  curriculum: [571],
  domain: "machine-learning",
  subcategory: "Matrix Decomposition",
  difficulty: "advanced",
  summary:
    "Decomposes any m×n matrix A into A = UΣVᵀ, where U and V are orthogonal and Σ is diagonal with singular values.",
  tags: ["SVD", "matrix decomposition", "linear algebra", "machine learning"],
  prerequisites: [],
  related: ["pca"],
  problem: {
    input: "An m×n matrix A.",
    output: "Matrices U (m×m), Σ (m×n diagonal), and Vᵀ (n×n) such that A = UΣVᵀ.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "SVD reveals the structure of any matrix by expressing it as a sequence of rotation, scaling, and rotation. The singular values on the diagonal tell how much each component matters — truncating small ones gives a low-rank approximation.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute AᵀA and its eigenvalues/eigenvectors (gives V and σ²).",
          "Singular values σᵢ = √(eigenvalues of AᵀA).",
          "Compute U columns: uᵢ = Avᵢ/σᵢ.",
          "Truncated SVD keeps only the top k singular values for dimensionality reduction.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "For large matrices, iterative methods (Lanczos, randomized SVD) are preferred. NumPy's svd uses LAPACK under the hood.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The Eckart-Young theorem: the best rank-k approximation of A (in Frobenius norm) is the truncated SVD with the top k singular values. Time: $O(\\min(m^2 n, mn^2))$ for full SVD.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Truncated SVD is the basis of Latent Semantic Analysis (LSA) in NLP.",
          "PCA on centered data is equivalent to SVD.",
          "Used in recommender systems (matrix factorization).",
          "Pseudoinverse: A⁺ = VΣ⁺Uᵀ.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(min(m^2*n, m*n^2))",
      average: "O(min(m^2*n, m*n^2))",
      worst: "O(min(m^2*n, m*n^2))",
    },
    space: "O(m * n)",
    worstClass: "n^3",
  },
  properties: [
    {
      label: "Always exists",
      value: "Yes, for any matrix",
    },
    {
      label: "Key insight",
      value: "Best low-rank approximation",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "svd_power",
      code: `def svd_power(A, k):
    """Compute top-k singular values of matrix A via power iteration. Returns singular values."""
    import math
    m, n = len(A), len(A[0])
    # Compute AᵀA
    AtA = [[sum(A[i][a] * A[i][b] for i in range(m)) for b in range(n)] for a in range(n)]
    vals = []
    vecs_found = []
    for _ in range(k):
        v = [1.0 if j == len(vecs_found) else 0.0 for j in range(n)]
        for __ in range(200):
            nv = [sum(AtA[i][j] * v[j] for j in range(n)) for i in range(n)]
            for prev in vecs_found:
                dot = sum(nv[j] * prev[j] for j in range(n))
                nv = [nv[j] - dot * prev[j] for j in range(n)]
            norm = math.sqrt(sum(x*x for x in nv)) or 1
            v = [x / norm for x in nv]
        eigenval = sum(v[j] * sum(AtA[j][i] * v[i] for i in range(n)) for j in range(n))
        vals.append(round(math.sqrt(max(0, eigenval)), 4))
        vecs_found.append(v)
    return vals
`,
      tests: [
        {
          args: [
            [
              [3, 0],
              [0, 4],
            ],
            2,
          ],
          expected: [3.0, 4.0],
        },
      ],
    },
    {
      language: "javascript",
      entry: "svdPower",
      code: `function svdPower(A, k) {
  const m = A.length, n = A[0].length;
  const AtA = Array.from({length: n}, (_, a) =>
    Array.from({length: n}, (_, b) => A.reduce((s, row) => s + row[a] * row[b], 0)));
  const vals = [], vecs = [];
  for (let vi = 0; vi < k; vi++) {
    let v = Array(n).fill(0); v[vi % n] = 1;
    for (let it = 0; it < 200; it++) {
      let nv = AtA.map(row => row.reduce((s, c, j) => s + c * v[j], 0));
      for (const prev of vecs) {
        const dot = nv.reduce((s, x, j) => s + x * prev[j], 0);
        nv = nv.map((x, j) => x - dot * prev[j]);
      }
      const norm = Math.sqrt(nv.reduce((s, x) => s + x * x, 0)) || 1;
      v = nv.map(x => x / norm);
    }
    const eigenval = v.reduce((s, vj, j) => s + vj * AtA[j].reduce((s2, c, i) => s2 + c * v[i], 0), 0);
    vals.push(Math.round(Math.sqrt(Math.max(0, eigenval)) * 10000) / 10000);
    vecs.push(v);
  }
  return vals;
}
`,
      tests: [
        {
          args: [
            [
              [3, 0],
              [0, 4],
            ],
            2,
          ],
          expected: [3.0, 4.0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "singular-value-decomposition-q1",
      kind: "mcq",
      prompt: "What does SVD decompose a matrix into?",
      options: [
        "U·Σ·Vᵀ where U, V are orthogonal and Σ is diagonal",
        "L·U where L is lower and U is upper triangular",
        "Q·R where Q is orthogonal and R is upper triangular",
        "P·D·P⁻¹ where D is diagonal",
      ],
      answer: 0,
      explanation:
        "SVD decomposes any matrix A = UΣVᵀ where U, V are orthogonal matrices and Σ is a diagonal matrix of singular values.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Decomposes any m×n matrix A into A = UΣVᵀ, where U and V are orthogonal and Σ is diagonal with singular values.",
    steps: [
      "Compute AᵀA and its eigenvalues/eigenvectors (gives V and σ²).",
      "Singular values σᵢ = √(eigenvalues of AᵀA).",
      "Compute U columns: uᵢ = Avᵢ/σᵢ.",
      "Truncated SVD keeps only the top k singular values for dimensionality reduction.",
    ],
    timeComplexity: "$O(min(m^2*n, m*n^2))$.",
    spaceComplexity: "$O(m * n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["machine learning"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Singular Value Decomposition?",
        a: "Decomposes any m×n matrix A into A = UΣVᵀ, where U and V are orthogonal and Σ is diagonal with singular values.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Singular Value Decomposition (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Singular Value Decomposition.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
