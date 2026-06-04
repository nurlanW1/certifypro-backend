import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          400: '#34D399',
          600: '#059669',
          800: '#047857',
          900: '#134E4A',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          800: '#92400E',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F5F2EB',
          tertiary: '#E8E4DB',
        },
        border: {
          light: '#E8E4DB',
          DEFAULT: '#D6D0C4',
          strong: '#A8A196',
        },
        text: {
          primary: '#1C1917',
          secondary: '#44403C',
          muted: '#78716C',
          inverse: '#FFFCF7',
        },
        success: {
          light: '#D1FAE5',
          DEFAULT: '#059669',
          dark: '#047857',
        },
        warning: {
          light: '#FEF3C7',
          DEFAULT: '#D97706',
          dark: '#92400E',
        },
        danger: {
          light: '#FEE2E2',
          DEFAULT: '#DC2626',
          dark: '#991B1B',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        xs: '2px 2px 0 0 rgba(28,25,23,0.08)',
        sm: '3px 3px 0 0 rgba(28,25,23,0.12)',
        md: '4px 4px 0 0 rgba(28,25,23,0.14)',
        lg: '6px 6px 0 0 rgba(28,25,23,0.16)',
        focus: '0 0 0 3px rgba(5,150,105,0.35)',
        brutal: '5px 5px 0 0 #1C1917',
        'brutal-sm': '3px 3px 0 0 #1C1917',
      },
    },
  },
  plugins: [],
}
export default config
