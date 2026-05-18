import React from 'react';
import { getCategoryIcon } from '../IconRegistry';
import { ChevronRight } from 'lucide-react';
import { CityProperty } from '../../../services/services';
import './NearbyPlaces.css';

interface NearbyPlacesProps {
  places: CityProperty['places'];
}

// Dynamically determine the category based on place name keywords
const getDynamicCategory = (name: string, originalCategory: string): string => {
  const lowercaseName = name.toLowerCase();
  
  if (lowercaseName.includes('airport') || lowercaseName.includes('aerodrome')) {
    return 'Airport';
  }
  if (lowercaseName.includes('hospital') || lowercaseName.includes('medical') || lowercaseName.includes('clinic') || lowercaseName.includes('health') || lowercaseName.includes('doctor')) {
    return 'Hospital';
  }
  if (lowercaseName.includes('temple') || lowercaseName.includes('church') || lowercaseName.includes('mosque') || lowercaseName.includes('shrine') || lowercaseName.includes('worship') || lowercaseName.includes('mandir')) {
    return 'Temple';
  }
  if (lowercaseName.includes('highway') || lowercaseName.includes('road') || lowercaseName.includes('bypass') || lowercaseName.includes('expressway') || lowercaseName.includes('flyover') || lowercaseName.includes('crossing') || lowercaseName.includes('nh8') || lowercaseName.includes('nh-8') || lowercaseName.startsWith('nh') || lowercaseName.includes(' nh')) {
    return 'Highway';
  }
  if (lowercaseName.includes('school') || lowercaseName.includes('college') || lowercaseName.includes('university') || lowercaseName.includes('education') || lowercaseName.includes('academy')) {
    return 'Education';
  }
  if (lowercaseName.includes('mall') || lowercaseName.includes('market') || lowercaseName.includes('store') || lowercaseName.includes('shop') || lowercaseName.includes('plaza') || lowercaseName.includes('complex')) {
    return 'Shopping';
  }
  if (lowercaseName.includes('restaurant') || lowercaseName.includes('food') || lowercaseName.includes('dining') || lowercaseName.includes('cafe') || lowercaseName.includes('dhaba') || lowercaseName.includes('hotel')) {
    return 'Dining';
  }
  if (lowercaseName.includes('metro') || lowercaseName.includes('bus') || lowercaseName.includes('station') || lowercaseName.includes('stop') || lowercaseName.includes('railway') || lowercaseName.includes('junction')) {
    return 'Transit';
  }
  
  // Fallback to the original category from API, or 'Place' if generic
  if (originalCategory) {
    const orig = originalCategory.toLowerCase();
    if (orig !== 'highway' && orig !== 'place' && orig !== 'unknown' && orig !== '') {
      return originalCategory;
    }
  }
  
  return 'Place';
};

const NearbyPlaces: React.FC<NearbyPlacesProps> = ({ places }) => {
  if (!places || places.length === 0) return null;

  return (
    <div className="places-container">
      <h3 className="section-title">
        <span className="title-underline">
          Around this project
        </span>
      </h3>
      <div className="places-scroll-container">
        {places.map((place, index) => {
          const dynamicCategory = getDynamicCategory(place.place_name, place.place_category);
          const { icon: Icon, color, bg } = getCategoryIcon(dynamicCategory);
          return (
            <div key={index} className="place-card-new">
              <div className="place-card-header">
                <div className="header-left">
                  <Icon size={24} color={color} className="category-icon-new" />
                  <span className="place-category-new">{dynamicCategory}</span>
                </div>
                <ChevronRight size={14} color="#94a3b8" />
              </div>
              <div className="place-card-body">
                <div className="place-info-row">
                  <span className="place-name-new">{place.place_name}</span>
                  <span className="place-distance-tag">
                    {String(place.distance_meters).toLowerCase().includes('km') 
                      ? place.distance_meters 
                      : `${(parseFloat(place.distance_meters) / 1000).toFixed(1)} km`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NearbyPlaces;
