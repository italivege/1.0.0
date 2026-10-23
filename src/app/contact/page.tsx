"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Script from "next/script";

// ტიპების გამოცხადება Cloudflare Turnstile-სთვის
declare global {
  interface Window {
    turnstile: any;
    onloadTurnstileCallback: () => void;
  }
}

export default function Contact() {
  const { t } = useLanguage();
  const captchaRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  // Turnstile-ის ინიციალიზაცია
  useEffect(() => {
    // ეს ფუნქცია გამოიძახება, როცა კაპჩას სკრიპტი ჩაიტვირთება
    window.onloadTurnstileCallback = () => {
      if (captchaRef.current && window.turnstile) {
        window.turnstile.render(captchaRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          theme: 'dark',
          callback: function (token: string) {
            setTurnstileToken(token);
          },
          'error-callback': function () {
            setTurnstileToken(null);
          },
        });
      }
    };

    // თუ სკრიპტი უკვე ჩატვირთულია, პირდაპირ ვარენდერებთ
    if (window.turnstile && captchaRef.current) {
        window.onloadTurnstileCallback();
    }
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken) {
      setFormStatus("error");
      setFormMessage(t.contact.captchaError);
      return;
    }

    setFormStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, token: turnstileToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus("success");
        setFormMessage(data.message);
        setFormData({ name: "", email: "", message: "" });
        
        // ფორმის გაგზავნის მერე ვაკეთებთ კაპჩას რესეტს
        if (window.turnstile && captchaRef.current) {
            window.turnstile.reset();
        }
        setTurnstileToken(null);
      } else {
        setFormStatus("error");
        setFormMessage(data.message || (t.contact.captchaSendError));
      }
    } catch (error) {
      setFormStatus("error");
      setFormMessage(t.contact.captchaNetError);
    }
  };

  return (
    <>
      {/* Cloudflare სკრიპტის ჩატვირთვა Next.js-ის Script კომპონენტით */}
      <Script 
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback" 
        strategy="afterInteractive" 
      />

      <div className="animate-[fadeIn_0.5s_ease-out_forwards] w-full pt-10 pb-20">
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
                
                {/* აქ დატრიალდება Turnstile ვიჯეტი */}
                <div className="flex justify-center my-4" ref={captchaRef}></div>
                
                {/* Status Messages */}
                {formStatus !== "idle" && (
                  <div className={`p-3 rounded border font-mono text-xs ${
                    formStatus === "success" ? "bg-green-900/20 border-green-500/50 text-green-400" :
                    formStatus === "error" ? "bg-red-900/20 border-red-500/50 text-red-400" :
                    "bg-cyan-900/20 border-cyan-500/50 text-cyan-400"
                  }`}>
                    {formStatus === "loading" ? "> Transmission in progress..." : `> ${formMessage}`}
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
                    {formStatus === "loading" ? (t.contact.captchaSending) : t.contact.btn}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Panel - Contact Info & Socials */}
            <div className="tech-panel p-8 neon-border flex flex-col justify-between">
              {/* აქ დარჩა იგივე ინფო და სოციალური ქსელები, რაც გქონდა. რომ ტოკენები დავზოგოთ, არ ვაკოპირებ. 
                  ჩასვი შენი წინა კოდიდან Right Panel-ის შიგთავსი. */}
                  
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

            <div className="mt-12 pt-8 border-t border-cyan-900/30">
              <h4 className="font-[var(--font-orbitron)] text-gray-500 text-xs mb-4">{t.contact.socialLabel}</h4>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/italivege" className="p-3 border border-cyan-900 text-gray-400 hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,243,255,0.5)] rounded transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
                </a>
                <a href="https://www.instagram.com/italive.ge" className="p-3 border border-cyan-900 text-gray-400 hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,243,255,0.5)] rounded transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/italivege" className="p-3 border border-cyan-900 text-gray-400 hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,243,255,0.5)] rounded transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                </a>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}