import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext"; // <--- დაამატე ეს
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-orbitron",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "italive.ge - Future of Digital Connectivity",
  description: "Innovative solutions for a tech-driven world.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${rajdhani.variable} font-sans antialiased selection:bg-cyan-500 selection:text-white`}>
        {/* მთლიანი აპლიკაცია მოქცეულია LanguageProvider-ში */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}