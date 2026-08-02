import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            boxShadow: {
                'deep-dark': '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 10px 20px -5px rgba(0, 0, 0, 0.8)',
                'neon-glow': '0 0 20px var(--accent-dim), 0 0 40px var(--accent-dim)',
            }
        },
    },

    plugins: [forms, typography],
};
