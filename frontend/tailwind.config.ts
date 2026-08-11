import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080a0f',
        panel: '#10141f',
        line: '#242b3a',
        mint: '#3ddc97',
        amber: '#f4b860',
        coral: '#ff6b6b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(61, 220, 151, 0.16), 0 18px 60px rgba(0,0,0,0.36)',
      },
    },
  },
  plugins: [],
} satisfies Config;
