/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			colors: {
				"picton-blue": {
					50: "#f1f9fe",
					100: "#e1f3fd",
					200: "#bde6fa",
					300: "#83d3f6",
					400: "#41beef",
					500: "#2ab1e8",
					600: "#0b85be",
					700: "#0a6a9a",
					800: "#0d597f",
					900: "#114b69",
					950: "#0b2f46"
				}
			}
		}
	},
	plugins: []
};
