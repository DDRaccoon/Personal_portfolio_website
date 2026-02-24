/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 集成Design Tokens到Tailwind
      colors: {
        // 背景色
        bg: {
          0: 'var(--bg-0)',
          1: 'var(--bg-1)',
        },
        // 文本色
        text: {
          strong: 'var(--text-strong)',
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
        },
        // 边框色
        border: {
          DEFAULT: 'var(--border)',
        },
        // 强调色
        accent: {
          orange: 'var(--accent-orange)',
        },
      },
      // 间距系统 (8px system)
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
      },
      // 圆角
      borderRadius: {
        card: 'var(--radius-card)',
        button: 'var(--radius-button)',
        large: 'var(--radius-large)',
      },
      // 动画曲线
      transitionTimingFunction: {
        'ease-out-token': 'var(--ease-out)',
      },
      // 动画时长
      transitionDuration: {
        hover: 'var(--duration-hover)',
        panel: 'var(--duration-panel)',
      },
      // 字体
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // 行高
      lineHeight: {
        tight: 'var(--line-height-tight)',
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
      },
      // 字重
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
      },
    },
  },
  plugins: [],
}