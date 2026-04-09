/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function({ addBase }) {
      addBase({
        'img, svg, video, canvas, audio, iframe, embed, object': {
          verticalAlign: 'unset',
        },
        'button, [type="button"], [type="reset"], [type="submit"]': {
          appearance: 'button',
        },
        '[type="search"]': {
          appearance: 'textfield',
        },
      })
    },
  ],
}
