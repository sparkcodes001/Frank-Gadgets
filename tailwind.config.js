/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F9F6F0",
          100: "#F0EAE0",
          200: "#E0D6C6",
          300: "#C7B89F",
          400: "#A89878",
          500: "#8A7A5C",
          600: "#6E6048",
          700: "#574C39",
          800: "#443B2C",
          900: "#362E23",
          950: "#1C1710",
        },
        dark: {
          DEFAULT: "#1E1810", // warm espresso — near-black with brown undertone
          100: "#2A2216",
          200: "#362C1E",
          300: "#453824",
          400: "#56462E",
        },
        light: {
          DEFAULT: "#F7F1E7", // warm ivory canvas
          100: "#F1E9DA",
          200: "#E8DCC5",
          300: "#DCCBA8",
        },
        // Frank Gadgets Brand Colors — Champagne Gold / Warm Ivory
        accent: {
          DEFAULT: "#C89B5C", // Champagne Gold
          dim: "#A67D3D", // Deeper bronze (hover/pressed)
          light: "#DDBC85", // Lighter gold
          glow: "#EAD3A3", // Pale gold highlight
        },
        secondary: {
          DEFAULT: "#8DA0B8", // Sierra Blue-Grey (device tone)
          dim: "#6E8299",
          deep: "#566779",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(135deg, #1E1810 0%, #362C1E 100%)",
        "gradient-accent": "linear-gradient(135deg, #C89B5C 0%, #F7F1E7 100%)",
        "gradient-mesh":
          "radial-gradient(at 20% 20%, #C89B5C 0px, transparent 50%), radial-gradient(at 80% 0%, #8DA0B8 0px, transparent 50%), radial-gradient(at 0% 100%, #F1E9DA 0px, transparent 50%)",
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-in",
        slideUp: "slideUp 0.5s ease-out",
        slideDown: "slideDown 0.5s ease-out",
        float: "float 6s ease-in-out infinite",
        kenburns: "kenburns 20s ease-in-out infinite alternate",
        marquee: "marquee 18s linear infinite",
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
