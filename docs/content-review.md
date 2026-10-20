# Content quality and review states

Every entry declares `review.status`:

| status         | meaning                                                         | badge                    |
| -------------- | --------------------------------------------------------------- | ------------------------ |
| `reviewed`     | A subject-matter reviewer checked the prose, maths and examples | Expert reviewed          |
| `draft`        | First-party content not yet reviewed by an expert               | Draft · unreviewed prose |
| `community`    | Contributed by a community member, not officially reviewed      | Community contributed    |
| `experimental` | Research content whose claims are not established               | Experimental             |

All current entries are `draft`: they were written with AI assistance. What _is_ verified automatically for every entry:

- every TeX string renders (KaTeX, `throwOnError`),
- every Python and JavaScript sample runs against its listed cases,
- every practice answer index is valid and the stated answer grades as correct,
- worked-example numbers that the engine can reproduce are cross-checked (`tests/unit/content.test.ts`),
- the linked visualizer passes the conformance suite.

What is **not** verified: prose accuracy, proof completeness, and whether references support the exact claims. References are limited to well-known sources and each says what it is cited for. Exam answer outlines are generic and say so; no institutional marking scheme is implied.

To promote an entry to `reviewed`, a reviewer reads all five levels, the exam notes and the practice explanations, checks each reference, and records their name and date in the entry's `review.note`.
