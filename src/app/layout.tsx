import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import "./globals.css";
import SeoSchema from "@/components/SeoSchema";

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
  metadataBase: new URL("https://www.italive.ge"),
  title: {
    default:
      "ITalive | IT აუთსორსინგი, აიტი მომსახურება და ინფორმაციული ტექნოლოგიები",
    template: "%s | ITalive — IT აუთსორსინგი საქართველოში",
  },
  description:
    "პროფესიონალური IT აუთსორსინგი და აიტი მომსახურება ბიზნესისთვის თბილისსა და მთელ საქართველოში. კომპიუტერული მომსახურება, სერვერების გამართვა, ქსელის მონტაჟი, კიბერუსაფრთხოება და 24/7 IT საპორტი. Professional IT Outsourcing & Managed IT Services in Georgia.",
  keywords: [
    // ქართული ძირითადი საძიებო სიტყვები
    "IT აუთსორსინგი",
    "აიტი აუთსორსინგი",
    "აიტი აუტსორსინგი",
    "IT მომსახურება",
    "აიტი მომსახურება",
    "ინფორმაციული ტექნოლოგიები",
    "კომპიუტერული მომსახურება",
    "კომპიუტერული მომსახურება კომპანიებისთვის",
    "აიტი კომპანია",
    "IT კომპანია საქართველოში",
    "აიტი საპორტი",
    "IT საპორტი",
    "აიტი სპეციალისტი",
    "სერვერების გამართვა",
    "სერვერების ადმინისტრირება",
    "ქსელის მონტაჟი",
    "ქსელის გამართვა",
    "ოფისის ქსელის მოწყობა",
    "Wi-Fi გამართვა ოფისში",
    "კიბერუსაფრთხოება",
    "ინფორმაციული უსაფრთხოება",
    "დისტანციური აიტი დახმარება",
    "სისტემური ადმინისტრირება",
    // ლათინური ტრანსლიტერაცია (როგორც ხშირად იძებნება Google-ში საქართველოდან)
    "it autsorsingi",
    "aiti autsorsingi",
    "it momsaxureba",
    "aiti momsaxureba",
    "informaciuli teqnologiebi",
    "kompiuteruli momsaxureba",
    "serverebis gamartva",
    "qselis gamartva",
    "it saporti",
    // ინგლისური საძიებო სიტყვები
    "IT Outsourcing Georgia",
    "IT Outsourcing Tbilisi",
    "Managed IT Services Georgia",
    "IT Support Tbilisi",
    "IT Services Georgia",
    "Network Administration Georgia",
    "Server Management Tbilisi",
    "Cybersecurity Services Georgia",
    "ITalive",
    "italive.ge",
  ],
  authors: [{ name: "ITalive", url: "https://www.italive.ge" }],
  creator: "ITalive",
  publisher: "ITalive",
  alternates: {
    canonical: "https://www.italive.ge",
    languages: {
      "ka-GE": "https://www.italive.ge",
      "en-US": "https://www.italive.ge",
    },
  },
  openGraph: {
    type: "website",
    locale: "ka_GE",
    alternateLocale: ["en_US"],
    url: "https://www.italive.ge",
    siteName: "ITalive — IT Outsourcing & Cybersecurity",
    title:
      "ITalive | IT აუთსორსინგი, აიტი მომსახურება და ინფორმაციული ტექნოლოგიები",
    description:
      "სრული IT აუთსორსინგი კომპანიებისთვის: სერვერების და ქსელების ადმინისტრირება, კომპიუტერული ტექნიკის მხარდაჭერა, Cloud სერვისები და 24/7 კიბერუსაფრთხოება.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ITalive | IT აუთსორსინგი და აიტი მომსახურება საქართველოში",
    description:
      "პროფესიონალური IT აუთსორსინგი, ქსელური ინფრასტრუქტურა, სერვერები და კიბერუსაფრთხოება თქვენი ბიზნესისთვის.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <body className={`${orbitron.variable} ${rajdhani.variable} font-sans antialiased selection:bg-cyan-500 selection:text-white flex flex-col min-h-screen`}>
	  <SeoSchema />
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