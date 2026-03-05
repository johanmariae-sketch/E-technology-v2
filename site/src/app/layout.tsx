import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E Technology Store — Tu tienda de tecnología en Piantini",
  description:
    "Smartphones, tablets, accesorios y más. Tienda física en Piantini, Santo Domingo. Envíos a todo el país.",
  keywords: ["tecnología", "smartphones", "accesorios", "tienda", "Piantini", "Santo Domingo"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body suppressHydrationWarning
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-[family-name:var(--font-inter)] antialiased bg-white text-[#0F172A]`}
      >
        {/* Noise texture overlay */}
        <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03]">
          <svg width="100%" height="100%">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>
        {children}
      </body>
    </html>
  );
}
