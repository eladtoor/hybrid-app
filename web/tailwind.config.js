/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D32F2F", // אדום כהה
        "primary-light": "#E57373", // אדום בהיר
        secondary: "#4CAF50", // ירוק כהה
        "secondary-light": "#66BB6A", // ירוק בהיר
        dark: "#111111", // שחור כהה
        grayish: "#333333", // אפור כהה
        light: "#f8f8f8", // רקע בהיר
      },
      backgroundImage: {
        "wall-texture": "url('/public/textures/wall-background.jpg')", // רקע טקסטורה
      },
      animation: {
        "border-gradient": "borderGradient 3s ease infinite",
      },
      keyframes: {
        borderGradient: {
          "0%, 100%": { borderColor: "#D32F2F" }, // primary (אדום כהה)
          "50%": { borderColor: "#4CAF50" }, // secondary (ירוק כהה)
        },
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".btn": {
          "@apply px-4 py-2 font-semibold rounded-lg shadow transition duration-300":
            {},
        },
        ".btn-primary": {
          "@apply btn bg-primary text-white hover:bg-primary-light": {},
        },
        ".btn-outline": {
          "@apply btn border border-primary text-primary bg-white hover:bg-primary hover:text-white":
            {},
        },
        ".btn-dark": {
          "@apply btn bg-dark text-white hover:bg-gray-800": {},
        },
        ".icon-btn": {
          "@apply flex items-center justify-center w-10 h-10 rounded-full bg-grayish text-white hover:bg-primary hover:text-black transition":
            {},
        },
        ".custom-table": {
          "@apply min-w-full border border-gray-300 text-right bg-white rounded-lg shadow-md overflow-hidden":
            {},
        },
        ".custom-table th": {
          "@apply bg-orange-100 text-orange-800 px-4 py-2 border-b font-semibold text-sm":
            {},
        },
        ".custom-table td": {
          "@apply px-4 py-2 border-b text-sm text-gray-800": {},
        },
        ".table-row-alt": {
          "@apply bg-gray-50": {},
        },
        ".modal": {
          "@apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4":
            {},
        },
        ".modal-content": {
          "@apply bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl relative":
            {},
        },
        ".modal-close": {
          "@apply absolute top-4 left-4 text-gray-500 hover:text-primary text-3xl cursor-pointer transition":
            {},
        },
        ".modal-form": {
          "@apply grid gap-4 mt-6": {},
        },
        ".modal-form label": {
          "@apply flex flex-col text-right text-sm font-medium text-gray-700":
            {},
        },
        ".modal-form input, .modal-form textarea, .modal-form select": {
          "@apply mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition":
            {},
        },
        ".search-input": {
          "@apply w-full px-4 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200":
            {},
        },
        ".section-title": {
          "@apply text-4xl font-bold text-gray-900 border-b-4 border-primary pb-4 inline-block":
            {},
        },
        ".section-title-rtl": {
          "@apply text-3xl font-bold text-gray-900 text-right pr-6 border-r-4 border-primary":
            {},
        },
        ".profile-card": {
          "@apply max-w-3xl mx-auto mt-36 p-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-primary relative overflow-hidden":
            {},
        },
        ".profile-card::before": {
          "@apply absolute inset-0 bg-wall-texture opacity-10 rounded-3xl": {},
          content: "''",
        },
        ".profile-content": {
          "@apply relative z-10": {},
        },
        ".profile-input": {
          "@apply border-gray-300 rounded-md p-3 shadow focus:ring-2 focus:ring-primary w-full mt-2 mb-4":
            {},
        },
        ".profile-button": {
          "@apply mt-6": {},
        },
      });
    },
  ],
};
