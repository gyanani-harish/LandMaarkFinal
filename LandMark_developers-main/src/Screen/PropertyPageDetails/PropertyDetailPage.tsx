import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader, Info } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';
import PropertyHeader from '../../Components/property/PropertyHeader';
import PropertyOverview from '../../Components/property/PropertyOverview';
import PropertyTabs from '../../Components/property/PropertyTabs';
import ImageGallery from '../../Components/property/ImageGallery';
import ContactCard from '../../Components/property/ContactCard';
import PropertyListings from '../../Components/property/CardsDetails/PropertyListings';
import QASection from '../../Components/property/QASection';
import AmenitiesSpecs from '../../Components/property/AmenitiesSpecs';
import { CityProperty } from '../../services/services';
import { ApiConstants } from '../../Constants/ApiConstants';
import { ApiEndPoints } from '../../constants/ApiEndpoints';
import './PropertyDetailPage.css';

const PropertyDetailPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [property, setProperty] = useState<CityProperty | null>(null);
  const [allTownshipProperties, setAllTownshipProperties] = useState<any[]>([]);
  const [townshipName, setTownshipName] = useState<string>('');
  const [townshipData, setTownshipData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Use the id from the URL as the townshipId
        const tId = id || '9';

        // Fetch all properties from the specific township API
        const url = `${ApiConstants.API_BASE_URL}${ApiEndPoints.TOWNSHIP_PROPERTIES_FULL(Number(tId))}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch properties: ' + response.status);
        }

        const result = await response.json();
        const properties: any[] = result.data?.properties || [];
        setTownshipName(result.data?.name || '');
        setTownshipData(result.data || null);
        setAllTownshipProperties(properties);

        // Find the specific property by ID
        let propertyData = properties.find((p: any) => String(p.property_id) === id);

        // Fallback: If not found by ID, just take the first property from the list
        if (!propertyData && properties.length > 0) {
          propertyData = properties[0];
        }

        if (propertyData) {
          // Transform API data to match CityProperty interface
          // Prioritize top-level township data (result.data) over property-specific data
          const topLevelData = result.data || {};
          
          // Extract key_values into a flat dictionary for easy access
          const kvMap = propertyData.key_values?.reduce((acc: any, kv: any) => {
            acc[kv.key] = kv.value;
            return acc;
          }, {}) || {};

          // Calculate a fallback area from Size/Sq Yds if needed
          const fallbackArea = parseFloat(String(kvMap['Sq Yds'] || kvMap['Size'] || '0').replace(/[^0-9.]/g, '')) || 0;
          
          const transformedProperty: CityProperty = {
            id: propertyData.property_id,
            title: topLevelData.name || propertyData.title,
            price: propertyData.price || kvMap['Price'] || '0',
            image_url: (topLevelData.images && topLevelData.images[0]) || propertyData.image || '',
            description: topLevelData.description || propertyData.description || kvMap['Description'] || '',
            location: topLevelData.location || propertyData.location,
            propertyType: propertyData.property_type || kvMap['Configuration'] || kvMap['Property Type'],
            bhk: propertyData.bhk || kvMap['Bhk'],
            area_sqft: propertyData.area_sqft || fallbackArea,
            raw_price: parseFloat(propertyData.price || kvMap['Price']) || 0,
            area: String(propertyData.area_sqft || fallbackArea),
            size: propertyData.size || kvMap['Dimension'] || kvMap['Size'],
            project_size: propertyData.project_size || topLevelData.project_size || kvMap['Project Size'],
            launch_date: propertyData.launch_date || topLevelData.launch_date || kvMap['Launch Date'],
            rera_id: propertyData.rera_id || topLevelData.rera_id || kvMap['RERA ID'],
            construction_type: propertyData.construction_type || kvMap['Construction Type'],
            construction_status: propertyData.construction_status || kvMap['Construction Status'],
            latitude: topLevelData.latitude || propertyData.latitude,
            longitude: topLevelData.longitude || propertyData.longitude,
            image: (topLevelData.images && topLevelData.images[0]) || propertyData.image || '',
            images: (topLevelData.images && topLevelData.images.length > 0) 
              ? topLevelData.images 
              : properties.flatMap((p: any) => p.images || (p.image ? [p.image] : [])),
            allImages: (topLevelData.images && topLevelData.images.length > 0) 
              ? topLevelData.images 
              : properties.flatMap((p: any) => p.images || (p.image ? [p.image] : [])),
            amenities: (topLevelData.mapped_amenities && topLevelData.mapped_amenities.length > 0)
              ? topLevelData.mapped_amenities.map((a: any) => ({
                  amenity_id: a.amenity_id || a.id || 0,
                  amenity_name: a.name || a.amenity_name || ''
                }))
              : (propertyData.amenities?.map((a: any) => ({ 
                  amenity_id: a.amenity_id || a.id || 0, 
                  amenity_name: a.amenity_name || a.name || '' 
                })) || []),
            places: (topLevelData.nearby_places && topLevelData.nearby_places.length > 0)
              ? topLevelData.nearby_places.map((p: any) => ({
                  place_id: p.place_id || p.id || 0,
                  place_name: p.name || p.place_name || '',
                  place_category: p.category || p.place_category || '',
                  distance_meters: String(p.distance || p.distance_meters || 0)
                }))
              : (propertyData.places?.map((p: any) => ({
                  place_id: p.place_id || p.id || 0,
                  place_name: p.name || p.place_name || '',
                  place_category: p.place_category || p.category || '',
                  distance_meters: String(p.distance_meters || p.distance || 0)
                })) || []),
            specifications: (topLevelData.mapped_specifications && topLevelData.mapped_specifications.length > 0)
              ? topLevelData.mapped_specifications
              : propertyData.specifications,
            overview: propertyData.overview || propertyData.key_values?.reduce((acc: any, kv: any) => {
              acc[kv.key] = kv.value;
              return acc;
            }, {}) || {},
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
      <div className="loading-wrapper">
        <div className="loading-content">
          <Loader className="loader-spinner" />
          <p className="loading-text">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="error-wrapper">
        <div className="error-content">
          <p className="error-message">{error || 'Property not found'}</p>
          <button
            onClick={() => window.history.back()}
            className="back-button"
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
    { id: 'pricing', label: 'Pricing' },
  ];

  const headerData = {
    name: property.title,
    builder: property.builder || '',
    location: property.location,
    type: property.propertyType,
    area: property.area,
    rating: property.bhk,
    possession: property.construction_status || 'Ready to Move',
    rera_id: property.rera_id || '',
    price: {
      min: property.raw_price || 0,
      max: property.raw_price || 0,
      perSqft: pricePerSqft,
      emi: emiApprox
    }
  };

  if (isMobile) {
    return (
      <div className="property-detail-container mobile-padding overflow-x-hidden pb-10">
        {/* Mobile Gallery */}
        <div className="mobile-gallery-wrapper">
          <ImageGallery images={property.images} propertyId={property.id} property={property} />
        </div>

        {/* Mobile Header */}
        <div className="mobile-header-wrapper">
          <PropertyHeader property={headerData} />
        </div>

        {/* Mobile Price Highlights */}
        <div className="mobile-price-highlights">
          <div className="highlight-item">
            <p className="highlight-title">{property.propertyType || `${property.bhk} BHK`}</p>
            <p className="highlight-label">Configuration</p>
          </div>

          <div className="highlight-item-no-border">
            <p className="highlight-title">₹{pricePerSqft.toLocaleString()}/sq.ft</p>
            <p className="highlight-label">Avg. Price</p>
          </div>
          <div className="highlight-item-no-border">
            <p className="highlight-title">{property.area_sqft?.toLocaleString()} sq.ft</p>
            <p className="highlight-label">Area</p>
          </div>
        </div>

        {/* Mobile Tabs & Content */}
        <div className="mobile-content-wrapper">
          <div className="component-spacing-mobile">
            <PropertyTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={tabs}
              property={property}
              pricePerSqft={pricePerSqft}
            />
          </div>

          <div className="component-spacing-mobile">
            <ContactCard />
          </div>

          <div className="component-spacing-mobile">
            <PropertyOverview property={property} pricePerSqft={pricePerSqft} townshipName={townshipName} townshipData={townshipData} />
          </div>

          <div className="component-spacing-mobile">
            <AmenitiesSpecs property={property} />
          </div>

          <div className="component-spacing-mobile">
            <QASection />
          </div>
        </div>

        <div className="mt-6">
          <PropertyListings initialData={allTownshipProperties} townshipId={id} />
        </div>
      </div>
    );
  }

  // Desktop View (Redesigned to match reference)
  return (
    <div className="property-detail-container desktop-padding">
      {/* Breadcrumbs */}
      <div className="breadcrumbs-desktop">
        <span>Home</span>
        <span className="breadcrumb-separator">/</span>
        <span>{property.location.split(',').pop()?.trim() || 'Location'}</span>
        <span className="breadcrumb-separator">/</span>
        <span>{property.location.split(',')[0].trim()}</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{property.title}</span>
      </div>

      <PropertyHeader property={headerData} />

      <div className="gallery-section-desktop">
        <ImageGallery images={property.images} propertyId={property.id} property={property} />
      </div>

      {/* Feature Highlights Grid */}
      <div className="feature-highlights-desktop">
        <div className="feature-item">
          <p className="feature-value">{property.propertyType || `${property.bhk} BHK Apartments`}</p>
          <p className="feature-label">Configurations</p>
        </div>

        <div className="feature-item">
          <p className="feature-value">Price on request</p>
          <p className="feature-label">Avg. Price</p>
        </div>
        <div className="feature-item">
          <p className="feature-value">{property.area_sqft?.toLocaleString()} sq.ft</p>
          <p className="feature-label">Super Builtup Area</p>
        </div>
      </div>

      <div className="desktop-content-grid">
        <div className="desktop-main-content">
          <PropertyTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
            property={property}
            pricePerSqft={pricePerSqft}
          />
          <QASection />
        </div>
        <div className="desktop-sidebar">
          <ContactCard />
          <div className="sidebar-ad-placeholder">
            {/* Additional sidebar content can go here */}
          </div>
        </div>
      </div>

      <div className="full-width-sections">
        <PropertyOverview property={property} pricePerSqft={pricePerSqft} townshipName={townshipName} townshipData={townshipData} />
        <AmenitiesSpecs property={property} />
        <PropertyListings initialData={allTownshipProperties} townshipId={id} townshipName={townshipName} />
      </div>
    </div>
  );
}

export default PropertyDetailPage;