import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
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

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      loadProperties();
    }, 600);
    return () => clearTimeout(timer);
  }, [filters.search]);

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
      <div className="sm:hidden px-4 mb-4 flex gap-2 items-center">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by city, project..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <span
          className="prop-search-filter-toggle shadow-sm hover:shadow-md"
          onClick={() => setShowFilters(true)}
          aria-label="Show Filters"
        >
          <SlidersHorizontal size={20} className="text-slate-800" />
        </span>
      </div>

      <div
        className={`filter-overlay ${showFilters ? 'mobile-show' : ''}`}
        onClick={() => setShowFilters(false)}
      />

      <div className={`filter-wrapper ${showFilters ? 'mobile-show' : ''}`}>
        <div className="sm:hidden flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Filters</h3>
          <button
            onClick={() => setShowFilters(false)}
            className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
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