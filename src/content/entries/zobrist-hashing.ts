import type { AlgorithmEntry } from "../types";

export const zobristHashingEntry: AlgorithmEntry = {
  slug: "zobrist-hashing",
  name: "Zobrist Hashing",
  aliases: ["Zobrist keys", "Board position hashing"],
  curriculum: [83],
  domain: "arrays-hashing",
  subcategory: "Hash functions",
  difficulty: "intermediate",
  summary:
    "Hashes a board position as the XOR of one random number per (square, piece). A move updates the hash with one or two XORs, and the same position reached by different move orders gets the same hash.",
  tags: ["hashing", "games", "XOR", "transposition table", "incremental hashing"],
  prerequisites: ["Hash Table (Separate Chaining)", "Bitwise XOR"],
  related: ["mcts", "hash-chaining"],
  problem: {
    input:
      "A few games on a 3×3 board, each a sequence of squares (X moves first), and a seed for the random table.",
    output: "The hash after every move, and every position whose hash was seen before.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Game-playing programs meet the same position again and again, reached through different move orders: playing A then B often gives the same board as B then A. Recognising it saves searching it twice. That needs a fingerprint of the position that is cheap to update after every move.",
      },
      {
        kind: "p",
        text: "Zobrist's idea: give every (square, piece) pair a random number, and let the fingerprint be the XOR of the numbers of the pieces on the board. Placing a piece XORs its number in; removing it XORs the same number out, because $x \\oplus z \\oplus z = x$. And since XOR does not care about order, any move order that ends in the same position ends with the same hash.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Once: fill a table $Z[\\text{square}][\\text{piece}]$ with random numbers (16 bits here; 64 bits in real programs).",
          "The empty board has hash 0.",
          "Placing piece $p$ on square $c$: $\\text{hash} \\leftarrow \\text{hash} \\oplus Z[c][p]$. Removing it: the same XOR. Moving a piece is a removal plus a placement.",
          "Look the hash up in a table of positions already seen (a *transposition table*).",
        ],
      },
      { kind: "heading", text: "Worked example (seed 7)" },
      {
        kind: "p",
        text: "Squares are numbered 1–9 row by row. The table gives $Z[5][X] = \\texttt{8da7}$, $Z[1][O] = \\texttt{0fdd}$ and $Z[9][X] = \\texttt{4b12}$ (hexadecimal).",
      },
      {
        kind: "table",
        head: ["Game", "Moves", "Hashes after each move"],
        rows: [
          ["1", "X5, O1, X9", "8da7, 827a, **c968**"],
          ["2", "X9, O1, X5", "4b12, 44cf, **c968**"],
          ["3", "X5, O9, X1", "8da7, 0542, 0642"],
        ],
      },
      {
        kind: "p",
        text: "Games 1 and 2 reach the same board in different orders, and both end at c968: a transposition, detected by one lookup. Game 3 starts like game 1 (8da7 is seen again after its first move) but ends elsewhere.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Use 64-bit keys** in real programs. With 16 bits, as here, two different positions share a hash with probability $2^{-16}$ per pair; among a million positions, collisions are certain.",
          "**Include everything that affects the game**: side to move, castling rights and en-passant squares in chess, each with its own random number XORed in or out.",
          "**Store a check value** (for instance the other half of a 128-bit hash, or part of the position) in the transposition table, to detect most collisions.",
          "**Fixed seed:** generate the table from a fixed seed so that hashes are reproducible between runs and machines.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Why XOR" },
      {
        kind: "p",
        text: "XOR is associative and commutative, and every value is its own inverse. So the hash of a position is $\\bigoplus_{(c, p) \\in \\text{board}} Z[c][p]$, a function of the set of pieces only, not of the order they arrived in. The property tests check this: reordering each player's moves never changes the final hash.",
      },
      { kind: "heading", text: "Collisions" },
      {
        kind: "p",
        text: "If the table entries are independent and uniformly random $b$-bit values, then for two different positions the XOR of the entries in which they differ is itself uniform, so they collide with probability $2^{-b}$. Among $N$ positions the expected number of colliding pairs is about $\\binom{N}{2} 2^{-b}$: negligible for $b = 64$ and practical $N$, but about 116 for a million positions with $b = 32$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Transposition tables** in chess, Go and checkers programs store each searched position's value and depth under its Zobrist hash, so repeated positions are not searched again.",
          "**Repetition detection:** draws by repetition are found by comparing the current hash with those of earlier positions in the game.",
          "**Tabulation hashing**, the same table-and-XOR construction applied to the bytes of a key, is a hash function family with strong independence guarantees.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    space: "\\Theta(\\text{squares} \\times \\text{pieces})",
    worstClass: "1",
    note: "Per move update; computing a hash from scratch costs one XOR per piece on the board.",
  },
  properties: [
    { label: "Update per move", value: "One or two XORs" },
    { label: "Order independence", value: "Same position, same hash" },
    { label: "Collisions", value: "Probability $2^{-b}$ per pair of positions" },
  ],
  implementations: [
    {
      language: "python",
      entry: "position_hash",
      code: `def position_hash(table, board):
    """table[c][p] for square c (0-8) and piece p (0 = X, 1 = O);
    board: string of 9 chars from 'X', 'O', '.'. XOR of the pieces' numbers."""
    h = 0
    for c, piece in enumerate(board):
        if piece != '.':
            h ^= table[c][0 if piece == 'X' else 1]
    return h
`,
      tests: [
        {
          args: [
            [
              [0x300, 0xfdd],
              [0xfa16, 0xb2f3],
              [0x857d, 0x67d0],
              [0x775b, 0x3d6c],
              [0x8da7, 0xbad5],
              [0x4200, 0x27ed],
              [0xc39b, 0x84b6],
              [0x3278, 0x5e33],
              [0x4b12, 0x88e5],
            ],
            "O...X...X",
          ],
          expected: 0xc968,
        },
        {
          args: [
            [
              [0x300, 0xfdd],
              [0xfa16, 0xb2f3],
              [0x857d, 0x67d0],
              [0x775b, 0x3d6c],
              [0x8da7, 0xbad5],
              [0x4200, 0x27ed],
              [0xc39b, 0x84b6],
              [0x3278, 0x5e33],
              [0x4b12, 0x88e5],
            ],
            ".........",
          ],
          expected: 0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "playHashes",
      code: `// Incremental hashes along a game: moves are squares 1-9, X first.
function playHashes(table, moves) {
  let h = 0;
  return moves.map((square, i) => (h ^= table[square - 1][i % 2]));
}
`,
      tests: [
        {
          args: [
            [
              [0x300, 0xfdd],
              [0xfa16, 0xb2f3],
              [0x857d, 0x67d0],
              [0x775b, 0x3d6c],
              [0x8da7, 0xbad5],
              [0x4200, 0x27ed],
              [0xc39b, 0x84b6],
              [0x3278, 0x5e33],
              [0x4b12, 0x88e5],
            ],
            [9, 1, 5],
          ],
          expected: [0x4b12, 0x44cf, 0xc968],
        },
      ],
    },
  ],
  visualizer: "zobrist-hashing",
  practice: [
    {
      id: "zob-undo",
      kind: "mcq",
      prompt:
        "The hash is $h$. You place X on square 3 and then take it back. What is the hash now?",
      options: ["$h$", "$h \\oplus Z[3][X]$", "0", "$2 \\cdot Z[3][X]$"],
      answer: 0,
      explanation: "$h \\oplus Z[3][X] \\oplus Z[3][X] = h$: XOR is its own inverse.",
      distractors: {
        1: "That is the hash while X is on square 3.",
        2: "Only the empty board has hash 0.",
        3: "XOR does not add values.",
      },
      hints: ["What is $z \\oplus z$?"],
      objective: "Use XOR's self-inverse",
    },
    {
      id: "zob-order",
      kind: "mcq",
      prompt: "Why do X5, O1, X9 and X9, O1, X5 end with the same Zobrist hash?",
      options: [
        "XOR is commutative and associative, so only the set of pieces matters",
        "Because the hash table has a collision",
        "Because both games have three moves",
        "Because the seed is the same for both games but not for others",
      ],
      answer: 0,
      explanation:
        "Both final hashes are $Z[5][X] \\oplus Z[1][O] \\oplus Z[9][X]$, in a different order.",
      distractors: {
        1: "It is the same position, so the same hash is correct, not a collision.",
        2: "Different positions with three moves have different hashes (almost surely).",
        3: "One table is used for every game.",
      },
      hints: ["Write both hashes as XORs of table entries."],
      objective: "Explain transposition detection",
    },
    {
      id: "zob-bits",
      kind: "numeric",
      prompt:
        "With 16-bit Zobrist keys, about how many positions $N$ give one expected colliding pair? Solve $N^2/2 = 2^{16}$ and round to the nearest whole number.",
      answer: 362,
      explanation:
        "$N = \\sqrt{2 \\cdot 2^{16}} = 2^{8.5} \\approx 362$: the birthday bound. A few hundred positions already make a collision likely.",
      hints: ["$N = \\sqrt{2^{17}}$.", "$2^{17} = 131072$."],
      objective: "Estimate collisions",
    },
  ],
  exam: {
    definition:
      "Zobrist hashing assigns a random bit string to each (square, piece) pair and hashes a position as the XOR of the strings of the pieces present, updating it incrementally with XOR on every move.",
    steps: [
      "Initialise $Z[c][p]$ with random $b$-bit values.",
      "Hash of empty board: 0.",
      "On placing or removing piece $p$ at $c$: hash $\\leftarrow$ hash $\\oplus Z[c][p]$.",
      "Use the hash as the key of a transposition table.",
    ],
    timeComplexity: "$O(1)$ per move; $O(\\text{pieces})$ to hash a position from scratch.",
    spaceComplexity: "One random number per square and piece type.",
    correctness:
      "XOR is associative, commutative and self-inverse, so the incremental hash always equals the XOR over the current pieces; equal positions have equal hashes.",
    applications: ["Transposition tables in game-tree search", "Repetition detection in chess"],
    limitations: [
      "Different positions can collide (probability $2^{-b}$ per pair)",
      "Every state feature (side to move, special rights) must be included explicitly",
    ],
    faq: [
      {
        q: "Why not hash the board string with an ordinary hash function?",
        a: "That costs time proportional to the board size after every move; Zobrist hashing updates in one or two XORs.",
      },
      {
        q: "How large should the keys be?",
        a: "64 bits in practice; smaller keys collide quickly by the birthday bound.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Random number per (square, piece); hash = XOR over pieces.",
          "Incremental $O(1)$ update; same position, same hash.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition and table (1).",
          "Incremental update for place, remove and move (2).",
          "Example showing a transposition (1).",
          "Collision probability (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Motivation: transpositions in game search — 2.",
          "Construction and XOR properties — 2.",
          "Worked example with two move orders — 3.",
          "Collision analysis and key size — 2.",
          "Transposition tables — 1.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "A. L. Zobrist, “A new hashing method with application for game playing”, Technical Report 88, Computer Sciences Department, University of Wisconsin, 1970.",
      supports: "The method and its use for transposition detection.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
