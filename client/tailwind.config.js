/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}" 
  ],
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
  darkMode: "class",
  plugins: [nextui()],
}

