/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
        },
        container: {
            center: true,
            padding: {
                xl: '20px',
                DEFAULT: '16px',
            },
        },
        extend: {
            colors: {
                black: '#22272F',
                light: '#E2E5EB',
                red: '#C03221',
                veryLight: '#EEEFF0',
                lightDark: '#707480',
            },
        },
    },
    plugins: [],
};
