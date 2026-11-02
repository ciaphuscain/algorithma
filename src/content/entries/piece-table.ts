import type { AlgorithmEntry } from "../types";

export const pieceTableEntry: AlgorithmEntry = {
  slug: "piece-table",
  name: "Piece Table",
  aliases: ["Piece Chain"],
  curriculum: [142],
  domain: "linear-structures",
  subcategory: "Linear Data Structures",
  difficulty: "intermediate",
  summary:
    "Represents a text document as a sequence of (buffer, start, length) descriptors pointing into an original buffer and an append-only add buffer, making insertions and deletions O(log n) in a balanced tree of pieces.",
  tags: ["text editor", "data structure", "piece table"],
  prerequisites: [],
  related: ["rope"],
  problem: {
    input: "A text document with insertions and deletions at arbitrary positions.",
    output: "The current document text, maintained efficiently.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Editing a large text file by shifting characters on every insert is expensive. A piece table instead keeps the original text untouched in one buffer and appends all new text to a second buffer. The document is described by a list of 'pieces' — each pointing to a span in one of the two buffers.",
      },
      {
        kind: "p",
        text: "An insert splits one piece and adds a new one pointing to the add buffer. A delete splits a piece and drops or shortens some. The original file is never modified.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with one piece covering the entire original buffer.",
          "**Insert** at position p: find the piece containing position p, split it at that offset, insert a new piece pointing to the add buffer where the new text is appended.",
          "**Delete** a range: find and split pieces at the range boundaries, remove or shorten covered pieces.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** Original 'Hello World'. Insert ' Beautiful' at 5: pieces become [(orig,0,5), (add,0,10), (orig,5,6)] → 'Hello Beautiful World'.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store pieces in a balanced BST (red-black tree) with subtree length sums for O(log n) position lookup.",
          "The add buffer is append-only, so it never fragments or needs compaction.",
          "Used in VS Code's text model.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "With a balanced tree of pieces: insert/delete is $O(\\log m)$ where m is the number of pieces. The number of pieces grows linearly with edits. Space is $O(n + k)$ where n is original text size and k is total inserted text.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Piece tables support undo naturally: just revert the piece list changes.",
          "Compared to ropes: piece tables have simpler memory management (two buffers only); ropes handle very large documents with better cache locality.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(log m)",
      average: "O(log m)",
      worst: "O(log m)",
    },
    space: "O(n + k)",
    worstClass: "log n",
    note: "m = number of pieces, n = original text size, k = inserted text size.",
  },
  properties: [
    {
      label: "Original buffer",
      value: "Read-only, never modified",
    },
    {
      label: "Add buffer",
      value: "Append-only",
    },
    {
      label: "Undo",
      value: "Natural by reverting piece list changes",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "test_piece_table",
      code: `class PieceTable:
    def __init__(self, text):
        self.original = text
        self.add = ""
        # Each piece: (buffer, start, length) where buffer is 'orig' or 'add'
        self.pieces = [("orig", 0, len(text))] if text else []

    def _get_text(self, piece):
        buf, start, length = piece
        source = self.original if buf == "orig" else self.add
        return source[start:start + length]

    def text(self):
        return "".join(self._get_text(p) for p in self.pieces)

    def insert(self, pos, s):
        add_start = len(self.add)
        self.add += s
        new_piece = ("add", add_start, len(s))
        # Find piece containing pos
        offset = 0
        for i, (buf, start, length) in enumerate(self.pieces):
            if offset + length >= pos:
                local = pos - offset
                before = (buf, start, local) if local > 0 else None
                after = (buf, start + local, length - local) if local < length else None
                new_pieces = self.pieces[:i]
                if before: new_pieces.append(before)
                new_pieces.append(new_piece)
                if after: new_pieces.append(after)
                new_pieces.extend(self.pieces[i + 1:])
                self.pieces = new_pieces
                return
            offset += length
        self.pieces.append(new_piece)

def test_piece_table():
    pt = PieceTable("Hello World")
    pt.insert(5, " Beautiful")
    return pt.text()
`,
      tests: [
        {
          args: [],
          expected: "Hello Beautiful World",
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pt-buffers",
      kind: "mcq",
      prompt: "How many buffers does a piece table use?",
      options: [
        "Two: a read-only original and an append-only add buffer",
        "One mutable buffer",
        "Three buffers",
        "One per edit",
      ],
      answer: 0,
      explanation:
        "The original text stays in a read-only buffer; all inserted text goes into a single append-only buffer.",
      hints: ["What happens to the original text on insert?"],
      objective: "Understand piece table structure",
    },
  ],
  exam: {
    definition:
      "A piece table represents text as descriptors into an immutable original buffer and an append-only add buffer.",
    steps: [
      "One piece spans the original text.",
      "Insert: split piece, append new text to add buffer, insert new piece.",
      "Delete: split and remove pieces.",
    ],
    timeComplexity: "$O(\\log m)$ with balanced tree of pieces.",
    spaceComplexity: "$O(n + k)$.",
    correctness:
      "Original buffer is never modified; add buffer only grows; piece list tracks the document structure.",
    applications: ["Text editors (VS Code)", "Document processing", "Version control"],
    limitations: ["Piece count grows with edits"],
    faq: [
      {
        q: "Why append-only?",
        a: "An append-only add buffer never fragments, simplifies memory management, and all piece offsets remain valid.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Two-buffer architecture and edit operations (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        'C. Crowley, "Data Structures for Text Sequences," Technical Report, University of New Mexico, 1998.',
      supports: "Comparison of piece tables, gap buffers, and ropes.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
