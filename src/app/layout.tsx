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
      "ITalive | IT აუთსორსინგი, სერვერები, ქსელები, IP ტელეფონია, ვებ საიტების და აპლიკაციების აწყობა",
    template: "%s | ITalive — IT აუთსორსინგი და აიტი მომსახურება",
  },
  description:
    "სრული IT აუთსორსინგი და აიტი მომსახურება ბიზნესისთვის: სერვერების გამართვა, ქსელების მონტაჟი, VPN, სატელეფონო სადგურები და IP ტელეფონები, პრინტერების გამართვა, ვებ საიტების და აპლიკაციების აწყობა, კიბერუსაფრთხოება 24/7.",
  keywords: [
    // IT აუთსორსინგი და კომპიუტერული სერვისი
    "IT აუთსორსინგი",
    "აიტი აუთსორსინგი",
    "აიტი აუტსორსინგი",
    "IT მომსახურება",
    "აიტი მომსახურება",
    "აიტი სერვისი",
    "ინფორმაციული ტექნოლოგიები",
    "კომპიუტერული მომსახურება",
    "კომპიუტერული მომსახურება კომპანიებისთვის",
    "აიტი კომპანია",
    "IT კომპანია საქართველოში",
    "აიტი საპორტი",
    "IT საპორტი",
    "დისტანციური IT მხარდაჭერა",
    // სერვერები, ქსელები, VPN
    "სერვერების გამართვა",
    "სერვერების ადმინისტრირება",
    "სერვერის კონფიგურაცია",
    "ქსელის მონტაჟი",
    "ქსელის გამართვა",
    "ქსელის მოკვლევა",
    "ოფისის ქსელის მოწყობა",
    "Wi-Fi გამართვა",
    "ვაიფაის გამართვა",
    "VPN კონფიგურაცია",
    "VPN გამართვა",
    "კორპორატიული VPN",
    "MikroTik კონფიგურაცია",
    "Cisco კონფიგურაცია",
    // სატელეფონო სადგურები, IP ტელეფონები, პრინტერები
    "სატელეფონო სადგურები",
    "სატელეფონო სადგურის გამართვა",
    "IP ტელეფონია",
    "აიპი ტელეფონები",
    "IP ტელეფონების გამართვა",
    "VoIP ტელეფონია",
    "Asterisk გამართვა",
    "პრინტერების გამართვა",
    "პრინტერის ინსტალაცია",
    "პრინტერის კომპიუტერთან დაკავშირება",
    // ვებ საიტების და აპლიკაციების აწყობა
    "ვებ საიტების აწყობა",
    "საიტების აწყობა",
    "საიტების დამზადება",
    "ვებ გვერდების დამზადება",
    "აპლიკაციების აწყობა",
    "აპლიკაციების დამზადება",
    "კიბერუსაფრთხოება",
    "მონაცემთა ბექაფი და აღდგენა",
    // ლათინური ტრანსლიტერაცია
    "it autsorsingi",
    "aiti momsaxureba",
    "serverebis gamartva",
    "qselis gamartva",
    "saitebis awyoba",
    "saitebis damzadeba",
    "aplikaciebis awyoba",
    "ip telefonia",
    "printerebis gamartva",
    // ინგლისური
    "IT Outsourcing Georgia",
    "Managed IT Services Tbilisi",
    "Network & Server Administration Georgia",
    "VoIP PBX Setup Tbilisi",
    "Web & App Development Georgia",
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
    siteName: "ITalive — IT Outsourcing & Technology Solutions",
    title:
      "ITalive | IT აუთსორსინგი, სერვერები, ქსელები, IP ტელეფონია, საიტების და აპლიკაციების აწყობა",
    description:
      "სრული IT აუთსორსინგი კომპანიებისთვის: სერვერები, ქსელები, VPN, IP სატელეფონო სადგურები, პრინტერები, ვებ-საიტებისა და აპლიკაციების აწყობა.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ITalive | სრული IT აუთსორსინგი და აიტი მომსახურება საქართველოში",
    description:
      "სერვერები, ქსელები, VPN, IP ტელეფონია, პრინტერები, კიბერუსაფრთხოება, ვებ-საიტებისა და აპლიკაციების დამზადება.",
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