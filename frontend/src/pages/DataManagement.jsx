import { useState } from 'react';
import { Upload, Download, Save, AlertCircle, CheckCircle, FileText, Settings } from 'lucide-react';
import { api } from '../services/api';
import './DataManagement.css';

const DataManagement = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const [csvError, setCsvError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [scoringPrefs, setScoringPrefs] = useState({
    populationWeight: 0.3,
    competitionWeight: 0.25,
    rentWeight: 0.2,
    accessibilityWeight: 0.25,
  });
  const [prefsSaved, setPrefsSaved] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setCsvError('Please select a valid CSV file');
      setCsvFile(null);
      setCsvPreview([]);
      return;
    }
    
    setCsvFile(file);
    setCsvError('');
    setUploadStatus(null);
    
    // Parse CSV preview
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        const preview = [];
        for (let i = 1; i < Math.min(lines.length, 6); i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const row = {};
          headers.forEach((header, idx) => {
            row[header] = values[idx] || '';
          });
          preview.push(row);
        }
        setCsvPreview(preview);
        // Basic validation
        const requiredHeaders = ['name', 'city'];
        const missingHeaders = requiredHeaders.filter(h => !headers.some(header => header.toLowerCase() === h));
        if (missingHeaders.length > 0) {
          setCsvError(`Missing required headers: ${missingHeaders.join(', ')}. Required: name, city`);
        }
      } catch {
        setCsvError('Error parsing CSV file');
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!csvFile) {
      setCsvError('Please select a file first');
      return;
    }
    
    setUploadLoading(true);
    setCsvError('');
    
    try {
      // Parse full CSV
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const text = event.target.result;
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          const locations = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const location = {};
            headers.forEach((header, idx) => {
              if (header === 'name') location.name = values[idx];
              else if (header === 'city') location.city = values[idx];
              else if (header === 'region' || header === 'state') location.region = values[idx];
              else if (header === 'lat' || header === 'latitude') location.lat = parseFloat(values[idx]) || null;
              else if (header === 'lng' || header === 'longitude') location.lng = parseFloat(values[idx]) || null;
              else if (header === 'population') location.population = parseInt(values[idx]) || null;
              else if (header === 'rent') location.rent = parseFloat(values[idx]) || null;
            });
            if (location.name && location.city) {
              locations.push(location);
            }
          }
          
          // Try to upload via API
          let successCount = 0;
          for (const loc of locations) {
            try {
              await api.createLocation(loc);
              successCount++;
            } catch {
              // Continue with other locations
            }
          }
          
          if (successCount > 0) {
            setUploadStatus({ type: 'success', message: `Successfully uploaded ${successCount} location(s) to server.` });
          } else {
            setUploadStatus({ type: 'warning', message: 'CSV parsed successfully but API upload failed. No locations were saved to server.' });
          }
        } catch {
          setUploadStatus({ type: 'error', message: 'Error processing CSV file.' });
        }
        setUploadLoading(false);
      };
      reader.readAsText(csvFile);
    } catch {
      setUploadStatus({ type: 'error', message: 'Error reading file.' });
      setUploadLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'name,city,region,lat,lng,population,rent\nKoregaon Park,Pune,Maharashtra,18.5362,73.8939,165000,28\nIndiranagar,Bengaluru,Karnataka,12.9719,77.6412,198000,36\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'location_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const savePreferences = () => {
    // Validate weights sum to 1
    const sum = scoringPrefs.populationWeight + scoringPrefs.competitionWeight + scoringPrefs.rentWeight + scoringPrefs.accessibilityWeight;
    if (Math.abs(sum - 1.0) > 0.01) {
      alert('Weights must sum to 1.0');
      return;
    }
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 3000);
  };

  const updatePref = (key, value) => {
    setScoringPrefs({ ...scoringPrefs, [key]: parseFloat(value) || 0 });
  };

  return (
    <div className="data-management">
      <div className="data-management-header">
        <div>
          <h1 className="data-management-title">Data Management</h1>
          <p className="data-management-subtitle">Import locations and configure scoring preferences</p>
        </div>
      </div>

      <div className="data-management-grid">
        {/* CSV Import */}
        <section className="data-section">
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-card-title-group">
                <Upload size={24} className="section-icon" />
                <h2>Import Locations from CSV</h2>
              </div>
            </div>
            <div className="section-card-content">
              <div className="csv-import">
                <div className="template-download">
                  <button className="template-btn" onClick={downloadTemplate}>
                    <Download size={18} />
                    Download Template CSV
                  </button>
                  <p className="template-help">Required columns: name, city. Optional: region, lat, lng, population, rent</p>
                </div>
                
                <div className="file-upload">
                  <label className="file-upload-label">
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileSelect}
                      className="file-input"
                    />
                    <div className="file-upload-content">
                      <FileText size={32} />
                      <p>{csvFile ? csvFile.name : 'Choose CSV file or drag and drop'}</p>
                      <span>Click to select file</span>
                    </div>
                  </label>
                </div>
                
                {csvError && (
                  <div className="csv-error">
                    <AlertCircle size={16} />
                    <span>{csvError}</span>
                  </div>
                )}
                
                {csvPreview.length > 0 && (
                  <div className="csv-preview">
                    <h3>Preview (first 5 rows)</h3>
                    <div className="preview-table-container">
                      <table className="preview-table">
                        <thead>
                          <tr>
                            {Object.keys(csvPreview[0]).map(key => (
                              <th key={key}>{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreview.map((row, idx) => (
                            <tr key={idx}>
                              {Object.values(row).map((val, vidx) => (
                                <td key={vidx}>{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                <button
                  className="upload-btn"
                  onClick={handleUpload}
                  disabled={!csvFile || uploadLoading || csvError}
                >
                  {uploadLoading ? 'Uploading...' : 'Upload and Import'}
                </button>
                
                {uploadStatus && (
                  <div className={`upload-status upload-status-${uploadStatus.type}`}>
                    {uploadStatus.type === 'success' && <CheckCircle size={16} />}
                    {uploadStatus.type === 'warning' && <AlertCircle size={16} />}
                    {uploadStatus.type === 'error' && <AlertCircle size={16} />}
                    <span>{uploadStatus.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Scoring Preferences */}
        <section className="data-section">
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-card-title-group">
                <Settings size={24} className="section-icon" />
                <h2>Scoring Preferences</h2>
              </div>
            </div>
            <div className="section-card-content">
              <div className="preferences">
                <p className="preferences-help">Configure weights for location suitability scoring. Total must equal 1.0.</p>
                
                <div className="preference-group">
                  <label className="preference-label">Population Weight</label>
                  <input
                    type="range"
                    className="preference-range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={scoringPrefs.populationWeight}
                    onChange={(e) => updatePref('populationWeight', e.target.value)}
                  />
                  <div className="preference-value">{scoringPrefs.populationWeight.toFixed(2)}</div>
                </div>
                
                <div className="preference-group">
                  <label className="preference-label">Competition Weight</label>
                  <input
                    type="range"
                    className="preference-range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={scoringPrefs.competitionWeight}
                    onChange={(e) => updatePref('competitionWeight', e.target.value)}
                  />
                  <div className="preference-value">{scoringPrefs.competitionWeight.toFixed(2)}</div>
                </div>
                
                <div className="preference-group">
                  <label className="preference-label">Rent Weight</label>
                  <input
                    type="range"
                    className="preference-range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={scoringPrefs.rentWeight}
                    onChange={(e) => updatePref('rentWeight', e.target.value)}
                  />
                  <div className="preference-value">{scoringPrefs.rentWeight.toFixed(2)}</div>
                </div>
                
                <div className="preference-group">
                  <label className="preference-label">Accessibility Weight</label>
                  <input
                    type="range"
                    className="preference-range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={scoringPrefs.accessibilityWeight}
                    onChange={(e) => updatePref('accessibilityWeight', e.target.value)}
                  />
                  <div className="preference-value">{scoringPrefs.accessibilityWeight.toFixed(2)}</div>
                </div>
                
                <div className="preferences-total">
                  <strong>Total: {(scoringPrefs.populationWeight + scoringPrefs.competitionWeight + scoringPrefs.rentWeight + scoringPrefs.accessibilityWeight).toFixed(2)}</strong>
                </div>
                
                <button className="save-prefs-btn" onClick={savePreferences}>
                  <Save size={18} />
                  Save Preferences
                </button>
                
                {prefsSaved && (
                  <div className="prefs-saved">
                    <CheckCircle size={16} />
                    <span>Preferences saved locally</span>
                  </div>
                )}
                
                <div className="prefs-note">
                  <AlertCircle size={16} />
                  <span>Preferences are saved locally only - no persistence endpoint available on server.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DataManagement;
