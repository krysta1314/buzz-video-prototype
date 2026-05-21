import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        accent: { DEFAULT: '#f97316', soft: '#fff5ec', ink: '#b94c00' },
        secondary: { DEFAULT: '#2563eb', soft: '#eff6ff' },
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
        'card-ultra': '0 4px 20px rgba(37, 99, 235, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
