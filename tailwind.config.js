/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary background: #0D0E0E
        primary: {
          50: '#EBEEEF',
          100: '#D1D6D9',
          200: '#A7B3BB',
          300: '#7D909D',
          400: '#536D7F',
          500: '#294A61',
          600: '#0D0E0E', // Main primary background
          700: '#0A0B0B',
          800: '#080808',
          900: '#050505',
        },
        // Accent purple: #4B0076
        accent: {
          50: '#F0E6F4',
          100: '#D9BFE7',
          200: '#B880D1',
          300: '#9740BB',
          400: '#762095',
          500: '#4B0076', // Main accent purple
          600: '#3A005D',
          700: '#290044',
          800: '#18002B',
          900: '#070012',
        },
        // Surface backgrounds (slightly lighter than main background)
        surface: {
          DEFAULT: '#1A1B1B', // Slightly lighter than #0D0E0E
          50: '#F2F3F3',
          100: '#DBDDDD',
          200: '#B7BCBC',
          300: '#949A9A',
          400: '#707878',
          500: '#4D5555',
          600: '#293232',
          700: '#1A1B1B', // Surface background
          800: '#141515',
          900: '#0E0F0F',
        },
        // Subtle borders
        border: {
          light: 'rgba(255, 255, 255, 0.1)', // Very subtle, low-opacity neutral border
          DEFAULT: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(255, 255, 255, 0.3)',
        },
        // High-contrast text
        text: {
          primary: '#FFFFFF',
          secondary: '#CCCCCC',
          muted: '#999999',
          disabled: '#666666',
        },
        // Dark theme backgrounds
        bg: {
          primary: '#0D0E0E', // Primary background
          secondary: '#1A1B1B', // Slightly lighter background
          card: '#141515', // Card background
          modal: '#1A1B1B', // Modal background
        }
      },
      borderRadius: {
        sm: '0.375rem',  // 6px - Soft rounded corners
        md: '0.5rem',    // 8px - Soft rounded corners
        lg: '0.75rem',   // 12px - Soft rounded corners
        xl: '1rem',      // 16px - Soft rounded corners
      },
      boxShadow: {
        // Subtle shadows for depth without harsh glow
        'soft': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [
    require('@headlessui/tailwindcss')({ prefix: 'ui' }),
  ],
}

