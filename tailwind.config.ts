import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}', // if using App Router
  ],
  theme: {
    extend: {
      screens: {
        'mid': { min: '1200px', max: '1399px' },
        '3xl': '1800px'
      },
      height: {
        '100lvh': '100lvh',
        '100svh': '100svh',
        '100dvh': '100dvh',
        '160dvh': '160dvh',

      },
      minHeight: {
        '100lvh': '100lvh',
        '100svh': '100svh',
        '100dvh': '100dvh',
      },
    },
  },
  plugins: [],
};

export default config;
