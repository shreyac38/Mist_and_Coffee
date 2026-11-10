/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFCF9',
          100: '#FFF8F0', // primary cream
          200: '#F9EFE3',
          300: '#F2E4D4',
          400: '#EAD7C2',
          500: '#DEC4A9',
        },
        dustyPink: {
          50: '#FDF7F7',
          100: '#F7EDED',
          200: '#F0DDDD',
          300: '#EBCBCB', // primary dusty pink
          400: '#DFB4B4',
          500: '#CF9999',
          600: '#B67575',
        },
        pastelPeach: {
          50: '#FEFAF7',
          100: '#FAF0EB',
          200: '#F4D6C6', // primary pastel peach
          300: '#EEC5B0',
          400: '#E4AB8F',
          500: '#D58D6B',
        },
        sageGreen: {
          50: '#F6F9F5',
          100: '#E9EFE7',
          200: '#DDE6D9',
          300: '#C8D5C0', // primary sage green
          400: '#AEC0A4',
          500: '#8FA583',
          600: '#6E8563',
        },
        butterYellow: {
          50: '#FEFCF3',
          100: '#FAF4DC',
          200: '#F5E7B2', // primary butter yellow
          300: '#EDD78A',
          400: '#DEC15E',
          500: '#C7A639',
        },
        cocoaBrown: {
          50: '#F7F3F1',
          100: '#EDE3DF',
          200: '#D9C5BF',
          300: '#B89B92',
          400: '#9B7468',
          500: '#795548', // primary cocoa brown
          600: '#644338',
          700: '#51342B',
        },
        espresso: {
          50: '#F4F2F1',
          100: '#E3DFDC',
          200: '#C2B9B4',
          300: '#94847D',
          400: '#5F4F48',
          500: '#46352E',
          600: '#35251F', // primary espresso
          700: '#2A1B16',
          800: '#1F130F',
          900: '#130A07',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        handwriting: ['"Caveat"', '"Homemade Apple"', 'cursive'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(53, 37, 31, 0.05)',
        'soft': '0 6px 20px -4px rgba(53, 37, 31, 0.07)',
        'soft-lg': '0 12px 32px -6px rgba(53, 37, 31, 0.09)',
        'soft-xl': '0 20px 45px -10px rgba(53, 37, 31, 0.12)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.6)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'steam': 'steam 4s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        steam: {
          '0%': { transform: 'translateY(0px) scale(0.95)', opacity: '0.4' },
          '50%': { transform: 'translateY(-10px) scale(1.05)', opacity: '0.85' },
          '100%': { transform: 'translateY(-20px) scale(1.15)', opacity: '0' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
