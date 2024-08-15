/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserat: ["Montserrat"],
        lora: ["Lora"],
      },
      backgroundImage: {
        homeImage: "url('/src/assets/thanksgiving-8335322.jpg')",
      },
      colors: {
        bg: "#FFF9E6",
        bg1: "#54B435",
        bg2: "#F4CE14",
        bg3:"#379237",
        btn1: "#F0FF42",
        btn2: "#82CD47",
      },
    },
  },
  plugins: [],
};
