"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
// Navbar, Footer, BackgroundCanvas და scanlines უკვე Layout-შია

export default function Home() {
  const { t } = useLanguage();

  return (
    <section className="flex flex-col justify-center min-h-[80vh] w-full">
      <div className="max-w-4xl animate-[fadeIn_0.5s_ease-out_forwards]">
        <div className="inline-block border border-cyan-500/50 bg-cyan-900/20 px-3 py-1 rounded text-cyan-400 font-[var(--font-orbitron)] text-xs mb-6 tracking-widest uppercase">
          {t.hero.system}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold font-[var(--font-orbitron)] text-white leading-tight mb-6">
          {t.hero.title1} <br />
          {t.hero.title2} <span className="neon-text">{t.hero.titleHighlight}</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-light mb-10 max-w-2xl">
          {t.hero.desc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* ვიყენებთ Link-ებს button-ის ნაცვლად */}
          <Link href="/solutions" className="btn-neon btn-solid py-4 px-8 text-lg text-center inline-block">
            {t.hero.btnStart}
          </Link>
          <Link href="/services" className="btn-neon py-4 px-8 text-lg text-center inline-block">
            {t.hero.btnLearn}
          </Link>
        </div>
      </div>

      {/* ანიმირებული მეტრიკები (Live Metrics) - გვერდითა პანელი */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block opacity-60">
        <div className="tech-panel p-6 w-64 neon-border">
          <h4 className="text-cyan-400 font-[var(--font-orbitron)] text-sm mb-2 border-b border-cyan-500/30 pb-2">LIVE METRICS</h4>
          <div className="flex justify-between text-sm my-2"><span>Latency:</span> <span className="text-green-400">12ms</span></div>
          <div className="flex justify-between text-sm my-2"><span>Uptime:</span> <span className="text-green-400">99.99%</span></div>
          <div className="flex justify-between text-sm my-2"><span>Nodes:</span> <span className="text-cyan-400 animate-pulse">Active</span></div>
        </div>
      </div>
    </section>
  );
}