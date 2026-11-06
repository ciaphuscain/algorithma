import type { AlgorithmEntry } from "../types";

export const crc32Entry: AlgorithmEntry = {
  slug: "crc32",
  name: "CRC32",
  aliases: ["Cyclic Redundancy Check 32-bit"],
  curriculum: [86],
  domain: "arrays-hashing",
  subcategory: "Hashing",
  difficulty: "intermediate",
  summary:
    "Computes a 32-bit cyclic redundancy check by treating the input as a polynomial over GF(2) and dividing by a fixed generator polynomial, used for error detection in network protocols and file formats.",
  tags: ["checksum", "error detection", "polynomial", "hashing"],
  prerequisites: ["Bit Manipulation"],
  related: ["zobrist-hashing"],
  problem: {
    input: "A sequence of bytes.",
    output: "A 32-bit integer checksum.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "CRC treats a message as a long polynomial over GF(2) (where addition is XOR) and computes the remainder when dividing by a fixed generator polynomial. Any accidental change to the message almost certainly changes the remainder, making it a good error-detection code.",
      },
      {
        kind: "p",
        text: "The standard CRC32 uses the generator 0x04C11DB7. A lookup table of 256 entries (one per byte value) speeds computation to one table lookup per input byte.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize crc = 0xFFFFFFFF.",
          "For each byte b: crc = table[(crc ^ b) & 0xFF] ^ (crc >> 8).",
          "Return crc ^ 0xFFFFFFFF.",
        ],
      },
      {
        kind: "p",
        text: "The table is precomputed: for each byte value 0-255, compute 8 rounds of polynomial division (shift right, XOR with polynomial if bit 0 is set).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The initial and final XOR with 0xFFFFFFFF ensures that leading/trailing zeros affect the checksum.",
          "CRC32 is not cryptographically secure — it is easy to forge a message with a given CRC.",
          "Hardware CRC instructions (e.g. x86 SSE4.2) compute CRC32C at wire speed.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "CRC detects all single-bit errors, all double-bit errors (for polynomials with >= 3 terms), all odd-count errors, and all burst errors shorter than the CRC width.",
      },
      {
        kind: "p",
        text: "**Time**: O(n) for n bytes with the table method. **Space**: O(1) working space plus 1 KB for the table.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "CRC32C (Castagnoli) uses a different polynomial optimized for hardware acceleration.",
          "Parallel CRC computation splits the input into blocks and combines partial CRCs.",
          "CRC is linear: CRC(A XOR B) = CRC(A) XOR CRC(B), which enables incremental updates.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(1)",
    worstClass: "n",
    note: "O(n) with a precomputed 256-entry table.",
  },
  properties: [
    {
      label: "Output size",
      value: "32 bits",
    },
    {
      label: "Error detection",
      value: "All bursts < 32 bits",
    },
    {
      label: "Cryptographic",
      value: "No",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "crc32",
      code: `def crc32(data):
    """Compute CRC32 checksum of a bytes-like object."""
    poly = 0xEDB88320
    # Build table
    table = []
    for i in range(256):
        c = i
        for _ in range(8):
            if c & 1:
                c = (c >> 1) ^ poly
            else:
                c >>= 1
        table.append(c)
    crc = 0xFFFFFFFF
    for b in data:
        crc = table[(crc ^ b) & 0xFF] ^ (crc >> 8)
    return crc ^ 0xFFFFFFFF
`,
      tests: [
        {
          args: [[]],
          expected: 0,
        },
        {
          args: [[73, 69, 84, 70]],
          expected: 4032953205,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "crc-detect",
      kind: "mcq",
      prompt: "Which error can CRC32 NOT reliably detect?",
      options: [
        "Single-bit errors",
        "All burst errors < 32 bits",
        "Arbitrary multi-bit errors longer than 32 bits",
        "Double-bit errors",
      ],
      answer: 2,
      explanation:
        "CRC32 detects all bursts shorter than 32 bits but some longer multi-bit patterns can go undetected.",
      hints: ["Think about the polynomial degree."],
      objective: "Understand CRC error detection limits",
    },
  ],
  exam: {
    definition:
      "CRC32 computes a 32-bit checksum by polynomial division over GF(2), used for error detection in protocols like Ethernet and ZIP.",
    steps: [
      "Build 256-entry lookup table from generator polynomial",
      "Init crc=0xFFFFFFFF",
      "For each byte: table lookup and XOR",
      "Final XOR",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) plus 1 KB table",
    correctness:
      "Polynomial division over GF(2) detects all burst errors shorter than the polynomial degree.",
    applications: ["Ethernet frames", "ZIP/PNG file integrity", "HDLC protocols"],
    limitations: ["Not cryptographically secure", "Cannot correct errors, only detect"],
    faq: [
      {
        q: "Why XOR with 0xFFFFFFFF?",
        a: "To ensure leading and trailing zero bytes affect the checksum.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Polynomial division concept and O(n) (2)"],
      },
    ],
  },
  references: [
    {
      citation:
        "W. W. Peterson and D. T. Brown, 'Cyclic Codes for Error Detection,' Proc. IRE, 49(1):228-235, 1961.",
      supports: "Foundational work on CRC theory.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
