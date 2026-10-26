import { useState } from 'react';
import { TrendingUp, Map, AlertCircle, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './MarketGapAnalysis.css';

// Sample data clearly labeled
const underservedAreas = [
  { area: 'North Phoenix', population: 145000, competitors: 3, opportunity: 89, gap: 'High' },
  { area: 'East Columbus', population: 98000, competitors: 2, opportunity: 86, gap: 'High' },
  { area: 'South Milwaukee', population: 87000, competitors: 1, opportunity: 84, gap: 'High' },
  { area: 'West Richmond', population: 76000, competitors: 2, opportunity: 78, gap: 'Medium' },
  { area: 'Central Memphis', population: 112000, competitors: 4, opportunity: 72, gap: 'Medium' },
];

const competitorData = [
  { category: 'Fast Food', count: 12, density: 8.5 },
  { category: 'Grocery', count: 8, density: 5.7 },
  { category: 'Retail', count: 15, density: 10.7 },
  { category: 'Services', count: 6, density: 4.3 },
  { category: 'Pharmacy', count: 4, density: 2.9 },
];

const MarketGapAnalysis = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');

  const regions = ['all', 'Southwest', 'Midwest', 'Southeast', 'Northeast'];

  return (
    <div className="market-gap">
      <div className="market-gap-header">
        <div>
          <h1 className="market-gap-title">Market Gap Analysis</h1>
          <p className="market-gap-subtitle">Identify underserved areas and market opportunities</p>
        </div>
        <div className="demo-badge">
          <AlertCircle size={16} />
          <span>Illustrative Sample Data</span>
        </div>
      </div>

      {/* Filters */}
      <section className="filters-section">
        <div className="section-card">
          <div className="section-card-content">
            <div className="filter-row">
              <div className="filter-group">
                <label className="filter-label">Region</label>
                <select
                  className="filter-select"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region === 'all' ? 'All Regions' : region}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts and Analysis */}
      <section className="analysis-section">
        <div className="analysis-grid">
          {/* Underserved Areas */}
          <div className="analysis-card">
            <div className="analysis-card-header">
              <div className="analysis-card-title-group">
                <Map size={24} className="section-icon" />
                <div>
                  <h2>Underserved Areas</h2>
                  <p>High opportunity, low competition zones</p>
                </div>
              </div>
            </div>
            <div className="analysis-card-content">
              <div className="underserved-list">
                {underservedAreas.map((area, index) => (
                  <div key={index} className="underserved-item">
                    <div className="underserved-info">
                      <h4>{area.area}</h4>
                      <div className="underserved-meta">
                        <span>Population: {area.population.toLocaleString()}</span>
                        <span>•</span>
                        <span>Competitors: {area.competitors}</span>
                      </div>
                    </div>
                    <div className="underserved-metrics">
                      <div className="opportunity-score">
                        <span className="opportunity-label">Opportunity</span>
                        <span className="opportunity-value">{area.opportunity}</span>
                      </div>
                      <span className={`gap-badge gap-${area.gap.toLowerCase()}`}>
                        {area.gap} Gap
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitor Density */}
          <div className="analysis-card">
            <div className="analysis-card-header">
              <div className="analysis-card-title-group">
                <BarChart3 size={24} className="section-icon" />
                <div>
                  <h2>Competitor Density by Category</h2>
                  <p>Market saturation analysis</p>
                </div>
              </div>
            </div>
            <div className="analysis-card-content">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={competitorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="density" fill="#f59e0b" name="Density (per 10k pop)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Explanation */}
      <section className="explanation-section">
        <div className="section-card">
          <div className="section-card-header">
            <div className="section-card-title-group">
              <TrendingUp size={24} className="section-icon" />
              <h2>Scoring Explanation</h2>
            </div>
          </div>
          <div className="section-card-content">
            <div className="explanation-grid">
              <div className="explanation-item">
                <h4>Market Opportunity Score</h4>
                <p>Calculated based on population size, income levels, growth trends, and demand indicators. Higher scores indicate greater untapped potential.</p>
              </div>
              <div className="explanation-item">
                <h4>Competitor Density</h4>
                <p>Number of direct competitors per 10,000 residents in the area. Lower density suggests less market saturation and easier entry.</p>
              </div>
              <div className="explanation-item">
                <h4>Gap Classification</h4>
                <p><strong>High Gap:</strong> Significant opportunity with minimal competition. <strong>Medium Gap:</strong> Moderate opportunity requiring competitive differentiation.</p>
              </div>
            </div>
            <div className="demo-notice">
              <AlertCircle size={16} />
              <span>This analysis uses illustrative sample data. Connect to the backend API for real market gap analysis based on actual location and competitor data.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketGapAnalysis;
