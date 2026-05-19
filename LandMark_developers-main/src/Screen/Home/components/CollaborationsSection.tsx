import React from "react";
import Section7Card from "../../../Components/HomePage/Section7Card";
import { Section7Type as Section7Item } from "../../../store/HomePage/section7Card";

interface CollaborationsSectionProps {
  section7: {
    title: string;
    subtitle: string;
    items: Section7Item[];
  };
}

export const CollaborationsSection: React.FC<CollaborationsSectionProps> = ({
  section7,
}) => {
  const title = section7.title || "";
  const subtitle = section7.subtitle || "";
  const items = section7.items || [];

  return (
    <section className="home-section-7">
      <div className="section-7-inner">
        <div className="section-7-title">{title}</div>
        <p className="section-7-subtitle">{subtitle}</p>
        <div className="section-7-grid">
          {items.map((item) => (
            <Section7Card key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
