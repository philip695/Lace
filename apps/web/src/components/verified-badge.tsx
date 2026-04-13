/**
 * Blue circle with white checkmark — shown on verified clubs.
 * Per design system: blue checkmark badge.
 */
export function VerifiedBadge() {
  return (
    <span
      title="Verified club"
      aria-label="Verified club"
      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue flex-shrink-0"
    >
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
        <path
          d="M2 4.5L3.5 6L7 3"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
