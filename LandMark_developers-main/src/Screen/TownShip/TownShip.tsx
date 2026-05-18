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
    <div className="townships-page-container">
      {/* LEFT CITY GRID */}
      <div className="townships-grid-wrapper">
        {loading ? (
          <div className="townships-loading-container">
            <div className="townships-loading-spinner"></div>
          </div>
        ) : (
          <div className="townships-grid">
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