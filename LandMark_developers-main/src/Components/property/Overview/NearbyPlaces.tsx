import React from 'react';
import { getCategoryIcon } from '../IconRegistry';
import { ChevronRight } from 'lucide-react';
import { CityProperty } from '../../../services/services';
import './NearbyPlaces.css';

interface NearbyPlacesProps {
  places: CityProperty['places'];
}

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
          const { icon: Icon, color, bg } = getCategoryIcon(place.place_category);
          return (
            <div key={index} className="place-card-new">
              <div className="place-card-header">
                <div className="header-left">
                  <Icon size={24} color={color} className="category-icon-new" />
                  <span className="place-name-new">{place.place_name}</span>
                </div>
                <ChevronRight size={14} color="#94a3b8" />
              </div>
              <div className="place-card-body">
                <p className="category-name-new">{place.place_category}</p>
                <div className="place-distance-tag">
                  {String(place.distance_meters).toLowerCase().includes('km') 
                    ? place.distance_meters 
                    : `${(parseFloat(place.distance_meters) / 1000).toFixed(1)} km`}
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
