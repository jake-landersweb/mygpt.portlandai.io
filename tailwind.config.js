/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "container": "#efefef",
        acc1: "#3c63ec",
        main: "#a47de2",
        acc2: "#ca5bd8",
        acc3: "#eb4c4f",
        txt: {
          DEFAULT: '#23262E',
          '50': '#C2C6D1',
          '100': '#B6BCC8',
          '200': '#9FA6B6',
          '300': '#8891A5',
          '400': '#707B93',
          '500': '#5E687C',
          '600': '#4D5465',
          '700': '#3B414E',
          '800': '#23262E',
          '900': '#0B0C0E'
        },
      }
    },
  },
  plugins: [],
}

