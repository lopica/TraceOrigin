/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customSideBarHover: 'rgb(3, 131, 255)',
        customSideBarBg: 'rgb(6, 11, 24)',
        color1: '#76BCCE',
        colorBgHomePage: '#FFFFFF',
        color1Dark: '#5DA0B0',

      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [ 
    daisyui,
  ],
  variants: {
    extend: {
      display: ['responsive', 'valid', 'invalid'],
    },
  },
}

