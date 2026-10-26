import { useState } from 'react';
import { GitCompare, Plus, X, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import './SiteComparison.css';

const sampleLocations = [
  { id: 1, name: 'Koregaon Park', city: 'Pune, Maharashtra', score: 94, rent: 28, population: 165000, competition: 4, accessibility: 93 },
  { id: 2, name: 'Bandra West', city: 'Mumbai, Maharashtra', score: 92, rent: 52, population: 245000, competition: 6, accessibility: 91 },
  { id: 3, name: 'Indiranagar', city: 'Bengaluru, Karnataka', score: 91, rent: 36, population: 198000, competition: 5, accessibility: 90 },
];

const SiteComparison = () => {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [availableLocations] = useState(sampleLocations);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addLocation = (location) => {
    if (selectedLocations.length < 3 && !selectedLocations.find(l => l.id === location.id)) {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const removeLocation = (locationId) => {
    setSelectedLocations(selectedLocations.filter(l => l.id !== locationId));
  };

  const runComparison = async () => {
    if (selectedLocations.length < 2) {
      setError('Please select at least 2 locations to compare');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await api.compareAnalysis({ locations: selectedLocations.map(l => l.id) });
    } catch (err) {
      setError(`Comparison failed: ${err.message}. Using sample comparison.`);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="comparison">
      <div className="comparison-header">
        <div>
          <h1 className="comparison-title">Site Comparison</h1>
          <p className="comparison-subtitle">Compare multiple locations side by side</p>
        </div>
        <div className="demo-badge">
          <AlertCircle size={16} />
          <span>Sample Data - Demo Mode</span>
        </div>
      </div>

      {/* Location Selection */}
      <section className="selection-section">
        <div className="section-card">
          <div className="section-card-header">
            <div className="section-card-title-group">
              <GitCompare size={24} className="section-icon" />
              <h2>Select Locations to Compare (2-3)</h2>
            </div>
          </div>
          <div className="section-card-content">
            <div className="selection-layout">
              <div className="available-locations">
                <h3>Available Locations</h3>
                <div className="available-list">
                  {availableLocations.map(location => (
                    <div
                      key={location.id}
                      className={`available-item ${selectedLocations.find(l => l.id === location.id) ? 'available-item-selected' : ''}`}
                      onClick={() => addLocation(location)}
                    >
                      <div className="available-item-info">
                        <h4>{location.name}</h4>
                        <p>{location.city}</p>
                      </div>
                      <Plus size={18} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="selected-locations">
                <h3>Selected ({selectedLocations.length}/3)</h3>
                <div className="selected-list">
                  {selectedLocations.length === 0 ? (
                    <div className="empty-selection">
                      <p>Select locations from the left to compare</p>
                    </div>
                  ) : (
                    selectedLocations.map(location => (
                      <div key={location.id} className="selected-item">
                        <div className="selected-item-info">
                          <h4>{location.name}</h4>
                          <p>{location.city}</p>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => removeLocation(location.id)}
                          aria-label="Remove location"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <button
                  className="compare-btn"
                  onClick={runComparison}
                  disabled={loading || selectedLocations.length < 2}
                >
                  {loading ? 'Comparing...' : 'Compare Sites'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Comparison Results */}
      {selectedLocations.length >= 2 && (
        <section className="comparison-results">
          <div className="section-card">
            <div className="section-card-header">
              <h2>Comparison Results</h2>
              <p>Side-by-side analysis of selected locations</p>
            </div>
            <div className="section-card-content">
              <div className="comparison-table-container">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      {selectedLocations.map(loc => (
                        <th key={loc.id}>{loc.name}<br/><span className="table-subheader">{loc.city}</span></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="metric-name">Suitability Score</td>
                      {selectedLocations.map((loc) => (
                        <td key={loc.id} className="metric-value">
                          <span className={`score-badge score-${loc.score >= 90 ? 'high' : loc.score >= 80 ? 'medium' : 'low'}`}>
                            {loc.score}/100
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="metric-name">Monthly Rent ($/sq ft)</td>
                      {selectedLocations.map(loc => (
                        <td key={loc.id} className="metric-value">{loc.rent}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="metric-name">Population</td>
                      {selectedLocations.map(loc => (
                        <td key={loc.id} className="metric-value">{loc.population.toLocaleString()}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="metric-name">Competition Level</td>
                      {selectedLocations.map(loc => (
                        <td key={loc.id} className="metric-value">{loc.competition}/10</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="metric-name">Accessibility Score</td>
                      {selectedLocations.map(loc => (
                        <td key={loc.id} className="metric-value">{loc.accessibility}/100</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="comparison-notes">
                <div className="note-item">
                  <CheckCircle size={16} className="note-icon" />
                  <span>Higher suitability scores indicate better overall fit</span>
                </div>
                <div className="note-item">
                  <AlertCircle size={16} className="note-icon" />
                  <span>Lower rent and competition are generally more favorable</span>
                </div>
                <div className="note-item">
                  <AlertCircle size={16} className="note-icon" />
                  <span>Missing values are not fabricated - shown as N/A if unavailable</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SiteComparison;
