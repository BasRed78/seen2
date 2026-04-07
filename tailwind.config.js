/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coral: '#ff6b5b',
        'coral-light': '#ff8a7a',
        'coral-dark': '#e85a4f',
        dark: '#0f0f1a',
        'dark-light': '#1a1a2e',
        navy: '#205179',
        cream: '#FAF8F5',
        'cream-light': '#F5F0E8',
        cyan: '#5B8F8F',
        'cyan-light': '#7ab5b5',
      },
    },
  },
  plugins: [],
}
