/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          primary: '#1D9C9C',
          secondary: '#105069',
          background: '#111827',  // '#111827' for dark mode, #ffffff for light mode
        }
      },
    },
    plugins: [],
    safelist: [
      {
        pattern: /(bg|text)-(blue|green|purple|yellow|cyan|rose)-400/,
      }
    ],
  };
  