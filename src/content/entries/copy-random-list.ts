import type { AlgorithmEntry } from "../types";

export const copyRandomListEntry: AlgorithmEntry = {
  slug: "copy-random-list",
  name: "Copy a List with Random Pointers",
  aliases: ["Clone linked list with random pointer", "Deep copy with random pointers"],
  curriculum: [110],
  domain: "linear-structures",
  subcategory: "Linked lists",
  difficulty: "advanced",
  summary:
    "Deep-copies a linked list whose nodes also point to arbitrary nodes, in constant extra space: weave each copy in right after its original, use the weaving to set the copies' random pointers, then unweave the two lists.",
  tags: ["linked list", "deep copy", "pointers", "constant space"],
  prerequisites: ["Reverse a Linked List (and in Groups of k)"],
  related: ["reverse-linked-list", "hash-chaining"],
  problem: {
    input:
      "A singly linked list in which every node also has a `random` pointer to any node or null.",
    output:
      "A copy made of new nodes, with the same values, next order and random structure, and the original unchanged.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Copying the values and next pointers is easy. The random pointers are the problem: a copy's random must point to the *copy* of its original's random target, and while walking the list we have no way to find that copy.",
      },
      {
        kind: "p",
        text: "The simple fix is a hash map from each original node to its copy. The clever fix uses the list itself as the map: put each copy right after its original. Then the copy of any node $x$ is simply `x.next`.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Weave:** for each original $x$, create its copy $c$ with $c.next = x.next$ and set $x.next = c$. The list now alternates original, copy, original, copy.",
          "**Random pointers:** for each original $x$, set `x.next.random = x.random.next` (or null). `x.random.next` is the copy of $x$'s random target.",
          "**Unweave:** for each original $x$ with copy $c$, set $x.next = c.next$ and $c.next = c.next.next$ (or null). Both lists are restored to separate chains.",
        ],
      },
      { kind: "heading", text: "Worked example: 7 → 13 → 11 → 10 → 1" },
      {
        kind: "p",
        text: "The random pointers go to positions −, 0, 4, 2, 0 (13's random is 7, 11's is 1, 10's is 11, 1's is 7). After the three passes the copy reads 7 → 13 → 11 → 10 → 1 with random pointers −, 0, 4, 2, 0 by position in the copy, its nodes are all new, and the original list is as it was. Five copies are created and no other node or table.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Hash-map version:** first map every original to a new copy, then set each copy's next and random through the map. Simpler and safe if the list must not be touched even temporarily, at $O(n)$ extra space.",
          "**Restore the original:** the unweaving pass must reset every original's next, or the caller's list stays woven.",
          "**Null randoms:** guard `x.random.next` when `x.random` is null.",
          "**Not thread-safe:** the original list is temporarily modified, so other readers must not walk it during the copy.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Invariant after weaving:** for every original node $x$, `x.next` is the copy of $x$. So for any original $y = x.\\text{random}$, `y.next` is the copy of $y$, which is exactly what the copy of $x$ must point to. Each pass visits every node once, so the time is $\\Theta(n)$; apart from the $n$ copies the method uses $O(1)$ extra space.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Graph cloning** generalises the problem: copy an arbitrary pointer graph with a map from originals to copies, filled by BFS or DFS.",
          "**Serialisation:** writing random pointers as positions (as the input here does) is how such structures are stored or sent; reading them back is the same mapping problem.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(n)", average: "\\Theta(n)", worst: "\\Theta(n)" },
    space: "O(1)",
    worstClass: "n",
    note: "Extra space besides the $n$ new nodes; the hash-map version uses $\\Theta(n)$.",
  },
  properties: [
    { label: "Extra space", value: "$O(1)$ besides the copies" },
    { label: "Original list", value: "Temporarily woven, then restored" },
  ],
  implementations: [
    {
      language: "python",
      entry: "copy_random",
      code: `class Node:
    def __init__(self, value):
        self.value, self.next, self.random = value, None, None


def copy_random(values, random):
    """Build the list, copy it with the weaving method, return the copy's
    values and random positions, and whether the original is unchanged."""
    nodes = [Node(v) for v in values]
    for a, b in zip(nodes, nodes[1:]):
        a.next = b
    for node, r in zip(nodes, random):
        node.random = None if r is None else nodes[r]
    head = nodes[0] if nodes else None
    x = head
    while x:                       # weave
        c = Node(x.value)
        c.next, x.next = x.next, c
        x = c.next
    x = head
    while x:                       # random pointers
        x.next.random = x.random.next if x.random else None
        x = x.next.next
    copy_head = head.next if head else None
    x = head
    while x:                       # unweave
        c = x.next
        x.next = c.next
        c.next = c.next.next if c.next else None
        x = x.next
    copies, c = [], copy_head
    while c:
        copies.append(c)
        c = c.next
    pos = {id(c): i for i, c in enumerate(copies)}
    rand = [None if c.random is None else pos[id(c.random)] for c in copies]
    unchanged = [n.value for n in nodes] == values and all(
        nodes[i].next is (nodes[i + 1] if i + 1 < len(nodes) else None) for i in range(len(nodes))
    )
    return [[c.value for c in copies], rand, unchanged]
`,
      tests: [
        {
          args: [
            [7, 13, 11, 10, 1],
            [null, 0, 4, 2, 0],
          ],
          expected: [[7, 13, 11, 10, 1], [null, 0, 4, 2, 0], true],
        },
        {
          args: [
            [1, 2],
            [1, 1],
          ],
          expected: [[1, 2], [1, 1], true],
        },
      ],
    },
    {
      language: "javascript",
      entry: "copyWithMap",
      code: `// The hash-map version: values and random positions in, the same out (via new nodes).
function copyWithMap(values, random) {
  const nodes = values.map((value) => ({ value, next: null, random: null }));
  nodes.forEach((n, i) => {
    n.next = nodes[i + 1] ?? null;
    n.random = random[i] === null ? null : nodes[random[i]];
  });
  const copy = new Map(nodes.map((n) => [n, { value: n.value, next: null, random: null }]));
  for (const n of nodes) {
    copy.get(n).next = n.next && copy.get(n.next);
    copy.get(n).random = n.random && copy.get(n.random);
  }
  const copies = nodes.map((n) => copy.get(n));
  return copies.map((c) => (c.random === null ? null : copies.indexOf(c.random)));
}
`,
      tests: [
        {
          args: [
            [7, 13, 11, 10, 1],
            [null, 0, 4, 2, 0],
          ],
          expected: [null, 0, 4, 2, 0],
        },
      ],
    },
  ],
  visualizer: "copy-random-list",
  practice: [
    {
      id: "crl-key",
      kind: "mcq",
      prompt: "After the weaving pass, how do you find the copy of an original node y?",
      options: ["y.next", "y.random", "y.next.next", "Look it up in a hash map"],
      answer: 0,
      explanation: "Each copy was inserted directly after its original.",
      distractors: {
        1: "random points to an arbitrary original.",
        2: "That is the next original node.",
        3: "The weaving method exists precisely to avoid the map.",
      },
      hints: ["Where was each copy inserted?"],
      objective: "Use the weaving invariant",
    },
    {
      id: "crl-random",
      kind: "mcq",
      prompt: "Which assignment sets the random pointer of x's copy in the second pass?",
      options: [
        "x.next.random ← x.random.next",
        "x.next.random ← x.random",
        "x.random ← x.next",
        "x.next.random ← x.next.next",
      ],
      answer: 0,
      explanation: "x.next is x's copy, and x.random.next is the copy of x's random target.",
      distractors: {
        1: "That points the copy at an original node, not at a copy.",
        2: "That would corrupt the original's random pointer.",
        3: "That is the copy's successor in the woven list, unrelated to random.",
      },
      hints: ["Both ends of the new pointer must be copies."],
      objective: "Set copied random pointers",
    },
    {
      id: "crl-space",
      kind: "numeric",
      prompt: "Copying a list of 5 nodes with the weaving method, how many new nodes are created?",
      answer: 5,
      explanation: "One copy per node and nothing else: the weaving takes the place of a map.",
      hints: ["What extra structure does the method avoid?"],
      objective: "Account for space",
    },
  ],
  exam: {
    definition:
      "Copying a list with random pointers creates new nodes with the same values whose next and random pointers mirror the original's, pointing to the corresponding new nodes.",
    steps: [
      "Weave a copy after each original.",
      "Set copy.random = original.random.next for each original.",
      "Unweave, restoring both next chains.",
    ],
    timeComplexity: "$\\Theta(n)$.",
    spaceComplexity: "$O(1)$ beyond the copies ($\\Theta(n)$ with a hash map).",
    correctness:
      "After weaving, original.next is its copy, so original.random.next is the copy of the random target.",
    applications: ["Deep copies of pointer structures", "Cloning graphs and object graphs"],
    limitations: ["Temporarily modifies the original list"],
    faq: [
      {
        q: "Why not copy random pointers directly?",
        a: "They would point into the original list instead of the copy.",
      },
      {
        q: "Which version should I use in production?",
        a: "Usually the hash map: clearer and leaves the input untouched.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Weave copies after originals; copy.random = orig.random.next; unweave.",
          "$\\Theta(n)$ time, $O(1)$ extra space.",
        ],
      },
      {
        marks: 5,
        outline: ["The three passes (3).", "Small example (1).", "Hash-map alternative (1)."],
      },
      {
        marks: 10,
        outline: [
          "Why random pointers make copying hard — 1.",
          "Hash-map method — 2.",
          "Weaving method, three passes — 3.",
          "Trace on an example — 2.",
          "Correctness and complexity — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §10.2–10.3.",
      supports: "Linked lists and their pointer representation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review. The weaving technique is widely taught; no original source is cited because none was verified.",
  },
  version: 1,
  updated: "2026-10-25",
};
