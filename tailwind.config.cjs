/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '.dark'], // More explicit version
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}