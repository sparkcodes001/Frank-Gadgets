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
        // Frank Gadgets Brand Colors
        accent: {
          DEFAULT: "#E63946", // Red (from logo)
          dim: "#c1121f", // Darker Red
          muted: "#9d0208", // Deep Red
        },
        secondary: {
          DEFAULT: "#1D3557", // Blue (from logo)
          dim: "#457b9d", // Lighter Blue
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(135deg, #080808 0%, #141414 100%)",
        "gradient-red": "linear-gradient(135deg, #E63946 0%, #1D3557 100%)",
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-in",
        slideUp: "slideUp 0.5s ease-out",
        slideDown: "slideDown 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
