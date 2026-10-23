/**
 * Build-time feature flags (NEXT_PUBLIC_* values are inlined when the app is built).
 *
 * The code runner executes the visitor's own JavaScript in a browser sandbox
 * (ADR-0007). It is off by default: the project rule is that user-code execution is
 * not enabled publicly until the isolation boundary has been independently reviewed.
 * Build with NEXT_PUBLIC_ENABLE_CODE_RUNNER=1 to turn it on (the e2e suite does).
 */
export const CODE_RUNNER_ENABLED = process.env.NEXT_PUBLIC_ENABLE_CODE_RUNNER === "1";
