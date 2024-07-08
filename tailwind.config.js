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

