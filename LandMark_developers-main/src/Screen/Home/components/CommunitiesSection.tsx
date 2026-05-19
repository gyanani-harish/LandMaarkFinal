import React from "react";
import Section8Card from "../../../Components/HomePage/Section8Card";
import { Section8Type as Section8Item } from "../../../store/HomePage/section8Card";
import { useTranslation } from "../../../hooks/useTranslation";

interface CommunitiesSectionProps {
  section8: {
    title: string;
    subtitle: string;
    videoUrl: string;
    items: Section8Item[];
  };
}

export const CommunitiesSection: React.FC<CommunitiesSectionProps> = ({
  section8,
}) => {
  const { t } = useTranslation();
  const title = section8.title || "";
  const subtitle = section8.subtitle || "";
  const videoUrl = section8.videoUrl || "";
  const items = section8.items || [];

  return (
    <section className="home-section-8">
      <div className="section-8-inner">
        <div className="section-8-title">{title}</div>
        <p className="section-8-subtitle">{subtitle}</p>

        <div className="section-8-grid-wrapper">
          <div className="section-8-cards-grid">
            {items.map((item) => (
              <Section8Card key={item.id} item={item} />
            ))}
          </div>

          <div className="section-8-video-wrapper">
            <iframe
              src={videoUrl}
              title={t("home.videoTitle")}
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};
