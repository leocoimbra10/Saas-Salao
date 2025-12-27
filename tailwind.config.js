/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Neomorphic Light Theme Colors
      colors: {
        'neo-bg': '#F0F0F3',
        'neo-surface': '#F0F0F3',
        'neo-text': '#4A4A58',
        'neo-text-secondary': '#8D8D99',
        'neo-accent': '#E8A0B8',
        'neo-accent-light': '#F5CED8',
        'neo-accent-dark': '#C67A94',
        'neo-success': '#50C878',
        'neo-danger': '#FF6B6B',
        'neo-warning': '#FFB347',
        'neo-info': '#6EC1E4',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#E8A0B8',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: '#4A90E2',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: '#E8A0B8',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      // Neomorphic Shadows
      boxShadow: {
        'neo-out': '8px 8px 16px #D1D9E6, -8px -8px 16px #FFFFFF',
        'neo-out-lg': '12px 12px 24px #D1D9E6, -12px -12px 24px #FFFFFF',
        'neo-out-sm': '5px 5px 10px #D1D9E6, -5px -5px 10px #FFFFFF',
        'neo-in': 'inset 8px 8px 16px #D1D9E6, inset -8px -8px 16px #FFFFFF',
        'neo-in-lg': 'inset 12px 12px 24px #D1D9E6, inset -12px -12px 24px #FFFFFF',
        'neo-in-sm': 'inset 5px 5px 10px #D1D9E6, inset -5px -5px 10px #FFFFFF',
        'neo-pressed': 'inset 4px 4px 8px #D1D9E6, inset -4px -4px 8px #FFFFFF',
      },
      borderRadius: {
        'neo': '24px',
        'neo-lg': '32px',
        'neo-sm': '16px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Nunito', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
