import type { Config } from 'tailwindcss'
import { lacePreset } from '@lace/config/tailwind'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [lacePreset as Config],
  theme: {
    extend: {
      colors: {
        // Web app design tokens (override shared preset)
        bg: {
          DEFAULT: '#F5F2EE',  // warm beige page background
          2: '#FFFFFF',        // white card / input backgrounds
        },
        ink: {
          DEFAULT: '#1A1A1A',
          2: '#6B6B6B',
          3: '#B0ADA9',
        },
        line: '#E8E4DF',
        accent: '#E8533A',   // coral — primary action / active state
        header: '#1A1A1A',   // dark header background
        // Semantic AM / PM badge colors
        am: {
          bg: '#EFF6FF',
          fg: '#1D4ED8',
        },
        pm: {
          bg: '#FFF0ED',
          fg: '#E8533A',
        },
      },
    },
  },
}

export default config
