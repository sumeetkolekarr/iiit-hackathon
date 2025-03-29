/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: "#1E1E2E",
        lightGray: "#888",
        primary: "#58CC02",
      },
    },
  },
  plugins: [],
};
