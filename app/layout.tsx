import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const spaceMono = Space_Mono({ 
  subsets: ["latin"], 
  weight: ["400"],
  variable: "--font-space-mono" 
});

export const metadata: Metadata = {
  title: "The Met Palette",
  description: "A Chromatic Archive of The Met's Menagerie",
};

import { PaletteProvider } from "@/context/PaletteContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} font-sans bg-museum-bg text-museum-text`}>
        <PaletteProvider>
          {children}
        </PaletteProvider>
      </body>
    </html>
  );
}
