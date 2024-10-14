import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        kanit: ["var(--font-kanit)"],
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(108.77deg, #7049C3 37.32%, #9725A9 88.63%)",
        "hero-bg": "url('/hero-bg.svg')",
        "partner-section-gradient":
          "linear-gradient(90deg, #EAE1FF 0%, #A983FF 100%)",
        "partner-section-bg":
          "url('https://s3-alpha-sig.figma.com/img/02eb/ec96/2a739454e6cdc68be968dea2a9d23804?Expires=1729468800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RoN00HNyo1Hfy7oq1PVI-i69AC9NKzZ5k2jhAdrmWGK2UN9jgo7k8C6wqR2j8nieO81rwa9bOtKyAfSyC6eGqSOAKa6M-PsScCrG9Lx2dfCzaeTjZHtSkBsdYSsMtje3E5T5Hvsy8Z~Kbvrg48hEYSgWbOPeChRJr1b5-PUhBBdnnbn5DpYz834xV3MOdWhXSnK201RZHZdawWMmmDyNmQrGauNzi-G4GWrzeDYMv13m0P6AYoSJRYgafS8waui3Ub33H7QnUanQIpHyWK2zZsEFpLmOhlaM2bNrG3y~JckGGMvzUm3vjo~mA2eRF151fiqNXoLk49NoqBg0ct8qvA__')",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
