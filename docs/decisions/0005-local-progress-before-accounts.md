# ADR-0005: Keep personal progress in the browser until accounts exist

- Status: accepted (2026-10-20)

## Context

"Continue learning" and practice history are useful immediately; accounts, a database and privacy policy are not yet built.

## Decision

Store recent pages and practice results in `localStorage` under a versioned key, guarded against unavailable storage. Opening a page is recorded separately from answering questions correctly, and only the latter is shown as evidence of understanding.

## Consequences

- No server, no personal data leaves the device.
- Progress does not sync across devices; the UI says it is stored only in this browser.
- When accounts arrive, offer a one-time import of the local record.
