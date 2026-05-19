import enTranslations from "../locales/en.json";

interface Translations {
  [key: string]: string | Translations;
}

export const useTranslation = () => {
  const t = (key: string): string => {
    const parts = key.split(".");
    let current: Translations | string = enTranslations as unknown as Translations;
    for (const part of parts) {
      if (current && typeof current === "object") {
        current = current[part];
      } else {
        return key;
      }
    }
    return typeof current === "string" ? current : key;
  };

  return { t };
};
