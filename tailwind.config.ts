import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#3b82f6',
        surface: '#f8fafc'
      }
    }
  },
  plugins: []
};

export default config;
