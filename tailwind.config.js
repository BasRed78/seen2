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
        coral: '#C25441',
        'coral-light': '#E07A5F',
        'coral-dark': '#A13D2D',
        dark: '#1a1a2e',
        'dark-light': '#252540',
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
