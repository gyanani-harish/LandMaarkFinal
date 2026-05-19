import React from "react";
import Section9Card from "../../../Components/HomePage/section9Card";
import { Section9Type as Section9Item } from "../../../store/HomePage/section9Card";

interface InvestSectionProps {
  section9: {
    title: string;
    items: Section9Item[];
  };
}

export const InvestSection: React.FC<InvestSectionProps> = ({
  section9,
}) => {
  const title = section9.title || "";
  const items = section9.items || [];

  return (
    <section className="home-section-9">
      <div className="section-9-inner">
        <div className="section-9-title">{title}</div>

        <div className="section-9-grid">
          {items.map((item) => (
            <Section9Card key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
