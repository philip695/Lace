import type { Config } from 'tailwindcss'

/**
 * Shared Tailwind preset for all lace. apps.
 * Import in each app's tailwind.config.ts:
 *   import { lacePreset } from '@lace/config/tailwind'
 */
export const lacePreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#2563EB',
          s: '#EFF4FF',
        },
        green: {
          DEFAULT: '#16A34A',
          s: '#DCFCE7',
        },
        orange: {
          DEFAULT: '#EA580C',
          s: '#FFF1E8',
        },
        ink: {
          DEFAULT: '#0F1117',
          2: '#6C7284',
          3: '#BCC0CB',
        },
        bg: {
          DEFAULT: '#FFFFFF',
          2: '#F6F7F9',
        },
        line: '#ECEEF1',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        'card-lg': '14px',
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
      },
    },
  },
}
