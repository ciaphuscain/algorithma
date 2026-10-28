import type { AlgorithmEntry } from "../types";

export const expressionTreeEntry: AlgorithmEntry = {
  slug: "expression-tree",
  name: "Expression Tree",
  aliases: ["Binary expression tree", "Syntax tree of an arithmetic expression", "Parse tree"],
  curriculum: [120],
  domain: "linear-structures",
  subcategory: "Stacks and queues",
  difficulty: "intermediate",
  summary:
    "A binary tree whose leaves are numbers and whose internal nodes are operators. Built from postfix, it is evaluated by a post-order walk and printed back as fully parenthesised infix by an in-order walk.",
  tags: ["tree", "stack", "postfix", "parsing", "post-order", "in-order"],
  prerequisites: ["Binary trees", "Tree traversals", "Postfix evaluation"],
  related: ["shunting-yard", "postfix-evaluation", "tree-traversals"],
  problem: {
    input: "An infix expression of numbers, + − * / ^ and parentheses.",
    output:
      "Its expression tree, the tree's height, its value, and the expression read back in fully parenthesised infix.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "An expression has a shape: in $(3 + 4) \\times (5 - 2)$ the × is applied last, to two smaller expressions. Make × the root and the two smaller expressions its subtrees, and keep going down to the numbers. Precedence and parentheses disappear: they are now encoded in which node sits above which. Each walk of the tree reads it differently: post-order gives postfix, pre-order gives prefix, and in-order gives infix (with parentheses added around every operator).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Convert the expression to postfix (the shunting-yard algorithm does this).",
          "Build the tree from the **end** of the postfix: the last token is the root. If it is an operator, build its right subtree from the tokens before it, then its left subtree from the tokens before those.",
          "Evaluate with a post-order walk: a leaf is its number; an operator node applies its operator to the values of its left and right subtrees.",
          "Read back with an in-order walk: (left operator right).",
        ],
      },
      {
        kind: "p",
        text: "The usual alternative builds the tree from the **start** of the postfix with a stack of subtrees: push a leaf for each number, and for each operator pop two subtrees (right, then left) and push the new node. Both give the same tree; the visualizer shows the top-down version, whose recursion mirrors the tree.",
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): $(3 + 4) \\times (5 - 2)$, in postfix `3 4 + 5 2 − *`.",
      },
      {
        kind: "table",
        head: ["token read (from the end)", "node created", "attached as"],
        rows: [
          ["*", "*", "root"],
          ["−", "−", "right child of *"],
          ["2", "2", "right child of −"],
          ["5", "5", "left child of −"],
          ["+", "+", "left child of *"],
          ["4", "4", "right child of +"],
          ["3", "3", "left child of +"],
        ],
      },
      {
        kind: "p",
        text: "The tree has height 2. The post-order walk computes 3 + 4 = 7, then 5 − 2 = 3, then 7 × 3 = 21, and the in-order walk prints `((3 + 4) * (5 - 2))`. In the second preset, `2 + 3 * 4 − 6 / 2`, precedence shapes the tree: it reads back as `((2 + (3 * 4)) - (6 / 2))`, has height 3 and value 11. The third, `2 ^ 3 ^ 2`, groups to the right: `(2 ^ (3 ^ 2))` = 512.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "A node holds a token and two children; leaves have no children. In a language with sum types, use one case for numbers and one for operators.",
          "To print with only the **necessary** parentheses, compare each child's operator precedence with its parent's (and use associativity for equal precedence).",
          "The same tree serves many purposes: evaluation, symbolic differentiation, constant folding (replace a subtree of constants by its value), and code generation.",
          "Recursion depth equals tree height, which can be $n/2$ for a long chain such as `1 + 2 + 3 + …`; very long expressions need an explicit stack.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Size and cost.** An expression with $k$ binary operators has $k + 1$ numbers: the tree has $2k + 1$ nodes, every internal node has exactly two children. Building, evaluating and printing each visit every node once: $O(n)$ time; the recursion uses $O(h)$ space for height $h$.",
      },
      {
        kind: "p",
        text: "**Correctness.** In postfix, the last token is the operator applied last, and the tokens before it split uniquely into its left operand followed by its right operand, each itself a postfix expression. Building right then left from the end consumes exactly the right operand and then exactly the left one. The tests check the value against stack evaluation of the postfix, and check that the in-order walk reproduces the input with its parentheses removed.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Compilers build **abstract syntax trees**, the generalisation of expression trees to whole programs.",
          "The number of registers needed to evaluate a tree without storing intermediate results in memory is given by the Ershov (Strahler) number of the tree, computed bottom-up; evaluating the needier subtree first achieves it (the Sethi–Ullman algorithm).",
          "Common subexpressions can be shared, turning the tree into a directed acyclic graph (DAG) so that each is computed once.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    { label: "Nodes", value: "$2k + 1$ for $k$ binary operators" },
    { label: "Walks", value: "Post-order evaluates; in-order prints infix" },
  ],
  implementations: [
    {
      language: "python",
      entry: "evaluate_postfix_tree",
      code: `def build(postfix):
    """Expression tree from postfix tokens, with a stack of subtrees."""
    stack = []
    for t in postfix:
        if t in "+-*/":
            right = stack.pop()
            left = stack.pop()
            stack.append((t, left, right))
        else:
            stack.append(int(t))
    return stack[0]

def evaluate(node):
    if isinstance(node, int):
        return node
    op, left, right = node
    a, b = evaluate(left), evaluate(right)
    return {"+": a + b, "-": a - b, "*": a * b}[op] if op != "/" else int(a / b)

def infix(node):
    if isinstance(node, int):
        return str(node)
    op, left, right = node
    return "(" + infix(left) + " " + op + " " + infix(right) + ")"

def evaluate_postfix_tree(postfix):
    tree = build(postfix)
    return [evaluate(tree), infix(tree)]
`,
      tests: [
        {
          args: [["3", "4", "+", "5", "2", "-", "*"]],
          expected: [21, "((3 + 4) * (5 - 2))"],
        },
        {
          args: [["2", "3", "4", "*", "+", "6", "2", "/", "-"]],
          expected: [11, "((2 + (3 * 4)) - (6 / 2))"],
        },
      ],
    },
    {
      language: "javascript",
      entry: "height",
      code: `// Height of the expression tree of a postfix expression (a single number has height 0).
function height(postfix) {
  const stack = []; // heights of subtrees
  for (const t of postfix.split(" ")) {
    if ("+-*/^".includes(t)) {
      const right = stack.pop();
      const left = stack.pop();
      stack.push(1 + Math.max(left, right));
    } else stack.push(0);
  }
  return stack[0];
}
`,
      tests: [
        { args: ["3 4 + 5 2 - *"], expected: 2 },
        { args: ["2 3 4 * + 6 2 / -"], expected: 3 },
        { args: ["7"], expected: 0 },
      ],
    },
  ],
  visualizer: "expression-tree",
  practice: [
    {
      id: "expr-tree-root",
      kind: "mcq",
      prompt: "What is the root of the expression tree of $2 \\times 3 + 4$?",
      options: ["+", "×", "2", "4"],
      answer: 0,
      explanation:
        "× binds tighter, so it is computed first; the + is applied last and is the root.",
      distractors: {
        1: "× is the left child of +.",
        2: "Numbers are always leaves.",
        3: "Numbers are always leaves.",
      },
      hints: ["Which operator is applied last?"],
      objective: "Shape of an expression tree",
    },
    {
      id: "expr-tree-nodes",
      kind: "numeric",
      prompt: "How many nodes does the expression tree of `1 + 2 * 3 - 4 / 5` have?",
      answer: 9,
      explanation: "4 binary operators and 5 numbers: $2 \\times 4 + 1 = 9$ nodes.",
      hints: ["Count operators $k$; there are $2k + 1$ nodes."],
      objective: "Count tree nodes",
    },
    {
      id: "expr-tree-walk",
      kind: "mcq",
      prompt: "Which walk of an expression tree lists its tokens in postfix order?",
      options: ["Post-order", "Pre-order", "In-order", "Level order"],
      answer: 0,
      explanation:
        "Post-order visits both operands before the operator, exactly as postfix writes them.",
      distractors: {
        1: "Pre-order gives prefix notation.",
        2: "In-order gives infix (without the parentheses).",
        3: "Level order mixes operands of different subtrees.",
      },
      hints: ["In postfix, where is the operator relative to its operands?"],
      objective: "Traversals and notations",
    },
  ],
  exam: {
    definition:
      "An expression tree is a binary tree with numbers at the leaves and operators at the internal nodes; each subtree is a subexpression.",
    steps: [
      "Convert to postfix.",
      "Build: for each token, a number pushes a leaf; an operator pops right and left subtrees and pushes a new node.",
      "Evaluate by post-order; print infix by in-order with parentheses.",
    ],
    timeComplexity: "$O(n)$ to build, evaluate or print.",
    spaceComplexity: "$O(n)$ nodes; $O(h)$ recursion.",
    correctness:
      "The last postfix token is the operator applied last, and the tokens before it split uniquely into its two operands.",
    applications: [
      "Compilers (abstract syntax trees)",
      "Symbolic algebra and differentiation",
      "Constant folding and code generation",
    ],
    limitations: ["Recursion depth grows with the height of the tree"],
    faq: [
      {
        q: "Why are the parentheses in the printed infix not those of the input?",
        a: "The tree keeps the structure, not the original text; an in-order walk with parentheses around every operator prints one canonical form.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Leaves are operands, internal nodes operators."] },
      {
        marks: 10,
        outline: [
          "Construction from postfix with a stack (4).",
          "Diagram for an example (2).",
          "Evaluation by post-order (3).",
          "Complexity (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 1: Fundamental Algorithms, 3rd ed., Addison-Wesley, 1997, Section 2.3.",
      supports: "Trees representing algebraic formulas, and traversal orders.",
    },
    {
      citation:
        "A. V. Aho, M. S. Lam, R. Sethi, J. D. Ullman, Compilers: Principles, Techniques, and Tools, 2nd ed., Addison-Wesley, 2006, Chapters 2, 5 and 8.",
      supports:
        "Syntax trees, DAGs for common subexpressions, and register allocation for expression trees.",
    },
    {
      citation:
        "R. Sethi, J. D. Ullman, “The generation of optimal code for arithmetic expressions,” Journal of the ACM, 17(4), 1970.",
      supports: "Evaluating expression trees with the fewest registers.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
