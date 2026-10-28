import type { AlgorithmEntry } from "../types";

export const postfixEvaluationEntry: AlgorithmEntry = {
  slug: "postfix-evaluation",
  name: "Postfix and Prefix Evaluation",
  aliases: ["Reverse Polish notation evaluation", "RPN calculator", "Polish notation evaluation"],
  curriculum: [118, 119],
  domain: "linear-structures",
  subcategory: "Stacks and queues",
  difficulty: "beginner",
  summary:
    "Evaluates an expression written in postfix (5 1 2 + +) or prefix (+ 5 + 1 2) notation with one stack of operands: numbers are pushed, and each operator pops two operands and pushes its result. No parentheses or precedence rules are needed.",
  tags: ["stack", "postfix", "prefix", "reverse polish notation", "polish notation", "calculator"],
  prerequisites: ["Stacks"],
  related: ["shunting-yard", "expression-tree"],
  problem: {
    input:
      "An expression of $n$ tokens in postfix or prefix notation: numbers and the binary operators + − * / ^.",
    output: "Its value.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In postfix, every operator comes right after its two operands. Read left to right, keeping the numbers seen so far on a stack: when an operator arrives, its operands are the two most recent values, on top of the stack. Replace them with the result and carry on. Prefix is the mirror image: the operator comes first, so read it from right to left and the same stack works.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Read the tokens left to right for postfix, right to left for prefix.",
          "A number is pushed.",
          "An operator pops two values and pushes the result. In postfix the first value popped is the **right** operand; in prefix it is the **left** one.",
          "At the end exactly one value remains: the result. (Fewer than two values for an operator, or more than one at the end, means the expression is malformed.)",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): `5 1 2 + 4 * + 3 −`, which is $5 + (1 + 2) \\times 4 - 3$.",
      },
      {
        kind: "table",
        head: ["token", "action", "stack afterwards"],
        rows: [
          ["5", "push", "5"],
          ["1", "push", "5 1"],
          ["2", "push", "5 1 2"],
          ["+", "1 + 2 = 3", "5 3"],
          ["4", "push", "5 3 4"],
          ["*", "3 × 4 = 12", "5 12"],
          ["+", "5 + 12 = 17", "17"],
          ["3", "push", "17 3"],
          ["−", "17 − 3 = 14", "14"],
        ],
      },
      {
        kind: "p",
        text: "The value is 14, after 4 operations, with at most 3 values on the stack. The second preset is the same expression in prefix, `− + 5 * + 1 2 4 3`: read from the right it pushes 3, 4, 2, 1 (4 values at once), then computes 1 + 2 = 3, 3 × 4 = 12, 5 + 12 = 17 and 17 − 3 = 14.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Get the operand order right: for postfix `a b −`, pop $b$ first, then $a$, and compute $a - b$. Swapping them is the most common bug, and only − / ^ reveal it.",
          "Decide what division means: here / truncates toward zero, as in C and Java; Python's // rounds down instead.",
          "Check the stack size: fewer than two values for an operator, or more than one at the end, is a malformed expression.",
          "To evaluate an infix expression, convert it with the shunting-yard algorithm and evaluate the postfix, or merge the two loops (Dijkstra's two-stack algorithm).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Running time.** Each token is handled once with $O(1)$ stack work: $O(n)$ time and $O(n)$ space for the stack.",
      },
      {
        kind: "p",
        text: "**Correctness.** Invariant: after reading a prefix of a valid postfix expression, the stack holds the values of the complete subexpressions read so far, in order. An operator's two operands are the last two complete subexpressions before it, which are the top two values. The tests check every run against a separate recursive evaluator that uses no explicit stack.",
      },
      {
        kind: "p",
        text: "**Stack depth.** The depth needed equals the largest number of complete subexpressions waiting at once; for a postfix expression it can be anything from 2 (a left-leaning expression such as `1 2 + 3 + 4 +`) to about $n/2$ (a right-leaning one such as `1 2 3 4 + + +`).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Postfix was promoted for computing by Burks, Warren and Wright (1954) and by Hamblin; it is called reverse Polish notation after Jan Łukasiewicz's prefix notation from the 1920s.",
          "Stack-based virtual machines (the JVM, .NET CIL, WebAssembly) and languages such as Forth and PostScript execute code in postfix order.",
          "Hewlett-Packard's RPN calculators, beginning with the HP-35, let users type postfix directly.",
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
    { label: "Operations", value: "One per operator" },
    { label: "Parentheses", value: "Never needed" },
  ],
  implementations: [
    {
      language: "python",
      entry: "eval_postfix",
      code: `def eval_postfix(tokens):
    """Value of a postfix expression; / truncates toward zero."""
    stack = []
    for t in tokens:
        if t in ("+", "-", "*", "/"):
            b = stack.pop()          # right operand comes off first
            a = stack.pop()
            if t == "+":
                stack.append(a + b)
            elif t == "-":
                stack.append(a - b)
            elif t == "*":
                stack.append(a * b)
            else:
                stack.append(int(a / b))
        else:
            stack.append(int(t))
    assert len(stack) == 1, "malformed expression"
    return stack[0]
`,
      tests: [
        { args: [["5", "1", "2", "+", "4", "*", "+", "3", "-"]], expected: 14 },
        { args: [["7", "2", "-"]], expected: 5 },
        { args: [["7", "-2", "/"]], expected: -3 },
      ],
    },
    {
      language: "javascript",
      entry: "evalPrefix",
      code: `// Value of a prefix expression, read from right to left.
function evalPrefix(tokens) {
  const stack = [];
  for (let i = tokens.length - 1; i >= 0; i--) {
    const t = tokens[i];
    if (["+", "-", "*", "/"].includes(t)) {
      const a = stack.pop(); // left operand comes off first in prefix
      const b = stack.pop();
      if (t === "+") stack.push(a + b);
      else if (t === "-") stack.push(a - b);
      else if (t === "*") stack.push(a * b);
      else stack.push(Math.trunc(a / b));
    } else stack.push(Number(t));
  }
  return stack[0];
}
`,
      tests: [
        { args: [["-", "+", "5", "*", "+", "1", "2", "4", "3"]], expected: 14 },
        { args: [["-", "7", "2"]], expected: 5 },
        { args: [["/", "9", "2"]], expected: 4 },
      ],
    },
  ],
  visualizer: "postfix-evaluation",
  practice: [
    {
      id: "postfix-value",
      kind: "numeric",
      prompt: "Evaluate the postfix expression `6 2 3 + −`.",
      answer: 1,
      explanation: "2 + 3 = 5, then 6 − 5 = 1.",
      hints: ["The + applies to the two values just before it."],
      objective: "Evaluate postfix",
    },
    {
      id: "prefix-value",
      kind: "numeric",
      prompt: "Evaluate the prefix expression `* − 9 4 + 1 1`.",
      answer: 10,
      explanation: "9 − 4 = 5 and 1 + 1 = 2, so the * gives 5 × 2 = 10.",
      hints: ["Read from the right, or find each operator's two operands."],
      objective: "Evaluate prefix",
    },
    {
      id: "postfix-order",
      kind: "mcq",
      prompt: "Evaluating postfix `8 2 /`, the stack holds 8 then 2. Which is computed?",
      options: [
        "8 / 2 = 4",
        "2 / 8 = 0",
        "It depends on the stack size",
        "The expression is malformed",
      ],
      answer: 0,
      explanation:
        "The first value popped (2) is the right operand; the second (8) is the left one.",
      distractors: {
        1: "That swaps the operands: a classic bug.",
        2: "The order rule is fixed.",
        3: "Two values and one operator is well formed.",
      },
      hints: ["Which value was pushed last?"],
      objective: "Operand order",
    },
  ],
  exam: {
    definition:
      "Postfix (and prefix) evaluation computes an expression's value with a stack of operands: numbers are pushed, and each operator replaces the top two values with its result.",
    steps: [
      "Scan left to right (postfix) or right to left (prefix).",
      "Push numbers.",
      "Operator: pop two operands (postfix: right then left), push the result.",
      "The single remaining value is the answer.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$ for the stack.",
    correctness:
      "The stack holds the values of the complete subexpressions so far; an operator's operands are the top two.",
    applications: ["RPN calculators", "Stack virtual machines", "Evaluating compiled expressions"],
    limitations: ["Expressions must first be converted from infix"],
    faq: [
      {
        q: "Why is prefix read from the right?",
        a: "Reading right to left, every operator's operands have already been pushed, just as in postfix read left to right; the pop order of the operands is reversed.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Push numbers; operator pops two and pushes the result."] },
      { marks: 5, outline: ["Algorithm (2).", "Trace with stack contents (2).", "$O(n)$ (1)."] },
    ],
  },
  references: [
    {
      citation:
        "A. W. Burks, D. W. Warren, J. B. Wright, “An analysis of a logical machine using parenthesis-free notation,” Mathematical Tables and Other Aids to Computation, 8(46), 1954.",
      supports: "Parenthesis-free (Polish and reverse Polish) notation for machine evaluation.",
    },
    {
      citation:
        "C. L. Hamblin, “Translation to and from Polish notation,” The Computer Journal, 5(3), 1962.",
      supports: "Stack evaluation of Polish notation.",
    },
    {
      citation: "R. Sedgewick, K. Wayne, Algorithms, 4th ed., Addison-Wesley, 2011, Section 1.3.",
      supports: "Evaluating arithmetic expressions with stacks (Dijkstra's two-stack algorithm).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
