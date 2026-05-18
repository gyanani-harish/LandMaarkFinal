import React from "react";
import "./sectionCard3.css";

interface SectionCardProps {
  title: string;
  description: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, description }) => {
  return (
    <div className="sec3-card">
      {/* Title */}
      <h3 className="sec3-card-title">
        {title}
      </h3>

      {/* Description */}
      <p className="sec3-card-desc">{description}</p>

      {/* Hover Glow Effect */} 
      <div className="sec3-card-glow"></div>
    </div>
  );
};

export default SectionCard;
