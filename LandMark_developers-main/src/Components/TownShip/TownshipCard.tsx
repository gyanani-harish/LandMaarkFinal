import React, { useState, useEffect } from "react";
import { Township } from "../../store/TownShip/townshipsData";
import { Share2, ChevronLeft, ChevronRight } from "lucide-react";
import "./TownShip.css";

interface TownshipCardProps {
  item: Township;
  onSelect: (item: Township) => void;
}

const TownshipCard: React.FC<TownshipCardProps> = ({ item, onSelect }) => {
  const cityName = item.name || 'Unknown';
  const propertiesCount = (item as any).property_count || item.properties?.length || 0;
  const description = item.description || '';

  // Extract images array from API response parameters
  const imagesList = Array.isArray(item.images) && item.images.length > 0
    ? item.images
    : item.image
      ? [item.image]
      : ["https://images.unsplash.com/photo-1568605114967-8130f3a36994"];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto scroll images every 3 seconds if there are multiple images
  useEffect(() => {
    if (imagesList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [imagesList.length]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imagesList.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imagesList.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/property/${item.township_id}`;
    const firstImageUrl = imagesList[0] || '';
    const shareText = `Hi there, 👋 \nCheck out this beautiful property which I have found on Housing. Could you take a quick look and connect if interested?: ${cityName}\nLink: ${shareUrl}\nPreview Image: ${firstImageUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: cityName,
        text: shareText,
        url: shareUrl,
      }).catch((err) => console.log("Share failed:", err));
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div onClick={() => onSelect(item)} className="township-card">
      {/* Auto-scrolling Image Carousel */}
      <div className="township-card-img-wrapper">
        <div 
          className="township-card-slider"
          style={{
            width: `${imagesList.length * 100}%`,
            transform: `translateX(-${(currentImageIndex * 100) / imagesList.length}%)`,
            transition: "transform 0.5s ease-in-out"
          }}
        >
          {imagesList.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`${cityName} slide ${index + 1}`}
              className="township-card-img"
              style={{ width: `${100 / imagesList.length}%` }}
            />
          ))}
        </div>

        {/* Carousel Navigation Arrows - Fades in on Card Hover */}
        {imagesList.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="township-card-arrow left"
              title="Previous Image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextImage}
              className="township-card-arrow right"
              title="Next Image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Story-style Segmented Progress Line indicators in top-left */}
        {imagesList.length > 1 && (
          <div className="township-card-lines">
            {imagesList.map((_, idx) => (
              <span
                key={idx}
                className={`township-card-line ${idx === currentImageIndex ? "active" : ""}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* City Info */}
      <div className="township-card-info">
        <div className="township-card-text">
          <h3 className="township-card-title" title={cityName}>
            {cityName}
          </h3>
          {(item.location || item.city) && (
            <p className="township-card-location" title={`${item.location || ""}${item.location && item.city ? ", " : ""}${item.city || ""}`}>
              {item.location}{item.location && item.city ? ", " : ""}{item.city}
            </p>
          )}
        </div>

        <div className="township-card-actions">
          <button
            onClick={handleShare}
            className="township-card-info-share-btn"
            title="Share Township"
          >
            <Share2 size={16} />
          </button>
          <span className="township-card-badge">
            {propertiesCount} {propertiesCount === 1 ? "Property" : "Properties"}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="township-card-desc">
        {description}
      </p> 
    </div>
  );
};

export default TownshipCard;
