# ADR-0006: A production Content-Security-Policy without nonces

- Status: accepted (2026-10-21)

## Context

XSS is the main web risk for a content site. React escapes text, and the only raw HTML is KaTeX output for repository TeX, but defence in depth calls for a CSP. Most pages are statically generated (SSG); Next.js bootstraps hydration with inline scripts.

## Decision

Send this policy on every production response:

`default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`

## Alternatives

- **Per-request nonces** (middleware/proxy). The strongest script policy, but forces every page to render dynamically and loses static generation and CDN caching. Worth revisiting once there are accounts and server-rendered personal pages anyway.
- **Hashes of inline scripts.** Next.js inline payloads differ per page and per build; maintaining hashes is fragile.
- **No CSP.** Leaves plugins, framing, base-tag hijacking and exfiltration to third-party origins unrestricted.

## Consequences

- Blocks external scripts, `eval`, plugins, framing by other sites, `<base>` hijacking, form posts and network requests to other origins.
- Does **not** block an injected inline script; React's escaping and the absence of user-controlled HTML remain the primary XSS defence.
- `worker-src blob:` and `frame-src 'self'` exist for the code sandbox ([ADR-0007](0007-browser-code-sandbox.md)); its iframe adds its own, stricter policy on top.
- Development omits the CSP because React Refresh needs `eval`.
- An e2e test fails if any page triggers a CSP violation.
