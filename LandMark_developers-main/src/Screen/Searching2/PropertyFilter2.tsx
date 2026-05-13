import React, { useState, useEffect } from "react";
import { CurrencyRupeeIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { ApiConstants } from "../../constants/ApiConstants";
import { ApiEndPoints } from "../../constants/ApiEndpoints";
import { Filters, FilterOptions } from "./types";
import "./PropertySearch2.css";

interface Props {
  filters: Filters;
  priceError: string;
  handleFilterChange: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetFilters: () => void;
}

const getOptionValue = (option: any, type: string): string => {
  if (!option) return '';
  if (type === 'bhk') return option.bhk?.toString() || '';
  return option.name || '';
};

const getOptionLabel = (option: any, type: string): string => {
  if (!option) return '';
  if (type === 'bhk') return `${option.bhk} BHK`;
  return option.name || '';
};

const PropertyFilters2: React.FC<Props> = ({
  filters,
  priceError,
  handleFilterChange,
  handleSubmit,
  resetFilters
}) => {
  const [optionsData, setOptionsData] = useState<FilterOptions>({});

  useEffect(() => {
    let mounted = true;
    const fetchOptions = async () => {
      try {
        const url = `${ApiConstants.API_BASE_URL}${ApiEndPoints.OPTIONS}`;
        const res = await axios.get(url, { headers: ApiConstants.HEADERS });
        if (mounted) setOptionsData(res.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
    return () => { mounted = false; };
  }, []);

  const filterOptions = optionsData;
  const bhkOptions = filterOptions?.bhk || [];
  const propertyTypeOptions = filterOptions?.property_type || [];
  const constructionStatusOptions = filterOptions?.construction_status || [];
  const constructionTypeOptions = filterOptions?.construction_type || [];

  return (
    <div className="filter-container">
      <form onSubmit={handleSubmit} className="filter-form">
        <div className="filter-group">
          <div className="filter-field">
            <label className="filter-label">BHK</label>
            <select
              value={filters.bhk}
              onChange={(e) => handleFilterChange("bhk", e.target.value)}
              className="filter-select"
            >
              <option value="">All BHK</option>
              {bhkOptions.map((opt, i) => (
                <option key={i} value={getOptionValue(opt, 'bhk')}>
                  {getOptionLabel(opt, 'bhk')}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label className="filter-label">PROPERTY TYPE</label>
            <select
              value={filters.property_type}
              onChange={(e) => handleFilterChange("property_type", e.target.value)}
              className="filter-select"
            >
              <option value="">All Property Types</option>
              {propertyTypeOptions.map((opt, i) => (
                <option key={i} value={getOptionValue(opt, 'property')}>
                  {getOptionLabel(opt, 'property')}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label className="filter-label">STATUS</label>
            <select
              value={filters.construction_status}
              onChange={(e) => handleFilterChange("construction_status", e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              {constructionStatusOptions.map((opt, i) => (
                <option key={i} value={getOptionValue(opt, 'status')}>
                  {getOptionLabel(opt, 'status')}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label className="filter-label">PRICE RANGE</label>
            <div className="price-input-group">
              <CurrencyRupeeIcon className="price-icon" />
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="price-input"
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="price-input"
              />
            </div>
          </div>

          {constructionTypeOptions.length > 0 && (
            <div className="filter-field">
              <label className="filter-label">CONSTRUCTION TYPE</label>
              <select
                value={filters.construction_type}
                onChange={(e) => handleFilterChange("construction_type", e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                {constructionTypeOptions.map((opt, i) => (
                  <option key={i} value={getOptionValue(opt, 'type')}>
                    {getOptionLabel(opt, 'type')}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="filter-actions">
          <button type="button" onClick={resetFilters} className="btn-reset">Reset</button>
          <button type="submit" className="btn-apply">Apply</button>
        </div>
      </form>
      {priceError && <p className="price-error">{priceError}</p>}
    </div>
  );
};

export default PropertyFilters2;