/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-ink': '#0A0E27',
        'brand-cyan': '#00E5FF',
        'brand-purple': '#6D28D9',
        'brand-orange': '#FF7A00',
        'brand-green': '#10B981',
        'brand-amber': '#F59E0B',
        'brand-red': '#EF4444',
        'brand-blue': '#3B82F6',
        'off-white': '#F8F9FA',
        'light-gray': '#E5E7EB',
        'medium-gray': '#9CA3AF',
        'dark-gray': '#4B5563',
        'card-bg': 'rgba(15, 23, 42, 0.95)',
        'scrollbar-thumb': '#00E5FF',
        'scrollbar-track': '#0A0E27',
        // keep original names too for compatibility
        'cyan': '#00E5FF',
        'purple-brand': '#6D28D9',
      },
      fontFamily: {
        headline: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        // legacy aliases kept
        kanit: ['Kanit', 'sans-serif'],
        montserrat: ['Inter', 'sans-serif'],
        oldStandard: ['Poppins', 'serif'],
        playfair: ['Poppins', 'sans-serif'],
        Poppins: ['Poppins', 'sans-serif'],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        full: '9999px',
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.5)',
        'xl': '0 20px 60px rgba(0, 0, 0, 0.5)',
        'cyan': '0 4px 12px rgba(0, 229, 255, 0.25)',
        'cyan-lg': '0 6px 20px rgba(0, 229, 255, 0.35)',
        'cyan-sm': '0 2px 8px rgba(0, 229, 255, 0.2)',
        'purple': '0 4px 12px rgba(109, 40, 217, 0.3)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.3)',
      },
      transitionDuration: {
        fast: '150ms',
        standard: '200ms',
        smooth: '300ms',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backgroundImage: {
        'gradient-cyan-purple': 'linear-gradient(135deg, #00E5FF, #6D28D9)',
        'gradient-deep': 'linear-gradient(180deg, rgba(10, 14, 39, 0) 0%, #0A0E27 100%)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        shimmer: 'shimmer 1.5s infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-in-right': 'slideInRight 0.2s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      scale: {
        '102': '1.02',
        '98': '0.98',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '::-webkit-scrollbar-thumb': {
          borderRadius: '10px',
          backgroundColor: 'rgba(0, 229, 255, 0.4)',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(10, 14, 39, 0.8)',
          borderRadius: '10px',
        },
      });
    },
  ],
};
