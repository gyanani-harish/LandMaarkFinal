import React, { useState, useEffect } from 'react';
import { Info, Loader } from "lucide-react";
import { useParams } from "react-router-dom";
import { CityProperty } from '../../services/services';
import { ApiConstants } from '../../constants/ApiConstants';
import { ApiEndPoints } from '../../constants/ApiEndpoints';
import PropertyHeader from '../../Components/property/PropertyHeader';
import ImageGallery from '../../Components/property/ImageGallery';
import PropertyTabs from '../../Components/property/PropertyTabs';
// import FloorPlansPricing from '../../Components/property/FloorPlansPricing';
import PropertyOverview from '../../Components/property/PropertyOverview';
import AmenitiesSpecs from '../../Components/property/AmenitiesSpecs';
import PropertyListings from '../../Components/property/CardsDetails/PropertyListings';
import ContactCard from '../../Components/property/ContactCard';
import QASection from '../../Components/property/QASection';
import useIsMobile from '../../Hooks/useIsMobile';

const PropertyDetailPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [property, setProperty] = useState<CityProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { id } = useParams();

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Get township_id from localStorage or use 9 as default
        const townshipId = localStorage.getItem('selectedTownshipId') || '9';
        
        // Fetch all properties from township API
        const url = `${ApiConstants.API_BASE_URL}${ApiEndPoints.TOWNSHIP_PROPERTIES_FULL(9)}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch properties: ' + response.status);
        }
        
        const result = await response.json();
        const properties: any[] = result.data || result;
        
        // Find the specific property by ID
        const propertyData = properties.find((p: any) => String(p.property_id) === id);
        
        if (propertyData) {
          // Transform API data to match CityProperty interface
          const transformedProperty: CityProperty = {
            id: propertyData.property_id,
            title: propertyData.title,
            price: propertyData.price || '0',
            image_url: propertyData.image || '',
            description: propertyData.description || '',
            location: propertyData.location,
            propertyType: propertyData.property_type,
            bhk: propertyData.bhk,
            area_sqft: propertyData.area_sqft,
            raw_price: parseFloat(propertyData.price) || 0,
            area: String(propertyData.area_sqft),
            size: propertyData.size,
            project_size: propertyData.project_size,
            launch_date: propertyData.launch_date,
            rera_id: propertyData.rera_id,
            construction_type: propertyData.construction_type,
            construction_status: propertyData.construction_status,
            latitude: propertyData.latitude,
            longitude: propertyData.longitude,
            image: propertyData.image || '',
            images: propertyData.image ? [propertyData.image] : [],
            allImages: propertyData.image ? [propertyData.image] : [],
            amenities: propertyData.amenities?.map((a: any) => ({ 
              amenity_id: a.amenity_id || a.id || 0, 
              amenity_name: a.amenity_name || a.name || '' 
            })) || [],
            places: propertyData.places?.map((p: any) => ({
              place_id: p.place_id || p.id || 0,
              place_name: p.place_name || p.name || '',
              place_category: p.place_category || p.category || '',
              distance_meters: String(p.distance_meters || p.distance || 0)
            })) || [],
            specifications: propertyData.specifications,
            overview: propertyData.overview || {},
            verified: true,
            tag: '',
          };
          
          setProperty(transformedProperty);
          setError(null);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        console.error('Error loading property:', err);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 mt-18 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 mt-18 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Property not found'}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-primary text-black px-4 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const pricePerSqft = property.area_sqft ? Math.round(property.raw_price! / property.area_sqft) : 0;
  const emiApprox = Math.round(property.raw_price! / 200);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'floorplans', label: 'Floor Plans' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'locality', label: 'Locality' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'pricing', label: 'Pricing' },
  ];

  const headerData = {
    name: property.title,
    builder: property.builder ?? 'no name',
    location: property.location,
    type: property.propertyType,
    area: property.area,
    rating: property.bhk,
    possession: property.construction_status || 'Ready to Move',
    price: {
      min: property.area_sqft || 0,
      max: property.area_sqft || 0,
      perSqft: pricePerSqft,
      emi: emiApprox
    }
  };

  if (isMobile) {
    return (
      <div className="w-full bg-gray-50 mt-14 min-h-screen pb-10 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="w-full px-4 pt-6 bg-white pb-4 shadow-sm">
          <div className="w-full">
            <PropertyHeader property={headerData} />
          </div>
        </div>

        {/* Mobile Gallery */}
        <div className="w-full px-2 mt-4">
          <ImageGallery images={[property.image]} propertyId={property.id} property={property} />
        </div>

        {/* Mobile Price Highlights */}
        <div className="w-full bg-white p-4 mt-4 shadow-sm grid grid-cols-2 gap-4 text-center">
          <div className="border-b pb-2 border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{property.bhk} BHK</p>
            <p className="text-gray-500 text-xs">Configuration</p>
          </div>
          <div className="border-b pb-2 border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{property.construction_status || 'Ready to Move'}</p>
            <p className="text-gray-500 text-xs">Status</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">₹{pricePerSqft.toLocaleString()}/sq.ft</p>
            <p className="text-gray-500 text-xs">Avg. Price</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{property.area_sqft?.toLocaleString()} sq.ft</p>
            <p className="text-gray-500 text-xs">Area</p>
          </div>
        </div>

        {/* Mobile Tabs & Content */}
        <div className="px-4 mt-6">
          <PropertyTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
            property={property}
            pricePerSqft={pricePerSqft}
          />
          
          <div className="mt-8">
            <ContactCard />
          </div>

          <div className="mt-8">
            <PropertyOverview property={property} pricePerSqft={pricePerSqft} />
          </div>

          <div className="mt-8">
            <AmenitiesSpecs property={property} />
          </div>

          <div className="mt-8">
            <QASection />
          </div>
        </div>

        <div className="mt-10">
          <PropertyListings />
        </div>
      </div>
    );
  }

  // Desktop View (Undisturbed)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 mt-18">
      <PropertyHeader property={headerData} />

      <ImageGallery images={[property.image]} propertyId={property.id} property={property} />

      <div className="bg-white py-6 px-8 mt-0 shadow-sm mb-6">
        <div className="grid grid-cols-4 text-center divide-x divide-gray-200">
          <div>
            <p className="text-lg font-semibold text-gray-900">{property.bhk} BHK {property.propertyType}</p>
            <p className="text-gray-500 text-sm mt-1">Configuration</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{property.construction_status || 'Ready to Move'}</p>
            <p className="text-gray-500 text-sm mt-1">Possession Starts</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">₹{pricePerSqft.toLocaleString()}/sq.ft</p>
            <p className="text-gray-500 text-sm mt-1">Avg. Price</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{property.area_sqft?.toLocaleString()} sq.ft</p>
            <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
              <span>(Super Built-up Area</span>
              <Info size={14} className="text-blue-600" />
              <span>)</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PropertyTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
            property={property}
            pricePerSqft={pricePerSqft}
          />
          <QASection />
        </div>
        <div className="lg:col-span-1">
          <ContactCard />
        </div>
      </div>

      <PropertyOverview property={property} pricePerSqft={pricePerSqft} />
      <AmenitiesSpecs property={property} />
      <PropertyListings />
    </div>
  );
};

export default PropertyDetailPage;