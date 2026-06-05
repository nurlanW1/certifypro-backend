import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--g-canvas)',
        ink: 'var(--g-ink)',
        subtle: 'var(--g-subtle)',
        muted: 'var(--g-muted)',
        divide: 'var(--g-divide)',

        'text-primary': 'var(--g-text-primary)',
        'text-secondary': 'var(--g-text-secondary)',
        'text-tertiary': 'var(--g-text-tertiary)',
        'text-disabled': 'var(--g-text-disabled)',

        accent: {
          DEFAULT: 'var(--g-accent)',
          dim: 'var(--g-accent-dim)',
          muted: 'var(--g-accent-muted)',
          border: 'var(--g-accent-border)',
          hover: 'var(--g-accent-hover)',
          strong: 'var(--g-accent-strong)',
        },

        ok: '#22C55E',
        warn: '#F59E0B',
        err: '#EF4444',

        surface: {
          DEFAULT: 'var(--g-surface)',
          1: 'var(--g-surface)',
          2: 'var(--g-surface-2)',
          3: 'var(--g-surface-3)',
          4: 'var(--g-surface-4)',
          secondary: 'var(--g-surface-2)',
          tertiary: 'var(--g-surface-3)',
        },

        border: {
          light: 'var(--g-border-light)',
          DEFAULT: 'var(--g-border)',
          strong: 'var(--g-border-strong)',
        },

        brand: {
          50: 'var(--g-brand-50)',
          100: 'var(--g-brand-100)',
          200: 'var(--g-brand-200)',
          400: 'var(--g-brand-400)',
          600: 'var(--g-brand-600)',
          800: 'var(--g-brand-800)',
          900: 'var(--g-brand-900)',
        },
        success: {
          light: '#22C55E20',
          DEFAULT: '#22C55E',
          dark: '#16A34A',
        },
        warning: {
          light: '#F59E0B20',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        danger: {
          light: '#EF444420',
          DEFAULT: '#EF4444',
          dark: '#DC2626',
        },
        text: {
          primary: 'var(--g-text-primary)',
          secondary: 'var(--g-text-secondary)',
          muted: 'var(--g-text-tertiary)',
          inverse: 'var(--g-text-inverse)',
        },
        overlay: 'var(--g-overlay)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        display: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '16px', letterSpacing: '0.06em' }],
        xs: ['12px', { lineHeight: '18px', letterSpacing: '0.02em' }],
        sm: ['14px', { lineHeight: '22px' }],
        base: ['15px', { lineHeight: '24px' }],
        md: ['16px', { lineHeight: '26px' }],
        lg: ['18px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        xl: ['20px', { lineHeight: '30px', letterSpacing: '-0.01em' }],
        '2xl': ['24px', { lineHeight: '34px', letterSpacing: '-0.02em' }],
        '3xl': ['30px', { lineHeight: '40px', letterSpacing: '-0.03em' }],
        '4xl': ['36px', { lineHeight: '46px', letterSpacing: '-0.03em' }],
        '5xl': ['48px', { lineHeight: '58px', letterSpacing: '-0.04em' }],
        '6xl': ['60px', { lineHeight: '70px', letterSpacing: '-0.04em' }],
        '7xl': ['72px', { lineHeight: '82px', letterSpacing: '-0.05em' }],
      },
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
        xl: '14px',
        '2xl': '16px',
        '3xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        xs: 'var(--g-shadow-xs)',
        sm: 'var(--g-shadow-sm)',
        md: 'var(--g-shadow-md)',
        lg: 'var(--g-shadow-lg)',
        focus: '0 0 0 2px var(--g-accent-muted)',
        glow: '0 0 24px var(--g-accent-dim)',
        inset: 'var(--g-inset)',
        'inset-sm': 'inset 0 0 0 1px rgba(128, 128, 128, 0.08)',
      },
      spacing: {
        '4.5': '18px',
        '5.5': '22px',
        '13': '52px',
        '15': '60px',
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px',
        '34': '136px',
        '38': '152px',
      },
      animation: {
        in: 'fadeIn 0.15s ease-out',
        'in-up': 'fadeInUp 0.2s ease-out',
        'in-down': 'fadeInDown 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        shimmer: 'shimmer 1.5s linear infinite',
        cursor: 'cursor 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        cursor: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
