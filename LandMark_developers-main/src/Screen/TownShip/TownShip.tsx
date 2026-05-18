
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Township } from "../../store/TownShip/TownshipTypes";
import TownshipCard from "../../Components/TownShip/TownshipCard";
import { useTownships } from "../../hooks/useTownships";
import { useTownshipProperties } from "../../hooks/useTownshipProperties";
import "./township.css";

const TownShip: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<Township | null>(null);
  const { townships, loading } = useTownships();
  const { properties, loading: propertiesLoading } = useTownshipProperties(selectedCity?.township_id || null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openCity = (item: Township) => {
    navigate(`/property/${item.township_id}`);
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
    <div className="w-full min-h-screen bg-gray-100 flex overflow-x-hidden pb-10 pt-16 lg:pt-28">
      {/* LEFT CITY GRID */}
      <div
        className="transition-all duration-300 px-4 sm:px-6 md:px-10 pt-8 lg:pt-14 pb-10 w-full"
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
    </div>
  );
};
export default TownShip;