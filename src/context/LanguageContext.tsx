"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { translations } from "@/app/translations";

type Language = "en" | "ka";
type Translations = typeof translations.en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // საწყის ენად ვაყენებთ ქართულს ("ka"), რომ Google-მა ქართული კონტენტი დააინდექსოს
  const [lang, setLang] = useState<Language>("ka");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as Language;
    if (savedLang === "en" || savedLang === "ka") {
      setLang(savedLang);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};