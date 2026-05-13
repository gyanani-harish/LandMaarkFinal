
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Township } from "../../store/TownShip/TownshipTypes";
import TownshipCard from "../../Components/TownShip/TownshipCard";
import { useTownships } from "../../Hooks/useTownships";
import { useTownshipProperties } from "../../Hooks/useTownshipProperties";
import "./township.css";

const TownShip: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<Township | null>(null);
  const { townships, loading } = useTownships();
  const { properties, loading: propertiesLoading } = useTownshipProperties(selectedCity?.township_id || null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openCity = (item: Township) => {
    if (window.innerWidth < 1024) {
      navigate(`/search2/${item.township_id}`);
    } else {
      setSelectedCity(item);
    }
  };

  const closeDrawer = () => {
    setSelectedCity(null);
  };

  useEffect(() => {
    if (selectedCity && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [selectedCity]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 flex overflow-x-hidden pb-10 pt-16">
      {/* LEFT CITY GRID */}
      <div
        className={`transition-all duration-300 px-4 sm:px-6 md:px-10 pt-4 pb-10 ${selectedCity ? "lg:w-[65%]" : "w-full"
          }`}
      >

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {townships.map((item) => (
              <TownshipCard key={item.township_id || item.id} item={item} onSelect={openCity} />
            ))}
          </div>
        )}
      </div>
      {/* MOBILE BACKDROP */}
      {selectedCity && (
        <div
          role="button"
          tabIndex={0}
          onClick={closeDrawer}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") closeDrawer();
          }}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}
      {/* RIGHT DRAWER */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed lg:relative right-0 top-0
        h-full lg:h-180
        w-full sm:w-[50%] md:w-[50%] lg:w-[35%]
        bg-white shadow-2xl
        transition-transform duration-300
        z-50
        ${selectedCity ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        ${selectedCity ? "block" : "hidden"}`}
      >
        {selectedCity && (
          <div className="h-full overflow-y-auto p-6 pr-20 relative">
            {/* CLOSE BUTTON */}
            <button
              ref={closeButtonRef}
              aria-label="Close drawer"
              onClick={closeDrawer}
              className="absolute top-6 right-6 z-50
              p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              </svg>
            </button>
            {/* CITY TITLE */}
            <h2 className="text-3xl font-bold mt-8 pr-12 text-gray-800">
              {(selectedCity.city || selectedCity.name)} Projects
            </h2>
            <p className="mt-2 text-gray-600 text-sm">{selectedCity.description || selectedCity.location}</p>
            {/* PROPERTY GRID */}
            {propertiesLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-8 pr-8 pb-20">
                {properties.map((property) => (
                  <div
                    key={property.property_id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800">
                        {property.title}
                      </h3>

                      <p className="text-sm text-gray-600 mt-2">
                        {property.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700">No Properties Yet</h3>
                <p className="text-gray-500 text-center max-w-xs">Properties for this township will be available soon.</p>
              </div>
            )}
            {/* VERTICAL BUTTON */}
            <button
              className="vertical-btn"
              onClick={() => navigate(`/search2/${selectedCity.township_id}`)}
            >
              <span>View More</span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
export default TownShip;