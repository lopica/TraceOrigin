/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customSideBarHover: "rgb(3, 131, 255)",
        customSideBarBg: "rgb(6, 11, 24)",
        color1: "#76BCCE",
        colorBgHomePage: "#FFFFFF",
        color1Dark: "#5DA0B0",
      },
      animation: {
        "scale-fade": "scale-fade 2s infinite",
        pulse: "pulse 2s infinite",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
    },
    keyframes: {
      "scale-fade": {
        "0%, 100%": {
          transform: "scale(1)",
          opacity: "1",
        },
        "50%": {
          transform: "scale(1.1)",
          opacity: "0.5",
        },
      },
      pulse: {
        "0%": { boxShadow: "0 0 0 0 rgba(14, 165, 233, 0.4)" },
        "70%": { boxShadow: "0 0 0 10px rgba(14, 165, 233, 0)" },
        "100%": { boxShadow: "0 0 0 0 rgba(14, 165, 233, 0)" },
      },
    },
  },
  plugins: [daisyui],
  variants: {
    extend: {
      display: ["responsive", "valid", "invalid"],
    },
  },
};
