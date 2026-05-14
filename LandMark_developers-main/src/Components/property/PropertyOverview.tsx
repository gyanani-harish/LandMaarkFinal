
import React from 'react';
import { MapPin, Calendar, Building2, Grid, Hash, Ruler, TrendingUp, Layers, Home, BarChart3 } from 'lucide-react';
import { CityProperty } from '../../services/services';
import OverviewItem from './Overview/OverviewItem';
import ActionButtons from './Overview/ActionButtons';
import NearbyPlaces from './Overview/NearbyPlaces';
import DescriptionSection from './Overview/DescriptionSection';
import './PropertyOverview.css';

interface PropertyOverviewProps {
  property: CityProperty;
  pricePerSqft: number;
  townshipName?: string;
  townshipData?: any;
}

const PropertyOverview: React.FC<PropertyOverviewProps> = ({ property, pricePerSqft, townshipName, townshipData }) => {
  // Use township-level data for the overview items
  const td = townshipData || {};

  const overviewItems = [
    { label: 'Area Unit', value: td.area_unit || property.area || 'N/A', icon: Ruler },
    { label: 'Avg. Price', value: td.avg_price || (pricePerSqft > 0 ? `₹${pricePerSqft.toLocaleString()}/sq.ft` : 'N/A'), icon: TrendingUp },
    { label: 'Configurations', value: td.configurations || property.propertyType || 'N/A', icon: Home },
    { label: 'Latitude', value: td.latitude || property.latitude || 'N/A', icon: MapPin },
    { label: 'Launch Date', value: td.launch_date ? new Date(td.launch_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : (property.launch_date ? new Date(property.launch_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'), icon: Calendar },
    { label: 'Longitude', value: td.longitude || property.longitude || 'N/A', icon: MapPin },
    { label: 'Possession Starts', value: td.possession_starts || property.construction_status || 'N/A', icon: Building2 },
    { label: 'Project Area', value: td.project_area || property.project_size || 'N/A', icon: Grid },
    { label: 'Property Count', value: td.property_count || 'N/A', icon: BarChart3 },
    { label: 'RERA ID', value: td.rera_id || property.rera_id || 'N/A', icon: Hash },
    { label: 'Sizes', value: td.sizes || property.size || 'N/A', icon: Layers },
  ];

  const handleShare = () => console.log('Share clicked');
  const handleSave = () => console.log('Save clicked');
  const handleAskDetails = () => console.log('Ask for details clicked');

  const displayName = townshipName || property.title || 'Township';

  return (
    <div className="property-overview-container">
      <div className="overview-grid">
        <div className="overview-main">
          <h2 className="overview-header">
            {displayName} Overview
          </h2>
          
          {/* Overview Items Grid */}
          <div className="mb-4">
            {overviewItems && overviewItems.length > 0 ? (
              <div className="items-grid">
                {overviewItems.map((item, index) => (
                  <OverviewItem
                    key={index}
                    label={item.label}
                    value={String(item.value)}
                    icon={item.icon}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No overview information available</p>
            )}
          </div>

          {/* Action Buttons */}
          
          <ActionButtons    
            onShare={handleShare}
            onSave={handleSave}
            onAskDetails={handleAskDetails}
          />

          {/* Description Section */}
          <DescriptionSection description={property.description} />

          {/* Nearby Places */}
          <NearbyPlaces places={property.places} />
        </div>
      </div>
    </div>
  );
};

export default PropertyOverview;