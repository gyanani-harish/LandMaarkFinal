import React from "react";
import { Section6Type } from "../../store/HomePage/Section6Card";
import "./Section6Card.css";

interface Props {
  item: Section6Type;
  isActive: boolean;
}

const Section6Card: React.FC<Props> = ({ item, isActive }) => {
  return (
    <div className={`sec6-card-slide ${isActive ? "active" : ""}`}>
      {/* Wrapper must be relative */}
      <div className="sec6-image-wrapper">
        {/* Image */}
        <img
          src={item.image}
          alt={item.title}
          className="sec6-card-img"
        />

        {/* Dark Overlay */}
        <div className="sec6-card-overlay"></div>

        {/* Text Content */}
        <div className="sec6-text-container">
          <h3 className="sec6-card-title">
            {item.title}
          </h3>

          <p className="sec6-card-subtitle">
            {item.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Section6Card;
