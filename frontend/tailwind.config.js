/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores principais
        primary: '#22C55E',
        
        // Cores neutras (dark mode)
        'dark-bg': '#0F172A',
        'dark-card': '#111827',
        'dark-border': '#1F2937',
        'dark-text': '#E5E7EB',
        
        // Cores neutras (light mode)
        'light-bg': '#F8FAFC',
        'light-card': '#FFFFFF',
        'light-border': '#E5E7EB',
        'light-text': '#0F172A',
        
        // Cores de feedback
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        
        // Cores de status
        status: {
          scheduled: '#3B82F6', // azul
          confirmed: '#22C55E', // verde
          cancelled: '#6B7280', // cinza
          no_show: '#EF4444', // vermelho
          paused: '#F59E0B', // âmbar
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'h1': ['28px', '36px'],
        'h2': ['22px', '30px'],
        'h3': ['18px', '28px'],
        'body': ['14px', '22px'],
        'small': ['12px', '18px'],
      },
      borderRadius: {
        DEFAULT: '12px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
      }
    },
  },
  plugins: [],
}

