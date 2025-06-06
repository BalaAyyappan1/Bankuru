import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}', // if using App Router
  ],
  theme: {
    extend: {
      height: {
        '100lvh': '100lvh',
        '100svh': '100svh',
        '100dvh': '100dvh',
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
