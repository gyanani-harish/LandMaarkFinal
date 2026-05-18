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
import AmenitiesSpecs from '../../Components/property/AmenitiesSpecs';
import OverviewItem from '../../Components/property/Overview/OverviewItem';
import NearbyPlaces from '../../Components/property/Overview/NearbyPlaces';
import QASection from '../../Components/property/QASection';
import { Car, Home, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CityProperty } from '../../services/services';
import { ApiConstants } from '../../constants/ApiConstants';
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

        const response = await fetch(url, {
          headers: ApiConstants.HEADERS
        });

        if (!response.ok) {
          throw new Error('Failed to fetch properties: ' + response.status);
        }

        const result = await response.json();

        // Normalize API data: extract value from {key, value} objects and add camelCase aliases
        const normalizeData = (data: any): any => {
          if (!data || typeof data !== 'object') return data;
          const out: any = {};
          for (const [k, v] of Object.entries(data)) {
            if (v && typeof v === 'object' && 'value' in v && !Array.isArray(v)) {
              out[k] = v.value;
            } else {
              out[k] = v;
            }
          }
          // Add camelCase aliases for display-name keys
          const keyMap: Record<string, string> = {
            'Avg. Price': 'avg_price',
            'Area Unit': 'area_unit',
            'Configurations': 'configurations',
            'Land Area': 'land_area',
            'Launch Date': 'launch_date',
            'Possession Starts': 'possession_starts',
            'Project Area': 'project_area',
            'Property Count': 'property_count',
            'RERA ID': 'rera_id',
            'Total Units': 'total_units',
            'Sizes': 'sizes',
            'name': 'name',
            'description': 'description',
            'location': 'location',
            'city': 'city',
            'latitude': 'latitude',
            'longitude': 'longitude',
          };
          for (const [displayKey, camelKey] of Object.entries(keyMap)) {
            if (displayKey in out) {
              out[camelKey] = out[displayKey];
            }
          }
          return out;
        };

        const normalizedData = normalizeData(result.data) || {};
        const properties: any[] = normalizedData.properties || [];
        setTownshipName(normalizedData.name || '');
        setTownshipData(normalizedData || null);
        setAllTownshipProperties(properties);

        // Find the specific property by ID
        let propertyData = properties.find((p: any) => String(p.property_id) === id);

        // Fallback: If not found by ID, just take the first property from the list
        if (!propertyData && properties.length > 0) {
          propertyData = properties[0];
        }

        // Ultimate Fallback: If still no propertyData (e.g. township has no properties yet),
        // we create a virtual propertyData shell so the township detail page still loads beautifully!
        if (!propertyData && result.success && result.data) {
          propertyData = {
            property_id: Number(id),
            title: normalizedData.name || '',
            image: (normalizedData.images && normalizedData.images[0]) || normalizedData.image || '',
            description: normalizedData.description || '',
            location: normalizedData.location || '',
            price: normalizedData.avg_price || 'Contact us',
            amenities: [],
            places: [],
            specifications: []
          };
        }

        if (propertyData) {
          // Transform API data to match CityProperty interface
          // Prioritize top-level township data (normalizedData) over property-specific data
          const topLevelData = normalizedData || {};

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
            price: topLevelData.avg_price || propertyData.price || kvMap['Price'] || '0',
            image_url: (topLevelData.images && topLevelData.images[0]) || propertyData.image || '',
            description: topLevelData.description || propertyData.description || kvMap['Description'] || '',
            location: topLevelData.location || propertyData.location,
            propertyType: topLevelData.configurations || propertyData.property_type || kvMap['Configuration'] || kvMap['Property Type'],
            bhk: propertyData.bhk || kvMap['Bhk'],
            area_sqft: propertyData.area_sqft || fallbackArea,
            raw_price: parseFloat(propertyData.price || kvMap['Price']) || 0,
            area: topLevelData.project_area || String(propertyData.area_sqft || fallbackArea),
            size: topLevelData.sizes || propertyData.size || kvMap['Dimension'] || kvMap['Size'],
            project_size: topLevelData.project_size || propertyData.project_size || kvMap['Project Size'],
            launch_date: topLevelData.launch_date || propertyData.launch_date || kvMap['Launch Date'],
            rera_id: topLevelData.rera_id || propertyData.rera_id || kvMap['RERA ID'],
            construction_type: propertyData.construction_type || kvMap['Construction Type'],
            construction_status: propertyData.construction_status || kvMap['Construction Status'],
            possession_starts: topLevelData.possession_starts || propertyData.possession_starts,
            latitude: topLevelData.latitude || propertyData.latitude,
            longitude: topLevelData.longitude || propertyData.longitude,
            area_unit: topLevelData.area_unit,
            configurations: topLevelData.configurations,
            property_count: topLevelData.property_count,
            sizes: topLevelData.sizes,
            avg_price: topLevelData.avg_price,
            land_area: topLevelData.land_area,
            total_units: topLevelData.total_units,
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
              : propertyData.specifications || [],
            overview: propertyData.overview || propertyData.key_values?.reduce((acc: any, kv: any) => {
              acc[kv.key] = kv.value;
              return acc;
            }, {}) || {},
            verified: true,
            tag: '',
            video: topLevelData.video || propertyData.video,
            pdf: topLevelData.pdf || propertyData.pdf,
            additionalDetails: normalizedData["Additional Details"] || propertyData["Additional Details"] || [],
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
    { id: 'amenities', label: 'Amenities' },
    { id: 'specs', label: 'Specs' },
  ];

  const headerData = {
    name: property.title,
    builder: property.builder || '',
    location: property.location,
    type: property.propertyType,
    area: property.area,
    rating: property.bhk,
    possession: property.possession_starts || property.construction_status || 'Ready to Move',
    rera_id: property.rera_id || '',
    price: {
      min: property.raw_price || 0,
      max: property.raw_price || 0,
      perSqft: pricePerSqft,
      emi: emiApprox,
      display: property.avg_price
    }
  };

  if (isMobile) {
    return (
      <div className="property-detail-container">
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
            <p className="highlight-title">{property.configurations || property.propertyType || 'N/A'}</p>
            <p className="highlight-label">Configurations</p>
          </div>

          <div className="highlight-item">
            <p className="highlight-title">{property.avg_price || 'Contact'}</p>
            <p className="highlight-label">Avg. Price</p>
          </div>
          <div className="highlight-item-no-border">
            <p className="highlight-title">{property.area || 'N/A'}</p>
            <p className="highlight-label">Project Area</p>
          </div>
        </div>

        {/* Mobile Tabs & Content */}
        <div className="mobile-content-wrapper">

          <div className="component-spacing-mobile">
            <NearbyPlaces places={property.places} />
          </div>

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

          {property.additionalDetails && property.additionalDetails.length > 0 && (
            <div className="component-spacing-mobile">
              <div className="tab-content-card additional-details-section">
                <h2 className="section-title">
                  <span className="title-underline">
                    Additional Details
                  </span>
                </h2>
                <div className="items-grid">
                  {property.additionalDetails.map((detail: any, idx: number) => (
                    <OverviewItem
                      key={idx}
                      label={detail.key}
                      value={detail.value}
                      icon={Info}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="">
          <PropertyListings initialData={allTownshipProperties} townshipId={id} townshipName={townshipName} pdf={property.pdf} />
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
          <p className="feature-value">{property.configurations || property.propertyType || 'N/A'}</p>
          <p className="feature-label">Configurations</p>
        </div>

        <div className="feature-item">
          <p className="feature-value">{property.avg_price || 'Contact'}</p>
          <p className="feature-label">Avg. Price</p>
        </div>
        <div className="feature-item">
          <p className="feature-value">{property.area || 'N/A'}</p>
          <p className="feature-label">Project Area</p>
        </div>
      </div>

      <div className="desktop-content-grid">
        <div className="desktop-main-content">
          <NearbyPlaces places={property.places} />
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

        {/* Desktop Additional Details Section */}
        <div className="tab-content-card additional-details-section" style={{ marginTop: '0.75rem' }}>
          <h2 className="section-title">
            <span className="title-underline">Additional Details</span>
          </h2>
          <div className="items-grid">
            {property.additionalDetails && property.additionalDetails.length > 0 ? (
              property.additionalDetails.map((detail: any, idx: number) => (
                <OverviewItem
                  key={idx}
                  label={detail.key}
                  value={detail.value}
                  icon={Info}
                />
              ))
            ) : (
              null
            )}
          </div>
        </div>

        <PropertyListings initialData={allTownshipProperties} townshipId={id} townshipName={townshipName} pdf={property.pdf} />
      </div>
    </div>
  );
}

export default PropertyDetailPage;
