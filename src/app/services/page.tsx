"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Services() {
  const { t } = useLanguage();

  return (
    <div className="animate-[fadeIn_0.5s_ease-out_forwards] w-full">
      <section className="text-center mb-16 pt-10">
        <h2 className="text-3xl md:text-4xl font-[var(--font-orbitron)] font-bold text-white uppercase mb-4">
          {t.servicesPage.title1} <br className="md:hidden" />
          <span className="neon-text">{t.servicesPage.title2}</span>
        </h2>
        <div className="font-[var(--font-orbitron)] text-cyan-400 inline-block bg-cyan-900/20 px-4 py-2 rounded text-sm">
          Active: <span className="text-green-400 animate-pulse">Services</span>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {/* Service Card 1 */}
        <div className="tech-panel p-6 neon-border group hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 mb-4 text-cyan-400 bg-cyan-900/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-black transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h3 className="text-xl font-[var(--font-orbitron)] font-bold text-white mb-3">{t.servicesList.service1Title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{t.servicesList.service1Desc}</p>
        </div>

        {/* Service Card 2 */}
        <div className="tech-panel p-6 neon-border group hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 mb-4 text-cyan-400 bg-cyan-900/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-black transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <h3 className="text-xl font-[var(--font-orbitron)] font-bold text-white mb-3">{t.servicesList.service2Title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{t.servicesList.service2Desc}</p>
        </div>

        {/* Service Card 3 */}
        <div className="tech-panel p-6 neon-border group hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 mb-4 text-cyan-400 bg-cyan-900/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-black transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
          </div>
          <h3 className="text-xl font-[var(--font-orbitron)] font-bold text-white mb-3">{t.servicesList.service3Title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{t.servicesList.service3Desc}</p>
        </div>

        {/* Service Card 4 */}
        <div className="tech-panel p-6 neon-border group hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 mb-4 text-cyan-400 bg-cyan-900/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-black transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
          </div>
          <h3 className="text-xl font-[var(--font-orbitron)] font-bold text-white mb-3">{t.servicesList.service4Title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{t.servicesList.service4Desc}</p>
        </div>

        {/* Service Card 5 */}
        <div className="tech-panel p-6 neon-border group hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 mb-4 text-cyan-400 bg-cyan-900/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-black transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h3 className="text-xl font-[var(--font-orbitron)] font-bold text-white mb-3">{t.servicesList.service5Title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{t.servicesList.service5Desc}</p>
        </div>

        {/* Service Card 6 */}
        <div className="tech-panel p-6 neon-border group hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 mb-4 text-cyan-400 bg-cyan-900/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-black transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
          </div>
          <h3 className="text-xl font-[var(--font-orbitron)] font-bold text-white mb-3">{t.servicesList.service6Title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{t.servicesList.service6Desc}</p>
        </div>
      </section>
    </div>
  );
}