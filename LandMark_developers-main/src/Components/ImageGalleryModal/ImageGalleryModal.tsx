// src/components/ImageGalleryModal/ImageGalleryModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import './ImageGalleryModal.css';

import { CityProperty } from '../../services/services';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: CityProperty;
  initialImageIndex?: number;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ isOpen, onClose, property, initialImageIndex = 0 }) => {
  const [mediaItems, setMediaItems] = useState<Array<{ type: 'image' | 'video'; url: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(initialImageIndex);
  const [loading, setLoading] = useState<boolean>(true);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    if (isOpen && property) {
      loadImages();
    }
  }, [isOpen, property]);

  const loadImages = () => {
    setLoading(true);
    try {
      let propertyImages: string[] = [];
      if (property.allImages && property.allImages.length > 0) {
        propertyImages = property.allImages;
      } else if (property.images && property.images.length > 0) {
        propertyImages = property.images;
      } else if (property.image) {
        propertyImages = [property.image];
      }
      
      if (!propertyImages || propertyImages.length === 0) {
        propertyImages = ['https://via.placeholder.com/800x600?text=No+Images+Available'];
      }

      const videos = property.video || [];
      const items = [
        ...propertyImages.map(url => ({ type: 'image' as const, url })),
        ...videos.map(url => ({ type: 'video' as const, url }))
      ];
      
      setMediaItems(items);
      const validIndex = Math.min(initialImageIndex, items.length - 1);
      setCurrentIndex(validIndex >= 0 ? validIndex : 0);
    } catch (err) {
      console.error('Error loading images:', err);
      setMediaItems([{ type: 'image', url: 'https://via.placeholder.com/800x600?text=Error+Loading+Images' }]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (mediaItems.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    if (mediaItems.length === 0) return;
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
    if (e.key === 'z' || e.key === 'Z') toggleZoom();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const swipeDistance = touchEndX.current - touchStartX.current;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('gallery-modal-open');
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      document.body.classList.remove('gallery-modal-open');
    };
  }, [isOpen, mediaItems.length]);

  const toggleZoom = () => {
    if (mediaItems[currentIndex]?.type === 'video') return; // Disable zoom on video slides
    setIsZoomed(!isZoomed);
    setZoomPosition({ x: 0, y: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isZoomed || !imageRef.current) return;
    const img = imageRef.current.querySelector('img');
    if (!img) return;
    const { left, top, width, height } = img.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x: Math.min(Math.max(x, 0), 100), y: Math.min(Math.max(y, 0), 100) });
  };

  if (!isOpen) return null;

  const currentMedia = mediaItems[currentIndex] || { type: 'image', url: '' };

  return (
    <div className="gallery-overlay">
      <div className="gallery-container">
        {/* Close button */}
        <button
          onClick={onClose}
          className="gallery-close-btn"
          aria-label="Close gallery"
        >
          <X size={24} />
        </button>

        {/* Counter */}
        {!loading && mediaItems.length > 0 && (
          <div className="gallery-counter">
            <span>{currentIndex + 1} / {mediaItems.length}</span>
          </div>
        )}

        {/* Main content - Carousel */}
        <div 
          className="gallery-main-viewport"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseMove={handleMouseMove}
        >
          {loading ? (
            <div className="gallery-loading">
              <div className="gallery-spinner"></div>
              <p>Loading gallery...</p>
            </div>
          ) : mediaItems.length > 0 ? (
            <div className="gallery-image-wrapper">
              <div 
                ref={imageRef}
                className={`gallery-image-container ${currentMedia.type === 'video' ? 'cursor-default' : (isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in')}`}
                onClick={toggleZoom}
              >
                {currentMedia.type === 'video' ? (
                  <video
                    src={currentMedia.url}
                    className="gallery-main-image"
                    controls
                    autoPlay
                    muted
                    playsInline
                    style={{ objectFit: 'contain', maxHeight: '80vh', width: '100%' }}
                  />
                ) : (
                  <img
                    src={currentMedia.url}
                    alt={property?.title || `Property image ${currentIndex + 1}`}
                    className="gallery-main-image"
                    style={{
                      transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                      transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://via.placeholder.com/800x600?text=Image+Load+Error';
                    }}
                  />
                )}
              </div>
              
              {/* Navigation arrows */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="gallery-nav-btn prev"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="gallery-nav-btn next"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="gallery-loading">
              <p>No media available</p>
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {!loading && mediaItems.length > 1 && (
          <div className="thumbnail-strip-container">
            <div className="thumbnail-strip">
              {mediaItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsZoomed(false);
                  }}
                  className={`thumbnail-btn ${idx === currentIndex ? 'active' : ''}`}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{ position: 'relative' }}
                >
                  {item.type === 'video' ? (
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                      <img
                        src={property.allImages?.[0] || property.image || 'https://via.placeholder.com/64x64?text=Video'}
                        alt="Video Thumbnail"
                        className="thumbnail-img"
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        borderRadius: '4px'
                      }}>
                        <Play size={16} fill="#ffffff" strokeWidth={2} />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="thumbnail-img"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://via.placeholder.com/64x64?text=Error';
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGalleryModal;