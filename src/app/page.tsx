"use client";

import { useState, useEffect } from "react";
import BackgroundCanvas from "@/components/BackgroundCanvas";
// 1. წავშალეთ ლოკალური თარგმანების იმპორტი და შემოვიტანეთ Context-ი
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [barKey, setBarKey] = useState(0); // ბარის ანიმაციის თავიდან დასაწყებად
  
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");
  const handleContactSubmit = async (e: React.FormEvent) => {
	e.preventDefault();
	setFormStatus("loading");
	
	try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setFormStatus("success");
      setFormMessage(data.message);
      setFormData({ name: "", email: "", message: "" });
    } else {
      setFormStatus("error");
      setFormMessage(data.message || "გაგზავნა ვერ მოხერხდა.");
    }
  } catch (error) {
    setFormStatus("error");
    setFormMessage("ქსელის შეცდომა.");
  }
};

  // 2. აქედან ვიღებთ ენას და თარგმანებს მთელი აპლიკაციისთვის (აღარ ვიყენებთ useState-ს)
  const { lang, setLang, t } = useLanguage();

  const navigate = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    if (tab === "services") {
      setBarKey(prev => prev + 1); // არესეტებს ანიმაციას
    }
  };

  return (
    <>
      <BackgroundCanvas />
      <div className="scanlines"></div>

      <nav className="fixed top-0 w-full z-40 bg-[#030811]/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("home")}>
              <span className="font-[var(--font-orbitron)] font-bold text-2xl tracking-wider text-white">
                italive<span className="neon-text">.ge</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8 font-[var(--font-orbitron)] text-sm tracking-wide">
                {["home", "solutions", "services", "contact"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => navigate(tab)}
                  className={`nav-link transition-colors uppercase ${
                  activeTab === tab ? "text-white" : "text-gray-400 hover:text-cyan-400"
                  }`}
                >
                  {t.nav[tab as keyof typeof t.nav]}
                </button>
                ))}
              </div>
            </div>
      
      {/* Language Switcher */}
        <div className="hidden md:flex items-center space-x-2 mr-4 font-[var(--font-orbitron)] text-sm">
          <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}>EN</button>
            <span className="text-gray-700">|</span>
          <button onClick={() => setLang('ka')} className={lang === 'ka' ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}>GE</button>
        </div>

            {/* Action Button */}
            <div className="hidden md:block">
              <button className="btn-neon text-xs">{t.nav.login}</button>
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-cyan-400 hover:text-white focus:outline-none"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#030811] border-b border-cyan-500/20 font-[var(--font-orbitron)]">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
              {["home", "solutions", "services", "contact"].map((tab) => (
        <button
          key={tab}
          onClick={() => navigate(tab)}
          className={`nav-link transition-colors uppercase ${
          activeTab === tab ? "text-white" : "text-gray-400 hover:text-cyan-400"
          }`}
        >
          {t.nav[tab as keyof typeof t.nav]}
        </button>
        ))}
              <button className="btn-neon mt-4 w-full text-center">{t.nav.login}</button>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen relative z-10">
        
        {/* === HOME SECTION === */}
        <section id="home" className={`page-section ${activeTab === "home" ? "active" : ""} flex flex-col justify-center min-h-[80vh]`}>
        <div className="max-w-4xl">
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
          <button className="btn-neon btn-solid py-4 px-8 text-lg" onClick={() => navigate("solutions")}>
            {t.hero.btnStart}
          </button>
          <button className="btn-neon py-4 px-8 text-lg" onClick={() => navigate("services")}>
            {t.hero.btnLearn}
          </button>
        </div>
      </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block opacity-60">
            <div className="tech-panel p-6 w-64 neon-border">
              <h4 className="text-cyan-400 font-[var(--font-orbitron)] text-sm mb-2 border-b border-cyan-500/30 pb-2">LIVE METRICS</h4>
              <div className="flex justify-between text-sm my-2"><span>Latency:</span> <span className="text-green-400">12ms</span></div>
              <div className="flex justify-between text-sm my-2"><span>Uptime:</span> <span className="text-green-400">99.99%</span></div>
              <div className="flex justify-between text-sm my-2"><span>Nodes:</span> <span className="text-cyan-400 animate-pulse">Active</span></div>
            </div>
          </div>
        </section>

