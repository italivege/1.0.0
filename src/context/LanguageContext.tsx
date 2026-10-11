"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { translations } from "@/app/translations";

type Language = "en" | "ka";
// ვიღებთ ინგლისური ობიექტის ტიპს, რომ TypeScript-მა ავტომატურად ამოიცნოს სიტყვები
type Translations = typeof translations.en; 

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>("en");

  // (სურვილისამებრ) აქ შეგიძლია ენა localStorage-შიც შეინახო, რომ დარეფრეშებისას არ დაიკარგოს
  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as Language;
    if (savedLang) setLang(savedLang);
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