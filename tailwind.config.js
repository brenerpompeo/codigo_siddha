/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cosmic-primary': '#6D28D9', // Deep Purple
        'cosmic-secondary': '#4C1D95', // Darker Purple
        'cosmic-accent': '#F472B6', // Pink
        'cosmic-dark': '#0F172A', // Slate 900
        'cosmic-card': '#1E293B', // Slate 800
        'cosmic-text': '#E2E8F0', // Slate 200
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
