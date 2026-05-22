import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        accent: { DEFAULT: '#f97316', soft: '#fff5ec', ink: '#b94c00' },
        secondary: { DEFAULT: '#7c3aed', soft: '#f5f3ff', ink: '#5b21b6' },
      },
      fontFamily: {
        sans: [
          '-apple-system', 'SF Pro Text', 'Inter', 'PingFang SC',
          'Helvetica Neue', 'Arial', 'sans-serif',
        ],
      },
      fontVariantNumeric: { tabular: 'tabular-nums' },
      boxShadow: {
        'card-pro': '0 4px 20px rgba(249, 115, 22, 0.08)',
        'card-ultra': '0 4px 24px rgba(124, 58, 237, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config;
