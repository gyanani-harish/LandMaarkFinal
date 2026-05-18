// PropertyListings.tsx
import React, { useState, useEffect } from 'react';
import './PropertyListings.css'; // Import the CSS file for styling
import { ChevronRight, FileText, Download } from 'lucide-react';
import { ApiConstants } from '../../../constants/ApiConstants';
import { ApiEndPoints } from '../../../constants/ApiEndpoints';
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
  data: {
    properties: ApiProperty[];
    [key: string]: any;
  };
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
  townshipId?: string | number;
  townshipName?: string;
}

const PropertyListings: React.FC<PropertyListingsProps> = ({ initialData, townshipId, townshipName: initialTownshipName }) => {
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
  const [townshipName, setTownshipName] = useState<string>(initialTownshipName || '');
  const [pdfData, setPdfData] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    subTownship: '',
    projectArea: '',
    configuration: '',
    status: '',
    sortBy: '',
  });

  // Calculate API_URL dynamically based on props or localStorage
  const currentTownshipId = townshipId || localStorage.getItem('selectedTownshipId') || 17;
  const API_URL = ApiConstants.API_BASE_URL + ApiEndPoints.TOWNSHIP_PROPERTIES_FULL(Number(currentTownshipId));

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (Array.isArray(value)) {
      if (value.length === 0) return '';
      if (typeof value[0] === 'object' && value[0] !== null) {
        return value.map(item => {
          const parts: string[] = [];
          if (item.name) parts.push(item.name);
          if (item.distance) parts.push(item.distance);
          return parts.join(', ');
        }).join(' | ');
      }
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

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
          type: kv.Configuration || p.property_type || '-',
          price: parseFloat(p.price) || 0,
          priceRaw: parseFloat(p.price) || 0,
          description: p.description || '',
          location: p.location || '',
          bhk: extractBhk(kv.Configuration || p.property_type || ''),
          rawKeyValues: p.key_values || [],
        };
      })
      .sort((a, b) => {
        const aNum = parseInt(a.plotNo.replace(/\D/g, '')) || 0;
        const bNum = parseInt(b.plotNo.replace(/\D/g, '')) || 0;
        return aNum - bNum;
      });

    setPlotData(properties);
    updateStats(properties);
  };

  const fetchData = async () => {
    // If we have a townshipName prop, it means the parent already fetched the project info.
    // In this case, we should NOT fetch again, even if initialData is empty.
    if (initialTownshipName) {
      if (initialData) {
        processApiData(initialData);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        // Normalize API data: extract value from {key, value} objects
        const normalizeData = (data: any): any => {
          if (!data || typeof data !== 'object') return data;
          const out: any = {};
          for (const [k, v] of Object.entries(data)) {
            if (v && typeof v === 'object' && 'value' in v && !Array.isArray(v)) {
              out[k] = v.value;
            } else {
              out[k] = v;
            }
          }
          return out;
        };

        const normalizedData = normalizeData(result.data);
        setTownshipName(normalizedData.name || '');
        setPdfData(normalizedData.pdf || []);

        // Only process properties if we don't have initialData
        if (!(initialData && initialData.length > 0)) {
          processApiData(normalizedData.properties || []);
        } else {
          processApiData(initialData);
        }
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

    // Project Area filter
    if (filters.projectArea) {
      filtered = filtered.filter(p => {
        const kv = p.rawKeyValues?.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {}) || {};
        return (kv['Project Area'] || '').toLowerCase() === filters.projectArea.toLowerCase();
      });
    }

    // Configuration filter
    if (filters.configuration) {
      filtered = filtered.filter(p => {
        const kv = p.rawKeyValues?.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {}) || {};
        return (kv['Configuration'] || '').toLowerCase() === filters.configuration.toLowerCase();
      });
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
        <div className="township-banner">
          <h1>
            {townshipName || 'Property List'}
            <span className="banner-count">({filteredData.length})</span>
          </h1>
        </div>

        <div className="project-details-cards-grid">
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
              <div
                key={plot.sno}
                className={`project-detail-card ${activeDetails === index ? 'active' : ''}`}
                onClick={() => toggleDetails(index)}
              >
                <div className="card-header-compact">
                  <div className="header-left-side">
                    <span className="plot-id">Plot {plot.plotNo}</span>
                  </div>
                  <div className="header-right-side">
                    <span className="compact-price">{plot.price > 0 ? `₹${plot.price} L` : ''}</span>
                    <ChevronRight size={18} className={`arrow-icon ${activeDetails === index ? 'rotate' : ''}`} />
                  </div>
                </div>
                {activeDetails === index && (
                  <div className="card-expanded-panel" onClick={(e) => e.stopPropagation()}>
                    <div className="expanded-info-grid">
                      {plot.rawKeyValues.filter(kv => {
                        if (kv.key === 'Is Deleted') return false;
                        if (kv.value === null || kv.value === undefined || kv.value === '') return false;
                        if (Array.isArray(kv.value) && kv.value.length === 0) return false;
                        if (typeof kv.value === 'object' && kv.value !== null && Object.keys(kv.value).length === 0) return false;
                        if (kv.value === '[]' || kv.value === '{}') return false;
                        return true;
                      }).map((kv, i) => (
                        <div key={i} className="info-item">
                          <span className="label">{kv.key}:</span>
                          <span className="value">{formatValue(kv.value)}</span>
                        </div>
                      ))}
                    </div>
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

      {/* PDF Section */}
      {(pdfData && pdfData.length > 0) && (
        <div className="pdf-section-wrapper mt-8  ">
          <div className="tab-content-card">
            <h2 className="section-title">
              <span className="title-underline">Brochures & Documents</span>
            </h2>
            <div className="pdf-grid">
              {pdfData.map((pdf, index) => (
                <div key={index} className="pdf-item">
                  <div className="pdf-icon-wrapper">
                    <FileText className="pdf-icon" />
                  </div>
                  <div className="pdf-info">
                    <p className="pdf-name">{pdf.name || `Document ${index + 1}`}</p>
                    <p className="pdf-size">PDF • Click to download</p>
                  </div>
                  <a
                    href={pdf.url || pdf.file_path || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-download-btn"
                  >
                    <Download className="download-icon" />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyListings;