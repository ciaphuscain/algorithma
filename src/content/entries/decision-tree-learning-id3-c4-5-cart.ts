import type { AlgorithmEntry } from "../types";

export const decisionTreeLearningId3C45CartEntry: AlgorithmEntry = {
  slug: "decision-tree-learning-id3-c4-5-cart",
  name: "Decision Tree Learning (ID3/C4.5/CART)",
  aliases: ["Decision Tree Learning (ID3/C4.5/CART)"],
  curriculum: [500],
  domain: "machine-learning",
  subcategory: "Classification",
  difficulty: "intermediate",
  summary:
    "Builds a tree-structured classifier by recursively splitting data on the feature that best separates classes, using criteria like information gain or Gini impurity.",
  tags: ["decision tree", "ID3", "C4.5", "CART", "classification", "machine learning"],
  prerequisites: [],
  related: ["k-means-clustering"],
  problem: {
    input: "A labeled dataset with features and class labels.",
    output: "A decision tree that predicts the class of new instances.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A decision tree asks a series of yes/no questions about features to classify a data point. At each node, it picks the question that best separates the classes — like playing 20 questions optimally. The tree is built top-down by choosing the most informative split at each step.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with all data at the root.",
          "For each feature, evaluate all possible splits using a criterion (information gain, Gini impurity).",
          "Split on the best feature/threshold.",
          "Recurse on each child subset.",
          "Stop when a node is pure (one class) or a depth limit is reached.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Information gain = H(parent) - weighted average H(children), where H is entropy. Gini impurity = 1 - Σ p_i². CART builds binary trees; ID3/C4.5 allow multi-way splits.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Building the tree: $O(n \\cdot d \\cdot \\log n)$ per level (sorting features), $O(n \\cdot d \\cdot \\log^2 n)$ total for a balanced tree. Prediction: $O(\\text{depth})$. Entropy $H = -\\sum p_i \\log_2 p_i$ measures class impurity.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Pruning** (post-pruning, cost-complexity pruning) prevents overfitting by removing branches that don't improve validation accuracy.",
          "**Random forests** average many decision trees trained on random subsets.",
          "C4.5 handles continuous attributes and missing values; CART builds binary trees and handles regression.",
          "Decision trees are interpretable — each prediction has a clear explanation path.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(depth)",
      average: "O(n * d * log n)",
      worst: "O(n^2 * d)",
    },
    space: "O(n)",
    worstClass: "n^2",
  },
  properties: [
    {
      label: "Type",
      value: "Supervised classification/regression",
    },
    {
      label: "Interpretable",
      value: "Yes",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "decision_tree",
      code: `def decision_tree(X, y):
    """Build a simple decision tree (binary, max depth 3). Returns a predict function as nested dict.
    X: list of feature lists, y: list of labels. Returns tree as nested dict."""
    def gini(labels):
        n = len(labels)
        if n == 0: return 0
        counts = {}
        for l in labels: counts[l] = counts.get(l, 0) + 1
        return 1 - sum((c/n)**2 for c in counts.values())
    def majority(labels):
        counts = {}
        for l in labels: counts[l] = counts.get(l, 0) + 1
        return max(counts, key=counts.get)
    def build(indices, depth):
        labels = [y[i] for i in indices]
        if len(set(labels)) <= 1 or depth >= 3:
            return {"leaf": majority(labels)}
        best_feat, best_thresh, best_score = 0, 0, float('inf')
        d = len(X[0])
        for f in range(d):
            vals = sorted(set(X[i][f] for i in indices))
            for t in range(len(vals) - 1):
                thresh = (vals[t] + vals[t+1]) / 2
                left = [i for i in indices if X[i][f] <= thresh]
                right = [i for i in indices if X[i][f] > thresh]
                score = len(left)/len(indices)*gini([y[i] for i in left]) + len(right)/len(indices)*gini([y[i] for i in right])
                if score < best_score:
                    best_feat, best_thresh, best_score = f, thresh, score
        left = [i for i in indices if X[i][best_feat] <= best_thresh]
        right = [i for i in indices if X[i][best_feat] > best_thresh]
        if not left or not right:
            return {"leaf": majority(labels)}
        return {"feat": best_feat, "thresh": best_thresh,
                "left": build(left, depth+1), "right": build(right, depth+1)}
    return build(list(range(len(X))), 0)
`,
      tests: [
        {
          args: [
            [[0], [1], [2], [3]],
            [0, 0, 1, 1],
          ],
          expected: {
            feat: 0,
            thresh: 1.5,
            left: {
              leaf: 0,
            },
            right: {
              leaf: 1,
            },
          },
        },
      ],
    },
    {
      language: "javascript",
      entry: "decisionTree",
      code: `function decisionTree(X, y) {
  function gini(labels) {
    const n = labels.length; if (!n) return 0;
    const counts = {};
    for (const l of labels) counts[l] = (counts[l] || 0) + 1;
    return 1 - Object.values(counts).reduce((s, c) => s + (c/n)**2, 0);
  }
  function majority(labels) {
    const counts = {};
    for (const l of labels) counts[l] = (counts[l] || 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }
  function build(indices, depth) {
    const labels = indices.map(i => y[i]);
    if (new Set(labels).size <= 1 || depth >= 3)
      return { leaf: majority(labels) };
    let bestFeat = 0, bestThresh = 0, bestScore = Infinity;
    const d = X[0].length;
    for (let f = 0; f < d; f++) {
      const vals = [...new Set(indices.map(i => X[i][f]))].sort((a,b) => a-b);
      for (let t = 0; t < vals.length - 1; t++) {
        const thresh = (vals[t] + vals[t+1]) / 2;
        const left = indices.filter(i => X[i][f] <= thresh);
        const right = indices.filter(i => X[i][f] > thresh);
        const score = left.length/indices.length*gini(left.map(i=>y[i])) + right.length/indices.length*gini(right.map(i=>y[i]));
        if (score < bestScore) { bestFeat = f; bestThresh = thresh; bestScore = score; }
      }
    }
    const left = indices.filter(i => X[i][bestFeat] <= bestThresh);
    const right = indices.filter(i => X[i][bestFeat] > bestThresh);
    if (!left.length || !right.length) return { leaf: majority(labels) };
    return { feat: bestFeat, thresh: bestThresh, left: build(left, depth+1), right: build(right, depth+1) };
  }
  return build(X.map((_, i) => i), 0);
}
`,
      tests: [
        {
          args: [
            [[0], [1], [2], [3]],
            [0, 0, 1, 1],
          ],
          expected: {
            feat: 0,
            thresh: 1.5,
            left: {
              leaf: "0",
            },
            right: {
              leaf: "1",
            },
          },
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "decision-tree-learning-id3-c4-5-cart-q1",
      kind: "mcq",
      prompt: "What splitting criterion does CART use by default?",
      options: ["Gini impurity", "Information gain", "Variance", "Mean absolute error"],
      answer: 0,
      explanation:
        "CART uses Gini impurity (1 - Σp_i²) to evaluate splits, while ID3/C4.5 use information gain (entropy reduction).",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Decision tree learning builds a tree-structured classifier by greedily choosing the best feature split at each node.",
    steps: [
      "Start with all data.",
      "Evaluate all feature splits.",
      "Split on the best.",
      "Recurse until stopping criterion.",
    ],
    timeComplexity: "$O(n \\cdot d \\cdot \\log n)$ per level.",
    spaceComplexity: "$O(n)$ for storing the tree.",
    correctness:
      "Greedy splitting on the best criterion produces locally optimal splits; pruning improves generalization.",
    applications: [
      "medical diagnosis",
      "credit scoring",
      "customer churn prediction",
      "feature importance",
    ],
    limitations: [
      "Prone to overfitting without pruning",
      "Greedy — not globally optimal",
      "Unstable (small data changes cause different trees)",
    ],
    faq: [
      {
        q: "When should you use Decision Tree Learning (ID3/C4.5/CART)?",
        a: "Builds a tree-structured classifier by recursively splitting data on the feature that best separates classes, using criteria like information gain or Gini impurity.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Decision Tree Learning (ID3/C4.5/CART) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Decision Tree Learning (ID3/C4.5/CART).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
