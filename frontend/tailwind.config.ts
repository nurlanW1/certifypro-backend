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
          50: '#EEEDFE',
          100: '#CECBF6',
          200: '#AFA9EC',
          400: '#7F77DD',
          600: '#534AB7',
          800: '#3C3489',
          900: '#26215C',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8F7FE',
          tertiary: '#F0EFFD',
        },
        border: {
          light: '#EEEDFE',
          DEFAULT: '#CECBF6',
          strong: '#AFA9EC',
        },
        text: {
          primary: '#26215C',
          secondary: '#534AB7',
          muted: '#7F77DD',
          inverse: '#FFFFFF',
        },
        success: {
          light: '#E1F5EE',
          DEFAULT: '#1D9E75',
          dark: '#0F6E56',
        },
        warning: {
          light: '#FAEEDA',
          DEFAULT: '#EF9F27',
          dark: '#854F0B',
        },
        danger: {
          light: '#FCEBEB',
          DEFAULT: '#E24B4A',
          dark: '#A32D2D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(38,33,92,0.04)',
        sm: '0 2px 6px 0 rgba(38,33,92,0.06)',
        md: '0 4px 16px 0 rgba(38,33,92,0.08)',
        lg: '0 8px 32px 0 rgba(38,33,92,0.10)',
        focus: '0 0 0 3px rgba(127,119,221,0.35)',
      },
    },
  },
  plugins: [],
}
export default config
