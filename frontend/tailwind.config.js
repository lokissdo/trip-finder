/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
    fontFamily: {
      customTitle: ['"Volkhov"', "serif"],
      customDetail: ['"Mulish"', "sans-serif"],
    },
  },
  plugins: [require("flowbite/plugin")],
};
