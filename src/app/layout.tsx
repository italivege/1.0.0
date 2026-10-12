import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundCanvas from "@/components/BackgroundCanvas";
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
      <body className={`${orbitron.variable} ${rajdhani.variable} font-sans antialiased selection:bg-cyan-500 selection:text-white flex flex-col min-h-screen`}>
        <LanguageProvider>
          {/* გლობალური ფონი და ეფექტები */}
          <BackgroundCanvas />
          <div className="scanlines"></div>
          
          {/* საერთო ნავიგაცია */}
          <Navbar />
          
          {/* ცვალებადი კონტენტი (გვერდები) */}
          <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-grow w-full relative z-10">
            {children}
          </main>
          
          {/* საერთო ფუტერი */}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}