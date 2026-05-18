import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Share2, Check, Image as ImageIcon, Play, ArrowLeft } from 'lucide-react';
import ImageGalleryModal from '../../Components/ImageGalleryModal/ImageGalleryModal';
import { CityProperty } from '../../services/services';
import useIsMobile from '../../hooks/useIsMobile';

import './ImageGallery.css';

interface ImageGalleryProps {
  images: string[];
  propertyId: number;
  property: CityProperty;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, propertyId, property: propData }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalStartIndex, setModalStartIndex] = useState<number>(0);
  const [property, setProperty] = useState<CityProperty | null>(propData || null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
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
      setModalStartIndex(index);
      setIsModalOpen(true);
    }
  };

  const showTemporaryToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Robust helper to fetch image as blob, bypassing ngrok warning screens and CORS issues
  const fetchImageAsBlob = async (url: string): Promise<Blob | null> => {
    try {
      // 1. Try a direct fetch from the absolute URL with the ngrok bypass header
      const response = await fetch(url, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (response.ok) {
        return await response.blob();
      }
    } catch (e) {
      console.warn('Direct fetch with ngrok header failed, trying local proxy...', e);
    }

    try {
      // 2. Try fetching through the local Vite proxy by making the URL relative
      let targetUrl = url;
      if (url.includes('/uploads/')) {
        targetUrl = url.substring(url.indexOf('/uploads/'));
      }

      const response = await fetch(targetUrl);
      if (response.ok) {
        return await response.blob();
      }
    } catch (fetchError) {
      console.warn('Proxy fetch failed, falling back to Canvas:', fetchError);
    }

    // 3. Fallback to Canvas draw (CORS-sensitive)
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.85);
        } catch (canvasError) {
          console.warn('Canvas conversion failed:', canvasError);
          resolve(null);
        }
      };

      img.onerror = () => {
        resolve(null);
      };

      img.src = url;
    });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const imgUrl = (mediaItems[currentImageIndex] || mediaItems[0] || { url: '' }).url;
    const link = window.location.href;
    const title = property?.title || document.title;
    const fullShareText = `Hi there, 👋 
Check out this beautiful property which I have found on Housing. Could you take a quick look and connect if interested?: ${title}\n${link}`;

    try {
      if (navigator.share) {
        // Try sharing with the image first if available
        if (imgUrl) {
          try {
            const blob = await fetchImageAsBlob(imgUrl);
            if (blob) {
              // Dynamically resolve file extension and MIME type to avoid mobile OS rejection
              const blobType = blob.type || 'image/jpeg';
              let extension = 'jpg';
              if (blobType.includes('png')) extension = 'png';
              else if (blobType.includes('webp')) extension = 'webp';
              else if (blobType.includes('gif')) extension = 'gif';

              const file = new File([blob], `property.${extension}`, { type: blobType });

              // 1. Try sharing both image file AND caption text together
              const combinedShareData: any = {
                title: title,
                text: fullShareText,
                files: [file]
              };

              if (navigator.canShare && navigator.canShare(combinedShareData)) {
                await navigator.share(combinedShareData);
                return;
              }

              // 2. Fallback: Try sharing just the image file (silently copying text to background)
              const fileOnlyShareData: any = {
                files: [file]
              };
              if (navigator.canShare && navigator.canShare(fileOnlyShareData)) {
                try {
                  await navigator.clipboard.writeText(fullShareText);
                } catch (cErr) {
                  console.warn('Silent clipboard copy failed', cErr);
                }
                await navigator.share(fileOnlyShareData);
                return;
              }
            }
          } catch (shareError) {
            console.warn('Sharing with image file failed:', shareError);
          }
        }

        // 3. Fallback: Text-only share if image file couldn't be fetched or shared.
        await navigator.share({
          title: title,
          text: `🏠 Check out this property: ${title}`,
          url: link
        });
        return;
      }

      // Fallback for browsers without Web Share API (desktop)
      await navigator.clipboard.writeText(fullShareText);
      showTemporaryToast();
    } catch (err: any) {
      // Ignore AbortError (when user cancels the native share sheet)
      if (err?.name !== 'AbortError') {
        console.error('Share failed:', err);
        // Ultimate fallback
        try {
          await navigator.clipboard.writeText(fullShareText);
          showTemporaryToast();
        } catch (clipboardError) {
          console.error('Failed to copy:', clipboardError);
          alert('Please copy the link manually: ' + link);
        }
      }
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    showTemporaryToast();
  };

  const activeMedia = mediaItems[currentImageIndex] || mediaItems[0] || { type: 'image', url: '' };

  return (
    <>
      {/* Toast Notification */}


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