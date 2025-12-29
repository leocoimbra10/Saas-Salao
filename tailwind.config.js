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
      // ===== BRAND COLORS =====
      colors: {
        // Primary Brand Colors (Dynamic via CSS vars)
        'brand-primary': 'var(--color-brand-primary, #E8A0B8)',
        'brand-primary-light': 'var(--color-brand-primary-light, #F5CED8)',
        'brand-primary-dark': 'var(--color-brand-primary-dark, #C67A94)',
        'brand-gold': 'var(--color-brand-gold, #D4AF37)',
        'brand-gold-light': 'var(--color-brand-gold-light, #F5E6C8)',
        'brand-purple': 'var(--color-brand-purple, #8A2BE2)',

        // Neomorphic Base Theme
        'neo-bg': '#F0F0F3',
        'neo-surface': '#F0F0F3',
        'neo-text': '#4A4A58',
        'neo-text-secondary': '#8D8D99',
        'neo-accent': 'var(--color-brand-primary, #E8A0B8)',
        'neo-accent-light': 'var(--color-brand-primary-light, #F5CED8)',
        'neo-accent-dark': 'var(--color-brand-primary-dark, #C67A94)',

        // Semantic Colors
        'neo-success': '#50C878',
        'neo-danger': '#FF6B6B',
        'neo-warning': '#FFB347',
        'neo-info': '#6EC1E4',

        // Shadcn/UI compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'var(--color-brand-primary, #E8A0B8)',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: '#4A90E2',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'var(--color-brand-primary, #E8A0B8)',
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

      // ===== NEOMORPHIC SHADOWS =====
      boxShadow: {
        // Standard Neomorphic Shadows
        'neo-out': '8px 8px 16px #D1D9E6, -8px -8px 16px #FFFFFF',
        'neo-out-lg': '12px 12px 24px #D1D9E6, -12px -12px 24px #FFFFFF',
        'neo-out-sm': '5px 5px 10px #D1D9E6, -5px -5px 10px #FFFFFF',
        'neo-in': 'inset 8px 8px 16px #D1D9E6, inset -8px -8px 16px #FFFFFF',
        'neo-in-lg': 'inset 12px 12px 24px #D1D9E6, inset -12px -12px 24px #FFFFFF',
        'neo-in-sm': 'inset 5px 5px 10px #D1D9E6, inset -5px -5px 10px #FFFFFF',
        'neo-pressed': 'inset 4px 4px 8px #D1D9E6, inset -4px -4px 8px #FFFFFF',
        'neo-flat': '0px 0px 0px #D1D9E6, 0px 0px 0px #FFFFFF',

        // Glow Effects for Glassmorphic Buttons
        'glow-brand': '0 0 8px var(--color-brand-primary, #E8A0B8), 0 0 16px var(--color-brand-primary, #E8A0B8), 0 0 24px var(--color-brand-gold, #D4AF37)',
        'glow-intense': '0 0 16px #FF69B4, 0 0 32px #FF69B4, 0 0 48px var(--color-brand-gold, #D4AF37), 0 0 60px var(--color-brand-gold, #D4AF37)',

        // Glass shadow
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },

      // ===== BORDER RADIUS =====
      borderRadius: {
        'neo': '24px',
        'neo-lg': '32px',
        'neo-sm': '16px',
        'neo-xs': '12px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ===== TYPOGRAPHY =====
      fontFamily: {
        'display': ['Playfair Display', 'serif'],  // All headings
        'body': ['Nunito', 'sans-serif'],          // All body text
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'display-sm': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
      },

      // ===== ANIMATIONS =====
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
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
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px var(--color-brand-primary, #E8A0B8)' },
          '50%': { boxShadow: '0 0 20px var(--color-brand-primary, #E8A0B8), 0 0 30px var(--color-brand-gold, #D4AF37)' },
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

      // ===== SPACING =====
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      // ===== TRANSITIONS =====
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
