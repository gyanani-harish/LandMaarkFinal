// src/components/ImageGalleryModal/ImageGalleryModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './ImageGalleryModal.css';

import { CityProperty } from '../../services/services';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: CityProperty;
  initialImageIndex?: number;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ isOpen, onClose, property, initialImageIndex = 0 }) => {
  const [images, setImages] = useState<string[]>([]);
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
      setImages(propertyImages);
      const validIndex = Math.min(initialImageIndex, propertyImages.length - 1);
      setCurrentIndex(validIndex >= 0 ? validIndex : 0);
    } catch (err) {
      console.error('Error loading images:', err);
      setImages(['https://via.placeholder.com/800x600?text=Error+Loading+Images']);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, images.length]);

  const toggleZoom = () => {
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

        {/* Image counter */}
        {!loading && images.length > 0 && (
          <div className="gallery-counter">
            <span>{currentIndex + 1} / {images.length}</span>
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
              <p>Loading images...</p>
            </div>
          ) : images.length > 0 ? (
            <div className="gallery-image-wrapper">
              <div 
                ref={imageRef}
                className={`gallery-image-container ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onClick={toggleZoom}
              >
                <img
                  src={images[currentIndex]}
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
              </div>
              
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="gallery-nav-btn prev"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="gallery-nav-btn next"
                    aria-label="Next image"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="gallery-loading">
              <p>No images available</p>
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {!loading && images.length > 1 && (
          <div className="thumbnail-strip-container">
            <div className="thumbnail-strip">
              {images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsZoomed(false);
                  }}
                  className={`thumbnail-btn ${idx === currentIndex ? 'active' : ''}`}
                  aria-label={`Go to image ${idx + 1}`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${idx + 1}`}
                    className="thumbnail-img"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://via.placeholder.com/64x64?text=Error';
                    }}
                  />
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