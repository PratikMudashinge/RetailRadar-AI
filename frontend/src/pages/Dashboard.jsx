import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Target, 
  TrendingUp, 
  Users, 
  Search,
  Brain,
  GitCompare,
  ArrowRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { api } from '../services/api';
import './Dashboard.css';

// Sample data clearly labeled as demo
const sampleKPIData = [
  { title: 'Locations Analyzed', value: '1,247', change: '+12%', icon: MapPin, color: 'emerald' },
  { title: 'Average Suitability Score', value: '78.5', change: '+5.2%', icon: Target, color: 'info' },
  { title: 'High-Potential Locations', value: '342', change: '+18%', icon: TrendingUp, color: 'warning' },
  { title: 'Market Coverage', value: '23%', change: '+3%', icon: Users, color: 'navy' },
];

const suitabilityData = [
  { name: '90-100', count: 45, color: '#10b981' },
  { name: '80-89', count: 89, color: '#34d399' },
  { name: '70-79', count: 134, color: '#f59e0b' },
  { name: '60-69', count: 42, color: '#fbbf24' },
  { name: 'Below 60', count: 32, color: '#ef4444' },
];

const marketOpportunityData = [
  { city: 'Mumbai', opportunity: 85, competition: 65 },
  { city: 'Bengaluru', opportunity: 84, competition: 58 },
  { city: 'Pune', opportunity: 82, competition: 52 },
  { city: 'Hyderabad', opportunity: 79, competition: 48 },
  { city: 'Mysuru', opportunity: 77, competition: 36 },
];

const competitorDensityData = [
  { month: 'Jan', density: 42 },
  { month: 'Feb', density: 45 },
  { month: 'Mar', density: 43 },
  { month: 'Apr', density: 47 },
  { month: 'May', density: 49 },
  { month: 'Jun', density: 51 },
];

const topCandidates = [
  { id: 1, name: 'Koregaon Park', city: 'Pune, Maharashtra', score: 94, rent: '₹28/sq ft', population: '165K' },
  { id: 2, name: 'Bandra West', city: 'Mumbai, Maharashtra', score: 92, rent: '₹52/sq ft', population: '245K' },
  { id: 3, name: 'Indiranagar', city: 'Bengaluru, Karnataka', score: 91, rent: '₹36/sq ft', population: '198K' },
  { id: 4, name: 'Jubilee Hills', city: 'Hyderabad, Telangana', score: 89, rent: '₹26/sq ft', population: '142K' },
  { id: 5, name: 'T Nagar', city: 'Chennai, Tamil Nadu', score: 87, rent: '₹24/sq ft', population: '176K' },
];

const recentAnalysis = [
  { id: 1, name: 'Mumbai-Pune Expansion Analysis (Sample)', date: '2024-01-15', status: 'Completed', locations: 12 },
  { id: 2, name: 'Bengaluru Market Study (Sample)', date: '2024-01-12', status: 'Completed', locations: 15 },
  { id: 3, name: 'Maharashtra Tier-2 Feasibility (Sample)', date: '2024-01-10', status: 'In Progress', locations: 18 },
];

