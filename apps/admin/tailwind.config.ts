import type { Config } from 'tailwindcss'
import { lacePreset } from '@lace/config/tailwind'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [lacePreset as Config],
}

export default config
