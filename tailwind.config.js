/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  "./pages/**/*.{ts,tsx}",
	  "./components/**/*.{ts,tsx}",
	  "./app/**/*.{ts,tsx}",
	  "./src/**/*.{ts,tsx}",
	  "*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
	  container: {
		center: true,
		padding: {
		  DEFAULT: "1rem",
		  sm: "2rem",
		},
		screens: {
		  "2xl": "1400px",
		},
	  },
	  extend: {
		colors: {
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
		  },
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		keyframes: {
		  "accordion-down": {
			from: { height: "0" },
			to: { height: "var(--radix-accordion-content-height)" },
		  },
		  "accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: "0" },
		  },
		  "fade-in": {
			from: { opacity: "0" },
			to: { opacity: "1" },
		  },
		  "fade-out": {
			from: { opacity: "1" },
			to: { opacity: "0" },
		  },
		  "slide-in": {
			from: { transform: "translateY(10px)", opacity: "0" },
			to: { transform: "translateY(0)", opacity: "1" },
		  },
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		  "fade-in": "fade-in 0.2s ease-out",
		  "fade-out": "fade-out 0.2s ease-out",
		  "slide-in": "slide-in 0.2s ease-out",
		},
		typography: {
		  DEFAULT: {
			css: {
			  maxWidth: "100%",
			  color: "hsl(var(--foreground))",
			  '[class~="lead"]': {
				color: "hsl(var(--foreground))",
			  },
			  a: {
				color: "hsl(var(--primary))",
			  },
			  strong: {
				color: "hsl(var(--foreground))",
			  },
			  "ol > li::marker": {
				color: "hsl(var(--foreground))",
			  },
			  "ul > li::marker": {
				color: "hsl(var(--foreground))",
			  },
			  hr: {
				borderColor: "hsl(var(--border))",
			  },
			  blockquote: {
				borderLeftColor: "hsl(var(--border))",
				color: "hsl(var(--foreground))",
			  },
			  h1: {
				color: "hsl(var(--foreground))",
			  },
			  h2: {
				color: "hsl(var(--foreground))",
			  },
			  h3: {
				color: "hsl(var(--foreground))",
			  },
			  h4: {
				color: "hsl(var(--foreground))",
			  },
			  "figure figcaption": {
				color: "hsl(var(--muted-foreground))",
			  },
			  code: {
				color: "hsl(var(--foreground))",
			  },
			  "a code": {
				color: "hsl(var(--primary))",
			  },
			  pre: {
				backgroundColor: "hsl(var(--muted))",
				color: "hsl(var(--foreground))",
			  },
			  thead: {
				borderBottomColor: "hsl(var(--border))",
			  },
			  "tbody tr": {
				borderBottomColor: "hsl(var(--border))",
			  },
			},
		  },
		},
	  },
	},
	plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
  }
  
  