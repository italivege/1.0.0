"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function SignUp() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // აქ მოგვიანებით დავამატებთ რეალურ რეგისტრაციას (ბაზაში შენახვას)
    setTimeout(() => {
      setStatus("idle");
      alert("Registration Demo: Backend not connected yet.");
    }, 1500);
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-out_forwards] w-full pt-10 pb-20 flex items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-[var(--font-orbitron)] font-bold text-white mb-2">
            {t.auth.signupTitle1} <br/> <span className="neon-text">{t.auth.signupTitle2}</span>
          </h2>
          <p className="text-gray-400">{t.auth.signupDesc}</p>
        </div>

        <div className="tech-panel p-8 neon-border relative overflow-hidden">
          <form onSubmit={handleSignup} className="space-y-6 relative z-10">
            <div>
              <label className="block text-cyan-500 text-xs font-[var(--font-orbitron)] mb-2">
                <svg className="w-4 h-4 inline-block mr-1 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                {t.auth.name}
              </label>
              <input 
                type="text" 
                required 
                className="tech-input focus:bg-cyan-900/10" 
                placeholder={t.auth.namePlaceholder}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={status === "loading"}
              />
            </div>

            <div>
              <label className="block text-cyan-500 text-xs font-[var(--font-orbitron)] mb-2">
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
              {status === "loading" ? "> INITIALIZING..." : t.auth.btnSignup}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 font-[var(--font-orbitron)] text-sm">
          <span className="text-gray-500">{t.auth.hasAccount}</span>{" "}
          <Link href="/login" className="text-cyan-400 hover:text-white transition-colors underline decoration-cyan-500/30 underline-offset-4">
            {t.auth.loginLink}
          </Link>
        </div>
      </div>
    </div>
  );
}