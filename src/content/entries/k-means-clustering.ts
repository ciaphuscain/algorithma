import type { AlgorithmEntry } from "../types";

export const kMeansClusteringEntry: AlgorithmEntry = {
  slug: "k-means-clustering",
  name: "K-Means Clustering",
  aliases: ["K-Means Clustering"],
  curriculum: [499],
  domain: "machine-learning",
  subcategory: "Clustering",
  difficulty: "intermediate",
  summary:
    "Partitions n data points into k clusters by iteratively assigning points to the nearest centroid and recomputing centroids until convergence.",
  tags: ["k-means", "clustering", "unsupervised learning", "centroid", "machine learning"],
  prerequisites: [],
  related: ["gaussian-mixture-models", "expectation-maximization"],
  problem: {
    input: "A set of n data points in d dimensions and a number of clusters k.",
    output: "An assignment of each point to one of k clusters, and the k centroids.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "K-Means is like a game of musical chairs: place k chairs (centroids) randomly, everyone runs to the nearest chair, then move each chair to the center of its group. Repeat until nobody changes chairs. The algorithm minimizes the within-cluster sum of squared distances.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Choose k initial centroids (randomly or via k-means++).",
          "Assign each point to the nearest centroid.",
          "Recompute each centroid as the mean of its assigned points.",
          "Repeat steps 2-3 until assignments don't change.",
          "Return the final assignments and centroids.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "k-means++ initialization picks the first centroid randomly, then each subsequent centroid with probability proportional to its squared distance from the nearest existing centroid. This gives an O(log k) approximation guarantee.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Each iteration takes $O(nkd)$ time (n points, k centroids, d dimensions). The algorithm always converges because the total within-cluster variance decreases at each step and there are finitely many possible assignments. Worst case: exponentially many iterations, but typically converges quickly.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**k-means++** initialization gives an O(log k)-competitive solution in expectation.",
          "**Mini-batch k-means** samples a subset per iteration for large datasets.",
          "K-Means assumes spherical clusters of similar size; use GMM for elliptical clusters.",
          "The **elbow method** helps choose k by plotting variance vs. k.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n * k * d)",
      average: "O(n * k * d * I)",
      worst: "O(n * k * d * I)",
    },
    space: "O(n * d + k * d)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Type",
      value: "Unsupervised clustering",
    },
    {
      label: "Convergence",
      value: "Always converges (local minimum)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "k_means",
      code: `def k_means(points, k, max_iter=100):
    """Cluster points into k groups. Returns list of cluster assignments (0..k-1)."""
    n = len(points)
    d = len(points[0])
    # Initialize centroids to first k points
    centroids = [list(points[i]) for i in range(k)]
    assign = [0] * n
    for _ in range(max_iter):
        # Assign
        new_assign = []
        for pt in points:
            best, best_d = 0, float('inf')
            for c in range(k):
                dist = sum((pt[j] - centroids[c][j]) ** 2 for j in range(d))
                if dist < best_d:
                    best, best_d = c, dist
            new_assign.append(best)
        if new_assign == assign:
            break
        assign = new_assign
        # Recompute centroids
        for c in range(k):
            members = [points[i] for i in range(n) if assign[i] == c]
            if members:
                centroids[c] = [sum(m[j] for m in members) / len(members) for j in range(d)]
    return assign
`,
      tests: [
        {
          args: [
            [
              [0, 0],
              [1, 0],
              [0, 1],
              [10, 10],
              [11, 10],
              [10, 11],
            ],
            2,
          ],
          expected: [0, 0, 0, 1, 1, 1],
        },
      ],
    },
    {
      language: "javascript",
      entry: "kMeans",
      code: `function kMeans(points, k, maxIter = 100) {
  const n = points.length, d = points[0].length;
  const centroids = points.slice(0, k).map(p => [...p]);
  let assign = new Array(n).fill(0);
  for (let iter = 0; iter < maxIter; iter++) {
    const newAssign = points.map(pt => {
      let best = 0, bestD = Infinity;
      for (let c = 0; c < k; c++) {
        let dist = 0;
        for (let j = 0; j < d; j++) dist += (pt[j] - centroids[c][j]) ** 2;
        if (dist < bestD) { best = c; bestD = dist; }
      }
      return best;
    });
    if (newAssign.every((v, i) => v === assign[i])) break;
    assign = newAssign;
    for (let c = 0; c < k; c++) {
      const members = points.filter((_, i) => assign[i] === c);
      if (members.length) {
        for (let j = 0; j < d; j++)
          centroids[c][j] = members.reduce((s, m) => s + m[j], 0) / members.length;
      }
    }
  }
  return assign;
}
`,
      tests: [
        {
          args: [
            [
              [0, 0],
              [1, 0],
              [0, 1],
              [10, 10],
              [11, 10],
              [10, 11],
            ],
            2,
          ],
          expected: [0, 0, 0, 1, 1, 1],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "k-means-clustering-q1",
      kind: "mcq",
      prompt: "What does K-Means minimize?",
      options: [
        "Within-cluster sum of squared distances to centroids",
        "The number of clusters",
        "The distance between centroids",
        "The total number of iterations",
      ],
      answer: 0,
      explanation:
        "K-Means minimizes the sum of squared distances from each point to its assigned centroid.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "K-Means partitions n points into k clusters by alternating between assigning points to nearest centroids and recomputing centroids.",
    steps: [
      "Initialize k centroids.",
      "Assign each point to nearest centroid.",
      "Recompute centroids as cluster means.",
      "Repeat until convergence.",
    ],
    timeComplexity: "$O(nkdI)$ for I iterations.",
    spaceComplexity: "$O(nd + kd)$.",
    correctness:
      "The objective (within-cluster SSE) decreases monotonically, guaranteeing convergence to a local minimum.",
    applications: [
      "customer segmentation",
      "image compression",
      "document clustering",
      "anomaly detection",
    ],
    limitations: [
      "Sensitive to initialization",
      "Assumes spherical clusters",
      "Must choose k in advance",
    ],
    faq: [
      {
        q: "When should you use K-Means Clustering?",
        a: "Partitions n data points into k clusters by iteratively assigning points to the nearest centroid and recomputing centroids until convergence.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define K-Means Clustering (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for K-Means Clustering.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
