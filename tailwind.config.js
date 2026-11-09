/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html", "./**/*.js", "!./node_modules/**", "!./bin/**"],
  safelist: [
    'ignition-play',
    'is-visible'
  ],
  theme: {
    extend: {
      colors: {
        void:   '#0a0a0b',
        panel:  '#131315',
        panel2: '#1b1b1e',
        amber:  '#ff7a1a',
        amberd: '#c2410c',
        silver: '#c9cdd3',
        bone:   '#f4f2ee',
        fog:    '#94949c',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    }
  }
}
