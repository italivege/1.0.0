"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function Login() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // აქ მოგვიანებით დავამატებთ რეალურ ავტორიზაციას (მაგ: NextAuth)
    setTimeout(() => {
      setStatus("idle");
      alert("Auth Demo: Backend not connected yet.");
    }, 1500);
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-out_forwards] w-full pt-10 pb-20 flex items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-[var(--font-orbitron)] font-bold text-white mb-2">
            {t.auth.loginTitle1} <span className="neon-text">{t.auth.loginTitle2}</span>
          </h2>
          <p className="text-gray-400">{t.auth.loginDesc}</p>
        </div>

        <div className="tech-panel p-8 neon-border relative overflow-hidden group">
          {/* Scanning line effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent w-full h-full animate-[translateY_3s_ease-in-out_infinite] z-0 pointer-events-none" style={{ transform: 'translateY(-100%)' }}></div>
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-cyan-500 text-xs font-[var(--font-orbitron)] mb-2">
                <svg className="w-4 h-4 inline-block mr-1 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                {t.auth.email}
              </label>
              <input 
                type="email" 
                required 
                className="tech-input focus:bg-cyan-900/10" 
                placeholder={t.auth.emailPlaceholder}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={status === "loading"}
              />
            </div>
            
            <div>
              <label className="block text-cyan-500 text-xs font-[var(--font-orbitron)] mb-2">
                <svg className="w-4 h-4 inline-block mr-1 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                {t.auth.password}
              </label>
              <input 
                type="password" 
                required 
                className="tech-input focus:bg-cyan-900/10 tracking-widest" 
                placeholder={t.auth.passwordPlaceholder}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                disabled={status === "loading"}
              />
            </div>

            <button 
              type="submit" 
              className={`btn-neon btn-solid w-full py-4 mt-2 ${status === "loading" ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={status === "loading"}
            >
              {status === "loading" ? "> PROCESSING..." : t.auth.btnLogin}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 font-[var(--font-orbitron)] text-sm">
          <span className="text-gray-500">{t.auth.noAccount}</span>{" "}
          <Link href="/signup" className="text-cyan-400 hover:text-white transition-colors underline decoration-cyan-500/30 underline-offset-4">
            {t.auth.registerLink}
          </Link>
        </div>
      </div>
    </div>
  );
}