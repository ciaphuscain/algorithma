import type { AlgorithmEntry } from "../types";

export const balancedBracketsEntry: AlgorithmEntry = {
  slug: "balanced-brackets",
  name: "Balanced Parentheses",
  aliases: ["Balanced brackets", "Valid parentheses", "Bracket matching"],
  curriculum: [116],
  domain: "linear-structures",
  subcategory: "Stacks and queues",
  difficulty: "beginner",
  summary:
    "Checks that every bracket in a text is closed by the right kind of bracket, in the right order, with one stack: openers are pushed, and each closer must match the opener on top.",
  tags: ["stack", "parentheses", "brackets", "matching", "dyck language"],
  prerequisites: ["Stacks"],
  related: ["shunting-yard", "expression-tree", "monotonic-stack"],
  problem: {
    input:
      "A text of $n$ characters; the brackets ( ) [ ] { } are checked and everything else is ignored.",
    output:
      "Whether the brackets are balanced and, if not, the position of the first problem: a closer that matches nothing, or the earliest opener left open.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Brackets nest like boxes inside boxes: the box opened last must be closed first. So keep the open brackets on a stack. A closing bracket can only close the most recently opened one, which is on top. If it is the wrong kind, or there is nothing open, the text is unbalanced; if anything is still open at the end, it is unbalanced too.",
      },
      {
        kind: "callout",
        tone: "note",
        text: "Counting is not enough. A single counter (+1 for “(”, −1 for “)”) works for one kind of bracket, but “([)]” has equal numbers of each kind and is still wrong: the stack remembers **which** bracket is open, not just how many.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For each character $c$, left to right:",
          "If $c$ opens a bracket, push it (with its position).",
          "If $c$ closes a bracket: if the stack is empty, or its top is a different kind, stop: unbalanced at $c$. Otherwise pop.",
          "At the end, the text is balanced exactly when the stack is empty; otherwise the bottom of the stack is the earliest bracket left open.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): “{[()()]}”.",
      },
      {
        kind: "table",
        head: ["position", "character", "action", "stack afterwards"],
        rows: [
          ["0", "{", "push", "{"],
          ["1", "[", "push", "{ ["],
          ["2", "(", "push", "{ [ ("],
          ["3", ")", "matches ( : pop", "{ ["],
          ["4", "(", "push", "{ [ ("],
          ["5", ")", "matches ( : pop", "{ ["],
          ["6", "]", "matches [ : pop", "{"],
          ["7", "}", "matches { : pop", "(empty)"],
        ],
      },
      {
        kind: "p",
        text: "Balanced, after 4 comparisons (one per closer). In the second preset, “([)]”, the “)” at position 2 meets “[” on top: unbalanced at position 2 after one comparison. In the third, “((a+b)*[c-d]”, every closer matches but the “(” from position 0 is still open at the end.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Keep a map from each closer to its opener, so the match test is one lookup.",
          "Push **positions**, not just characters, if you want to report where the error is.",
          "Stop at the first bad closer: nothing after it can repair the text.",
          "In editors, the same stack finds the bracket that matches the one under the cursor.",
          "Quotes and comments need a small state machine around the stack: brackets inside a string literal do not count.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Running time.** Each character is read once and each bracket is pushed and popped at most once: $O(n)$ time and $O(n)$ space in the worst case (all openers).",
      },
      {
        kind: "p",
        text: "**Correctness.** Invariant: the stack holds exactly the brackets opened so far and not yet closed, innermost on top. A closer is legal exactly when it closes the innermost open bracket, so it must match the top. The balanced strings are exactly those that reduce to nothing by repeatedly deleting an adjacent matched pair such as “()”; the stack performs those deletions as it scans. (The tests check the stack against that deletion procedure.)",
      },
      {
        kind: "p",
        text: "**Counting.** The number of balanced strings of $n$ pairs of one kind of bracket is the Catalan number $C_n = \\frac{1}{n+1}\\binom{2n}{n}$: 1, 1, 2, 5, 14, 42, ….",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Balanced bracket strings form the **Dyck language**, the standard example of a context-free language that is not regular: a finite automaton cannot count unbounded nesting, and a stack (a pushdown automaton) is exactly what it needs.",
          "With only one kind of bracket, a counter replaces the stack, and the problem needs only $O(\\log n)$ bits of memory.",
          "Shortest fix: the minimum number of brackets to insert to balance a one-kind string is the number of unmatched “)” plus the number of “(” left open.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "The best case stops at a first character that is a closer.",
  },
  properties: [
    { label: "Comparisons", value: "One per closing bracket read" },
    { label: "Stack holds", value: "The open brackets, innermost on top" },
  ],
  implementations: [
    {
      language: "python",
      entry: "is_balanced",
      code: `def is_balanced(text):
    """True when every bracket is closed by the right kind, in order."""
    opener = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in text:
        if c in "([{":
            stack.append(c)
        elif c in opener:
            if not stack or stack[-1] != opener[c]:
                return False
            stack.pop()
    return not stack
`,
      tests: [
        { args: ["{[()()]}"], expected: true },
        { args: ["([)]"], expected: false },
        { args: ["((a+b)*[c-d]"], expected: false },
        { args: ["f(a[i],{x:1})"], expected: true },
      ],
    },
    {
      language: "javascript",
      entry: "firstError",
      code: `// Position of the first problem, or -1 when the brackets are balanced.
function firstError(text) {
  const opener = { ")": "(", "]": "[", "}": "{" };
  const stack = []; // positions of open brackets
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if ("([{".includes(c)) stack.push(i);
    else if (c in opener) {
      if (!stack.length || text[stack[stack.length - 1]] !== opener[c]) return i;
      stack.pop();
    }
  }
  return stack.length ? stack[0] : -1;
}
`,
      tests: [
        { args: ["{[()()]}"], expected: -1 },
        { args: ["([)]"], expected: 2 },
        { args: ["((a+b)*[c-d]"], expected: 0 },
        { args: ["a)"], expected: 1 },
      ],
    },
  ],
  visualizer: "balanced-brackets",
  practice: [
    {
      id: "brackets-error",
      kind: "numeric",
      prompt: "In “[(])”, at which position (counting from 0) does the check fail?",
      answer: 2,
      explanation: "“]” at position 2 meets “(” on top of the stack, which it does not close.",
      hints: ["Push the first two characters, then look at the third."],
      objective: "Trace the bracket stack",
    },
    {
      id: "brackets-counter",
      kind: "mcq",
      prompt: "Why can one counter per bracket kind not replace the stack?",
      options: [
        "It cannot tell that “([)]” closes brackets in the wrong order",
        "Counters overflow on long inputs",
        "It is slower than a stack",
        "It cannot detect a text with too many closers",
      ],
      answer: 0,
      explanation:
        "Per-kind counters see one “(”, one “)”, one “[” and one “]”; only the order of the brackets, which the stack keeps, shows the error.",
      distractors: {
        1: "Overflow is not the issue; order is.",
        2: "Both are linear time.",
        3: "A counter going negative does detect an extra closer.",
      },
      hints: ["Try “([)]” with two counters."],
      objective: "Why a stack is needed",
    },
  ],
  exam: {
    definition:
      "Bracket matching checks, with a stack of open brackets, that each closing bracket closes the most recently opened bracket of the same kind and that none is left open.",
    steps: [
      "Push each opening bracket.",
      "For a closer: fail if the stack is empty or the top is a different kind; otherwise pop.",
      "Balanced exactly when the stack is empty at the end.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$ for the stack.",
    correctness:
      "The stack holds the open brackets innermost on top; a closer is legal exactly when it closes the innermost one.",
    applications: [
      "Compilers and editors (syntax checks, matching-bracket highlighting)",
      "Validating JSON, XML and HTML nesting",
      "Expression parsing",
    ],
    limitations: ["Needs extra state to skip brackets inside strings and comments"],
    faq: [
      {
        q: "Which position is reported when brackets are left open?",
        a: "This implementation reports the earliest open bracket, at the bottom of the stack; reporting the innermost (the top) is equally valid.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Push openers; a closer must match the top.", "Empty at the end."] },
      { marks: 5, outline: ["Algorithm (2).", "Trace of an example (2).", "$O(n)$ (1)."] },
    ],
  },
  references: [
    {
      citation: "R. Sedgewick, K. Wayne, Algorithms, 4th ed., Addison-Wesley, 2011, Section 1.3.",
      supports: "Stacks and their use for checking balanced parentheses.",
    },
    {
      citation:
        "N. Chomsky, M. P. Schützenberger, “The algebraic theory of context-free languages,” in Computer Programming and Formal Systems, North-Holland, 1963.",
      supports: "Dyck languages of balanced brackets.",
    },
    {
      citation:
        "R. L. Graham, D. E. Knuth, O. Patashnik, Concrete Mathematics, 2nd ed., Addison-Wesley, 1994, Section 7.5.",
      supports: "Catalan numbers count balanced strings of parentheses.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
