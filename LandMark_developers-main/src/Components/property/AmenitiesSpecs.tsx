 
import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp,
  Grid,
  MoreHorizontal,
  Dumbbell,
  Waves,
  Trees,
  Shield,
  Zap,
  ArrowUpDown,
  ParkingCircle,
  Building2,
  Home
} from 'lucide-react';
import { CityProperty } from '../../services/services';
// import ConstructionSpecs from '../../Components/Amenities/ConstructionSpecs';
interface AmenitiesSpecsProps {
  property: CityProperty;
}
const iconMap: Record<string, any> = {
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
  const [openSection, setOpenSection] = useState<string>("amenities");
  const renderIcon = (IconComponent: any, className: string = "w-6 h-6") => {
    return <IconComponent className={className} />;
  }; 
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
  // Show specifications as-is from API (no filtering, no deduplication)
  let specificationsArray: Array<{ label: string; value: string }> = [];
  if (property.specifications) {
    if (Array.isArray(property.specifications)) {
      specificationsArray = property.specifications.map((item: any) => ({
        label: item.name || item.key || item.label || 'Feature',
        value: item.value || 'Not specified',
      }));
    } else if (typeof property.specifications === 'object') {
      specificationsArray = Object.entries(property.specifications).map(([key, value]) => ({
        label: key,
        value: String(value),
      }));
    }
  }
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };
  const hasAmenities = property.amenities && property.amenities.length > 0;
  const hasSpecifications = specificationsArray.length > 0;
  return (
    <div className="amenities-specs-wrapper">
      <div className="amenities-specs-container">
        <div className="amenities-main-grid">
          <div className="amenities-content-card">
            <h2 className="section-header-large">
              Top Amenities
            </h2>  
            {/* Amenities Section */}
            {hasAmenities && (
              <div className="amenities-list-wrapper">
                <div className="amenities-grid">
                  {property.amenities.slice(0, 7).map((item, i) => {
                    const iconName = getAmenityIcon(item.amenity_name);
                    const IconComponent = iconMap[iconName] || Building2;
                    return (
                      <div key={i} className="amenity-item">
                        <div className="amenity-icon-wrapper">
                          {renderIcon(IconComponent)}
                        </div>
                        <p className="amenity-name">
                          {item.amenity_name}
                        </p>
                      </div>
                    );
                  })}
                  {property.amenities.length > 7 && (
                    <div className="more-amenities-badge">
                      <MoreHorizontal className="more-amenities-icon" />
                      <p className="more-amenities-text">+{property.amenities.length - 7} more</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Specifications Section */}
            <div className="specs-section-wrapper">
              <h2 className="section-header-large">
                Specifications
              </h2>
              {/* Property Specifications from API */}
              {hasSpecifications && (
                <div className="border-b border-gray-200 py-4">
                  <div
                    className="specs-dropdown-header"
                    onClick={() => toggleSection("specs")}
                  >
                    <div className="specs-title-row">
                      <Grid className="specs-icon" />
                      <p className="specs-title-text">Property Specifications</p>
                    </div>
                    {openSection === "specs" ? (
                      <ChevronUp className="specs-icon" />
                    ) : (
                      <ChevronDown className="specs-icon" />
                    )}
                  </div>

                  {openSection === "specs" && (
                    <div className="specs-grid">
                      {specificationsArray.map((item, i) => (
                        <div key={i} className="spec-item">
                          <p className="spec-label">
                            {item.label.replace(/_/g, ' ')}
                          </p>
                          <p className="spec-value">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesSpecs;