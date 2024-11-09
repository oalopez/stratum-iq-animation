/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {},
    },
    plugins: [],
    safelist: [
      {
        pattern: /(bg|text)-(blue|green|purple|yellow|cyan|rose)-400/,
      }
    ],
  };
  