import type { Metadata } from "next";
import { Space_Grotesk, Inter, Roboto_Mono } from "next/font/google";
import { SplashScreen } from "@/components/splash/splash-screen";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Gestor de Finanzas",
    template: "%s · Gestor de Finanzas",
  },
  description:
    "Lleva el control de tus ingresos y gastos, compáralos con la regla 50/30/20 y aprende a gestionar tu dinero.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${robotoMono.variable} h-full`}
    >
      <body className="min-h-full bg-paper text-ink font-sans antialiased">
        <SplashScreen />
        <div className="min-h-screen p-2 sm:p-4">
          <div className="mx-auto flex h-[calc(100dvh-1rem)] max-w-[1600px] overflow-hidden rounded-[2rem] border border-line bg-paper/70 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:h-[calc(100dvh-2rem)]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
