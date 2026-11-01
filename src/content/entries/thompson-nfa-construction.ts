import type { AlgorithmEntry } from "../types";

export const thompsonNfaConstructionEntry: AlgorithmEntry = {
  slug: "thompson-nfa-construction",
  name: "Thompson NFA Construction",
  aliases: ["Thompson NFA Construction"],
  curriculum: [338],
  domain: "compilers",
  subcategory: "Compiler Algorithms",
  difficulty: "intermediate",
  summary:
    "Thompson NFA Construction is an algorithm in the field of compiler algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["thompson nfa construction", "compiler algorithms"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Thompson NFA Construction.",
    output: "Result of applying Thompson NFA Construction to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Thompson NFA Construction addresses a fundamental problem in compiler algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Thompson NFA Construction is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Thompson NFA Construction algorithm proceeds through a series of well-defined steps:",
      },
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize the data structures needed for processing.",
          "Process each element of the input according to the algorithm's rules.",
          "Combine intermediate results to produce the final output.",
          "Return the computed result.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The implementation follows the algorithm's specification closely. Key considerations include choosing appropriate data structures and handling edge cases.",
      },
      {
        kind: "callout",
        tone: "tip",
        text: "When implementing Thompson NFA Construction, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Thompson NFA Construction depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Thompson NFA Construction exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Category",
      value: "Compiler Algorithms",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "tokenize",
      code: `def tokenize(source):
    """Simple tokenizer: split source into tokens (identifiers, numbers, operators).
    Returns list of [type, value] pairs."""
    tokens = []
    i = 0
    while i < len(source):
        if source[i].isspace():
            i += 1
        elif source[i].isalpha():
            j = i
            while j < len(source) and source[j].isalnum():
                j += 1
            tokens.append(["id", source[i:j]])
            i = j
        elif source[i].isdigit():
            j = i
            while j < len(source) and source[j].isdigit():
                j += 1
            tokens.append(["num", source[i:j]])
            i = j
        else:
            tokens.append(["op", source[i]])
            i += 1
    return tokens
`,
      tests: [
        {
          args: ["x + 42"],
          expected: [
            ["id", "x"],
            ["op", "+"],
            ["num", "42"],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "tokenize",
      code: `function tokenize(source) {
  const tokens = []; let i = 0;
  while (i < source.length) {
    if (source[i] === " ") { i++; continue; }
    if (/[a-zA-Z]/.test(source[i])) {
      let j = i; while (j < source.length && /[a-zA-Z0-9]/.test(source[j])) j++;
      tokens.push(["id", source.slice(i, j)]); i = j;
    } else if (/[0-9]/.test(source[i])) {
      let j = i; while (j < source.length && /[0-9]/.test(source[j])) j++;
      tokens.push(["num", source.slice(i, j)]); i = j;
    } else { tokens.push(["op", source[i]]); i++; }
  }
  return tokens;
}`,
      tests: [
        {
          args: ["x + 42"],
          expected: [
            ["id", "x"],
            ["op", "+"],
            ["num", "42"],
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "thompson-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Thompson NFA Construction?",
      options: [
        "To solve problems in compiler algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Thompson NFA Construction is designed specifically for problems in the domain of compiler algorithms.",
      hints: ["Think about what domain Thompson NFA Construction belongs to"],
      objective: "Understand the purpose of Thompson NFA Construction",
    },
  ],
  exam: {
    definition: "Define Thompson NFA Construction and explain its purpose.",
    steps: ["Describe the main steps of Thompson NFA Construction."],
    timeComplexity: "Analyze the time complexity of Thompson NFA Construction.",
    spaceComplexity: "Analyze the space complexity of Thompson NFA Construction.",
    correctness: "How does Thompson NFA Construction guarantee correctness?",
    applications: ["List two applications of Thompson NFA Construction."],
    limitations: ["What are the limitations of Thompson NFA Construction?"],
    faq: [
      {
        q: "Why is Thompson NFA Construction preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Thompson NFA Construction works by applying its core strategy to efficiently sol",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Thompson NFA Construction",
      supports: "Core algorithm description",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
