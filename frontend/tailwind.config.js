/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: "#4970E4",
        customBlack: "#000000",
      },
      fontFamily: {
        instrument: ["Instrument Sans", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        istok: ["Istok Web", "sans-serif"],
      },
      boxShadow: {
        customshadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
