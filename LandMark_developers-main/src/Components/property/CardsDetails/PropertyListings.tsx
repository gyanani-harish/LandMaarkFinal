// PropertyListings.tsx
import React, { useState, useEffect } from 'react';
import './PropertyListings.css'; // Import the CSS file for styling
import PropertyFilters from './PropertyFilters';
import { SlidersHorizontal } from 'lucide-react';

interface Property {
  sno: number;
  id: string;
  plotNo: string;
  size: string;
  sizeRaw: number;
  type: string;
  price: number;
  priceRaw: number;
  description: string;
  location: string;
  bhk: string;
  rawKeyValues: { key: string; value: any }[];
}

interface ApiResponse {
  success: boolean;
  data: ApiProperty[];
  summary?: any;
}

interface ApiProperty {
  property_id: number;
  plot_number: string;
  price: string;
  property_type?: string;
  description?: string;
  location?: string;
  key_values?: { key: string; value: any }[];
}

interface Stats {
  totalPlots: number;
  minPrice: number;
  maxPrice: number;
  minSize: number;
  maxSize: number;
  bhkMin: number;
  bhkMax: number;
}

interface PropertyListingsProps {
  initialData?: any[];
}

const PropertyListings: React.FC<PropertyListingsProps> = ({ initialData }) => {
  const [plotData, setPlotData] = useState<Property[]>([]);
  const [filteredData, setFilteredData] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalPlots: 0,
    minPrice: 0,
    maxPrice: 0,
    minSize: 0,
    maxSize: 0,
    bhkMin: 0,
    bhkMax: 0,
  });
  const [activeDetails, setActiveDetails] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    bhk: '',
    status: '',
    subTownship: '',
    sortBy: '',
  });

  const API_URL = `https://unimmunized-rosella-hedonistically.ngrok-free.dev/api/townships/${localStorage.getItem('selectedTownshipId') || 10}/properties`;

  const extractBhk = (type: string): string => {
    const match = type.match(/(\d+)\s*BHK/i);
    return match ? match[1] : '';
  };

  const getTypeBadgeClass = (type: string): string => {
    if (type.includes('Corner') || type.includes('CORNER')) return 'corner';
    if (type.includes('Guest')) return 'guest';
    if (type.includes('Duplex')) return 'duplex';
    if (type.includes('Villa')) return 'villa';
    return '';
  };

  const processApiData = (data: ApiProperty[]) => {
    const properties: Property[] = data
      .map((p, index) => {
        const kv = p.key_values?.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {}) || {};

        const sizeVal = parseFloat(String(kv.Size || kv['Sq Yds'] || '0').replace(/[^0-9.]/g, '')) || 0;

        return {
          sno: index + 1,
          id: kv.ID || String(p.property_id),
          plotNo: kv.Plot || p.plot_number || '-',
          size: kv.Size || kv['Sq Yds'] || '-',
          sizeRaw: sizeVal,
          type: p.property_type || '-',
          price: Math.round(parseFloat(p.price) / 100000),
          priceRaw: parseFloat(p.price) || 0,
          description: p.description || '-',
          location: p.location || '-',
          bhk: extractBhk(p.property_type || ''),
          rawKeyValues: p.key_values || [],
        };
      });

    setPlotData(properties);
    updateStats(properties);
  };

  const fetchData = async () => {
    if (initialData && initialData.length > 0) {
      processApiData(initialData);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      const result: ApiResponse = await response.json();

      if (result.success) {
        processApiData(result.data);
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (data: Property[]) => {
    const validData = data.filter(p => p.priceRaw > 0);
    const prices = validData.map(p => p.priceRaw);
    const sizes = validData.map(p => p.sizeRaw).filter(s => s > 0);
    const bhkValues = [...new Set(data.map(p => p.bhk).filter(b => b && b !== ''))].map(Number).sort();

    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    const minSize = sizes.length ? Math.min(...sizes) : 0;
    const maxSize = sizes.length ? Math.max(...sizes) : 0;

    setStats({
      totalPlots: data.length,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      bhkMin: bhkValues.length ? Math.min(...bhkValues) : 0,
      bhkMax: bhkValues.length ? Math.max(...bhkValues) : 0,
    });
  };

  const getUniqueTypes = (): string[] => {
    return [...new Set(plotData.map(p => p.type).filter(t => t && t !== '-'))].sort();
  };

  const filterData = () => {
    let filtered = [...plotData];

    // BHK filter
    if (filters.bhk) {
      filtered = filtered.filter(p => p.bhk === filters.bhk);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(p => {
        const kv = p.rawKeyValues?.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {}) || {};
        return (kv['Construction Status'] || '').toLowerCase() === filters.status.toLowerCase();
      });
    }

    // Sub Township filter
    if (filters.subTownship) {
      filtered = filtered.filter(p => {
        const kv = p.rawKeyValues?.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {}) || {};
        return (kv['Sub Township'] || '').toLowerCase() === filters.subTownship.toLowerCase();
      });
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'size-asc':
          filtered.sort((a, b) => {
            const aSize = parseFloat(String(a.size).replace(/[^0-9.]/g, '')) || 0;
            const bSize = parseFloat(String(b.size).replace(/[^0-9.]/g, '')) || 0;
            return aSize - bSize;
          });
          break;
        case 'size-desc':
          filtered.sort((a, b) => {
            const aSize = parseFloat(String(a.size).replace(/[^0-9.]/g, '')) || 0;
            const bSize = parseFloat(String(b.size).replace(/[^0-9.]/g, '')) || 0;
            return bSize - aSize;
          });
          break;
      }
    }

    setFilteredData(filtered);
  };

  const toggleDetails = (index: number) => {
    setActiveDetails(activeDetails === index ? null : index);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [filters, plotData]);

  useEffect(() => {
    if (plotData.length > 0) {
      filterData();
    }
  }, [plotData]);

  if (loading) {
    return (
      <div className="container">
        <div className="table-container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">

      <div className="table-container">
        <div className="table-header">
          <div className="header-title-section">
            <h2>Property List</h2>
            <div className="count">({filteredData.length})</div>
          </div>

          <div className="header-right">
            <PropertyFilters
              filters={filters}
              plotData={plotData}
              onFilterChange={handleFilterChange}
              isMobileOpen={isFilterOpen}
              setIsMobileOpen={setIsFilterOpen}
            />
          </div>
        </div>

        <div className="mobile-cards">
          {error ? (
            <div className="empty-state">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <p>No plots found matching your criteria</p>
            </div>
          ) : (
            filteredData.map((plot, index) => (
              <div key={plot.sno} className="mobile-card">
                <div
                  className="card-header-compact"
                  onClick={() => toggleDetails(index)}
                >
                  <div className="card-plot-badge">
                    Plot: #{plot.plotNo}
                  </div>
                  <div className="card-size-text">
                    {plot.size}
                  </div>
                </div>

                {activeDetails === index && (
                  <div className="card-content">
                    {plot.rawKeyValues
                      .filter((kv: any) => !['Is Deleted', 'ID', 'Plot', 'Price', 'Price (Lakhs)', 'Total Price'].includes(kv.key))
                      .map((kv: any, i: number) => (
                        <div key={i} className="card-detail">
                          <p className="detail-label">{kv.key}</p>
                          <p className="detail-value">{kv.value}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop View - Table */}
        <div className="desktop-table table-wrapper">
          {error ? (
            <div className="empty-state">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <p>No plots found matching your criteria</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Plot No.</th>
                  <th>Size</th>
                  <th>Sub Township</th>
                  <th>Project Area</th>
                  <th>Configuration</th>
                  <th>Construction Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((plot) => {
                  const kv = plot.rawKeyValues?.reduce((acc: any, item: any) => {
                    acc[item.key] = item.value;
                    return acc;
                  }, {} as any) || {};

                  return (
                    <tr key={plot.sno} className="no-expand">
                      <td className="plot-no">{plot.plotNo}</td>
                      <td>{plot.size}</td>
                      <td>{kv['Sub Township'] || '-'}</td>
                      <td>{kv['Project Area'] || '-'}</td>
                      <td>{kv.Configuration || '-'}</td>
                      <td>{kv['Construction Status'] || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyListings;