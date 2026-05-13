import React from 'react';
import { 
  MapPin, 
  Building2, 
  Phone,
  Home,
  TrendingUp,
  Layers
} from 'lucide-react';

interface PropertyHeaderProps {
  property: {
    name?: string;
    builder?: string;
    location?: string;
    type?: string;
    area?: string;
    rating?: number;
    possession?: string;
    price?: {
      min?: number;
      max?: number;
      perSqft?: number;
      emi?: number;
    };
  };
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property }) => {  
  // Safe access with default values
  const propertyName = property?.name || 'Property';
  const builder = property?.builder || 'Developer';
  const location = property?.location || 'Location not specified';
  const propertyType = property?.type || '';
  const area = property?.area || '';
  
  const priceMin = property?.price?.min || 0;
  const priceMax = property?.price?.max || 0;
  const pricePerSqft = property?.price?.perSqft || 0;
  const emi = property?.price?.emi || 0;

  return (
    <div className="w-full flex flex-col md:flex-row md:justify-between md:items-start gap-6">
      
      {/* Left Section - Property Details */}
      <div className="flex-1">
        
        {/* Property Name */}
        <div className="flex items-center gap-2 mb-1">
          <Home className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            {propertyName}
          </h2>
        </div>

        {/* Builder */}
        <p className="text-blue-700 text-sm mt-2 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5" />
          <span>By {builder}</span>
        </p>

        {/* Property Type */}
        {propertyType && (
          <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>{propertyType}</span>
          </p>
        )}

        {/* Location */}
        <p className="text-gray-600 text-sm mt-2 flex items-start gap-1.5">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
          <span>{location}</span>
        </p>

        {/* Area */}
        {area && (
          <p className="text-gray-500 text-xs mt-1 flex items-center gap-1 ml-5">
            <TrendingUp className="w-3 h-3" />
            <span>Super built-up: {area}</span>
          </p>
        )}
      </div>

      {/* Right Section - Price & CTA */}
      <div className="text-left sm:text-right min-w-0 sm:min-w-[220px]">
        
        <p className="text-lg sm:text-xl font-semibold">
          {priceMin > 0 || priceMax > 0 ? (
            `₹${priceMin.toLocaleString()} L - ${priceMax.toLocaleString()} L`
          ) : (
            'Contact for Price'
          )}
        </p>

        {pricePerSqft > 0 && (
          <p className="text-sm text-gray-700">
            ₹{pricePerSqft.toLocaleString()}/sq.ft
          </p>
        )}

        {emi > 0 && (
          <p className="text-blue-700 text-sm mt-1">
            EMI starts at ₹{emi.toLocaleString()}K
          </p>
        )}

        {/* Contact Button */}
        <button
          className="mt-3 w-full md:w-auto bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-lg transition transform hover:scale-105"
          style={{background:'#5e23dc'}}
          onClick={() => console.log("Contact clicked")}
        >
          <span className="flex items-center justify-center text-white font-bold">
            <Phone className="w-4 h-4 mr-2" />
            Contact Sellers
          </span>
        </button>

        <p className="text-gray-400 text-xs mt-2">
          *Price excludes maintenance, floor rise
        </p>
      </div>
    </div>
  );
};

export default PropertyHeader;