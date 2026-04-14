'use client'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * Search/filter input for clubs and locations.
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search clubs or locations…',
}: SearchBarProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          aria-hidden="true"
          className="text-ink3"
        >
          <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M10 10L13 13"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg2 rounded-card pl-9 pr-4 py-2.5 text-sm text-ink placeholder:text-ink3 outline-none focus:ring-1 focus:ring-blue focus:ring-offset-0"
      />
    </div>
  )
}
