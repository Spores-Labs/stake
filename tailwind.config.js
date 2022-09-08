module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  media: false,
  important: true,
  theme: {
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '800px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        color: {
          primary: '#B7A284',
          secondary: '#F1E9DC',
          caption: '#F5E6D5',
          golden: '#FFC350',

          legendary: '#DA8B14',
          epic: '#C261F0',
          rare: '#62B1F9',
          uncommon: '#6FAF51',
          common: '#F1E9DC',

          brown: '#463024',
          dark: '#170A02CC',
          'dark-brown': '#33221B',
          greyish: '#423429',
          browny: '#271911',
          greenish: '#3DBC42',
          'stroke-black': '#574239',
        },
        dark: {
          10: '#0001',
          20: '#0002',
          30: '#0003',
          40: '#0004',
          50: '#0005',
          60: '#0006',
          70: '#0007',
          80: '#0008',
          90: '#0009',
          A0: '#000A',
          B0: '#000B',
          C0: '#000C',
          D0: '#000D',
          E0: '#000E',
          F0: '#000F',
        },
        light: {
          10: '#FFF1',
          20: '#FFF2',
          30: '#FFF3',
          40: '#FFF4',
          50: '#FFF5',
          60: '#FFF6',
          70: '#FFF7',
          80: '#FFF8',
          90: '#FFF9',
          A0: '#FFFA',
          B0: '#FFFB',
          C0: '#FFFC',
          D0: '#FFFD',
          E0: '#FFFE',
          F0: '#FFFF',
        },
      },
      fontFamily: {
        skadi: ['Skranji'],
        avenir: 'Avenir',
      },
      width: {
        15: '3.75rem',
        fit: 'fit-content',
      },
      height: {
        15: '3.75rem',
      },
      letterSpacing: {
        extra: '.2em',
      },
      fontSize: {
        smallest: ['8px', '11px'],
        tiny: ['10px', '14px'],
        average: ['22px', '30px'],
        huge: ['40px', '56px'],
        giant: ['64px', '90px'],
      },
    },
  },
};
