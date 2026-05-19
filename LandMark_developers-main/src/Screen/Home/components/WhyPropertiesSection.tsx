import React from "react";
import SectionCard from "../../../Components/HomePage/sectionCard3";
import { SectionItem } from "../../../store/HomePage/section";

interface WhyPropertiesSectionProps {
  section: {
    title: string;
    subtitle: string;
    items: SectionItem[];
  };
}

export const WhyPropertiesSection: React.FC<WhyPropertiesSectionProps> = ({
  section,
}) => {
  const title = section.title || "";
  const subtitle = section.subtitle || "";
  const items = section.items || [];

  return (
    <section className="home-section-3">
      <div className="section-3-inner">
        <div className="section-3-header">
          <div className="section-3-title">{title}</div>
          <p className="section-3-subtitle">{subtitle}</p>
        </div>

        <div className="section-3-grid">
          {items.map((item, index) => (
            <SectionCard
              key={index}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
