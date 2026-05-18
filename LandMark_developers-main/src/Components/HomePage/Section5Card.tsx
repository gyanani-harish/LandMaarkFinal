import React from "react";
import { MapPin, Hand } from "lucide-react";
import { Cards } from "../../store/HomePage/Section5Card";
import "./Section5Card.css";

interface PropertyCardProps {
  property: Cards;
}

const Section5Card: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="section5-card">
      <img
        src={property.image}
        alt={property.title}
        className="section5-card-img"
      />

      <div className="section5-card-content">
        <h3 className="section5-card-title">
          {property.title}
        </h3>

        <div className="section5-card-location">
          <MapPin size={16} />
          <span>{property.location}</span>
        </div>

        <p className="section5-card-price">{property.price}</p>

        <div className="section5-card-footer">
          <button className="section5-card-btn">
            <Hand size={16} />
            ENQUIRE NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default Section5Card;
