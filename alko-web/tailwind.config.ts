import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Una única tipografía para todo el sitio: EB Garamond.
        sans: ["var(--font-eb-garamond)", "Georgia", "serif"],
        display: ["var(--font-eb-garamond)", "Georgia", "serif"],
        serif: ["var(--font-eb-garamond)", "Georgia", "serif"],
        mono: ["var(--font-eb-garamond)", "Georgia", "serif"],
      },
      colors: {
        // Paleta única del sitio: #c98300 · #e1e1df · #545454 · #000 · #ffffff
        stone: {
          50: "#ffffff",
          100: "#e1e1df",
          200: "#e1e1df",
          300: "#e1e1df",
          400: "#545454",
          500: "#545454",
          600: "#545454",
          700: "#000000",
          800: "#000000",
          900: "#000000",
          950: "#000000",
        },
        amber: {
          50: "#e1e1df",
          100: "#e1e1df",
          200: "#e1e1df",
          300: "#e1e1df",
          400: "#c98300",
          500: "#c98300",
          600: "#c98300",
          700: "#c98300",
          800: "#c98300",
          900: "#c98300",
        },
        neutral: {
          900: "#000000",
        },
        brand: {
          gold: "#c98300",
          light: "#e1e1df",
          mid: "#545454",
        },
      },
    },
  },
  plugins: [],
};

export default config;

