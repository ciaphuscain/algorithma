# ADR-0001: Start as a modular Next.js monolith with trusted in-browser execution

- Status: accepted (2026-10-19)

## Context

The first workflows (learn, visualize, practise) need fast static content and interactive execution of _reviewed_ algorithms. There are no accounts, no shared state and no user code yet. The team is small.

## Decision

One Next.js application. Framework-free core layers (`engine`, `algorithms`, `lib`) with lint-enforced dependency direction; React only in `ui` and `app`. Shipped algorithms run wherever they are needed: browser (interactive), Node (tests, build-time rendering).

## Alternatives

- **Vite SPA + separate API later.** Lighter today, but lessons lose static rendering and a second deployable appears as soon as persistence does.
- **Monolith + execution workers now.** Pays sandbox costs before any user code exists.
- **Services.** No requirement for independent scaling or deployment.

## Consequences

- Single deployable, static pages for lessons, zero infrastructure.
- The execution boundary is an interface (`runAlgorithm`), so a worker implementation can be swapped in for user code.
- Revisit when user code execution, accounts or collaborative editing are scheduled.
