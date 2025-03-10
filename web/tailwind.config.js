/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // וידוא שטיילווינד עובד בכל הקבצים של React
  theme: {
    extend: {
      colors: {
        primary: 'rgb(255, 174, 0)', // צבע מותאם אישית
      },
    },
  },
  plugins: [],
};
