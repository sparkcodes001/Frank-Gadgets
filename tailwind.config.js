/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f5f5",
          100: "#e8e8e8",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
          950: "#1a1a1a",
        },
        dark: {
          DEFAULT: "#080808",
          100: "#0f0f0f",
          200: "#141414",
          300: "#1a1a1a",
          400: "#222222",
        },
        light: {
          DEFAULT: "#f0f0f0",
          100: "#e8e8e8",
          200: "#d9d9d9",
        },
        // ✅ accent now green, with shade variants so hover:bg-accent-dim works
        accent: {
          DEFAULT: "#00ff88",
          dim: "#00cc6a",
          muted: "#00994f",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(135deg, #080808 0%, #141414 100%)",
        "gradient-light": "linear-gradient(135deg, #f0f0f0 0%, #d1d1d1 100%)",
      },
    },
  },
  plugins: [],
};
