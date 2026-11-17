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
        accent: {
          DEFAULT: "#e8542b",
          hover: "#d0451e",
          light: "#ffedd5",
        },
        wa: "#1fa855",
        ink: {
          DEFAULT: "#0b1426",
          2: "#1a2336",
          muted: "#5c6373",
        },
        brand: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#1e3a5f",
          900: "#0b1426",
          950: "#060b15",
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
