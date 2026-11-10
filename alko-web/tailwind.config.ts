import type { Config } from "tailwindcss";

/**
 * Sistema visual ALKO · Dirección V3 (ver Alko-recomendacion/BRIEF_EJECUCION_V3.md).
 *
 * Paleta: marfil #F5F3EE (60 %) · carbón #20211F (25 %) · piedra #D8D2C8 (10 %) ·
 * bronce mate #8B7560 solo para acentos (5 %) · superficie #FBFAF7.
 *
 * Las escalas `stone` y `amber` se mantienen como alias para que todo el sitio
 * (y el panel) herede la nueva paleta sin reescribir cada clase: `stone` pasa a
 * ser una escala cálida de marfil a carbón y `amber` se convierte en el bronce.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Cuerpo: DM Sans · Titulares: Manrope (Light)
        sans: ["var(--font-dm-sans)", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["var(--font-manrope)", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["var(--font-manrope)", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-dm-sans)", "Helvetica Neue", "Arial", "sans-serif"],
        // Tipografía exclusiva para el panel de administración: Poppins
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        paper: "#F5F3EE",
        surface: "#FBFAF7",
        warm: "#EAE5DD",
        piedra: "#D8D2C8",
        line: "#D8D4CC",
        ink: "#20211F",
        mid: "#67645F",
        bronze: {
          DEFAULT: "#8B7560",
          dark: "#75624F",
          light: "#C0A68D",
        },
        stone: {
          50: "#FBFAF7",
          100: "#F5F3EE",
          200: "#EAE5DD",
          300: "#D8D2C8",
          400: "#A39E96",
          500: "#67645F",
          600: "#57544F",
          700: "#3C3B38",
          800: "#2B2C29",
          900: "#20211F",
          950: "#1A1B19",
        },
        amber: {
          50: "#F3EEE8",
          100: "#E9E0D6",
          200: "#D9C9B8",
          300: "#C0A68D",
          400: "#A38B74",
          500: "#8B7560",
          600: "#8B7560",
          700: "#8B7560",
          800: "#75624F",
          900: "#5E4F40",
        },
        neutral: {
          900: "#20211F",
        },
        brand: {
          gold: "#8B7560",
          light: "#D8D2C8",
          mid: "#67645F",
        },
      },
      maxWidth: {
        site: "1600px",
      },
      transitionTimingFunction: {
        alko: "cubic-bezier(.2,.8,.2,1)",
      },
    },
  },
  plugins: [],
};

export default config;
