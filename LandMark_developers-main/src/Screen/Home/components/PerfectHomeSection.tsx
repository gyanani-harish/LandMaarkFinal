import React from "react";
import Section3Card from "../../../Components/HomePage/Section2Card";
import { Section3Item } from "../../../store/HomePage/Section3";
import { useTranslation } from "../../../hooks/useTranslation";

interface PerfectHomeSectionProps {
  section3: {
    title: string;
    items: Section3Item[];
  };
}

export const PerfectHomeSection: React.FC<PerfectHomeSectionProps> = ({
  section3,
}) => {
  const { t } = useTranslation();
  const title = section3.title || "";
  const items = section3.items || [];

  return (
    <section className="home-section-2">
      <div className="section-2-title">{title}</div>

      <div className="section-2-grid">
        {items.map((item) => (
          <Section3Card
            key={item.id}
            id={item.id}
            image={item.image}
            title={item.title}
            price={item.price}
          />
        ))}
      </div>

      <div className="section-2-btn-wrapper">
        <button className="rounded-btn section-2-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M6.5 2a.5.5 0 0 1 .5.5V6h1V3.5a.5.5 0 0 1 1 0V6h1V4.5a.5.5 0 0 1 1 0V6h.5a2 2 0 0 1 2 2v1.5c0 2.5-2 4.5-4.5 4.5S4 12 4 9.5V6.5a.5.5 0 0 1 1 0V9a1 1 0 0 0 2 0V2.5a.5.5 0 0 1 .5-.5z" />
          </svg>
          {t("home.viewMore")}
        </button>
      </div>
    </section>
  );
};
