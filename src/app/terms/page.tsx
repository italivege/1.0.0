"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Terms() {
  const { t } = useLanguage();

  return (
    <div className="animate-[fadeIn_0.5s_ease-out_forwards] w-full pt-10 pb-20 flex justify-center">
      <div className="max-w-4xl w-full">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-[var(--font-orbitron)] font-bold text-white mb-2 uppercase">
            {t.terms.title1} <span className="neon-text">{t.terms.title2}</span>
          </h2>
          <div className="inline-block border border-cyan-500/50 bg-cyan-900/20 px-3 py-1 rounded text-cyan-400 font-[var(--font-orbitron)] text-xs mt-4 tracking-widest uppercase">
            {t.terms.lastUpdated}
          </div>
        </div>

        <div className="tech-panel p-8 md:p-10 neon-border relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
          
          <div className="relative z-10 space-y-10">
            
            {/* Section 1 */}
            <div>
              <h3 className="text-xl font-[var(--font-orbitron)] font-bold text-cyan-400 mb-4 border-b border-cyan-900/50 pb-2">
                {t.terms.sec1Title}
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                {t.terms.sec1Desc}
              </p>
            </div>

            {/* Section 2 - CRITICAL LIABILITY */}
            <div className="bg-red-950/20 border-l-4 border-red-500 p-6 rounded-r shadow-[inset_0_0_20px_rgba(255,0,0,0.05)]">
              <h3 className="text-xl font-[var(--font-orbitron)] font-bold text-red-400 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                {t.terms.sec2Title}
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base font-mono">
                {t.terms.sec2Desc}
              </p>
            </div>

            {/* Section 3 - PRIVACY & TELEMETRY */}
            <div>
              <h3 className="text-xl font-[var(--font-orbitron)] font-bold text-cyan-400 mb-4 border-b border-cyan-900/50 pb-2">
                {t.terms.sec3Title}
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                {t.terms.sec3Desc}
              </p>
            </div>

            {/* Section 4 - NO WARRANTY */}
            <div>
              <h3 className="text-xl font-[var(--font-orbitron)] font-bold text-cyan-400 mb-4 border-b border-cyan-900/50 pb-2">
                {t.terms.sec4Title}
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                {t.terms.sec4Desc}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}