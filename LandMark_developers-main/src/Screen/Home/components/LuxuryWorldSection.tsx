import React from "react";
import Section6Card from "../../../Components/HomePage/Section6Card";
import { Section6Type as Section6Item } from "../../../store/HomePage/Section6Card";
import useCarousel from "../../../hooks/useCarousel";

interface LuxuryWorldSectionProps {
  section6: {
    title: string;
    subtitle: string;
    items: Section6Item[];
  };
}

export const LuxuryWorldSection: React.FC<LuxuryWorldSectionProps> = ({
  section6,
}) => {
  const title = section6.title || "";
  const subtitle = section6.subtitle || "";
  const items = section6.items || [];
  const currentIndex = useCarousel(items.length, 5000);

  return (
    <section className="home-section-6">
      <div className="section-6-inner">
        <div className="section-6-title">{title}</div>
        <p className="section-6-subtitle">{subtitle}</p>

        <div className="section-6-carousel-container">
          {items.map((item, index) => (
            <Section6Card
              key={item.id}
              item={item}
              isActive={index === currentIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
