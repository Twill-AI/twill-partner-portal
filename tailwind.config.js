/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
			// Authentic Twill AI Color Palette
			"background-color": "hsl(0deg, 0%, 95%)",
			card: "#FFF",
			"list-item": "#D9D9D9",
			white: "#FFF",
			gray40: "#F3F6F8",
			gray60: "#ECF1F4", 
			gray75: "#ECF1F4",
			gray80: "#CCD0DA",
			gray100: "#7B8294",
			black50: "#222E48",
			black100: "#161E2D",
			azure100: "#387094",
			yellow75: "#D1A400",
			error: "#FF2753",
			green: "#39E696",
			periwinkle50: "#7994DD",
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
			muted: {
				DEFAULT: "hsl(var(--muted))",
				foreground: "hsl(var(--muted-foreground))",
			},
			accent: {
				DEFAULT: "hsl(var(--accent))",
				foreground: "hsl(var(--accent-foreground))",
			},
			destructive: {
				DEFAULT: "hsl(var(--destructive))",
				foreground: "hsl(var(--destructive-foreground))",
			},
			popover: {
				DEFAULT: "hsl(var(--popover))",
				foreground: "hsl(var(--popover-foreground))",
			},
			chart: {
				"1": "#387094",
				"2": "#7994DD",
				"3": "#39E696",
				"4": "#D1A400",
				"5": "#FF2753"
			},
			sidebar: {
  				DEFAULT: "#FFF",
  				foreground: "#222E48",
  				primary: "#222E48",
  				'primary-foreground': "#FFF",
  				accent: "#7994DD",
  				'accent-foreground': "#FFF",
  				border: "#CCD0DA",
  				ring: "#222E48"
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}