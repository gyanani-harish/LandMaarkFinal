import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropertyFilters from "./PropertyFilter2";
import PropertyCards from "./PropertyCards2";
import { Property, Filters } from "./types";
import { fetchProperties, buildQueryString } from "./propertyUtils";
import "./PropertySearch2.css";

const PropertySearch2 = () => {
  const { id } = useParams<{ id?: string }>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    city: "", bhk: "", property_type: "", construction_status: "",
    construction_type: "", minPrice: "", maxPrice: "",
    search: "", sale_type: "", verified: "", project: "", featured_agent: ""
  });

  const townshipId = id ? parseInt(id) : 9;

  const loadProperties = async () => {
    setLoading(true);
    const query = buildQueryString(filters);
    const data = await fetchProperties(townshipId, query);
    setProperties(data);
    setTotalCount(data.length);
    setLoading(false);
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProperties();
  };

  const resetFilters = () => {
    const clearedFilters = {
      city: "", bhk: "", property_type: "", construction_status: "",
      construction_type: "", minPrice: "", maxPrice: "",
      search: "", sale_type: "", verified: "", project: "", featured_agent: ""
    };
    setFilters(clearedFilters);
    setPriceError("");
    
    // Call load with cleared filters
    setLoading(true);
    setTimeout(async () => {
      const query = buildQueryString(clearedFilters);
      const data = await fetchProperties(townshipId, query);
      setProperties(data);
      setTotalCount(data.length);
      setLoading(false);
    }, 100);
  };

  return (
    <div className="search-container">
      <div className="sm:hidden px-4 mb-4">
        <button 
          className="w-full bg-white border border-gray-200 text-gray-800 py-3 rounded-xl font-semibold shadow-sm flex items-center justify-center gap-2"
          onClick={() => setShowFilters(true)}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Filters
        </button>
      </div>

      <div 
        className={`filter-overlay ${showFilters ? 'mobile-show' : ''}`}
        onClick={() => setShowFilters(false)}
      />

      <div className={`filter-wrapper ${showFilters ? 'mobile-show' : ''}`}>
        <div className="sm:hidden flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Filters</h3>
          <button onClick={() => setShowFilters(false)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <PropertyFilters
          filters={filters}
          priceError={priceError}
          handleFilterChange={handleFilterChange}
          handleSubmit={(e) => {
            handleSubmit(e);
            setShowFilters(false);
          }}
          resetFilters={resetFilters}
        />
      </div>
      <div className="content-area">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <PropertyCards properties={properties} totalCount={totalCount} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default PropertySearch2;