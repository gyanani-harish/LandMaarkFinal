
import { ApiConstants } from "../constants/ApiConstants";
import { ApiEndPoints } from "../constants/ApiEndpoints";
 
export interface CityProperty {
  id: number;
  title: string;
  builder?: string;
  price: string;
  location: string;
  area: string;
  image: string; // Primary/main image
  image_url: string;
  tag: string;
  bhk: number;
  propertyType: string;
  description: string;
  verified: boolean;
  
  // Multiple images support
  images: string[]; // Array of all property images
  allImages: string[]; // Combined array of all images (main + gallery)
  
  amenities: Array<{ amenity_id: number; amenity_name: string }>;
  places: Array<{
    place_id: number;
    place_name: string;
    place_category: string;
    distance_meters: string;
  }>;
  specifications: Record<string, string>;
  overview: Record<string, string>;
  latitude?: string;
  longitude?: string;
  construction_status?: string;
construction_type?:string;  property_type?: string;
  area_sqft?: number;
  raw_price?: number;
  
  // Additional fields from API
  project_units?: string | number;
  project_area?: string;
  size?: string;
  project_size?: string;
  launch_date?: string;
  avg_price?: string;
  possession_date?: string;
  possession_starts?: string;
  configuration?: string;
  rera_id?: string;
  nearby_places?: Array<{ name: string; distance: string }>;
  area_unit?: string;
  configurations?: string;
  property_count?: number;
  sizes?: string;
  land_area?: string;
  total_units?: string | number;
  created_at?: string;
}

// Interface for property images from API
export interface PropertyImage {
  id: number;
  property_id: number;
  image_url: string;
  is_primary: boolean;
  caption?: string;
  created_at?: string;
}

export const fetchProperties = async (townshipId: number = 9): Promise<CityProperty[]> => {
  try {
    const response = await fetch(`${ApiConstants.API_BASE_URL}${ApiEndPoints.TOWNSHIP_PROPERTIES_FULL(townshipId)}`, {
      headers: ApiConstants.HEADERS,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    const propertiesData = result.data?.properties || [];
    
    return propertiesData.map((item: any) => {
      // Safely parse price
      const numericPrice = item.price ? parseFloat(item.price) : 0;
      const formattedPrice = numericPrice > 0 ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericPrice) : 'Contact for price';

      // Safely determine tag
      let tag = 'Featured';
      if (item.construction_status === 'Ready to Move') {
        tag = 'Ready to Move';
      } else if (item.construction_status === 'Under Construction') {
        tag = 'Under Construction';
      }

      // Safely format area
      const areaSqft = item.area_sqft ? Number(item.area_sqft) : 0;
      const formattedArea = areaSqft > 0 ? `${areaSqft.toLocaleString()} sq ft` : 'Area not specified';

      // Parse images from the response
      let mainImageUrl = '';
      let galleryImages: string[] = [];
      
      // Handle main image (can be string or JSON array)
      if (item.image) {
        try {
          // Check if image is a JSON string array
          if (typeof item.image === 'string' && item.image.startsWith('[')) {
            const parsedImages = JSON.parse(item.image);
            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
              mainImageUrl = parsedImages[0];
            }
          } else if (typeof item.image === 'string') {
            mainImageUrl = item.image;
          }
        } catch (e) {
          // If parsing fails, treat as direct URL
          mainImageUrl = item.image;
        }
      }
      
      // Handle images array (gallery images)
      if (item.images && Array.isArray(item.images)) {
        galleryImages = item.images.filter((img: string) => img && typeof img === 'string');
      }
      
      // Combine all unique images (main + gallery)
      const allImages = [...new Set([mainImageUrl, ...galleryImages].filter(url => url && url.trim() !== ''))];
      
      // If no images found, use placeholder
      const fallbackImage = 'https://via.placeholder.com/300x200?text=Property+Image';
      const finalMainImage = mainImageUrl || (allImages[0] || fallbackImage);
      const finalAllImages = allImages.length > 0 ? allImages : [fallbackImage];

      return {
        id: item.property_id || 0,
        title: item.property_name || item.title || 'Property',
        builder: item.builder || '',
        price: formattedPrice,
        raw_price: numericPrice,
        location: item.location || 'Location not specified',
        area: formattedArea,
        image: finalMainImage,
        image_url: finalMainImage,
        images: galleryImages,
        allImages: finalAllImages,
        tag: tag,
        bhk: item.bhk || 0,
        propertyType: item.property_type || 'Residential',
        description: item.description || 'No description available',
        verified: item.verified === 1,
        amenities: item.amenities || [],
        places: item.places || [],
        specifications: item.specifications || {},
        overview: item.overview || {},
        latitude: item.latitude,
        longitude: item.longitude,
        construction_status: item.construction_status || '',
        construction_type: item.construction_type || '',
        construcstion_type: item.construction_type || '',
        property_type: item.property_type || '',
        area_sqft: areaSqft,
        
        // Include additional fields
        project_units: item.project_units,
        project_area: item.project_area,
        size: item.size,
        project_size: item.project_size,
        launch_date: item.launch_date,
        avg_price: item.avg_price,
        possession_date: item.possession_date,
        possession_starts: item.possession_starts,
        configuration: item.configuration,
        rera_id: item.rera_id,
        nearby_places: item.nearby_places,
        area_unit: item.area_unit,
        configurations: item.configurations,
        property_count: item.property_count,
        sizes: item.sizes,
        created_at: item.created_at,
        // Removed duplicate image assignment here
      };
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

// Fetch property images from separate endpoint
export const fetchPropertyImages = async (propertyId: number): Promise<PropertyImage[]> => {
  try {
    const response = await fetch(`${ApiConstants.API_BASE_URL}${ApiEndPoints}?property_id=${propertyId}`, {
      headers: ApiConstants.HEADERS,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    const imagesData = result.data || [];
    
    return imagesData.map((item: any) => ({
      id: item.id,
      property_id: item.property_id,
      image_url: item.image_url ? 
        (item.image_url.startsWith('http') ? item.image_url : `${ApiConstants.API_BASE_URL}uploads/${item.image_url}`) 
        : '',
      is_primary: item.is_primary === 1,
      caption: item.caption || '',
      created_at: item.created_at,
    }));
  } catch (error) {
    console.error('Error fetching property images:', error);
    return [];
  }
};

// Fetch single property with all images
export const fetchPropertyById = async (id: number): Promise<CityProperty | null> => {
  try {
    const properties = await fetchProperties();
    const property = properties.find(p => p.id === id);
    
    if (property) {
      // Optionally fetch additional images from separate endpoint
      const additionalImages = await fetchPropertyImages(id);
      if (additionalImages.length > 0) {
        // Merge additional images if needed
        const additionalUrls = additionalImages.map(img => img.image_url);
        property.allImages = [...new Set([...property.allImages, ...additionalUrls])];
        property.images = [...new Set([...property.images, ...additionalUrls])];
      }
    }
    
    return property || null;
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    return null;
  }
};

// Helper function to get image URL with proper base URL
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Otherwise, prepend the base URL
  return `${ApiConstants.API_BASE_URL}uploads/${imagePath}`;
};

// Helper function to parse image array from string
export const parseImageArray = (imageString: string | null | undefined): string[] => {
  if (!imageString) return [];
  
  try {
    if (typeof imageString === 'string' && imageString.startsWith('[')) {
      const parsed = JSON.parse(imageString);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [imageString];
  } catch (e) {
    return [imageString];
  }
};

// Add default export for convenience
export default {
  fetchProperties,
  fetchPropertyImages,
  fetchPropertyById,
  getImageUrl,
  parseImageArray,
};