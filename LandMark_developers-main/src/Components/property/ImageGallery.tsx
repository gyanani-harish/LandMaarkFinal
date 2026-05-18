
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
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (propData) {
      setProperty(propData);
    }
  }, [propData]);

  const displayImages = property?.allImages?.length && property.allImages.length > 0 ? property.allImages : images;
  const videos = property?.video || [];

  // Combined media items: Images first, Video(s) LAST
  const mediaItems = [
    ...displayImages.map(imgUrl => ({ type: 'image', url: imgUrl })),
    ...videos.map(vUrl => ({ type: 'video', url: vUrl }))
  ];

  const handleImageClick = (index: number) => {
    if (mediaItems[index]?.type === 'video') {
      setCurrentImageIndex(index);
    } else {
      // Since images are first, the mediaItems index maps exactly to displayImages index!
      setModalStartIndex(index);
      setIsModalOpen(true);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareData = {
      title: property?.title || document.title,
      text: `Check out this amazing property: ${property?.title || 'LandMaark Property'}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Property link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const activeMedia = mediaItems[currentImageIndex] || mediaItems[0] || { type: 'image', url: '' };

  return (
    <>
      <div className="gallery-container">
        {/* Main large image or video */}
        <div 
          className="main-image-wrapper" 
          onClick={() => {
            if (activeMedia.type !== 'video') {
              handleImageClick(currentImageIndex);
            }
          }}
        >
          {activeMedia.type === 'video' ? (
            <video
              src={activeMedia.url}
              className="main-image"
              controls
              autoPlay
              muted
              playsInline
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <img
              src={activeMedia.url}
              alt="property"
              className="main-image"
            />
          )}

          {/* Desktop: "Cover Image" label top-left */}
          {!isMobile && (
            <div className="cover-image-label">
              {activeMedia.type === 'video' ? 'Video Tour' : 'Cover Image'}
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
              <button className="desktop-share-btn" onClick={handleShare}>
                <Share2 size={16} />
                SHARE
              </button>
              <button 
                className="desktop-save-btn" 
                onClick={handleSave}
                style={{ color: isSaved ? '#ef4444' : '#1a202c' }}
              >
                <Heart size={16} fill={isSaved ? '#ef4444' : 'none'} stroke={isSaved ? '#ef4444' : 'currentColor'} />
                {isSaved ? 'SAVED' : 'SAVE'}
              </button>
            </div>
          )}

          {/* Mobile: Circular action buttons */}
          {isMobile && (
            <div className="prop-gallery-actions-unique">
              <button className="prop-gallery-action-btn-unique" onClick={handleShare}>
                <Share2 size={32} strokeWidth={2.5} />
              </button>
              <button className="prop-gallery-action-btn-unique" onClick={handleSave}>
                <Heart 
                  size={32} 
                  strokeWidth={2.5} 
                  fill={isSaved ? '#ef4444' : 'none'} 
                  stroke={isSaved ? '#ef4444' : '#4a5568'} 
                />
              </button>
            </div>
          )}

          {/* Mobile: Tap to See All Images Overlay */}
          {isMobile && activeMedia.type !== 'video' && (
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
          <div 
            className="sidebar-img-container" 
            onClick={() => {
              if (videos.length > 0) {
                // If video is present, clicking the first sidebar container (Play icon overlay) plays the video!
                setCurrentImageIndex(mediaItems.length - 1);
              } else {
                handleImageClick(1);
              }
            }}
          >
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