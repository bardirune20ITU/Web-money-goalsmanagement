/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#b6dbff',
          300: '#86c3ff',
          400: '#4da3ff',
          500: '#1e8aff',
          600: '#0d6de6',
          700: '#0a56b4',
          800: '#0a478f',
          900: '#0c3c75'
        }
      },
      boxShadow: {
        glass: '0 10px 30px rgba(30,138,255,0.25)'
      },
      backgroundImage: {
        'mesh-gradient':
          'radial-gradient(1200px circle at 0% 0%, rgba(30,138,255,0.25), transparent 40%), radial-gradient(1000px circle at 100% 0%, rgba(255,64,129,0.2), transparent 40%), radial-gradient(900px circle at 0% 100%, rgba(16,185,129,0.25), transparent 40%)'
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      animation: {
        gradientShift: 'gradientShift 18s ease infinite'
      }
    }
  },
  plugins: []
};

