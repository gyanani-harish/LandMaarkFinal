
interface ImageGalleryProps {
  images: string[];
  propertyId: number;
  property: CityProperty;
}

import React, { useState } from 'react';
import { Heart, Share2, Check, Image as ImageIcon, Play } from 'lucide-react';
import ImageGalleryModal from '../../Components/ImageGalleryModal/ImageGalleryModal';
import { CityProperty } from '../../services/services';
import useIsMobile from '../../hooks/useIsMobile';

import './ImageGallery.css';

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, propertyId, property: propData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalStartIndex, setModalStartIndex] = useState<number>(0);
  const [property, setProperty] = useState<CityProperty | null>(propData || null);
  const isMobile = useIsMobile();

  const handleImageClick = (index: number) => {
    setModalStartIndex(index);
    setIsModalOpen(true);
  };

  const displayImages = property?.allImages?.length && property.allImages.length > 0 ? property.allImages : images;

  return (
    <>
      <div className="gallery-container">
        {/* Main large image */}
        <div className="main-image-wrapper" onClick={() => handleImageClick(currentImageIndex)}>
          <img
            src={displayImages[currentImageIndex]}
            alt="property"
            className="main-image"
          />

          {/* Desktop: "Cover Image" label top-left */}
          {!isMobile && (
            <div className="cover-image-label">
              Cover Image
            </div>
          )}

          {/* Mobile: RERA Badge top-left */}
          {isMobile && property?.rera_id && (
            <div className="rera-badge-capsule">
              <div className="rera-check-circle">
                <Check size={12} strokeWidth={4} />
              </div>
              <span className="rera-label">RERA</span>
            </div>
          )}

          {/* Desktop: Rectangular SHARE and SAVE buttons */}
          {!isMobile && (
            <div className="desktop-action-btns">
              <button className="desktop-share-btn" onClick={(e) => { e.stopPropagation(); }}>
                <Share2 size={16} />
                SHARE
              </button>
              <button className="desktop-save-btn" onClick={(e) => { e.stopPropagation(); }}>
                <Heart size={16} />
                SAVE
              </button>
            </div>
          )}

          {/* Mobile: Circular action buttons */}
          {isMobile && (
            <div className="prop-gallery-actions-unique">
              <button className="prop-gallery-action-btn-unique" onClick={(e) => { e.stopPropagation(); }}>
                <Share2 size={32} strokeWidth={2.5} />
              </button>
              <button className="prop-gallery-action-btn-unique" onClick={(e) => { e.stopPropagation(); }}>
                <Heart size={32} strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* Mobile: Tap to See All Images Overlay */}
          {isMobile && (
            <div className="tap-overlay">
              <span>Tap to see all images</span>
            </div>
          )}

          {/* Image Count Badge */}
          <div className="image-count-badge">
            <ImageIcon size={14} />
            <span>{displayImages.length}</span>
          </div>
        </div>

        {/* Sidebar images - Desktop Only */}
        <div className="sidebar-images-desktop">
          <div className="sidebar-img-container" onClick={() => handleImageClick(1)}>
            <img
              src={displayImages[1] || displayImages[0]}
              alt="Side"
              className="sidebar-img-wrapper"
            />
            <div className="play-overlay">
              <Play size={32} fill="white" />
            </div>
          </div>

          <div className="view-more-wrapper" onClick={() => handleImageClick(2)}>
            <img
              src={displayImages[2] || displayImages[0]}
              alt="Side"
              className="view-more-img"
            />
            <div className="view-more-overlay">
              <span className="view-more-text">
                +{displayImages.length > 3 ? `${displayImages.length - 2} more` : 'View More'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {property && (
        <ImageGalleryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          property={property}
          initialImageIndex={modalStartIndex}
        />
      )}
    </>
  );
};

export default ImageGallery;