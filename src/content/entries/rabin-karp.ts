import type { AlgorithmEntry } from "../types";

export const rabinKarpEntry: AlgorithmEntry = {
  slug: "rabin-karp",
  name: "Rabin–Karp (Rolling Hash)",
  aliases: ["Rabin-Karp", "Rolling hash", "Polynomial hash", "Karp–Rabin"],
  curriculum: [303, 81, 82],
  domain: "strings",
  subcategory: "Pattern matching",
  difficulty: "intermediate",
  summary:
    "Finds a pattern by comparing hashes: the hash of each text window is updated in constant time as the window slides (a rolling polynomial hash), and characters are compared only when the hashes agree.",
  tags: ["string matching", "hashing", "rolling hash", "polynomial hash", "randomized"],
  prerequisites: ["Hash Table (Separate Chaining)", "Modular arithmetic"],
  related: ["kmp", "aho-corasick", "hash-chaining"],
  problem: {
    input:
      "A text $T$ of length $n$, a pattern $P$ of length $m$, a base $d$ and a prime modulus $q$.",
    output: "Every shift $s$ with $T[s..s+m-1] = P$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Comparing the pattern with every window of the text character by character costs up to $m$ comparisons per window. Instead, summarise each window by a number, its hash, and compare numbers. Only when the numbers agree do we check the characters, because different strings can share a hash.",
      },
      {
        kind: "p",
        text: "The trick is computing every window's hash cheaply. Treat a window as a number written in base $d$: sliding the window one place removes the leading digit and appends a new one, which is one subtraction, one multiplication and one addition, whatever the window's length.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "The polynomial hash of a string $c_0 c_1 \\dots c_{m-1}$ is $(c_0 d^{m-1} + c_1 d^{m-2} + \\dots + c_{m-1}) \\bmod q$, computed by Horner's rule.",
          "Compute $p = \\text{hash}(P)$, $t_0 = \\text{hash}(T[0..m-1])$ and $h = d^{m-1} \\bmod q$.",
          "For each shift $s$: if $t_s = p$, compare the characters; equal means a match, unequal a **spurious hit**.",
          "Roll: $t_{s+1} = (d\\,(t_s - T[s]\\,h) + T[s+m]) \\bmod q$.",
        ],
      },
      {
        kind: "heading",
        text: "Worked example (CLRS): T = 2359023141526739921, P = 31415, d = 10, q = 13",
      },
      {
        kind: "p",
        text: "$p = 31415 \\bmod 13 = 7$. The window hashes, shift by shift, are 8, 9, 3, 11, 0, 1, **7**, 8, 4, 5, 10, 11, **7**, 9, 11. Two windows hash to 7. At shift 6 the characters are 31415: a match. At shift 12 the window is 67399, also $\\equiv 7 \\pmod{13}$: a spurious hit, rejected after one character comparison. In all, 6 character comparisons and 14 rolls.",
      },
      {
        kind: "p",
        text: "With a tiny modulus (second preset, $q = 3$), the hash of a decimal window is just its value modulo 3. Searching for 30 in 1203691215, seven of the nine windows (12, 03, 36, 69, 12, 21, 15) are multiples of 3 like 30, so there are seven spurious hits and no match.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Use a large modulus.** With $q$ around $10^9$ (or a 61-bit Mersenne prime), spurious hits are rare. Products then exceed 32 bits: use 64-bit or big-integer arithmetic.",
          "**Keep values non-negative:** `(t - T[s]*h) mod q` can be negative in most languages; add $q$ before taking the remainder.",
          "**Choose the base or modulus at random** when inputs may be adversarial; a fixed, known hash can be attacked with strings designed to collide.",
          "**Many patterns of one length:** put their hashes in a set and test each window's hash against all of them at once.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "The rolling update" },
      {
        kind: "p",
        text: "Write the window as $t_s = \\sum_{j=0}^{m-1} T[s+j]\\, d^{m-1-j} \\pmod q$. Removing the leading term $T[s]\\, d^{m-1}$, multiplying by $d$ and adding $T[s+m]$ gives exactly $t_{s+1}$. All of this is valid modulo $q$, so $t_{s+1} = (d(t_s - T[s]h) + T[s+m]) \\bmod q$.",
      },
      { kind: "heading", text: "Running time" },
      {
        kind: "p",
        text: "Preprocessing is $\\Theta(m)$ and rolling is $\\Theta(n - m + 1)$. Each hash hit costs up to $m$ comparisons, so the total is $O(n + m \\cdot (\\text{matches} + \\text{spurious hits}))$; the property tests check this bound on random inputs. The worst case is $\\Theta(nm)$, for example when the text and pattern are all one letter. If $q$ is a random prime from a large range, a given non-matching window collides with probability about $1/q$, so the expected time is $O(n + m)$ plus $m$ per real match.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Plagiarism and duplicate detection:** rolling hashes of every $k$-character window (shingles, fingerprints) let documents be compared quickly.",
          "**Content-defined chunking** in backup and synchronisation tools cuts files where a rolling hash takes a special value, so an insertion shifts only nearby chunk boundaries.",
          "**Two-dimensional patterns** can be matched by hashing rows, then hashing the column of row hashes.",
          "**Double hashing** (two independent moduli) makes spurious hits vanishingly rare for competitive-programming string problems.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(n + m)", average: "\\Theta(n + m)", worst: "\\Theta(nm)" },
    space: "\\Theta(1)",
    worstClass: "other",
    note: "Average with a large random prime modulus; the worst case needs many hash hits.",
  },
  properties: [
    { label: "Character comparisons", value: "Only in windows whose hash equals the pattern's" },
    { label: "Window update", value: "$O(1)$ per shift" },
  ],
  implementations: [
    {
      language: "python",
      entry: "rabin_karp",
      code: `def rabin_karp(text, pat, d=256, q=1_000_000_007):
    """Return the start of every occurrence of pat in text."""
    n, m = len(text), len(pat)
    if m > n:
        return []
    h = pow(d, m - 1, q)
    p = t = 0
    for i in range(m):
        p = (p * d + ord(pat[i])) % q
        t = (t * d + ord(text[i])) % q
    found = []
    for s in range(n - m + 1):
        if p == t and text[s:s + m] == pat:
            found.append(s)
        if s < n - m:
            t = (d * (t - ord(text[s]) * h) + ord(text[s + m])) % q
    return found
`,
      tests: [
        { args: ["abracadabra", "abra"], expected: [0, 7] },
        { args: ["aaaa", "aa"], expected: [0, 1, 2] },
        { args: ["abc", "abcd"], expected: [] },
      ],
    },
    {
      language: "javascript",
      entry: "windowHashes",
      code: `// The hash of every length-m window of a digit string, base 10 mod q, by rolling.
function windowHashes(text, m, q) {
  const v = (i) => text.charCodeAt(i) - 48;
  let h = 1;
  for (let i = 1; i < m; i++) h = (h * 10) % q;
  let t = 0;
  for (let i = 0; i < m; i++) t = (t * 10 + v(i)) % q;
  const out = [t];
  for (let s = 0; s + m < text.length; s++) {
    t = (((t - ((v(s) * h) % q) + q) % q) * 10 + v(s + m)) % q;
    out.push(t);
  }
  return out;
}
`,
      tests: [
        {
          args: ["2359023141526739921", 5, 13],
          expected: [8, 9, 3, 11, 0, 1, 7, 8, 4, 5, 10, 11, 7, 9, 11],
        },
        { args: ["1203691215", 2, 3], expected: [0, 2, 0, 0, 0, 1, 0, 0, 0] },
      ],
    },
  ],
  visualizer: "rabin-karp",
  practice: [
    {
      id: "rk-hash",
      kind: "numeric",
      prompt: "With $d = 10$ and $q = 13$, what is the hash of the window 67399?",
      answer: 7,
      explanation:
        "$67399 = 5184 \\cdot 13 + 7$. It equals the hash of 31415, so it is a spurious hit.",
      hints: ["The base-10 polynomial hash of a digit string is its value modulo $q$."],
      objective: "Compute a polynomial hash",
    },
    {
      id: "rk-roll",
      kind: "numeric",
      prompt:
        "With $d = 10$, $q = 13$ and $m = 5$, the window 31415 has hash 7. What is the hash of the next window, 14152? (Use $h = 10^4 \\bmod 13 = 3$.)",
      answer: 8,
      explanation:
        "$(10 \\cdot (7 - 3 \\cdot 3) + 2) \\bmod 13 = (10 \\cdot (-2) + 2) \\bmod 13 = -18 \\bmod 13 = 8$. Check: $14152 = 1088 \\cdot 13 + 8$.",
      hints: [
        "Remove the leading digit's term $T[s] \\cdot h$, multiply by $d$, add the new digit.",
        "Reduce a negative intermediate result by adding multiples of 13.",
      ],
      objective: "Apply the rolling update",
    },
    {
      id: "rk-worst",
      kind: "mcq",
      prompt:
        "Which input makes Rabin–Karp take $\\Theta(nm)$ time even with a perfect hash function?",
      options: [
        "Text aaaa…a and pattern aa…a: every window matches",
        "A text with no occurrence of the pattern",
        "A pattern longer than the text",
        "A text made of random letters",
      ],
      answer: 0,
      explanation:
        "Every window is a real match, so every window needs $m$ character comparisons to confirm it.",
      distractors: {
        1: "With few hash hits, that case runs in $O(n + m)$.",
        2: "Then there is no window to check at all.",
        3: "Random text produces few hash hits.",
      },
      hints: ["Character comparisons happen only on hash hits. When are all windows hits?"],
      objective: "Identify the worst case",
    },
  ],
  exam: {
    definition:
      "Rabin–Karp is a string-matching algorithm that compares a hash of the pattern with a rolling hash of each text window, verifying characters only when the hashes are equal.",
    steps: [
      "Compute $h = d^{m-1} \\bmod q$, $p = \\text{hash}(P)$, $t_0 = \\text{hash}(T[0..m-1])$.",
      "For $s = 0..n-m$: if $p = t_s$ and $P = T[s..s+m-1]$, report $s$.",
      "Roll: $t_{s+1} = (d(t_s - T[s]h) + T[s+m]) \\bmod q$.",
    ],
    timeComplexity:
      "$\\Theta(n + m)$ expected with a large random prime; $\\Theta(nm)$ worst case.",
    spaceComplexity: "$\\Theta(1)$ beyond the input.",
    correctness:
      "Equal strings have equal hashes, so no match is missed; every hash hit is verified, so no false match is reported.",
    applications: [
      "Searching for many patterns of the same length",
      "Plagiarism detection and document fingerprinting",
      "Content-defined chunking for deduplication",
    ],
    limitations: [
      "Worst case $\\Theta(nm)$",
      "Spurious hits with a small or adversarially known modulus",
    ],
    faq: [
      {
        q: "Why must every hash hit be verified?",
        a: "Different strings can have the same hash modulo $q$ (spurious hits).",
      },
      {
        q: "Rabin–Karp or KMP?",
        a: "KMP guarantees $O(n + m)$; Rabin–Karp is simpler to extend to many patterns and to two dimensions.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Compare the pattern's hash with a rolling hash of each window; verify on equality.",
          "Expected $O(n + m)$, worst $O(nm)$.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Polynomial hash and the rolling formula (2).",
          "Algorithm with verification of hash hits (1).",
          "Short example with a spurious hit (1).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Idea and the polynomial hash — 2.",
          "Derivation of the rolling update — 2.",
          "Full worked example: window hashes, the match and the spurious hit — 3.",
          "Correctness and complexity, effect of $q$ — 2.",
          "Applications and comparison with KMP — 1.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "R. M. Karp, M. O. Rabin, “Efficient randomized pattern-matching algorithms”, IBM Journal of Research and Development 31(2), 1987.",
      supports: "The algorithm and its randomized analysis.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §32.2.",
      supports:
        "The rolling update, the worked example with $q = 13$, and the running-time analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
