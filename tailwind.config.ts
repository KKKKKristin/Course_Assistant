import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      backgroundColor: {
        'custom-light': '#f0f2f5',
      },
      textColor: {
        'custom-dark': '#333',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;


// import type { Config } from 'tailwindcss';

// module.exports = {
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
//       },
//       backgroundColor: {
//         'custom-light': '#f0f2f5',
//       },
//       textColor: {
//         'custom-dark': '#333',
//       },
//     },
//   },
// }


// const config: Config = {
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       gridTemplateColumns: {
//         '13': 'repeat(13, minmax(0, 1fr))',
//       },
//       colors: {
//         blue: {
//           400: '#2589FE',
//           500: '#0070F3',
//           600: '#2F6FEB',
//         },
//       },
//     },
//     keyframes: {
//       shimmer: {
//         '100%': {
//           transform: 'translateX(100%)',
//         },
//       },
//     },
//   },
//   plugins: [require('@tailwindcss/forms')],
// };
// export default config;
