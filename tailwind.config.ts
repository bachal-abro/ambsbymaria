import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#FFFBFC',
          charcoal: '#FFF5F7',
          'charcoal-light': '#EDE4E7',
          gold: '#f8d0d3',
          'gold-light': '#fae6e8',
          'gold-dark': '#eebabc',
          champagne: '#FDF2F4',
          silver: '#C0C0C0',
          'rose-gold': '#B76E79',
          white: '#1A1118',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      fontSize: {
        'display-xl': ['7rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-lg': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        'luxury-glow': '0 0 40px rgba(248, 208, 211, 0.4)',
        'luxury-glow-lg': '0 0 60px rgba(248, 208, 211, 0.6)',
        'luxury-elevation': '0 20px 60px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'luxury-gradient': 'linear-gradient(135deg, #f8d0d3 0%, #fae6e8 50%, #eebabc 100%)',
        'dark-gradient': 'linear-gradient(180deg, #FFFBFC 0%, #FFF5F7 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4', filter: 'blur(20px)' },
          '50%': { opacity: '0.8', filter: 'blur(30px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
