import React from "react";
import { Section7Type } from "../../store/HomePage/section7Card";
import "./Section7Card.css";

interface Props {
  item: Section7Type;
}

const Section7Card: React.FC<Props> = ({ item }) => {
  return (
    <div className="sec7-card">
      {/* Image */}
      <img
        src={item.image}
        alt={item.title}
        className="sec7-card-img"
      />

      {/* Gradient Overlay */}
      <div className="sec7-card-overlay"></div>



      {/* Bottom Content */}
      <div className="sec7-content">
        <h3 className="sec7-card-title">{item.title}</h3>
        <p className="sec7-card-subtitle">{item.subtitle}</p>
      </div>
    </div>
  );
};

export default Section7Card;
