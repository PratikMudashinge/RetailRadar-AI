import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search, Filter, MapPin, AlertCircle, Loader } from 'lucide-react';
import L from 'leaflet';
import { api } from '../services/api';
import './LocationExplorer.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Sample data clearly labeled (Indian cities - illustrative only, not verified market research)
const sampleLocations = [
  // Maharashtra - existing
  { id: 1, name: 'Koregaon Park', city: 'Pune', region: 'Maharashtra', lat: 18.5362, lng: 73.8939, population: 165000, rent: 28, competition: 4, suitability: 94 },
  { id: 2, name: 'Bandra West', city: 'Mumbai', region: 'Maharashtra', lat: 19.0596, lng: 72.8295, population: 245000, rent: 52, competition: 6, suitability: 92 },
  { id: 3, name: 'Sitabuldi', city: 'Nagpur', region: 'Maharashtra', lat: 21.1458, lng: 79.0882, population: 112000, rent: 14, competition: 3, suitability: 84 },
  { id: 4, name: 'College Road', city: 'Nashik', region: 'Maharashtra', lat: 20.0059, lng: 73.7910, population: 98000, rent: 13, competition: 2, suitability: 83 },
  { id: 5, name: 'Rajaram Road', city: 'Kolhapur', region: 'Maharashtra', lat: 16.7050, lng: 74.2433, population: 86000, rent: 12, competition: 2, suitability: 82 },
  // Maharashtra - additional
  { id: 6, name: 'Vishrambaug Wada', city: 'Sangli', region: 'Maharashtra', lat: 16.8524, lng: 74.5815, population: 89000, rent: 13, competition: 2, suitability: 83 },
  { id: 7, name: 'Rajwada Chowk', city: 'Satara', region: 'Maharashtra', lat: 17.6805, lng: 74.0183, population: 76000, rent: 11, competition: 2, suitability: 81 },
  { id: 8, name: 'Market Yard', city: 'Solapur', region: 'Maharashtra', lat: 17.6599, lng: 75.9064, population: 104000, rent: 12, competition: 3, suitability: 82 },
  { id: 9, name: 'Cidco N-11', city: 'Chhatrapati Sambhajinagar', region: 'Maharashtra', lat: 19.8762, lng: 75.3433, population: 126000, rent: 16, competition: 3, suitability: 85 },
  { id: 10, name: 'Rajapeth', city: 'Amravati', region: 'Maharashtra', lat: 20.9374, lng: 77.7796, population: 82000, rent: 10, competition: 2, suitability: 80 },
  { id: 11, name: 'M.G. Road', city: 'Akola', region: 'Maharashtra', lat: 20.7002, lng: 77.0082, population: 78000, rent: 9, competition: 2, suitability: 79 },
  { id: 12, name: 'Mehrun', city: 'Jalgaon', region: 'Maharashtra', lat: 21.0077, lng: 75.5626, population: 74000, rent: 9, competition: 2, suitability: 79 },
  { id: 13, name: 'Shivaji Nagar', city: 'Nanded', region: 'Maharashtra', lat: 19.1383, lng: 77.3210, population: 71000, rent: 9, competition: 2, suitability: 78 },
  { id: 14, name: 'Ganj Golai', city: 'Latur', region: 'Maharashtra', lat: 18.4088, lng: 76.5604, population: 68000, rent: 8, competition: 2, suitability: 78 },
  { id: 15, name: 'Savedi Road', city: 'Ahilyanagar', region: 'Maharashtra', lat: 19.0952, lng: 74.7496, population: 72000, rent: 9, competition: 2, suitability: 79 },
  { id: 16, name: 'Subhash Chowk', city: 'Dhule', region: 'Maharashtra', lat: 20.9042, lng: 74.7749, population: 66000, rent: 8, competition: 2, suitability: 77 },
  { id: 17, name: 'Thibaw Palace Road', city: 'Ratnagiri', region: 'Maharashtra', lat: 16.9944, lng: 73.3000, population: 58000, rent: 10, competition: 1, suitability: 76 },
  { id: 18, name: 'Jain Mandir Road', city: 'Ichalkaranji', region: 'Maharashtra', lat: 16.6916, lng: 74.4605, population: 92000, rent: 11, competition: 2, suitability: 81 },
  // Karnataka
  { id: 19, name: 'Indiranagar', city: 'Bengaluru', region: 'Karnataka', lat: 12.9719, lng: 77.6412, population: 198000, rent: 36, competition: 5, suitability: 91 },
  { id: 20, name: 'Vidyanagar', city: 'Hubballi', region: 'Karnataka', lat: 15.3647, lng: 75.1240, population: 112000, rent: 14, competition: 3, suitability: 84 },
  { id: 21, name: 'Saptapur', city: 'Dharwad', region: 'Karnataka', lat: 15.4589, lng: 75.0078, population: 98000, rent: 13, competition: 3, suitability: 83 },
  { id: 22, name: 'Tilakwadi', city: 'Belagavi', region: 'Karnataka', lat: 15.8497, lng: 74.4977, population: 106000, rent: 13, competition: 3, suitability: 83 },
  { id: 23, name: 'Sayyaji Rao Road', city: 'Mysuru', region: 'Karnataka', lat: 12.2958, lng: 76.6394, population: 142000, rent: 18, competition: 3, suitability: 87 },
  { id: 24, name: 'Hampankatta', city: 'Mangaluru', region: 'Karnataka', lat: 12.9141, lng: 74.8560, population: 138000, rent: 19, competition: 4, suitability: 86 },
  { id: 25, name: 'Durgigudi', city: 'Shivamogga', region: 'Karnataka', lat: 13.9299, lng: 75.5681, population: 82000, rent: 11, competition: 2, suitability: 81 },
  { id: 26, name: 'PJ Extension', city: 'Davanagere', region: 'Karnataka', lat: 14.4644, lng: 75.9218, population: 88000, rent: 11, competition: 2, suitability: 81 },
  { id: 27, name: 'Cantonment', city: 'Ballari', region: 'Karnataka', lat: 15.1394, lng: 76.9214, population: 94000, rent: 12, competition: 2, suitability: 82 },
  { id: 28, name: 'MG Road', city: 'Tumakuru', region: 'Karnataka', lat: 13.3379, lng: 77.1173, population: 92000, rent: 12, competition: 2, suitability: 82 },
  { id: 29, name: 'Super Market', city: 'Kalaburagi', region: 'Karnataka', lat: 17.3213, lng: 76.8417, population: 86000, rent: 10, competition: 2, suitability: 80 },
  { id: 30, name: 'Station Road', city: 'Vijayapura', region: 'Karnataka', lat: 16.8302, lng: 75.7100, population: 78000, rent: 9, competition: 2, suitability: 79 },
  { id: 31, name: 'Car Street', city: 'Udupi', region: 'Karnataka', lat: 13.3409, lng: 74.7421, population: 76000, rent: 12, competition: 2, suitability: 80 },
  // Other cities for context
  { id: 32, name: 'Jubilee Hills', city: 'Hyderabad', region: 'Telangana', lat: 17.4326, lng: 78.4071, population: 142000, rent: 26, competition: 4, suitability: 89 },
  { id: 33, name: 'T Nagar', city: 'Chennai', region: 'Tamil Nadu', lat: 13.0418, lng: 80.2341, population: 176000, rent: 24, competition: 5, suitability: 87 },
  { id: 34, name: 'Navrangpura', city: 'Ahmedabad', region: 'Gujarat', lat: 23.0395, lng: 72.5660, population: 158000, rent: 18, competition: 3, suitability: 86 },
  { id: 35, name: 'Vijay Nagar', city: 'Indore', region: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, population: 134000, rent: 16, competition: 3, suitability: 85 },
];

