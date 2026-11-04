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
        museum: {
          bg: "#F8F8F6",       // 博物馆米白
          text: "#1A1A1A",     // 深灰文字
          muted: "#888888",    // 辅助文字
          card: "#FFFFFF",     // 卡片白
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      boxShadow: {
        'museum': '0 10px 30px -5px rgba(0, 0, 0, 0.05)', // 极柔和的投影
      }
    },
  },
  plugins: [],
};
export default config;
