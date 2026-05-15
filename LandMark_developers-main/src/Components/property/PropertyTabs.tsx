
import React from 'react';
import {
  Bed, Bath, Square, Calendar, Star, Check, X, TrendingDown,
  MapPin, Building2, Home, Ruler, Car, Trees, Wifi, Dumbbell,
  Waves, Shield, Zap, ArrowUpDown, ParkingCircle, Maximize
} from 'lucide-react';
import { CityProperty } from '../../services/services';

interface PropertyTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: Array<{ id: string; label: string }>;
  property: CityProperty;
  pricePerSqft: number;
}

import './PropertyTabs.css';

const PropertyTabs: React.FC<PropertyTabsProps> = ({
  activeTab,
  setActiveTab,
  tabs,
  property,
  pricePerSqft
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="tab-content-card">
              <h2 className="section-title">
                <span className="title-underline">
                  Property Overview
                </span>
              </h2>

              <div className="overview-stats-grid">
                <div className="stat-item">
                  <div className="flex items-center gap-2 mb-2">
                    <Maximize className="w-6 h-6 text-gray-600" />
                    <p className="text-base text-gray-500">Total Area</p>
                  </div>
                  <p className="tab-stat-value">{property.area || property.project_area || 'N/A'}</p>
                </div>

                <div className="stat-item">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-6 h-6 text-gray-600" />
                    <p className="text-base text-gray-500">Launch Date</p>
                  </div>
                  <p className="tab-stat-value">{property.launch_date || 'N/A'}</p>
                </div>

                <div className="stat-item">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-6 h-6 text-gray-600" />
                    <p className="text-base text-gray-500">Project Size</p>
                  </div>
                  <p className="tab-stat-value">{property.property_count || property.project_size || 'N/A'} Properties</p>
                </div>

                <div className="stat-item">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-6 h-6 text-gray-600" />
                    <p className="text-sm text-gray-500">Possession</p>
                  </div>
                  <p className="tab-stat-value">{property.possession_starts || property.construction_status || 'N/A'}</p>
                </div>
              </div>

              <div className="tab-description-wrapper mt-6">
                <p className="tab-description-text">{property.description}</p>
              </div>
            </div>

            <div className="tab-content-card additional-details-section">
              <h2 className="section-title">
                <span className="title-underline">
                  Additional Details
                </span>
              </h2>
              <div className="additional-details-grid">
                <div className="detail-info-item">
                  <p className="detail-info-label">Parking</p>
                  <p className="detail-info-value">
                    {property.amenities.some(a => a.amenity_name === 'Parking') ? 'Available' : 'Not Available'}
                  </p>
                </div>
                <div className="detail-info-item">
                  <p className="detail-info-label">Balcony</p>
                  <p className="detail-info-value">{property.specifications?.Balcony || 'Not Specified'}</p>
                </div>
                <div className="detail-info-item">
                  <p className="detail-info-label">Property Type</p>
                  <p className="detail-info-value">{property.propertyType}</p>
                </div>
                <div className="detail-info-item">
                  <p className="detail-info-label">Verified</p>
                  <p className="detail-info-value verified-status">
                    {property.verified ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'amenities':
        return (
          <div className="tab-content-card">
            <h2 className="section-title">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  {getAmenityIconComponent(amenity.amenity_name)}
                  <span className="font-medium ml-3">{amenity.amenity_name}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-green-700 flex items-center">
                <Check className="w-5 h-5 mr-2" />
                Water harvesting facility available
              </p>
            </div>
          </div>
        );

      case 'locality':
        return (
          <div className="tab-content-card">
            <div className="flex justify-between items-start mb-4">
              <h2 className="section-title">{property.location} Locality</h2>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-800">{property.places?.length || 0}</p>
                <p className="text-sm text-gray-600">Places</p>
              </div>
            </div>

            {property.places && property.places.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Nearby Places</h3>
                <div className="space-y-2">
                  {property.places.slice(0, 5).map((place, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-700">{place.place_name}</span>
                      <span className="text-sm text-blue-600">
                        {(parseFloat(place.distance_meters) / 1000).toFixed(1)} km
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'pricing':
        return (
          <div className="tab-content-card">
            <h2 className="section-title">Price Trends</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-600 font-semibold">2.5%</span>
                </div>
                <p className="text-sm text-gray-600">depreciation in avg. price/sq.ft for {property.title}</p>
                <p className="text-xs text-gray-500 mt-2">Last 1 year</p>
                <p className="text-lg font-bold mt-2">₹{pricePerSqft.toLocaleString()}/sq.ft</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-600 font-semibold">3.2%</span>
                </div>
                <p className="text-sm text-gray-600">depreciation in avg. price/sq.ft for {property.location}</p>
                <p className="text-xs text-gray-500 mt-2">Last 1 year</p>
                <p className="text-lg font-bold mt-2">₹{Math.round(pricePerSqft * 0.95).toLocaleString()}/sq.ft</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Price Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-semibold">{property.price}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Price per sq.ft</span>
                  <span className="font-semibold">₹{pricePerSqft.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Total Area</span>
                  <span className="font-semibold">{property.area_sqft?.toLocaleString()} sq.ft</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Estimated EMI</span>
                  <span className="font-semibold text-blue-600">₹{(property.raw_price! / 200).toLocaleString()}/month</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'floorplans':
        return (
          <div className="tab-content-card">
            <h2 className="section-title">Floor Plans</h2>
            <div className="text-center p-8 bg-gray-100 rounded-lg">
              <p className="text-gray-500">Floor plans coming soon for {property.bhk} BHK configuration</p>
              <p className="text-sm text-gray-400 mt-2">Contact us for detailed floor plans</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="tabs-nav-container">
        <nav className="tabs-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'tab-button-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tabs-content-wrapper">
        {renderTabContent()}
      </div>
    </div>
  );
};

// Helper function to get icon component for amenities
const getAmenityIconComponent = (amenityName: string) => {
  const iconMap: Record<string, any> = {
    'Gym': <Dumbbell className="w-5 h-5 text-blue-600" />,
    'Parking': <ParkingCircle className="w-5 h-5 text-blue-600" />,
    'Swimming pool': <Waves className="w-5 h-5 text-blue-600" />,
    'Club House': <Building2 className="w-5 h-5 text-blue-600" />,
    'Security': <Shield className="w-5 h-5 text-blue-600" />,
    'Garden': <Trees className="w-5 h-5 text-blue-600" />,
    'Children Play Area': <Trees className="w-5 h-5 text-blue-600" />,
    'Power Backup': <Zap className="w-5 h-5 text-blue-600" />,
    'Lift': <ArrowUpDown className="w-5 h-5 text-blue-600" />,
  };

  return iconMap[amenityName] || <Home className="w-5 h-5 text-blue-600" />;
};

export default PropertyTabs;