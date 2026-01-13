import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // New warm palette
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c', // Warm dark gray text
          800: '#292524',
          900: '#1c1917',
        },
        primary: {
          DEFAULT: '#8D7F71', // Warm Taupe
          hover: '#7A6E62',
          light: '#A69B8F',
        },
        secondary: {
          DEFAULT: '#D4A373', // Soft Terracotta
          hover: '#C39262',
        },
        cream: '#FAFAF9',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-lato)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

