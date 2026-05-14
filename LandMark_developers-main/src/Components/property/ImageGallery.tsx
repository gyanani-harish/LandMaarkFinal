
interface ImageGalleryProps {
  images: string[];
  propertyId: number;
  property: CityProperty;
}

import React, { useState } from 'react';
import { Heart, Share2Icon } from 'lucide-react';
import ImageGalleryModal from '../../Components/ImageGalleryModal/ImageGalleryModal';
import { CityProperty } from '../../services/services';

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, propertyId, property: propData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalStartIndex, setModalStartIndex] = useState<number>(0);
  const [property, setProperty] = useState<CityProperty | null>(propData || null);

  const handleImageClick = (index: number) => {
    setModalStartIndex(index);
    setIsModalOpen(true);
  };

  const handleMoreClick = () => {
    setModalStartIndex(2); // Start from the third image
    setIsModalOpen(true);
  };

  // Get images for display - use property.allImages if available, otherwise use the passed images prop
  const displayImages = property?.allImages?.length && property.allImages.length > 0 ? property.allImages : images;

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
        {/* Main large image */}
        <div className="relative md:col-span-2 w-full h-[220px] sm:h-[320px] md:h-[450px] overflow-hidden cursor-pointer rounded-lg">
          <img
            src={displayImages[currentImageIndex]}
            alt="property"
            className="w-full h-full object-cover"
            onClick={() => handleImageClick(currentImageIndex)}
          />
          <div className="absolute top-0 left-0 h-full w-1/4 backdrop-blur-md bg-white/30"></div>
          <div className="absolute top-0 right-0 h-full w-1/4 backdrop-blur-md bg-white/30">
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 bg-white rounded-lg text-blue hover:bg-gray-100 shadow-md">
                <Share2Icon className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white rounded-lg hover:bg-gray-100 shadow-md">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        {/* Sidebar images */}
        <div className="flex flex-row md:flex-col gap-2 sm:gap-4">
          <img
            src={displayImages[1] || displayImages[0]}
            alt="Side"
            className="w-1/2 md:w-full h-[120px] sm:h-[160px] md:h-[210px] object-cover cursor-pointer rounded-lg"
            onClick={() => handleImageClick(1)}
          />

          <div className="relative cursor-pointer" onClick={() => handleImageClick(2)}>
            <img
              src={displayImages[2] || displayImages[0]}
              alt="Side"
              className="w-full h-[120px] sm:h-[160px] md:h-[210px] object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
              <span className="text-white text-lg font-semibold">
                {displayImages.length > 3 ? `+${displayImages.length - 2} more` : 'View More'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for viewing all images - Pass property object */}
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