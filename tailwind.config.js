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
			background: "#FFF",
			foreground: "#222E48",
			border: "#CCD0DA",
			input: "#ECF1F4",
			ring: "#222E48",
			primary: {
				DEFAULT: "#222E48",
				foreground: "#FFF"
			},
			secondary: {
				DEFAULT: "#387094",
				foreground: "#FFF"
			},
			muted: {
				DEFAULT: "#F3F6F8",
				foreground: "#7B8294"
			},
			accent: {
				DEFAULT: "#7994DD",
				foreground: "#FFF"
			},
			destructive: {
				DEFAULT: "#FF2753",
				foreground: "#FFF"
			},
			popover: {
				DEFAULT: "#FFF",
				foreground: "#222E48"
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