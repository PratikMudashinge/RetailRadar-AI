import { useState, useEffect } from 'react';
import { FileText, Printer, AlertCircle, Calendar, MapPin, Eye } from 'lucide-react';
import { api } from '../services/api';
import './Reports.css';

// Sample data clearly labeled
const sampleReports = [
  { id: 1, title: 'Mumbai-Pune Retail Corridor Analysis (Sample)', date: '2024-01-15', type: 'Market Analysis', locations: 12, status: 'Completed', sample: true },
  { id: 2, title: 'Bengaluru-Karnataka Expansion Feasibility (Sample)', date: '2024-01-12', type: 'Feasibility Study', locations: 15, status: 'Completed', sample: true },
  { id: 3, title: 'Maharashtra Tier-2 City Site Selection (Sample)', date: '2024-01-10', type: 'Site Selection', locations: 18, status: 'Completed', sample: true },
];

const Reports = () => {
  const [reports, setReports] = useState(sampleReports);
  const [error, setError] = useState(null);
  const [usingSampleData, setUsingSampleData] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setError(null);
      try {
        const data = await api.getReports();
        if (data && Array.isArray(data) && data.length > 0) {
          setReports(data.map(r => ({ ...r, sample: false })));
          setUsingSampleData(false);
        } else {
          setError('No reports available from API. Using sample data.');
          setUsingSampleData(true);
        }
      } catch (err) {
        setError(`Failed to fetch reports: ${err.message}. Using sample data.`);
        setUsingSampleData(true);
      }
    };
    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const viewReport = (report) => {
    setSelectedReport(report);
  };

  const closeReport = () => {
    setSelectedReport(null);
  };

  return (
    <div className="reports">
      <div className="reports-header">
        <div>
          <h1 className="reports-title">Reports</h1>
          <p className="reports-subtitle">Analysis history and report management</p>
        </div>
        <div className="header-actions">
          {usingSampleData && (
            <div className="demo-badge">
              <AlertCircle size={16} />
              <span>Sample Reports</span>
            </div>
          )}
          <button className="print-btn no-print" onClick={handlePrint}>
            <Printer size={18} />
            Print Page
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Reports List */}
      {!selectedReport && (
        <section className="reports-list-section">
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-card-title-group">
                <FileText size={24} className="section-icon" />
                <h2>Report History</h2>
              </div>
            </div>
            <div className="section-card-content">
              <div className="reports-table-container">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Report</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Locations</th>
                      <th>Status</th>
                      <th>Source</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(report => (
                      <tr key={report.id}>
                        <td className="report-title-cell">
                          <div className="report-title-info">
                            <h4>{report.title}</h4>
                          </div>
                        </td>
                        <td>{report.type}</td>
                        <td>
                          <div className="date-cell">
                            <Calendar size={14} />
                            <span>{report.date}</span>
                          </div>
                        </td>
                        <td>
                          <div className="locations-cell">
                            <MapPin size={14} />
                            <span>{report.locations}</span>
                          </div>
                        </td>
                        <td>
                          <span className="status-badge status-completed">{report.status}</span>
                        </td>
                        <td>
                          <span className={`source-badge ${report.sample ? 'source-sample' : 'source-real'}`}>
                            {report.sample ? 'Sample' : 'Real'}
                          </span>
                        </td>
                        <td>
                          <button className="view-report-btn" onClick={() => viewReport(report)}>
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Report Detail View */}
      {selectedReport && (
        <section className="report-detail-section">
          <div className="section-card">
            <div className="section-card-header">
              <div className="detail-header">
                <div>
                  <h2>{selectedReport.title}</h2>
                  <div className="detail-meta">
                    <span>{selectedReport.type}</span>
                    <span>•</span>
                    <span>{selectedReport.date}</span>
                    <span>•</span>
                    <span>{selectedReport.locations} locations analyzed</span>
                    <span>•</span>
                    <span className={`source-badge ${selectedReport.sample ? 'source-sample' : 'source-real'}`}>
                      {selectedReport.sample ? 'Sample Report' : 'Real Report'}
                    </span>
                  </div>
                </div>
                <div className="detail-actions no-print">
                  <button className="back-btn" onClick={closeReport}>Back to Reports</button>
                  <button className="print-btn" onClick={handlePrint}>
                    <Printer size={18} />
                    Print Report
                  </button>
                </div>
              </div>
            </div>
            <div className="section-card-content">
              <div className="report-content">
                <div className="report-section">
                  <h3>Executive Summary</h3>
                  <p>This report analyzes potential retail locations based on market conditions, demographics, competition, and suitability factors. The analysis provides data-driven recommendations for optimal site selection.</p>
                  {selectedReport.sample && (
                    <div className="sample-notice">
                      <AlertCircle size={16} />
                      <span>This is a sample report for demonstration purposes. Real reports would contain actual analysis data from your backend.</span>
                    </div>
                  )}
                </div>
                
                <div className="report-section">
                  <h3>Key Findings</h3>
                  <ul>
                    <li>Market opportunity remains strong in target regions</li>
                    <li>Competition levels vary significantly by location</li>
                    <li>Demographic alignment supports expansion strategy</li>
                    <li>Recommended focus on high-suitability locations</li>
                  </ul>
                </div>
                
                <div className="report-section">
                  <h3>Recommendations</h3>
                  <p>Based on the analysis, we recommend prioritizing locations with suitability scores above 80, considering local market conditions and competition levels. Conduct detailed site visits for top candidates before final selection.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Reports;
