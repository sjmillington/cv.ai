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
      'pastel'
    ]
  },
  plugins: [
    require('daisyui')
  ],
  
} satisfies Config;
