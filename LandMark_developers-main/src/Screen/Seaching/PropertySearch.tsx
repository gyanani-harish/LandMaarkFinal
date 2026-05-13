 
import { useState, useEffect, useCallback } from "react";
import PropertyFilters from "./PropertyFilters";
import PropertyCards from "./PropertyCards";
import { useLocation } from "react-router-dom";
import { div } from "framer-motion/client";
import { ApiConstants } from "../../constants/ApiConstants";

interface Filters {
  city: string;
  bhk: string;
  property_type: string;
  construction_status: string;
  construction_type: string;
  minPrice: string;
  maxPrice: string;
  search: string;
  sale_type: string;
  verified: string;
  project: string;
  featured_agent: string;
}

const PropertySearch = () => {
  const API_BASE_URL = "/api";
  const { state } = useLocation();
  const [properties, setProperties] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterOptionsApiData, setFilterOptionsApiData] = useState({});
  const [isUsingAI, setIsUsingAI] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    city: "",
    bhk: "",
    property_type: "",
    construction_status: "",
    construction_type: "",
    minPrice: "",
    maxPrice: "",
    search: "",
    sale_type: "",
    verified: "",
    project: "",
    featured_agent: ""
  });

  const [priceError, setPriceError] = useState("");

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (filters.city) params.append("city", filters.city);
    if (filters.bhk) params.append("bhk", filters.bhk);
    if (filters.property_type) params.append("property_type", filters.property_type);
    if (filters.construction_status) params.append("construction_status", filters.construction_status);
    if (filters.construction_type) params.append("construction_type", filters.construction_type);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.search) params.append("search", filters.search);
    if (filters.sale_type) params.append("sale_type", filters.sale_type);
    if (filters.verified) params.append("verified", filters.verified);
    if (filters.project) params.append("project", filters.project);
    if (filters.featured_agent) params.append("featured_agent", filters.featured_agent);

    return params.toString();
  }, [filters]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setIsUsingAI(false);

    const query = buildQueryString();
    const url = `${API_BASE_URL}/properties${query ? `?${query}` : ""}`;
    console.log("🔍 Fetching properties from:", url);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log("📡 Response status:", res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("📦 Properties data received:", data);
      
      let propertiesData = [];
      if (data.data && Array.isArray(data.data)) {
        propertiesData = data.data;
      } else if (Array.isArray(data)) {
        propertiesData = data;
      } else if (data.properties && Array.isArray(data.properties)) {
        propertiesData = data.properties;
      } else {
        propertiesData = [];
      }
      
      console.log("📊 Number of properties:", propertiesData.length);

      const formattedProperties = propertiesData.map((item: any) => ({
        property_id: item.property_id || item.id,
        title: item.title || "No Title",
        image: item.image || "",
        price: parseFloat(item.price || 0),
        location: item.location || ApiConstants.UNKNOWN,
        bhk: parseInt(item.bhk) || ApiConstants.UNKNOWN,
        property_type: item.property_type || ApiConstants.UNKNOWN,
        construction_status: item.construction_status ||  ApiConstants.UNKNOWN,
        construction_type: item.construction_type || "",
        area_sqft: parseFloat(item.area_sqft || 0),
        description: item.description || "",
        verified: item.verified || 0,
        created_at: item.created_at || new Date().toISOString(),
      }));

      console.log("✨ Formatted properties:", formattedProperties);
      setProperties(formattedProperties);
      setTotalCount(formattedProperties.length);
    } catch (error) {
      console.error("❌ Error fetching properties prafful:", error);
      setProperties([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchProperties();
  };

  const resetFilters = () => {
    setFilters({
      city: "",
      bhk: "",
      property_type: "",
      construction_status: "",
      construction_type: "",
      minPrice: "",
      maxPrice: "",
      search: "",
      sale_type: "",
      verified: "",
      project: "",
      featured_agent: ""
    });
    setPriceError("");
    
    setTimeout(() => {
      fetchProperties();
    }, 100);
  };
  const fetchOptions = async () => {
    try {
      const url = `${API_BASE_URL}/options`;
      console.log("🔍 Fetching options from:", url);
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("📦 Options data:", data);
      setFilterOptionsApiData(data.data || data);
    } catch (error) {
      console.error("❌ Error fetching options:", error);
    }
  };
 
  useEffect(() => {
    if (
      filters.minPrice &&
      filters.maxPrice &&
      parseFloat(filters.minPrice) >= parseFloat(filters.maxPrice)
    ) {
      setPriceError("Min price must be less than max price");
    } else {
      setPriceError("");
    }
  }, [filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    if (isUsingAI) return;
    
    const delayDebounce = setTimeout(() => {
      const hasFilters = Object.values(filters).some(value => value !== "");
      if (hasFilters) {
        fetchProperties();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [filters, fetchProperties, isUsingAI]);

  useEffect(() => {
    fetchOptions();
    
    if (state?.aiResults && Array.isArray(state.aiResults)) {
      console.log("🤖 Loading AI search results:", state.aiResults.length);
      
      const formattedAIResults = state.aiResults.map((item: any) => ({
        property_id: item.property_id || item.id,
        title: item.title || "No Title",
        image: item.image || "",
        price: parseFloat(item.price || 0),
        location: item.location || "Unknown",
        bhk: parseInt(item.bhk) || 1,
        property_type: item.property_type || "Apartment",
        construction_status: item.construction_status || "Ready",
        construction_type: item.construction_type || "",
        area_sqft: parseFloat(item.area_sqft || 0),
        description: item.description || "",
        verified: item.verified || 0,
        created_at: item.created_at || new Date().toISOString(),
      }));
      
      setProperties(formattedAIResults);
      setTotalCount(formattedAIResults.length);
      setIsUsingAI(true);
    } else {
      fetchProperties();
    }
  }, []);

  return (
 
 <div className="w-full min-h-screen pt-24 pb-12 text-black overflow-y-auto">

  {/* Sticky Filters */}
  <div className="sticky top-0 z-10 bg-white shadow-sm">  
    <PropertyFilters
      filters={filters}
      filterOptions={filterOptionsApiData}
      priceError={priceError}
      handleFilterChange={handleFilterChange}
      handleSubmit={handleSubmit}
      resetFilters={resetFilters}
    />
  </div>

  {/* Content */}
  <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
    {loading ? (
      <div className="flex justify-start items-start py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    ) : (
      <PropertyCards
        properties={properties}
        totalCount={totalCount}
        loading={loading}
      />
    )}
  </div>

</div>
  );
};

export default PropertySearch;


 