const Dashboard = () => {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkApi = async () => {
      try {
        await api.health();
        setApiStatus('connected');
      } catch {
        setApiStatus('disconnected');
      }
    };
    checkApi();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Retail expansion intelligence overview</p>
        </div>
        <div className="demo-badge">
          <AlertCircle size={16} />
          <span>Sample Data - Demo Mode</span>
        </div>
      </div>

      {/* API Status */}
      <div className={`api-status-banner api-status-${apiStatus}`}>
        <div className="api-status-content">
          <span className="api-status-dot"></span>
          <span className="api-status-text">
            {apiStatus === 'connected' && 'Backend API Connected'}
            {apiStatus === 'disconnected' && 'Backend API Unavailable - Using Demo Data'}
            {apiStatus === 'checking' && 'Checking API Connection...'}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="kpi-section">
        <div className="kpi-grid">
          {sampleKPIData.map((kpi, index) => (
            <div key={index} className="kpi-card">
              <div className="kpi-header">
                <div className={`kpi-icon kpi-icon-${kpi.color}`}>
                  <kpi.icon size={24} />
                </div>
                <span className="kpi-change">{kpi.change}</span>
              </div>
              <div className="kpi-content">
                <h3 className="kpi-value">{kpi.value}</h3>
                <p className="kpi-title">{kpi.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <div className="charts-grid">
          {/* Suitability Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h2 className="chart-title">Suitability Score Distribution</h2>
              <p className="chart-subtitle">Sample data</p>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={suitabilityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {suitabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Opportunity vs Competition */}
          <div className="chart-card">
            <div className="chart-header">
              <h2 className="chart-title">Market Opportunity vs Competition</h2>
              <p className="chart-subtitle">Sample data - Top markets</p>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={marketOpportunityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="city" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="opportunity" fill="#10b981" name="Opportunity Score" />
                  <Bar dataKey="competition" fill="#f59e0b" name="Competition Level" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Competitor Density Trend */}
          <div className="chart-card chart-card-full">
            <div className="chart-header">
              <h2 className="chart-title">Competitor Density Trend</h2>
              <p className="chart-subtitle">Sample data - Industry average</p>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={competitorDensityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="density" stroke="#3b82f6" strokeWidth={2} name="Density %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="bottom-section">
        <div className="bottom-grid">
          {/* Top Candidates */}
          <div className="table-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Top Candidate Locations</h2>
                <p className="card-subtitle">Sample data</p>
              </div>
              <Link to="/recommendations" className="card-link">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>City</th>
                    <th>Suitability Score</th>
                    <th>Rent</th>
                    <th>Population</th>
                  </tr>
                </thead>
                <tbody>
                  {topCandidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td className="table-location">{candidate.name}</td>
                      <td>{candidate.city}</td>
                      <td>
                        <span className={`score-badge score-${candidate.score >= 90 ? 'high' : candidate.score >= 80 ? 'medium' : 'low'}`}>
                          {candidate.score}
                        </span>
                      </td>
                      <td>{candidate.rent}</td>
                      <td>{candidate.population}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Analysis */}
          <div className="side-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Recent Analysis</h2>
                <p className="card-subtitle">Sample history</p>
              </div>
              <Link to="/reports" className="card-link">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="side-card-content">
              {recentAnalysis.map((analysis) => (
                <div key={analysis.id} className="analysis-item">
                  <div className="analysis-info">
                    <h4 className="analysis-name">{analysis.name}</h4>
                    <div className="analysis-meta">
                      <Clock size={14} />
                      <span>{analysis.date}</span>
                      <span>•</span>
                      <span>{analysis.locations} locations</span>
                    </div>
                  </div>
                  <span className={`status-badge status-${analysis.status === 'Completed' ? 'completed' : 'progress'}`}>
                    {analysis.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/explorer" className="quick-action-card">
            <div className="quick-action-icon quick-action-explorer">
              <Search size={24} />
            </div>
            <div className="quick-action-content">
              <h3>Explore Locations</h3>
              <p>Search and filter potential sites</p>
            </div>
            <ArrowRight size={20} className="quick-action-arrow" />
          </Link>
          
          <Link to="/recommendations" className="quick-action-card">
            <div className="quick-action-icon quick-action-ai">
              <Brain size={24} />
            </div>
            <div className="quick-action-content">
              <h3>Run AI Analysis</h3>
              <p>Get AI-powered recommendations</p>
            </div>
            <ArrowRight size={20} className="quick-action-arrow" />
          </Link>
          
          <Link to="/comparison" className="quick-action-card">
            <div className="quick-action-icon quick-action-compare">
              <GitCompare size={24} />
            </div>
            <div className="quick-action-content">
              <h3>Compare Sites</h3>
              <p>Evaluate multiple locations side by side</p>
            </div>
            <ArrowRight size={20} className="quick-action-arrow" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
