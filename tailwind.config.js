/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {  // Correção aqui
        'logoteentech': "url('/src/assets/TeechTech.jpg')" // Adicione aspas ao redor da URL
      }
    },
  },
  plugins: [],
}
