// src/components/ImageGalleryModal/ImageGalleryModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Heart, Share2, Maximize2, Minimize2 } from 'lucide-react';

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
      console.log('Loading images for property:', property);
      
      // Get images from property object
      let propertyImages: string[] = [];
      
      // Check if property has allImages array (from our updated API)
      if (property.allImages && property.allImages.length > 0) {
        propertyImages = property.allImages;
      } 
      // Check if property has images array
      else if (property.images && property.images.length > 0) {
        propertyImages = property.images;
      }
      // Check if property has single image
      else if (property.image) {
        propertyImages = [property.image];
      }
      
      console.log('Loaded images:', propertyImages);
      
      if (!propertyImages || propertyImages.length === 0) {
        // If no images found, use placeholder
        propertyImages = ['https://via.placeholder.com/800x600?text=No+Images+Available'];
      }
      
      setImages(propertyImages);
      
      // Ensure initial index is within bounds
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

  const handleDownload = async () => {
    if (!images[currentIndex]) return;
    
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `property-image-${property?.id || 'unknown'}-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image:', err);
      window.open(images[currentIndex], '_blank');
    }
  };

  const handleShare = async () => {
    if (!images[currentIndex]) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: property?.title || 'Property Image',
          text: `Check out this beautiful property image`,
          url: images[currentIndex],
        });
      } else {
        await navigator.clipboard.writeText(images[currentIndex]);
        alert('Image URL copied to clipboard!');
      }
    } catch (err) {
      console.error('Failed to share:', err);
      try {
        await navigator.clipboard.writeText(images[currentIndex]);
        alert('Image URL copied to clipboard!');
      } catch (clipboardErr) {
        alert('Unable to share or copy URL');
      }
    }
  };

  const handleFavorite = () => {
    console.log('Added to favorites:', property?.id, images[currentIndex]);
    alert('Added to favorites!');
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-7xl mx-auto p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-200 hover:scale-110"
          aria-label="Close gallery"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image counter */}
        {!loading && images.length > 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm">
            <span>{currentIndex + 1} / {images.length}</span>
          </div>
        )}

        {/* Main content - Carousel */}
        <div 
          className="relative w-full h-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseMove={handleMouseMove}
        >
          {loading ? (
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading images...</p>
            </div>
          ) : images.length > 0 ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <div 
                ref={imageRef}
                className={`relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onClick={toggleZoom}
              >
                <img
                  src={images[currentIndex]}
                  alt={property?.title || `Property image ${currentIndex + 1}`}
                  className={`max-w-full max-h-full object-contain transition-all duration-300 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                  }`}
                  style={{
                    transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center'
                  }}
                  onError={(e) => {
                    console.error('Image failed to load:', images[currentIndex]);
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
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-200 hover:scale-110 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-200 hover:scale-110 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-white text-center">
              <p>No images available</p>
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {!loading && images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 z-20">
            <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-2 scrollbar-thin scrollbar-thumb-white/20">
              {images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsZoomed(false);
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                    idx === currentIndex 
                      ? 'ring-2 ring-blue-500 scale-105 shadow-lg' 
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
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