/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: '#2b7fff',
					dark: '#1f6ae0',
					light: '#e8f1ff',
				},
			},
		},
	},
	plugins: [],
}
