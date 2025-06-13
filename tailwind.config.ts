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
        'ipad': {
  raw: '(min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait)',
}
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
