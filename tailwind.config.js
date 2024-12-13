/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        golden:'#FFD700',
        orange:'#FFA500',
        darkorange:'#FF8C00',
        green:'#008000',
        darkgreen:'#006400',
      }
    },
  },
  plugins: [],
}

