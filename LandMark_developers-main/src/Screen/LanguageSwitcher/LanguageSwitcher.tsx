import React, { useCallback } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import "./LanguageSwitcher.css";

const LanguageSwitcher: React.FC = () => {
  const { t, changeLanguage, currentLang } = useTranslation();

  const handleSelectEn = useCallback(() => {
    changeLanguage("en");
  }, [changeLanguage]);

  const handleSelectHi = useCallback(() => {
    changeLanguage("hi");
  }, [changeLanguage]);

  return (
    <div className="language-switcher-container">
      <button
        onClick={handleSelectEn}
        className={`lang-btn ${currentLang === "en" ? "active" : ""}`}
      >
        {t("common.langEN")}
      </button>
      <button
        onClick={handleSelectHi}
        className={`lang-btn ${currentLang === "hi" ? "active" : ""}`}
      >
        {t("common.langHI")}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