function MapController({ selectedLocation }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      map.setView([selectedLocation.lat, selectedLocation.lng], 13);
    }
  }, [selectedLocation, map]);
  
  return null;
}

const LocationExplorer = () => {
  const [locations, setLocations] = useState(sampleLocations);
  const [filteredLocations, setFilteredLocations] = useState(sampleLocations);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingSampleData, setUsingSampleData] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [minPopulation, setMinPopulation] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [minSuitability, setMinSuitability] = useState('');
  
  const cities = [...new Set(locations.map(l => l.city))].sort();
  
  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getLocations();
        if (data && Array.isArray(data) && data.length > 0) {
          // Check if data has coordinates
          const validData = data.filter(l => l.lat && l.lng);
          if (validData.length > 0) {
            setLocations(validData);
            setFilteredLocations(validData);
            setUsingSampleData(false);
          } else {
            setError('Location data missing coordinates. Using sample data.');
            setLocations(sampleLocations);
            setFilteredLocations(sampleLocations);
            setUsingSampleData(true);
          }
        } else {
          setError('No location data available. Using sample data.');
          setLocations(sampleLocations);
          setFilteredLocations(sampleLocations);
          setUsingSampleData(true);
        }
      } catch (err) {
        setError(`Failed to fetch locations: ${err.message}. Using sample data.`);
        setLocations(sampleLocations);
        setFilteredLocations(sampleLocations);
        setUsingSampleData(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, []);
  
  useEffect(() => {
    const filterLocations = () => {
      let filtered = locations;
      
      if (searchTerm) {
        filtered = filtered.filter(l => 
          l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.city.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (cityFilter) {
        filtered = filtered.filter(l => l.city === cityFilter);
      }
      
      if (minPopulation) {
        filtered = filtered.filter(l => (l.population || 0) >= parseInt(minPopulation));
      }
      
      if (maxRent) {
        filtered = filtered.filter(l => (l.rent || 0) <= parseInt(maxRent));
      }
      
      if (minSuitability) {
        filtered = filtered.filter(l => (l.suitability || 0) >= parseInt(minSuitability));
      }
      
      setFilteredLocations(filtered);
    };
    
    filterLocations();
  }, [searchTerm, cityFilter, minPopulation, maxRent, minSuitability, locations]);
  
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };
  
  return (
    <div className="location-explorer">
      <div className="explorer-header">
        <div>
          <h1 className="explorer-title">Location Explorer</h1>
          <p className="explorer-subtitle">Search, filter and visualize potential retail locations</p>
        </div>
        {usingSampleData && (
          <div className="demo-badge">
            <AlertCircle size={16} />
            <span>Sample Locations - Demo Mode (India)</span>
          </div>
        )}
      </div>
      
      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      <div className="explorer-layout">
        {/* Filters and List */}
        <div className="explorer-sidebar">
          <div className="filters-section">
            <div className="filters-header">
              <Filter size={20} />
              <h2>Filters</h2>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">City</label>
              <select
                className="filter-select"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-row">
              <div className="filter-group filter-group-half">
                <label className="filter-label">Min Population</label>
                <input
                  type="number"
                  className="filter-input"
                  placeholder="e.g., 50000"
                  value={minPopulation}
                  onChange={(e) => setMinPopulation(e.target.value)}
                />
              </div>
              <div className="filter-group filter-group-half">
                <label className="filter-label">Max Rent (₹/sq ft)</label>
                <input
                  type="number"
                  className="filter-input"
                  placeholder="e.g., 40"
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Min Suitability Score</label>
              <input
                type="range"
                className="filter-range"
                min="0"
                max="100"
                value={minSuitability || 0}
                onChange={(e) => setMinSuitability(e.target.value)}
              />
              <div className="range-labels">
                <span>0</span>
                <span>{minSuitability || 0}</span>
                <span>100</span>
              </div>
            </div>
          </div>
          
          <div className="locations-list-section">
            <div className="locations-list-header">
              <h3>Locations ({filteredLocations.length})</h3>
              {loading && <Loader size={16} className="loading-spinner" />}
            </div>
            
            <div className="locations-list">
              {filteredLocations.length === 0 ? (
                <div className="empty-state">
                  <MapPin size={32} />
                  <p>No locations match your filters</p>
                </div>
              ) : (
                filteredLocations.map(location => (
                  <div
                    key={location.id}
                    className={`location-item ${selectedLocation?.id === location.id ? 'location-item-selected' : ''}`}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="location-item-header">
                      <h4 className="location-item-name">{location.name}</h4>
                      <span className={`score-badge score-${location.suitability >= 90 ? 'high' : location.suitability >= 80 ? 'medium' : 'low'}`}>
                        {location.suitability}
                      </span>
                    </div>
                    <p className="location-item-city">{location.city}, {location.region}</p>
                    <div className="location-item-details">
                      <span>Pop: {(location.population || 0).toLocaleString()}</span>
                      <span>•</span>
                      <span>Rent: ₹{location.rent}/sq ft</span>
                      <span>•</span>
                      <span>Comp: {location.competition}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className="explorer-map">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            className="leaflet-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController selectedLocation={selectedLocation} />
            {filteredLocations.map(location => {
              if (!location.lat || !location.lng) return null;
              return (
                <Marker
                  key={location.id}
                  position={[location.lat, location.lng]}
                  eventHandlers={{
                    click: () => handleLocationSelect(location),
                  }}
                >
                  <Popup>
                    <div className="map-popup">
                      <h4>{location.name}</h4>
                      <p>{location.city}, {location.region}</p>
                      <p><strong>Suitability:</strong> {location.suitability}/100</p>
                      <p><strong>Population:</strong> {(location.population || 0).toLocaleString()}</p>
                      <p><strong>Rent:</strong> ₹{location.rent}/sq ft</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default LocationExplorer;
