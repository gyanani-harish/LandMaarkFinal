import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

interface Property {
  bhk: string;
  rawKeyValues: { key: string; value: any }[];
}

interface PropertyFiltersProps {
  filters: {
    bhk: string;
    status: string;
    subTownship: string;
    sortBy: string;
  };
  plotData: Property[];
  onFilterChange: (key: any, value: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  plotData,
  onFilterChange,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const uniqueBhk = [...new Set(plotData.map(p => p.bhk).filter(Boolean))].sort();

  const uniqueSubTownships = [...new Set(plotData.map(p => {
    const kv = p.rawKeyValues?.reduce((acc: any, item: any) => { acc[item.key] = item.value; return acc; }, {}) || {};
    return kv['Sub Township'];
  }).filter(Boolean))].sort();

  const uniqueStatus = [...new Set(plotData.map(p => {
    const kv = p.rawKeyValues?.reduce((acc: any, item: any) => { acc[item.key] = item.value; return acc; }, {}) || {};
    return kv['Construction Status'];
  }).filter(Boolean))].sort();

  const filterContent = (isMobile: boolean) => (
    <div className={isMobile ? "mobile-filters-grid" : "filters"}>
      <div className={isMobile ? "filter-group" : ""}>
        {isMobile && <label>BHK</label>}
        <select value={filters.bhk} onChange={(e) => onFilterChange('bhk', e.target.value)}>
          <option value="">All BHK</option>
          {uniqueBhk.map(b => (
            <option key={b} value={b}>{b} BHK</option>
          ))}
        </select>
      </div>

      <div className={isMobile ? "filter-group" : ""}>
        {isMobile && <label>Sub Township</label>}
        <select value={filters.subTownship} onChange={(e) => onFilterChange('subTownship', e.target.value)}>
          <option value="">All Sub Townships</option>
          {uniqueSubTownships.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      <div className={isMobile ? "filter-group" : ""}>
        {isMobile && <label>Status</label>}
        <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)}>
          <option value="">All Status</option>
          {uniqueStatus.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className={isMobile ? "filter-group" : ""}>
        {isMobile && <label>Sort By</label>}
        <select value={filters.sortBy} onChange={(e) => onFilterChange('sortBy', e.target.value)}>
          <option value="">Sort By Size</option>
          <option value="size-asc">Size: Low to High</option>
          <option value="size-desc">Size: High to Low</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Filter Trigger Button */}
      <button className="filter-trigger-btn" onClick={() => setIsMobileOpen(true)}>
        <SlidersHorizontal size={18} />
      </button>

      {/* Filter Bottom Sheet */}
      {isMobileOpen && (
        <div className="bottom-sheet-overlay" onClick={() => setIsMobileOpen(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-header">
              <h3>Filters</h3>
              <button className="close-btn" onClick={() => setIsMobileOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="bottom-sheet-content">
              {filterContent(true)}
              <button className="apply-btn" onClick={() => setIsMobileOpen(false)}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyFilters;
