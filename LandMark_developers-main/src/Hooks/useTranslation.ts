import { useState, useEffect } from "react";
import enTranslations from "../locales/en.json";
import hiTranslations from "../locales/hi.json";

interface Translations {
  [key: string]: string | Translations;
}

const translations: Record<string, Translations> = {
  en: enTranslations as unknown as Translations,
  hi: hiTranslations as unknown as Translations,
};

export const useTranslation = () => {
  const [currentLang, setCurrentLang] = useState<string>(() => {
    return localStorage.getItem("lang") || "en";
  });

  useEffect(() => {
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setCurrentLang(customEvent.detail);
      }
    };

    window.addEventListener("languagechange-custom", handleLanguageChange);
    return () => {
      window.removeEventListener("languagechange-custom", handleLanguageChange);
    };
  }, []);

  const changeLanguage = (lang: string) => {
    localStorage.setItem("lang", lang);
    const event = new CustomEvent("languagechange-custom", { detail: lang });
    window.dispatchEvent(event);
  };

  const t = (key: string): string => {
    const parts = key.split(".");
    let current: string | Translations = translations[currentLang] || translations["en"];
    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return key;
      }
    }
    return typeof current === "string" ? current : key;
  };

  return { t, changeLanguage, currentLang };
};
