/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      colors: {
        void: '#020203',
        surface: '#0a0a0c',
        primary: '#8b5cf6',
        pillar: {
          physical: '#10b981',
          mental: '#0ea5e9',
          intellectual: '#6366f1',
          spiritual: '#8b5cf6',
          cultural: '#ec4899',
          professional: '#f59e0b',
          personal: '#ef4444',
        }
      }
    }
  },
  plugins: []
}
