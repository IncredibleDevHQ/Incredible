const Color = require('color')
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

const alpha = (clr, val) => Color(clr).alpha(val).rgb().string()
const lighten = (clr, val) => Color(clr).lighten(val).rgb().string()
const darken = (clr, val) => Color(clr).darken(val).rgb().string()
const fade = (clr, val) => Color(clr).fade(val).rgb().string()

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      borderWidth: {
        1.5: '1.5px',
      },
      borderRadius: {
        sm: '0.25rem',
      },
      fontFamily: {
        main: ['Gilroy', ...fontFamily.sans],
        body: ['InterBody', ...fontFamily.sans],
      },
      minHeight: {
        32: '8rem',
        48: '12rem',
      },
      colors: {
        inherit: 'inherit',
        cyan: colors.cyan,
        brand: {
          DEFAULT: '#16A34A',
          lighter: lighten('#16A34A', 0.05),
          dark: darken('#16A34A', 0.05),
          darker: darken('#16A34A', 0.1),
          75: alpha('#16A34A', 0.75),
          10: alpha('#16A34A', 0.1),
        },
        'brand-alt': {
          DEFAULT: '#51A3EA',
          lighter: lighten('#51A3EA', 0.05),
          darker: darken('#51A3EA', 0.05),
          75: alpha('#51A3EA', 0.75),
        },
        background: '#FFFFFF',
        'background-alt': '#FAFAFA',
        grey: {
          DEFAULT: '#1f1f1f',
          lighter: lighten('#1f1f1f', 0.5),
          darker: darken('#1f1f1f', 0.05),
          75: alpha('#1f1f1f', 0.75),
        },
        orange: {
          DEFAULT: '#FFEDD5',
          lighter: lighten('#FFEDD5', 0.5),
          darker: '#C2410C',
        },
        success: { DEFAULT: '#137547', 10: `rgba(19,117,71, 0.1)` },
        warning: '#ED7D3A',
        error: {
          DEFAULT: '#EF2D56',
          10: `rgba(239,45,86, 0.1)`,
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      cursor: {
        'zoom-in': 'zoom-in',
        'zoom-out': 'zoom-out',
      },
    },
  },
  variants: {
    opacity: ({ after }) => after(['disabled']),
    cursor: ({ after }) => after(['disabled']),
    extend: {
      border: ['hover'],
      backgroundColor: ['active'],
      borderColor: ['active'],
      transform: ['group-hover'],
      translate: ['group-hover'],
      margin: ['last'],
      display: ['hover', 'group-hover'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
