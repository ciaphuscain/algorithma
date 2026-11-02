import type { AlgorithmEntry } from "../types";

export const shuntingYardEntry: AlgorithmEntry = {
  slug: "shunting-yard",
  name: "Shunting-Yard Algorithm (Infix to Postfix)",
  aliases: ["Infix to postfix", "Infix to reverse Polish notation", "Operator-precedence parsing"],
  curriculum: [117, 121],
  domain: "linear-structures",
  subcategory: "Stacks and queues",
  difficulty: "intermediate",
  summary:
    "Dijkstra's algorithm for turning an infix expression such as 3 + 4 * 2 into postfix (3 4 2 * +): numbers go straight to the output, and operators wait on a stack until precedence, associativity or a closing parenthesis says it is their turn.",
  tags: ["stack", "parsing", "infix", "postfix", "reverse polish notation", "precedence"],
  prerequisites: ["Stacks", "Queues"],
  related: ["postfix-evaluation", "expression-tree", "balanced-brackets"],
  problem: {
    input:
      "An infix expression of $n$ tokens: numbers, the binary operators + − * / ^ and parentheses. * and / bind tighter than + and −, ^ binds tightest; ^ groups to the right and the others to the left.",
    output: "The same expression in postfix (reverse Polish) order, with no parentheses.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In postfix, an operator comes right after its two operands: “3 + 4” is “3 4 +”, and no parentheses are ever needed. Numbers keep their order, so they can go straight to the output. Operators have to wait: in “3 + 4 * 2” the + cannot be written until we know that the * after it binds tighter. Dijkstra pictured a railway shunting yard: numbers run straight through, operators are parked on a siding (a stack) and leave it when a weaker operator, a “)”, or the end of the input arrives.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Read the tokens left to right.",
          "A number goes straight to the output.",
          "“(” is pushed.",
          "“)”: pop operators to the output until the matching “(”, which is discarded.",
          "An operator $o$: while the top of the stack is an operator that binds tighter than $o$, or equally tightly when $o$ groups to the left, pop it to the output. Then push $o$.",
          "At the end, pop every remaining operator to the output.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset, Dijkstra's standard example): `3 + 4 * 2 / (1 - 5) ^ 2 ^ 3`.",
      },
      {
        kind: "table",
        head: ["token", "action", "operator stack", "output"],
        rows: [
          ["3", "output", "", "3"],
          ["+", "push", "+", "3"],
          ["4", "output", "+", "3 4"],
          ["*", "+ binds less tightly: push", "+ *", "3 4"],
          ["2", "output", "+ *", "3 4 2"],
          ["/", "pop * (same precedence, left); push", "+ /", "3 4 2 *"],
          ["(", "push", "+ / (", "3 4 2 *"],
          ["1", "output", "+ / (", "3 4 2 * 1"],
          ["−", "top is (: push", "+ / ( −", "3 4 2 * 1"],
          ["5", "output", "+ / ( −", "3 4 2 * 1 5"],
          [")", "pop − ; discard (", "+ /", "3 4 2 * 1 5 −"],
          ["^", "/ binds less tightly: push", "+ / ^", "3 4 2 * 1 5 −"],
          ["2", "output", "+ / ^", "3 4 2 * 1 5 − 2"],
          ["^", "^ groups right: push", "+ / ^ ^", "3 4 2 * 1 5 − 2"],
          ["3", "output", "+ / ^ ^", "3 4 2 * 1 5 − 2 3"],
          ["end", "pop ^ ^ / +", "", "3 4 2 * 1 5 − 2 3 ^ ^ / +"],
        ],
      },
      {
        kind: "p",
        text: "The stack is never deeper than 4, and the algorithm makes 5 precedence comparisons. Associativity matters: “8 − 3 − 2” becomes “8 3 − 2 −”, that is $(8 - 3) - 2$, because the second − pops the first; the two ^ above stay stacked, giving $2^{3}$ first and then $(1-5)^{8}$.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Write the pop condition as one comparison of precedences plus the associativity rule; a table `prec` and a set of right-associative operators is all the grammar there is.",
          "Unary minus needs its own token (for example “neg”) with higher precedence, recognised when − appears at the start or right after an operator or “(”.",
          "Function calls such as `max(a, b)` extend the algorithm: push the function name, let commas pop to the nearest “(”, and output the function when its “)” closes.",
          "Reject malformed input separately: the basic algorithm happily converts “3 +” or “) (”. This visualizer validates the input with a recursive-descent parser first.",
          "Instead of postfix text, the output step can build tree nodes (an operand stack of subtrees), which gives the expression tree directly.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Running time.** Every token is output or pushed once and popped at most once, so the work is $O(n)$; each precedence comparison either pops an operator or ends the loop for the current token, so there are fewer than $2n$ of them.",
      },
      {
        kind: "p",
        text: "**Correctness.** Invariant: the operators on the stack, between parentheses, have strictly increasing binding strength from bottom to top (except that right-associative ones may repeat). An operator leaves the stack exactly when both of its operands are complete in the output: its right operand ends when an operator that binds no tighter arrives, or at “)” or the end. That is the moment it must appear in postfix. The tests compare the output with an independent recursive-descent parser on every preset and on random expressions.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The algorithm is a special case of **operator-precedence parsing**, and is closely related to Pratt parsing (top-down operator precedence), which many hand-written compilers use.",
          "**Postfix** is also called reverse Polish notation, after Jan Łukasiewicz's parenthesis-free (prefix) notation. Stack machines such as the JVM and many calculators execute postfix directly.",
          "Running the algorithm on the reversed expression (swapping “(” and “)”) and reversing the result gives prefix notation, provided associativity is handled with care.",
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
    { label: "Passes", value: "One, left to right" },
    { label: "Operator stack", value: "Binding strength increases from bottom to top" },
  ],
  implementations: [
    {
      language: "python",
      entry: "to_postfix",
      code: `PREC = {"+": 1, "-": 1, "*": 2, "/": 2, "^": 3}
RIGHT = {"^"}

def to_postfix(tokens):
    """Shunting-yard: infix tokens to postfix tokens."""
    out, stack = [], []
    for t in tokens:
        if t == "(":
            stack.append(t)
        elif t == ")":
            while stack[-1] != "(":
                out.append(stack.pop())
            stack.pop()
        elif t in PREC:
            while (stack and stack[-1] in PREC and
                   (PREC[stack[-1]] > PREC[t] or
                    (PREC[stack[-1]] == PREC[t] and t not in RIGHT))):
                out.append(stack.pop())
            stack.append(t)
        else:
            out.append(t)
    while stack:
        out.append(stack.pop())
    return out
`,
      tests: [
        {
          args: [["3", "+", "4", "*", "2", "/", "(", "1", "-", "5", ")", "^", "2", "^", "3"]],
          expected: ["3", "4", "2", "*", "1", "5", "-", "2", "3", "^", "^", "/", "+"],
        },
        { args: [["8", "-", "3", "-", "2"]], expected: ["8", "3", "-", "2", "-"] },
        {
          args: [["(", "1", "+", "2", ")", "*", "(", "3", "+", "4", ")"]],
          expected: ["1", "2", "+", "3", "4", "+", "*"],
        },
      ],
    },
    {
      language: "javascript",
      entry: "toPostfix",
      code: `// Shunting-yard on a string with single-character tokens; returns postfix text.
function toPostfix(expr) {
  const prec = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };
  const out = [];
  const stack = [];
  for (const t of expr.replace(/\\s+/g, "")) {
    if (t === "(") stack.push(t);
    else if (t === ")") {
      while (stack[stack.length - 1] !== "(") out.push(stack.pop());
      stack.pop();
    } else if (t in prec) {
      for (;;) {
        const top = stack[stack.length - 1];
        if (!(top in prec)) break;
        if (prec[top] > prec[t] || (prec[top] === prec[t] && t !== "^")) out.push(stack.pop());
        else break;
      }
      stack.push(t);
    } else out.push(t);
  }
  while (stack.length) out.push(stack.pop());
  return out.join(" ");
}
`,
      tests: [
        { args: ["a+b*c"], expected: "a b c * +" },
        { args: ["(a+b)*c"], expected: "a b + c *" },
        { args: ["a^b^c"], expected: "a b c ^ ^" },
        { args: ["a-b-c"], expected: "a b - c -" },
      ],
    },
  ],
  visualizer: "shunting-yard",
  practice: [
    {
      id: "shunting-output",
      kind: "mcq",
      prompt: "What is the postfix form of $2 * (3 + 4) - 5$?",
      options: ["2 3 4 + * 5 −", "2 3 4 * + 5 −", "2 3 + 4 * 5 −", "2 3 4 + 5 − *"],
      answer: 0,
      explanation:
        "The parentheses make 3 + 4 the right operand of *, giving 2 3 4 + *; then − with 5.",
      distractors: {
        1: "That is 2 + 3 * 4 − 5: it ignores the parentheses.",
        2: "That is (2 + 3) * 4.",
        3: "That is 2 * ((3 + 4) − 5).",
      },
      hints: ["Convert the parenthesised part first."],
      objective: "Convert infix to postfix",
    },
    {
      id: "shunting-depth",
      kind: "numeric",
      prompt:
        "Converting `1 + 2 * 3 ^ 4`, what is the largest number of operators on the stack at once?",
      answer: 3,
      explanation:
        "Each operator binds tighter than the one below it, so none is popped early: + , * and ^ are all on the stack before the end.",
      hints: ["Does any operator pop another?"],
      objective: "Trace the operator stack",
    },
    {
      id: "shunting-assoc",
      kind: "mcq",
      prompt: "Why does an incoming ^ not pop a ^ already on the stack?",
      options: [
        "^ groups to the right, so the later ^ must be applied first",
        "^ has the lowest precedence",
        "Operators of equal precedence never pop each other",
        "Only parentheses pop operators",
      ],
      answer: 0,
      explanation:
        "`a ^ b ^ c` means $a^{(b^c)}$: the right ^ must reach the output first, so the left one waits.",
      distractors: {
        1: "^ binds tightest here.",
        2: "Equal left-associative operators (− and −) do pop each other.",
        3: "Operators pop each other by precedence too.",
      },
      hints: ["Compare 8 − 3 − 2 with 2 ^ 3 ^ 2."],
      objective: "Associativity",
    },
  ],
  exam: {
    definition:
      "The shunting-yard algorithm converts infix to postfix in one pass, sending operands straight to the output and holding operators on a stack until precedence, associativity or a parenthesis releases them.",
    steps: [
      "Number: output it. “(”: push it.",
      "“)”: pop to the output until “(”, then discard it.",
      "Operator o: pop operators that bind tighter (or equally, if o is left-associative); push o.",
      "End: pop all remaining operators.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$ for the stack.",
    correctness:
      "An operator is popped exactly when both its operands are complete in the output, which is where postfix places it.",
    applications: [
      "Calculators",
      "Compilers and interpreters",
      "Formula evaluation in spreadsheets",
    ],
    limitations: [
      "Does not by itself detect malformed expressions",
      "Unary operators and functions need extensions",
    ],
    faq: [
      {
        q: "Infix to postfix or shunting yard: are they different?",
        a: "Shunting yard is the standard stack algorithm for infix-to-postfix conversion; the curriculum lists both names, and this lesson covers both.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Operands to the output, operators on a stack.", "Pop by precedence."],
      },
      {
        marks: 10,
        outline: [
          "Rules for numbers, parentheses, operators, end (3).",
          "Associativity (2).",
          "Full trace of an example (4).",
          "$O(n)$ (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "E. W. Dijkstra, “Algol 60 translation: an Algol 60 translator for the X1 and making a translator for Algol 60,” report, Mathematisch Centrum, Amsterdam, 1961.",
      supports: "The original description of the shunting-yard algorithm.",
    },
    {
      citation:
        "A. V. Aho, M. S. Lam, R. Sethi, J. D. Ullman, Compilers: Principles, Techniques, and Tools, 2nd ed., Addison-Wesley, 2006, Chapters 2 and 4.",
      supports: "Postfix translation and operator-precedence parsing.",
    },
    {
      citation:
        "C. L. Hamblin, “Translation to and from Polish notation,” The Computer Journal, 5(3), 1962.",
      supports: "Converting expressions to parenthesis-free (Polish) notation with a stack.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
