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
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(257deg, rgba(2, 0, 36, 1) 0%, rgba(49, 49, 167, 1) 70%, rgba(0, 212, 255, 1) 100%)",
      },
      colors: {
        gold: "#d3a625",
        maroon: "#740001",
        "dark-blue": "#1a237e",
        beige: "#f5f5dc",
      },
      fontFamily: {
        medieval: ['"MedievalSharp"', "cursive"],
        cinzel: ['"Cinzel Decorative"', "serif"],
      },
      borderWidth: {
        3: "3px",
      },
      boxShadow: {
        custom: "5px 5px 15px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  safelist: [
    "bg-indigo-800",
    "text-white",
    "bg-yellow-400",
    "bg-yellow-500",
    "bg-green-600",
    "bg-gray-600",
    "bg-emerald-900",
    "text-gray-200",
    "bg-lime-400",
    "bg-lime-500",
    "bg-teal-600",
    "bg-gray-700",
    "bg-amber-800",
    "bg-red-600",
    "bg-red-700",
    "bg-orange-500",
    "bg-stone-600",
    "text-black",
    "animate-pulse", // If you use it for active state
  ],
  plugins: [],
};
