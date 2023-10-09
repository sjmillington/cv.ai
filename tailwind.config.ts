import { type Config } from "tailwindcss";

//box-shadow: 0px 25px 20px -20px rgba(0, 0, 0, 0.45), 25px 0 20px -20px rgba(0, 0, 0, 0.45);
export default {
  content: [
    "./node_modules/flowbite/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        '10xl': '10px 10px 0px'
      }
    },
  },
  daisyui: {
    themes: [
      'light'
    ]
  },
  plugins: [
    require("@tailwindcss/typography"),
    require('daisyui')
  ],
  
} satisfies Config;
