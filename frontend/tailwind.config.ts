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
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          400: '#60A5FA',
          600: '#2563EB',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        accent: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          800: '#075985',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
        },
        border: {
          light: '#E2E8F0',
          DEFAULT: '#CBD5E1',
          strong: '#94A3B8',
        },
        text: {
          primary: '#0F172A',
          secondary: '#334155',
          muted: '#64748B',
          inverse: '#FFFFFF',
        },
        success: {
          light: '#DCFCE7',
          DEFAULT: '#16A34A',
          dark: '#15803D',
        },
        warning: {
          light: '#FEF9C3',
          DEFAULT: '#CA8A04',
          dark: '#A16207',
        },
        danger: {
          light: '#FEE2E2',
          DEFAULT: '#DC2626',
          dark: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        md: '12px',
        lg: '14px',
        xl: '18px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(15,23,42,0.04)',
        sm: '0 4px 12px -2px rgba(37,99,235,0.08)',
        md: '0 8px 24px -4px rgba(37,99,235,0.12)',
        lg: '0 16px 40px -8px rgba(30,64,175,0.18)',
        focus: '0 0 0 3px rgba(37,99,235,0.35)',
        glow: '0 0 40px -8px rgba(37,99,235,0.45)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 40%, #E0F2FE 100%)',
        'brand-gradient': 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
      },
    },
  },
  plugins: [],
}
export default config
