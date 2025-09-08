/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // GenZ Primary Color - Vibrant Orange
        primary: {
          50: '#fef5f0',
          100: '#fee8d7',
          200: '#fdd3b8',
          300: '#fcb184',
          400: '#fa8b51',
          500: '#EF6F38', // Main brand color
          600: '#e55a28',
          700: '#d14818',
          800: '#b73c12',
          900: '#9d340f',
        },
        // GenZ Orange Scale - Energy & Action
        orange: {
          50: '#fef5f0',
          100: '#fee8d7',
          200: '#fdd3b8',
          300: '#fcb184',
          400: '#fa8b51',
          500: '#EF6F38',
          600: '#e55a28',
          700: '#d14818',
          800: '#b73c12',
          900: '#9d340f',
          950: '#7a280b',
        },
        // GenZ Golden Scale - Success & Achievement  
        golden: {
          50: '#fef9e7',
          100: '#fef3c7',
          200: '#fee8a3',
          300: '#fdd868',
          400: '#F0BB43',
          500: '#F3A340',
          600: '#e6941c',
          700: '#d18315',
          800: '#b56f11',
          900: '#9c5d0e',
          950: '#794209',
        },
        // GenZ Pink Scale - Secondary Actions & Warmth
        pink: {
          50: '#fef7f7',
          100: '#fee9ec',
          200: '#fed5dc',
          300: '#fcb5c4',
          400: '#F088A3',
          500: '#e9708b',
          600: '#de5a75',
          700: '#cc485f',
          800: '#b53a4f',
          900: '#9e3142',
          950: '#7a1f2f',
        },
        // GenZ Neutral Scale - Warm & Rich
        neutral: {
          50: '#F3ECD2',  // Cream
          100: '#f7f0e0',
          150: '#f0e6d5', 
          200: '#e8dcc8',
          250: '#d5c7a8',
          300: '#c4b392',
          400: '#a8956b',
          500: '#8b7355',
          600: '#6b563f',
          700: '#4a3b2a',
          750: '#2a201a',
          800: '#1a1410',
          850: '#151109',
          900: '#121212', // GenZ Dark
          950: '#0a0807',
        },
        // Legacy colors for compatibility
        focus: {
          50: '#fef5f0',
          100: '#fee8d7',
          200: '#fdd3b8',
          300: '#fcb184',
          400: '#EF6F38',
          500: '#F3A340',
          600: '#e6941c',
          700: '#d18315',
          800: '#b56f11',
          900: '#9c5d0e',
        },
        success: {
          50: '#fef9e7',
          100: '#fef3c7',
          200: '#fee8a3',
          300: '#fdd868',
          400: '#F0BB43',
          500: '#F3A340',
          600: '#e6941c',
          700: '#d18315',
          800: '#b56f11',
          900: '#9c5d0e',
        },
        gray: {
          50: '#F3ECD2',
          100: '#f7f0e0',
          200: '#e8dcc8',
          300: '#c4b392',
          400: '#a8956b',
          500: '#8b7355',
          600: '#6b563f',
          700: '#4a3b2a',
          800: '#1a1410',
          900: '#121212',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'breathing': 'breathing 4s ease-in-out infinite',
        'aurora-flow': 'auroraFlow 6s ease-in-out infinite',
        'aurora-drift': 'auroraDrift 8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        breathing: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        auroraFlow: {
          '0%, 100%': { 
            transform: 'rotate(0deg) scale(1)',
            opacity: '0.4'
          },
          '25%': { 
            transform: 'rotate(90deg) scale(1.1)',
            opacity: '0.6'
          },
          '50%': { 
            transform: 'rotate(180deg) scale(1.2)',
            opacity: '0.8'
          },
          '75%': { 
            transform: 'rotate(270deg) scale(1.1)',
            opacity: '0.6'
          },
        },
        auroraDrift: {
          '0%, 100%': { 
            transform: 'translateX(0px) translateY(0px)',
            filter: 'hue-rotate(0deg)'
          },
          '33%': { 
            transform: 'translateX(10px) translateY(-5px)',
            filter: 'hue-rotate(120deg)'
          },
          '66%': { 
            transform: 'translateX(-5px) translateY(10px)',
            filter: 'hue-rotate(240deg)'
          },
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(239, 111, 56, 0.5)',
            filter: 'brightness(1)'
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(239, 111, 56, 0.8)',
            filter: 'brightness(1.2)'
          },
        },
      },
      fontFamily: {
        'primary': ['Inter Variable', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI Variable', 'Segoe UI', 'system-ui', 'sans-serif'],
        'secondary': ['Geist Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI Variable', 'Segoe UI', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono Variable', 'SF Mono', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
        'sans': ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'], // Fallback
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      blur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}