import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f6f5f1",
        card: "#ffffff",
        line: "#e2dfd8",
        primary: {
          DEFAULT: "#3d0000",
          hover: "#540b0b",
          light: "#fce8e8",
          dark: "#1a0000",
        },
        secondary: {
          DEFAULT: "#c5a059",
          hover: "#b28d46",
          light: "#fbf8f1",
          dark: "#876329",
        },
        accent: {
          DEFAULT: "#d97706",
          hover: "#b45309",
          light: "#fef3c7",
        },
        wa: "#1fa855",
        ink: {
          DEFAULT: "#1a0505",
          2: "#2d0a0a",
          muted: "#665454",
        },
        brand: {
          50: "#fdf5f5",
          100: "#fce8e8",
          200: "#f3bcbc",
          300: "#e48585",
          400: "#cc5050",
          500: "#ab2a2a",
          600: "#8b1c1c",
          700: "#6e1313",
          800: "#540b0b",
          900: "#3d0000",
          950: "#1a0000",
        },
      },
      fontFamily: {
        head: ["var(--font-archivo)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "18px",
      },
    },
  },
  plugins: [],
};
export default config;