{/* === SOLUTIONS SECTION === */}
        <section id="solutions" className={`page-section pt-10 ${activeTab === "solutions" ? "active" : ""}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-[var(--font-orbitron)] font-bold text-white mb-4">
              {t.solutions.title1} <span className="neon-text">{t.solutions.title2}</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t.solutions.desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {/* Card 1 */}
             <div onClick={() => navigate("ai-systems")} className="tech-panel p-6 neon-border group cursor-pointer">
                <div className="w-12 h-12 mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-xl font-[var(--font-orbitron)] font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{t.solutions.card1Title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t.solutions.card1Desc}</p>
            </div>
            {/* Card 2 */}
            <div onClick={() => navigate("cloud-architecture")} className="tech-panel p-6 neon-border group cursor-pointer">
                <div className="w-12 h-12 mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                </div>
                <h3 className="text-xl font-[var(--font-orbitron)] font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{t.solutions.card2Title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t.solutions.card2Desc}</p>
            </div>
            {/* Card 3 */}
            <div onClick={() => navigate("data-security")} className="tech-panel p-6 neon-border group cursor-pointer">
                <div className="w-12 h-12 mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h3 className="text-xl font-[var(--font-orbitron)] font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{t.solutions.card3Title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t.solutions.card3Desc}</p>
            </div>
            {/* Card 4 */}
            <div onClick={() => navigate("network-optimization")} className="tech-panel p-6 neon-border group cursor-pointer">
                <div className="w-12 h-12 mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 className="text-xl font-[var(--font-orbitron)] font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{t.solutions.card4Title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t.solutions.card4Desc}</p>
            </div>
          </div>
        </section>
    
    {/* === AI SYSTEMS SECTION === */}
    <section id="ai-systems" className={`page-section pt-10 ${activeTab === "ai-systems" ? "active" : ""}`}>
      <div className="mb-6">
        <button onClick={() => navigate("solutions")} className="text-cyan-400 hover:text-white font-[var(--font-orbitron)] text-sm flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          {t.ai.backBtn}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-block border border-cyan-500/50 bg-cyan-900/20 px-3 py-1 rounded text-cyan-400 font-[var(--font-orbitron)] text-xs mb-6 tracking-widest uppercase animate-pulse">
            {t.ai.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-orbitron)] text-white leading-tight mb-6">
            {t.ai.title1} <br />
            <span className="neon-text">{t.ai.title2}</span>
          </h2>
          <p className="text-lg text-gray-400 font-light mb-8">
            {t.ai.desc}
          </p>
          <div className="space-y-6 mb-10">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="mt-1 text-cyan-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>
              <div>
                <h4 className="font-[var(--font-orbitron)] text-white text-lg">{t.ai.feature1Title}</h4>
                <p className="text-sm text-gray-400">{t.ai.feature1Desc}</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="flex gap-4">
                <div className="mt-1 text-cyan-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
              <div>
                <h4 className="font-[var(--font-orbitron)] text-white text-lg">{t.ai.feature2Title}</h4>
                <p className="text-sm text-gray-400">{t.ai.feature2Desc}</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="mt-1 text-cyan-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg></div>
              <div>
                <h4 className="font-[var(--font-orbitron)] text-white text-lg">{t.ai.feature3Title}</h4>
                <p className="text-sm text-gray-400">{t.ai.feature3Desc}</p>
              </div>
            </div>
          </div>
          
          <button className="btn-neon btn-solid py-4 px-10 text-lg w-full sm:w-auto" onClick={() => navigate("contact")}>
            {t.ai.cta}
          </button>
        </div>
        
        {/* Visual Element - Code Terminal */}
        <div className="tech-panel p-1 neon-border h-96 relative group hidden lg:block">
          <div className="absolute inset-0 bg-[#030811] p-6 rounded overflow-hidden">
            <div className="flex gap-2 mb-4 border-b border-cyan-900/50 pb-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-500 font-mono ml-2">ai_core_terminal.sh</span>
            </div>
            <div className="font-mono text-sm text-green-400 space-y-2 opacity-80">
              <p>&gt; Initializing neural network...</p>
              <p className="text-gray-400">&gt; Loading historical packet data [1.2 PB]... DONE</p>
              <p>&gt; Activating anomaly detection matrix...</p>
              <p className="text-yellow-400">&gt; WARNING: Unusual traffic spike detected on Node 7.</p>
              <p className="text-cyan-400">&gt; AI ACTION: Rerouting traffic through Node 12. Latency optimized.</p>
              <p>&gt; System status: <span className="text-green-500 animate-pulse">NOMINAL</span></p>
              <p className="animate-pulse mt-4">_</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    {/* === CLOUD ARCHITECTURE SECTION === */}
<section id="cloud-architecture" className={`page-section pt-10 ${activeTab === "cloud-architecture" ? "active" : ""}`}>
  <div className="mb-6">
    <button onClick={() => navigate("solutions")} className="text-cyan-400 hover:text-white font-[var(--font-orbitron)] text-sm flex items-center gap-2 transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      {t.cloud.backBtn}
    </button>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div>
      <div className="inline-block border border-cyan-500/50 bg-cyan-900/20 px-3 py-1 rounded text-cyan-400 font-[var(--font-orbitron)] text-xs mb-6 tracking-widest uppercase animate-pulse">
        {t.cloud.badge}
      </div>
      <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-orbitron)] text-white leading-tight mb-6">
        {t.cloud.title1} <br />
        <span className="neon-text">{t.cloud.title2}</span>
      </h2>
      <p className="text-lg text-gray-400 font-light mb-8">
        {t.cloud.desc}
      </p>

      <div className="space-y-6 mb-10">
        <div className="flex gap-4">
          <div className="mt-1 text-cyan-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
          <div>
            <h4 className="font-[var(--font-orbitron)] text-white text-lg">{t.cloud.feature1Title}</h4>
            <p className="text-sm text-gray-400">{t.cloud.feature1Desc}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="mt-1 text-cyan-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg></div>
          <div>
            <h4 className="font-[var(--font-orbitron)] text-white text-lg">{t.cloud.feature2Title}</h4>
            <p className="text-sm text-gray-400">{t.cloud.feature2Desc}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="mt-1 text-cyan-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
          <div>
            <h4 className="font-[var(--font-orbitron)] text-white text-lg">{t.cloud.feature3Title}</h4>
            <p className="text-sm text-gray-400">{t.cloud.feature3Desc}</p>
          </div>
        </div>
      </div>

      <button className="btn-neon btn-solid py-4 px-10 text-lg w-full sm:w-auto" onClick={() => navigate("contact")}>
        {t.cloud.cta}
      </button>
    </div>

    {/* Visual Element - Animated Cloud Nodes */}
    <div className="tech-panel p-1 neon-border h-96 relative group hidden lg:flex items-center justify-center">
      <div className="absolute inset-0 bg-[#030811] rounded overflow-hidden flex items-center justify-center">
         <div className="relative w-64 h-64">
           {/* Center Node */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-cyan-900/30 border-2 border-cyan-400 rounded-lg flex items-center justify-center shadow-[0_0_25px_#00f3ff] z-10 animate-pulse">
             <svg className="w-10 h-10 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
           </div>
           
           {/* Surrounding Nodes */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#0a1423] border border-cyan-500/50 rounded flex items-center justify-center z-10"><div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div></div>
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#0a1423] border border-cyan-500/50 rounded flex items-center justify-center z-10"><div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div></div>
           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#0a1423] border border-cyan-500/50 rounded flex items-center justify-center z-10"><div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div></div>
           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#0a1423] border border-cyan-500/50 rounded flex items-center justify-center z-10"><div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div></div>
           
           {/* Connecting Lines */}
           <svg className="absolute inset-0 w-full h-full" style={{stroke: 'rgba(0, 243, 255, 0.4)', strokeWidth: 2, strokeDasharray: 4}}>
             <line x1="50%" y1="50%" x2="50%" y2="10%" className="animate-pulse" />
             <line x1="50%" y1="50%" x2="50%" y2="90%" className="animate-pulse" style={{animationDelay: '0.2s'}} />
             <line x1="50%" y1="50%" x2="10%" y2="50%" className="animate-pulse" style={{animationDelay: '0.4s'}} />
             <line x1="50%" y1="50%" x2="90%" y2="50%" className="animate-pulse" style={{animationDelay: '0.6s'}} />
           </svg>
         </div>
      </div>
    </div>
  </div>
</section>

{/* === DATA SECURITY SECTION === */}
<section id="data-security" className={`page-section pt-10 ${activeTab === "data-security" ? "active" : ""}`}>
  <div className="mb-6">
    <button onClick={() => navigate("solutions")} className="text-cyan-400 hover:text-white font-[var(--font-orbitron)] text-sm flex items-center gap-2 transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      {t.security.backBtn}
    </button>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div>
      <div className="inline-block border border-cyan-500/50 bg-cyan-900/20 px-3 py-1 rounded text-cyan-400 font-[var(--font-orbitron)] text-xs mb-6 tracking-widest uppercase animate-pulse">
        {t.security.badge}
      </div>
      <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-orbitron)] text-white leading-tight mb-6">
        {t.security.title1} <br />
        <span className="neon-text">{t.security.title2}</span>
      </h2>
      <p className="text-lg text-gray-400 font-light mb-8">
        {t.security.desc}
      </p>

      <div className="space-y-6 mb-10">
        <div className="flex gap-4">
          <div className="mt-1 text-cyan-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></div>
          <div>
            <h4 className="font-[var(--font-orbitron)] text-white text-lg">{t.security.feature1Title}</h4>
            <p className="text-sm text-gray-400">{t.security.feature1Desc}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="mt-1 text-cyan-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>
          <div>
            <h4 className="font-[var(--font-orbitron)] text-white text-lg">{t.security.feature2Title}</h4>
            <p className="text-sm text-gray-400">{t.security.feature2Desc}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="mt-1 text-cyan-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg></div>
          <div>
            <h4 className="font-[var(--font-orbitron)] text-white text-lg">{t.security.feature3Title}</h4>
            <p className="text-sm text-gray-400">{t.security.feature3Desc}</p>
          </div>
        </div>
      </div>

      <button className="btn-neon btn-solid py-4 px-10 text-lg w-full sm:w-auto" onClick={() => navigate("contact")}>
        {t.security.cta}
      </button>
    </div>

    {/* Visual Element - Security Shield */}
    <div className="tech-panel p-1 neon-border h-96 relative group hidden lg:flex items-center justify-center">
      <div className="absolute inset-0 bg-[#030811] rounded overflow-hidden flex items-center justify-center">
         
         {/* Animated Shield Container */}
         <div className="relative flex items-center justify-center">
            {/* Outer scanning rings */}
            <div className="absolute w-64 h-64 border border-cyan-500/20 rounded-full animate-[spin_8s_linear_infinite]"></div>
            <div className="absolute w-52 h-52 border-t border-b border-cyan-400/50 rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>
            
            {/* Shield Icon */}
            <div className="relative z-10 text-cyan-400 drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]">
              <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>

            {/* Scanline passing over */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent w-full h-full animate-[translateY_2s_ease-in-out_infinite] z-20" style={{ transform: 'translateY(-100%)' }}>
               <style>{`
                 @keyframes translateY {
                   0% { transform: translateY(-100%); }
                   50% { transform: translateY(100%); }
                   100% { transform: translateY(-100%); }
                 }
               `}</style>
            </div>
         </div>

         {/* Status Text */}
         <div className="absolute bottom-6 font-mono text-xs text-green-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            ENCRYPTION ACTIVE // SECURE
         </div>
      </div>
    </div>
  </div>
</section>

{/* === NETWORK OPTIMIZATION SECTION === */}
<section id="network-optimization" className={`page-section pt-10 ${activeTab === "network-optimization" ? "active" : ""}`}>
  <div className="mb-6">
    <button onClick={() => navigate("solutions")} className="text-cyan-400 hover:text-white font-[var(--font-orbitron)] text-sm flex items-center gap-2 transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      {t.optimization.backBtn}
    </button>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div>
      <div className="inline-block border border-cyan-500/50 bg-cyan-900/20 px-3 py-1 rounded text-cyan-400 font-[var(--font-orbitron)] text-xs mb-6 tracking-widest uppercase animate-pulse">
        {t.optimization.badge}
      </div>
      <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-orbitron)] text-white leading-tight mb-6">
        {t.optimization.title1} <br />
        <span className="neon-text">{t.optimization.title2}</span>
      </h2>
      <p className="text-lg text-gray-400 font-light mb-8">
        {t.optimization.desc}
      </p>

      <div className="space-y-6 mb-10">
        <div className="flex gap-4">
          <div className="mt-1 text-cyan-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
          <div>
            <h4 className="font-[var(--font-orbitron)] text-white text-lg">{t.optimization.feature1Title}</h4>
            <p className="text-sm text-gray-400">{t.optimization.feature1Desc}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="mt-1 text-cyan-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"></path></svg></div>
          <div>
            <h4 className="font-[var(--font-orbitron)] text-white text-lg">{t.optimization.feature2Title}</h4>
            <p className="text-sm text-gray-400">{t.optimization.feature2Desc}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="mt-1 text-cyan-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg></div>
          <div>
            <h4 className="font-[var(--font-orbitron)] text-white text-lg">{t.optimization.feature3Title}</h4>
            <p className="text-sm text-gray-400">{t.optimization.feature3Desc}</p>
          </div>
        </div>
      </div>

      <button className="btn-neon btn-solid py-4 px-10 text-lg w-full sm:w-auto" onClick={() => navigate("contact")}>
        {t.optimization.cta}
      </button>
    </div>

    {/* Visual Element - Hyper-Speed Data Streams */}
    <div className="tech-panel p-1 neon-border h-96 relative group hidden lg:flex items-center justify-center">
      <div className="absolute inset-0 bg-[#030811] rounded overflow-hidden">
         
         {/* Animated Data Lines */}
         <div className="absolute inset-0 opacity-70">
            <div className="absolute top-[20%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[translateX_1.5s_linear_infinite]" style={{ transform: 'translateX(-100%)' }}></div>
            <div className="absolute top-[40%] left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-[translateX_1s_linear_infinite]" style={{ transform: 'translateX(-100%)', animationDelay: '0.2s' }}></div>
            <div className="absolute top-[60%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-[translateX_2s_linear_infinite]" style={{ transform: 'translateX(-100%)', animationDelay: '0.5s' }}></div>
            <div className="absolute top-[80%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[translateX_1.2s_linear_infinite]" style={{ transform: 'translateX(-100%)', animationDelay: '0.1s' }}></div>
            
            <style>{`
              @keyframes translateX {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
            `}</style>
         </div>

         {/* Latency Meter */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10 bg-[#030811]/80 p-6 rounded-full border border-cyan-500/30 backdrop-blur-sm">
            <span className="text-gray-400 text-xs font-[var(--font-orbitron)] mb-1">LATENCY</span>
            <div className="text-4xl font-bold text-white font-[var(--font-orbitron)] flex items-end gap-1">
              <span className="text-cyan-400">0.</span>4
              <span className="text-sm text-cyan-500 mb-1">ms</span>
            </div>
         </div>

         {/* Grid background */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      </div>
    </div>
  </div>
</section>


{/* === SERVICES SECTION (Formerly DATA LAB) === */}
        <section id="services" className={`page-section pt-10 ${activeTab === "services" ? "active" : ""}`}>
          <div className="mb-10 flex flex-col md:flex-row justify-between items-end border-b border-cyan-500/30 pb-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-[var(--font-orbitron)] font-bold text-white uppercase">
                {t.servicesPage.title1} <br className="md:hidden" />
                <span className="neon-text">{t.servicesPage.title2}</span>
              </h2>
              <p className="text-cyan-500/70 text-sm mt-1 uppercase tracking-widest">Active Services</p>
            </div>
            <div className="font-[var(--font-orbitron)] text-cyan-400 mt-4 md:mt-0 bg-cyan-900/20 px-4 py-2 rounded text-sm">
              Active: <span className="text-green-400 animate-pulse">Services</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
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
          </div>
        </section>

{/* === CONTACT SECTION === */}
<section id="contact" className={`page-section pt-10 ${activeTab === "contact" ? "active" : ""}`}>
  <div className="max-w-5xl mx-auto">
    <div className="text-center mb-10">
      <h2 className="text-4xl font-[var(--font-orbitron)] font-bold text-white mb-2">
        {t.contact.title1} <span className="neon-text">{t.contact.title2}</span>
      </h2>
      <p className="text-gray-400">{t.contact.desc}</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Panel - Contact Form */}
      <div className="tech-panel p-8 neon-border">
<form onSubmit={handleContactSubmit} className="space-y-6">
  <div className="grid grid-cols-1 gap-6">
    <div>
      <label className="block text-cyan-500 text-xs font-[var(--font-orbitron)] mb-2">{t.contact.name}</label>
      <input 
        type="text" 
        required 
        className="tech-input" 
        placeholder={t.contact.namePlaceholder}
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        disabled={formStatus === "loading"}
      />
    </div>
    <div>
      <label className="block text-cyan-500 text-xs font-[var(--font-orbitron)] mb-2">{t.contact.email}</label>
      <input 
        type="email" 
        required 
        className="tech-input" 
        placeholder={t.contact.emailPlaceholder}
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        disabled={formStatus === "loading"}
      />
    </div>
  </div>
  <div>
    <label className="block text-cyan-500 text-xs font-[var(--font-orbitron)] mb-2">{t.contact.message}</label>
    <textarea 
      required 
      className="tech-input h-32 resize-none" 
      placeholder={t.contact.messagePlaceholder}
      value={formData.message}
      onChange={(e) => setFormData({...formData, message: e.target.value})}
      disabled={formStatus === "loading"}
    ></textarea>
  </div>
  
  {/* Status Messages */}
			{formStatus !== "idle" && (
				<div className={`p-3 rounded border font-mono text-xs ${
				formStatus === "success" ? "bg-green-900/20 border-green-500/50 text-green-400" :
				formStatus === "error" ? "bg-red-900/20 border-red-500/50 text-red-400" :
				"bg-cyan-900/20 border-cyan-500/50 text-cyan-400"
				}`}>
				{formStatus === "loading" ? "> მონაცემები იგზავნება..." : `> ${formMessage}`}
				</div>
			)}
			
			<div className="flex justify-between items-center pt-4 border-t border-cyan-900/30 mt-4">
				<span className="text-xs text-gray-500 font-[var(--font-orbitron)] hidden sm:inline-block">
				{t.contact.encrypted}
				</span>
				<button 
				type="submit" 
				className={`btn-neon btn-solid w-full sm:w-auto px-10 py-3 ${formStatus === "loading" ? "opacity-50 cursor-not-allowed" : ""}`}
				disabled={formStatus === "loading"}
				>
				{formStatus === "loading" ? "იგზავნება..." : t.contact.btn}
    </button>
  </div>
</form>
      </div>

      {/* Right Panel - Contact Info & Socials */}
      <div className="tech-panel p-8 neon-border flex flex-col justify-between">
        <div>
          <div className="inline-block border border-cyan-500/50 bg-cyan-900/20 px-3 py-1 rounded text-cyan-400 font-[var(--font-orbitron)] text-xs mb-8 tracking-widest uppercase animate-pulse">
            {t.contact.infoTitle}
          </div>

          <div className="space-y-8">
            {/* Phone */}
            <div className="flex items-start gap-4 group">
              <div className="mt-1 p-3 bg-cyan-900/20 border border-cyan-500/30 rounded text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <div>
                <h4 className="font-[var(--font-orbitron)] text-gray-500 text-xs mb-1">{t.contact.phoneLabel}</h4>
                <p className="text-white text-xl tracking-wider font-bold">{t.contact.phoneValue}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 group">
              <div className="mt-1 p-3 bg-cyan-900/20 border border-cyan-500/30 rounded text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <h4 className="font-[var(--font-orbitron)] text-gray-500 text-xs mb-1">{t.contact.emailLabel}</h4>
                <p className="text-white text-xl tracking-wider font-bold">{t.contact.emailValue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-cyan-900/30">
          <h4 className="font-[var(--font-orbitron)] text-gray-500 text-xs mb-4">{t.contact.socialLabel}</h4>
          <div className="flex gap-4">
            {/* Facebook */}
            <a href="#" className="p-3 border border-cyan-900 text-gray-400 hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,243,255,0.5)] rounded transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" className="p-3 border border-cyan-900 text-gray-400 hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,243,255,0.5)] rounded transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="p-3 border border-cyan-900 text-gray-400 hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,243,255,0.5)] rounded transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
            </a>
            {/* YouTube */}
            <a href="#" className="p-3 border border-cyan-900 text-gray-400 hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,243,255,0.5)] rounded transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      </main>

      <footer className="border-t border-cyan-500/20 bg-[#02050a] py-8 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-[var(--font-orbitron)] text-xl text-white">
            italive<span className="text-cyan-400">.ge</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
          </div>
          <div className="text-gray-600 text-xs font-[var(--font-orbitron)]">
            &copy; 2026 ITALIVE.GE. ALL SYSTEMS ALIVE.
          </div>
        </div>
      </footer>
    </>
  );
}