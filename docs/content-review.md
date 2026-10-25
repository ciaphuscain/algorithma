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

## Recording an expert review

Reviews are recorded in the entry itself, so the record travels with the content and its history is in version control.

1. The reviewer reads all five levels, the exam notes and the practice explanations, checks each reference against the claim it is cited for, and runs the visualizer on the presets.
2. Corrections are made first, and the tests re-run (`npm run check`).
3. Run `npm run content:hash -- <slug>` to print the entry's content hash: a hash of everything the reviewer checked (all of the entry except its review metadata, version and date).
4. Add a record to `review.records`, set `review.status` to `"reviewed"` and update `review.note`:

   ```ts
   review: {
     status: "reviewed",
     note: "…",
     records: [
       {
         reviewer: "Full name, as they wish to be credited",
         affiliation: "optional",
         date: "YYYY-MM-DD",
         scope: "all five levels, exam notes, practice and references",
         contentHash: "<from step 3>",
       },
     ],
   }
   ```

5. The entry page then shows **Expert reviewed** and names the reviewer and date in its provenance section.

If the content changes after a review, its hash no longer matches the last record. The entry keeps its history but the badge changes to **Changed since expert review**, and the provenance section says so, until a reviewer checks the changes and adds a new record. `npm run content:hash` lists every entry's state (`reviewed`, `stale` or `unreviewed`).

The tests check that records are well formed and that every `reviewed` entry has one. No review records exist yet: no entry has been reviewed, and none will be marked reviewed without a real reviewer.
