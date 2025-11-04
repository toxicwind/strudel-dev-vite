import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './apps/dev/index.html',
    './apps/dev/src/**/*.{ts,tsx,js,jsx,mdx,html}'
  ],
  theme: {
    extend: {}
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        strudel: {
          primary: '#8caaee',
          'primary-content': '#05070f',
          secondary: '#ef9f76',
          accent: '#a6d189',
          neutral: '#1e2230',
          'neutral-content': '#f5f6fb',
          'base-100': '#0a0d14',
          'base-200': '#121724',
          'base-300': '#1a2030',
          'base-content': '#f5f6fb',
          info: '#89dceb',
          success: '#81c8be',
          warning: '#e5c890',
          error: '#e78284'
        }
      },
      'dark'
    ]
  }
}
