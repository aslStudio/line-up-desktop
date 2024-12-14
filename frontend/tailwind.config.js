/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        btn: "8px",
      },
      colors: {
        statusBlue: "#33B6FF",
        statusGreen: "#33FFAA",
        statusGray: "#9F9F9F",
        fontPrimary: {
          dark: "#FFFFFF",
          DEFAULT: "#FFFFFF",
          light: "",
        },
        black: {
          100: "#000000",
        },
        white: {
          100: "#FFFFFF",
        },
        accent: {
          100: "#33FFAA",
          500: "#2A4338",
          900: "#219653",
        },
        gray: {
          300: "#F4F4F4",
          350: "#d4d4d4",
          400: "#888888",
          600: "#292929",
          700: "#1C1C1E",
        },
        /* typography */
        font: {
          dark: "#999999",
          DEFAULT: "#999999",
          light: "",
        },
        /* background */
        backgroundPrimary: {
          dark: "#1E1E1E",
          DEFAULT: "#1E1E1E",
          light: "",
        },
        backgroundSecondary: {
          dark: "#1E1E1E",
          DEFAULT: "#1E1E1E",
          light: "",
        },
      },
    },
  },
  plugins: [],
};
