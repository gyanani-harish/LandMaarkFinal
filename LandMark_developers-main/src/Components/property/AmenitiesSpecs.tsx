/* eslint-disable custom/reusability-rules */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import {
  Grid,
  Dumbbell,
  Waves,
  Trees,
  Shield,
  Zap,
  ArrowUpDown,
  ParkingCircle,
  Building2,
  Home,
  LucideIcon
} from 'lucide-react';
import { CityProperty } from '../../services/services';
import OverviewItem from './Overview/OverviewItem';
import { useTranslation } from '../../hooks/useTranslation';

interface AmenitiesSpecsProps {
  property: CityProperty;
}

const iconMap: Record<string, LucideIcon> = {
  Dumbbell: Dumbbell,
  Waves: Waves,
  Trees: Trees,
  Shield: Shield,
  Zap: Zap,
  ArrowUpDown: ArrowUpDown,
  ParkingCircle: ParkingCircle,
  Building2: Building2,
  Home: Home,
};

import './AmenitiesSpecs.css';

const AmenitiesSpecs: React.FC<AmenitiesSpecsProps> = ({ property }) => {
  const { t } = useTranslation();

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

  // Grouped specifications logic
  const groupedSpecifications: Record<string, Array<{ label: string; value: string; iconUrl?: string }>> = {};

  if (property.specifications) {
    if (Array.isArray(property.specifications)) {
      groupedSpecifications['General'] = property.specifications.map((item: any) => ({
        label: item.name || item.key || item.label || 'Feature',
        value: item.value || 'Not specified',
        iconUrl: item.icon?.value || item.iconUrl || undefined
      }));
    } else if (typeof property.specifications === 'object' && property.specifications !== null) {
      const isGrouped = Object.values(property.specifications).some(val => Array.isArray(val));
      if (isGrouped) {
        Object.entries(property.specifications).forEach(([category, group]: [string, any]) => {
          if (Array.isArray(group)) {
            groupedSpecifications[category] = group.map((item: any) => ({
              label: item.name || item.key || item.label || 'Feature',
              value: item.value || 'Not specified',
              iconUrl: item.icon?.value || item.iconUrl || undefined
            }));
          }
        });
      } else {
        groupedSpecifications['General'] = Object.entries(property.specifications).map(([key, value]) => ({
          label: key,
          value: String(value),
        }));
      }
    }
  }

  const hasAmenities = property.amenities && property.amenities.length > 0;
  const hasSpecifications = Object.keys(groupedSpecifications).length > 0 &&
    Object.values(groupedSpecifications).some(arr => arr.length > 0);

  return (
    <div className="amenities-specs-wrapper">
      <div className="amenities-specs-container">
        <div id="amenities-section" className="amenities-main-grid">
          <div className="tab-content-card">
            <div className="section-title">
              <span className="title-underline">
                {t('property.topAmenities')}
              </span>
            </div>
            {/* Amenities Section */}
            {hasAmenities && (
              <div className="amenities-list-wrapper">
                <div className="items-grid">
                  {property.amenities.slice(0, 8).map((item, i) => {
                    const iconName = getAmenityIcon(item.amenity_name);
                    const IconComponent = iconMap[iconName] || Building2;
                    return (
                      <OverviewItem
                        key={i}
                        label={item.amenity_name}
                        value=""
                        icon={item.iconUrl ? undefined : IconComponent}
                        imageSrc={item.iconUrl}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="tab-content-card" id="specifications-section">
            <div className="section-title">
              <span className="title-underline">
                {t('property.specifications')}
              </span>
            </div>
            {hasSpecifications && (
              <div className="specifications-categories-wrapper">
                {Object.entries(groupedSpecifications).map(([category, specs], idx) => {
                  if (specs.length === 0) return null;
                  return (
                    <div key={idx} className="specification-category-group">
                      {category !== 'General' && (
                        <div className="specification-category-title">
                          {category}
                        </div>
                      )}
                      <div className="items-grid py-4">
                        {specs.map((item, i) => (
                          <OverviewItem
                            key={i}
                            label={item.label.replace(/_/g, ' ')}
                            value={item.value}
                            icon={item.iconUrl ? undefined : Grid}
                            imageSrc={item.iconUrl}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesSpecs;