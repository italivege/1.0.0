"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ITADesk() {
  const { t } = useLanguage();

  return (
    <div className="animate-[fadeIn_0.5s_ease-out_forwards] w-full pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        
        {/* Header / Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block border border-cyan-500/50 bg-cyan-900/20 px-3 py-1 rounded text-cyan-400 font-[var(--font-orbitron)] text-xs mb-6 tracking-widest uppercase animate-pulse">
            {t.itadesk.badge}
          </div>
          <h2 className="text-4xl md:text-6xl font-[var(--font-orbitron)] font-bold text-white mb-4">
            {t.itadesk.title1} <span className="neon-text">{t.itadesk.title2}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
            {t.itadesk.desc}
          </p>
          
          <a
            href="/itadesk-windows.exe"
            download="itadesk-windows.exe"
            className="btn-neon btn-solid py-4 px-10 text-lg inline-flex items-center gap-3 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            {t.itadesk.downloadBtn}
          </a>

          {/* Windows SmartScreen Info Box */}
          <div className="max-w-xl mx-auto mt-6 bg-cyan-950/25 border border-cyan-500/40 rounded-lg px-4 py-3 text-left flex items-start gap-3">
            <svg className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-xs text-gray-300 leading-relaxed">
              <span className="font-[var(--font-orbitron)] text-cyan-400 font-bold block mb-0.5">
                {t.itadesk.smartScreenTitle}
              </span>
              {t.itadesk.smartScreenDesc}
            </div>
          </div>
        </div>

        {/* Visual Terminal / Mock Interface */}
        <div className="tech-panel p-1 neon-border mb-16 relative min-h-[290px]">
          <div className="bg-[#030811] p-6 rounded overflow-hidden">
            <div className="flex justify-between items-center mb-4 border-b border-cyan-900/50 pb-3">
              <div className="flex gap-2 items-center">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-500 font-mono ml-2">itadesk-windows.exe</span>
              </div>
              <span className="text-xs text-green-400 font-mono animate-pulse">● SECURE TUNNEL ACTIVE</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 items-center">
              <div className="bg-[#0a1423] p-6 rounded border border-cyan-500/20 text-center">
                <span className="text-xs text-gray-400 font-[var(--font-orbitron)] block mb-2">YOUR DESK ID</span>
                <span className="text-3xl md:text-4xl font-bold font-mono text-cyan-400 tracking-wider">982 410 753</span>
                <span className="block text-xs text-gray-500 mt-2">Ready to connect</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-cyan-500 text-xs font-[var(--font-orbitron)] mb-2">TARGET DESK ADDRESS</label>
                  <input type="text" readOnly className="tech-input text-center font-mono tracking-widest" placeholder="Enter ID..." />
                </div>
                <div className="btn-neon w-full py-3 text-center pointer-events-none">CONNECT TO DESK</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-10 text-center">
          <h3 className="text-2xl font-[var(--font-orbitron)] font-bold text-white uppercase tracking-wider mb-8">
            {t.itadesk.featuresTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="tech-panel p-6 neon-border">
            <div className="w-12 h-12 mb-4 text-cyan-400 bg-cyan-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h4 className="text-lg font-[var(--font-orbitron)] font-bold text-white mb-2">{t.itadesk.feat1Title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{t.itadesk.feat1Desc}</p>
          </div>

          <div className="tech-panel p-6 neon-border">
            <div className="w-12 h-12 mb-4 text-cyan-400 bg-cyan-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h4 className="text-lg font-[var(--font-orbitron)] font-bold text-white mb-2">{t.itadesk.feat2Title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{t.itadesk.feat2Desc}</p>
          </div>

          <div className="tech-panel p-6 neon-border">
            <div className="w-12 h-12 mb-4 text-cyan-400 bg-cyan-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h4 className="text-lg font-[var(--font-orbitron)] font-bold text-white mb-2">{t.itadesk.feat3Title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{t.itadesk.feat3Desc}</p>
          </div>
        </div>

      </div>
    </div>
  );
}