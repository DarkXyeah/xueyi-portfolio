/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0C0C0C',
        mist: '#D7E2EA',
        bone: '#EDE9E2',
        ember: '#FF4D1C',
      },
      fontFamily: {
        display: ['Kanit', 'sans-serif'],
        sans: ['"Inter Tight"', 'Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        shell: '1700px',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' },
        },
      },
      animation: {
        drift: 'drift 60s linear infinite',
      },
    },
  },
  plugins: [],
}
