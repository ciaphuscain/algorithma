# ADR-0004: Lesson content as typed, block-structured modules in the repository

- Status: accepted (2026-10-19)

## Context

Entries need many fields (levels, complexity, implementations, questions, exam notes, references, review status) that will evolve. There is no editorial UI or database yet.

## Decision

Each entry is a TypeScript object of type `AlgorithmEntry`. Free-form material is a list of typed blocks (`p`, `math`, `list`, `table`, `callout`, `code`, `heading`), so new kinds of material do not need schema changes per algorithm. The compiler checks shape; tests check maths (every TeX string renders), code (Python and JavaScript samples execute against their test cases), questions (answer indices valid) and worked examples (numbers match the engine).

## Alternatives

- **Markdown/MDX files:** pleasant to write, but structure (questions, complexity, references) would be implicit and unchecked.
- **Database + CMS now:** needed for community contributions, but premature without accounts or reviewers.

## Consequences

- Content changes go through code review and CI — appropriate while all content is first-party.
- The block schema maps directly to JSON documents if content moves to a database (Phase 5).
