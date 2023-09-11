import { type Config } from "tailwindcss";


export default {
  content: [
    "./node_modules/flowbite/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
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
