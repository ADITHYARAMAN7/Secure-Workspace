/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'aurora-bg': '#030014', // Deep space blue/black
                'aurora-card': 'rgba(255, 255, 255, 0.03)',
                'aurora-border': 'rgba(255, 255, 255, 0.1)',
                primary: {
                    DEFAULT: '#8B5CF6', // Violet
                    hover: '#7C3AED',
                    glow: 'rgba(139, 92, 246, 0.5)'
                },
                secondary: {
                    DEFAULT: '#EC4899', // Pink
                    glow: 'rgba(236, 72, 153, 0.5)'
                },
                accent: {
                    DEFAULT: '#06B6D4', // Cyan
                }
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'], // Elite typography
            },
            backgroundImage: {
                'gradient-aurora': 'linear-gradient(135deg, #FF0080 0%, #7928CA 50%, #FF0080 100%)', // Vibrant Animated
                'gradient-glass': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            },
            animation: {
                'blob': 'blob 10s infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                }
            }
        },
    },
    plugins: [],
}
