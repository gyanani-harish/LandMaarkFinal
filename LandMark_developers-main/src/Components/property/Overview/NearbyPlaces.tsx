import React from 'react';
import { CityProperty } from '../../../services/services';
import './NearbyPlaces.css';

interface NearbyPlacesProps {
  places: CityProperty['places'];
}

const NearbyPlaces: React.FC<NearbyPlacesProps> = ({ places }) => {
  if (!places || places.length === 0) return null;

  return (
    <div className="tab-content-card">
      <div className="places-container">
        <h3 className="section-title">
          <span className="title-underline">
            Around this project
          </span>
        </h3>
        <div className="places-grid">
          {places.map((place, index) => (
            <div key={index} className="place-item">
              <div>
                <p className="place-info-name">{place.place_name}</p>
                <p className="place-info-category">{place.place_category}</p>
              </div>
              <span className="place-distance">
                {String(place.distance_meters).toLowerCase().includes('km') 
                  ? place.distance_meters 
                  : `${(parseFloat(place.distance_meters) / 1000).toFixed(1)} km`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NearbyPlaces;
