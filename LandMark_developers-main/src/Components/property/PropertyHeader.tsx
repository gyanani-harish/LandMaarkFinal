import React from 'react';
import { 
  Phone,
  Check
} from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';
import './PropertyHeader.css';

interface PropertyHeaderProps {
  property: {
    name?: string;
    builder?: string;
    location?: string;
    type?: string;
    area?: string;
    rating?: number;
    bhk?: string;
    possession?: string;
    rera_id?: string;
    price?: {
      min?: number;
      max?: number;
      perSqft?: number;
      emi?: number;
    };
  };
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property }) => {  
  const propertyName = property?.name || 'Property';
  const builder = property?.builder || '';
  const location = property?.location || 'Location not specified';
  const propertyType = property?.type || '';
  const reraId = property?.rera_id || '';
  
  const priceMin = property?.price?.min || 0;
  const priceMax = property?.price?.max || 0;
  const pricePerSqft = property?.price?.perSqft || 0;
  const emi = property?.price?.emi || 0;
  const isMobile = useIsMobile();

  const formatPrice = (price: number) => {
    if (price === 0) return '';
    if (price >= 10000) {
      if (price >= 10000000) {
        return `₹${(price / 10000000).toFixed(2)} Cr`;
      } else if (price >= 100000) {
        return `₹${(price / 100000).toFixed(2)} L`;
      }
      return `₹${price.toLocaleString()}`;
    }
    return `₹${price.toLocaleString()} L`;
  };

  const priceDisplay = () => {
    if (priceMin === 0 && priceMax === 0) return 'Contact for Price';
    if (priceMin === priceMax || priceMax === 0) return formatPrice(priceMin);
    return `${formatPrice(priceMin)} - ${formatPrice(priceMax)}`;
  };

  return (
    <div className="ph-container">
      {/* Left Section */}
      <div className="ph-left">
        <div className="ph-title-row">
          <h1 className="ph-title">{propertyName}</h1>
          {reraId && (
            <span className="ph-rera-inline">
              <Check size={12} strokeWidth={3} className="ph-rera-check" />
              RERA
            </span>
          )}
        </div>

        {builder && builder.toLowerCase() !== 'developer' && (
          <p className="ph-builder">By <span className="ph-builder-link">{builder.toUpperCase()}</span></p>
        )}

        <p className="ph-location">{location}</p>
      </div>

      {/* Right Section */}
      <div className="ph-right">
        <p className="ph-price">{priceDisplay()}</p>
        
        {emi > 0 && (
          <p className="ph-emi">EMI starts at ₹{emi.toLocaleString()} K</p>
        )}

        <p className="ph-price-type">Basic Price</p>

        <button
          className="ph-contact-btn"
          onClick={() => console.log("Contact clicked")}
        >
          <Phone size={16} />
          Contact Developer
        </button>
      </div>
    </div>
  );
};

export default PropertyHeader;