/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                primary: { DEFAULT: '#7c3aed', light: '#8b5cf6', dark: '#6d28d9', faint: '#f5f3ff' },
                secondary: { DEFAULT: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
                amber: { DEFAULT: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
                surface: '#ffffff',
                muted: '#f8f7ff',
                border: '#e4e4f0',
                subtle: '#f3f4f6',
            },
            fontFamily: {
                body: ['Inter', 'system-ui', 'sans-serif'],
                display: ['"Playfair Display"', 'Georgia', 'serif'],
            },
            boxShadow: {
                card: '0 2px 8px rgba(124,58,237,0.07)',
                'card-hover': '0 8px 24px rgba(124,58,237,0.15)',
                nav: '0 2px 12px rgba(0,0,0,0.08)',
            },
            backgroundImage: {
                'violet-gradient': 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                'amber-gradient': 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            },
        },
    },
    plugins: [],
};
