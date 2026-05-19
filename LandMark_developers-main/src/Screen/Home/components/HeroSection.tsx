import React, { useCallback } from "react";
import { HeroSlide } from "../../../services/HomeService";
import useCarousel from "../../../hooks/useCarousel";
import AIPrompt from "../../AIPrompt/AIPrompt";
import { useTranslation } from "../../../hooks/useTranslation";

interface HeroSectionProps {
  hero: {
    title: string;
    slides: HeroSlide[];
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
  const { t } = useTranslation();
  const slides = hero.slides || [];
  const heroIndex = useCarousel(slides.length, 6000);

  const handleEnquireScroll = useCallback(() => {
    document
      .getElementById("enquiry-form")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section className="hero-desktop">
      <div className="hero-image-wrapper">
        {slides.map((slide, idx) => (
          <img
            key={slide.id || idx}
            src={slide.image}
            alt={slide.title}
            className={`hero-bg-img ${idx === heroIndex ? "active" : ""}`}
            loading="lazy"
          />
        ))}
        <div className="hero-overlay" />
      </div>

      <div className="hero-brand-top" />

      <div className="hero-content-wrapper">
        <div className="hero-text-container">
          <h1 className="hero-title">
            {slides[heroIndex]?.title || t("home.defaultHeroTitle")}
          </h1>

          <h1 className="hero-title">
            {slides[heroIndex]?.titleHighlight || t("home.defaultHeroTitleHighlight")}
          </h1>

          <p className="hero-subtitle">
            {slides[heroIndex]?.subtitle || t("home.defaultHeroSubtitle")}
          </p>

          <div className="hero-btn-container">
            <button onClick={handleEnquireScroll} className="rounded-btn">
              {t("home.enquireNow")}
            </button>
          </div>
        </div>

        <AIPrompt />
      </div>
    </section>
  );
};
