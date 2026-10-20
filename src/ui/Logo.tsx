/** The ALGORITHMA mark: three bars mid-sort, the tallest already in place. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" aria-hidden="true">
      <rect x="1" y="1" width="26" height="26" rx="7" fill="var(--ink)" />
      <rect x="6" y="14" width="4" height="8" rx="1.2" fill="var(--bg)" />
      <rect x="12" y="10" width="4" height="12" rx="1.2" fill="var(--bg)" opacity="0.75" />
      <rect x="18" y="6" width="4" height="16" rx="1.2" fill="var(--tone-sorted)" />
    </svg>
  );
}
