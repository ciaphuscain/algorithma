import type { NextConfig } from "next";

/**
 * Content-Security-Policy (see docs/decisions/0006-content-security-policy.md).
 *
 * - script-src allows 'unsafe-inline' because statically generated pages cannot carry
 *   per-request nonces and Next.js bootstraps with inline scripts. No external script
 *   origin and no 'unsafe-eval' are allowed.
 * - worker-src blob: lets the code sandbox start its worker from a blob URL inside an
 *   opaque-origin iframe; frame-src 'self' covers that srcdoc frame.
 * - Development needs eval for React Refresh, so the policy is production-only.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    const headers =
      process.env.NODE_ENV === "production"
        ? [...securityHeaders, { key: "Content-Security-Policy", value: csp }]
        : securityHeaders;
    return [{ source: "/:path*", headers }];
  },
};

export default nextConfig;
