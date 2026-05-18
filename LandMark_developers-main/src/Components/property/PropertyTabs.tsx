import React, { useEffect, useRef } from 'react';
import {
  Waves, Shield, Zap, ArrowUpDown, ParkingCircle, Maximize,
  ChevronDown, ChevronUp, Grid, MoreHorizontal, Dumbbell, Trees, Building2, Home,
  Check, TrendingDown
} from 'lucide-react';
import { CityProperty } from '../../services/services';
import OverviewItem from './Overview/OverviewItem';

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
  pricePerSqft,
}) => {
  const navRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tabId: string) => {
    if (tabId === 'amenities' || tabId === 'specs') {
      const targetId = tabId === 'amenities' ? 'amenities-section' : 'specifications-section';
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }
      setActiveTab(tabId);
    } else {
      setActiveTab(tabId);
    }
  };

  useEffect(() => {
    // Only internal scroll for tabs other than overview, amenities, and specs
    if (activeTab !== 'overview' && activeTab !== 'amenities' && activeTab !== 'specs' && navRef.current) {
      setTimeout(() => {
        const offset = 100;
        const elementPosition = navRef.current!.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [activeTab]);

  const getAmenityIcon = (amenityName: string): string => {
    const name = amenityName.toLowerCase();
    const amenityIconMap: Record<string, string> = {
      'gym': 'Dumbbell',
      'parking': 'ParkingCircle',
      'swimming pool': 'Waves',
      'club house': 'Building2',
      'security': 'Shield',
      'garden': 'Trees',
      'children play area': 'Trees',
      'power backup': 'Zap',
      'lift': 'ArrowUpDown',
      '24/7 security and surveillance': 'Shield',
      "children's play area": 'Trees',
      'power backup and water supply': 'Zap',
      'modular kitchen': 'Home',
      'balcony': 'Home',
      'bathrooms': 'Waves',
    };
    for (const key in amenityIconMap) {
      if (name.includes(key)) return amenityIconMap[key];
    }
    return 'Building2';
  };

  const iconMap: Record<string, any> = {
    Dumbbell, Waves, Trees, Shield, Zap, ArrowUpDown, ParkingCircle, Building2, Home
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">



          </div>
        );

      case 'amenities':
        return null; // Amenities section exists separately, we just scroll to it

      case 'locality':
        return (
          <>
            <div className="flex justify-between items-start mb-4">
              <h2 className="section-title">
                <span className="title-underline">{property.location} Locality</span>
              </h2>
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
                        {String(place.distance_meters).toLowerCase().includes('km')
                          ? place.distance_meters
                          : `${(parseFloat(place.distance_meters) / 1000).toFixed(1)} km`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      case 'pricing':
        return (
          <>
            <h2 className="section-title">
              <span className="title-underline">Price Trends</span>
            </h2>

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
          </>
        );

      case 'floorplans':
        return (
          <>
            <h2 className="section-title">
              <span className="title-underline">Floor Plans</span>
            </h2>
            <div className="text-center p-8 bg-gray-100 rounded-lg">
              <p className="text-gray-500">Floor plans coming soon for {property.bhk} BHK configuration</p>
              <p className="text-sm text-gray-400 mt-2">Contact us for detailed floor plans</p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tabs Navigation */}
      <div ref={navRef} className="tabs-nav-container">
        <nav className="tabs-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'tab-button-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab !== 'overview' && activeTab !== 'amenities' && activeTab !== 'specs' && (
        <div className="tab-content-card">
          {renderTabContent()}
        </div>
      )}
    </div>
  );
};

export default PropertyTabs;