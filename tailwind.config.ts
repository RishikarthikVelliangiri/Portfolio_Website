
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Add more distinctive colors
				nebula: {
					blue: '#4361ee',
					purple: '#7209b7',
					pink: '#f72585',
					dark: '#0a0a0b',
				}
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				display: ['Space Grotesk', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'shimmer': {
					from: { backgroundPosition: '0 0' },
					to: { backgroundPosition: '-200% 0' },
				},
				'morph': {
					'0%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
					'50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
					'100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' }
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(79, 70, 229, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(79, 70, 229, 0.8)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'shimmer': 'shimmer 2s linear infinite',
				'morph': 'morph 8s ease-in-out infinite',
				'spin-slow': 'spin-slow 15s linear infinite',
				'float': 'float 6s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 3s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'grid-pattern': 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
				'glow-conic': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
				'nebula-gradient': 'linear-gradient(to right, #4361ee, #7209b7, #f72585)',
				'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
				'skill-gradient': 'linear-gradient(to right, rgba(67, 97, 238, 0.3), rgba(114, 9, 183, 0.3))',
			},
			boxShadow: {
				'neon': '0 0 5px rgba(79, 70, 229, 0.5), 0 0 20px rgba(79, 70, 229, 0.3)',
				'neon-hover': '0 0 10px rgba(79, 70, 229, 0.7), 0 0 30px rgba(79, 70, 229, 0.5)',
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
			},
			transitionProperty: {
				'width': 'width',
				'height': 'height',
				'spacing': 'margin, padding',
				'transform': 'transform',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
