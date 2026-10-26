import { useState } from 'react';
import { Brain, Play, AlertCircle, CheckCircle, Loader, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import './AIRecommendations.css';

// Sample data clearly labeled as demo
const sampleRecommendations = [
  {
    id: 1,
    name: 'East Austin District',
    city: 'Austin, TX',
    score: 94,
    positiveFactors: ['High foot traffic', 'Growing population', 'Limited direct competition', 'Good public transit'],
    risks: ['Rising rent costs', 'Parking limitations'],
    explanation: 'Prime location with strong demographic growth and favorable market conditions. High demand area with room for premium offerings.'
  },
  {
    id: 2,
    name: 'LoHi Neighborhood',
    city: 'Denver, CO',
    score: 91,
    positiveFactors: ['Affluent demographic', 'Strong dining scene', 'Walkable neighborhood', 'High disposable income'],
    risks: ['High competition in food & beverage', 'Expensive rent'],
    explanation: 'Upscale neighborhood with excellent spending power. Ideal for premium retail concepts targeting young professionals.'
  },
  {
    id: 3,
    name: 'Capitol Hill',
    city: 'Seattle, WA',
    score: 87,
    positiveFactors: ['Dense population', 'Tech worker demographic', 'Strong public transit', 'Year-round foot traffic'],
    risks: ['Rainy weather impact', 'High competition', 'Parking challenges'],
    explanation: 'Urban location with consistent foot traffic. Good for convenience retail and services catering to city dwellers.'
  },
];

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState(sampleRecommendations);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [demoMode, setDemoMode] = useState(true);
  const [analysisParams, setAnalysisParams] = useState({
    location: '',
    businessType: 'retail',
    budget: '',
  });

  const runAnalysis = async () => {
    if (!analysisParams.location.trim()) {
      setError('Please enter a location to analyze');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.runAnalysis(analysisParams);
      if (result && result.recommendations) {
        setRecommendations(result.recommendations);
        setDemoMode(false);
      } else {
        setError('Invalid response from API. Using demo data.');
        setRecommendations(sampleRecommendations);
        setDemoMode(true);
      }
    } catch (err) {
      setError(`Analysis failed: ${err.message}. Using demo data.`);
      setRecommendations(sampleRecommendations);
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'high';
    if (score >= 80) return 'medium';
    if (score >= 70) return 'low';
    return 'very-low';
  };

  return (
    <div className="ai-recommendations">
      <div className="recommendations-header">
        <div>
          <h1 className="recommendations-title">AI Recommendations</h1>
          <p className="recommendations-subtitle">AI-powered location suitability analysis</p>
        </div>
        {demoMode && (
          <div className="demo-badge">
            <AlertCircle size={16} />
            <span>Demo Mode - Sample Data</span>
          </div>
        )}
      </div>

      {/* Run Analysis Section */}
      <section className="run-analysis-section">
        <div className="section-card">
          <div className="section-card-header">
            <div className="section-card-title-group">
              <Brain size={24} className="section-icon" />
              <h2>Run New Analysis</h2>
            </div>
          </div>
          <div className="section-card-content">
            <div className="analysis-form">
              <div className="form-row">
                <div className="form-group form-group-flex">
                  <label className="form-label">Location/Area</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Austin, TX or specific neighborhood"
                    value={analysisParams.location}
                    onChange={(e) => setAnalysisParams({...analysisParams, location: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Business Type</label>
                  <select
                    className="form-select"
                    value={analysisParams.businessType}
                    onChange={(e) => setAnalysisParams({...analysisParams, businessType: e.target.value})}
                  >
                    <option value="retail">Retail</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="service">Service</option>
                    <option value="grocery">Grocery</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Budget Range</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., $50k - $100k"
                    value={analysisParams.budget}
                    onChange={(e) => setAnalysisParams({...analysisParams, budget: e.target.value})}
                  />
                </div>
              </div>
              <button 
                className="run-analysis-btn"
                onClick={runAnalysis}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size={18} className="btn-spinner" />
                    Running Analysis...
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Run AI Analysis
                  </>
                )}
              </button>
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

      {/* Recommendations Results */}
      <section className="recommendations-results">
        <div className="results-header">
          <h2>Ranked Candidates</h2>
          <p>{demoMode ? 'Sample recommendations (not from AI engine)' : 'AI-generated recommendations'}</p>
        </div>
        
        <div className="recommendations-list">
          {recommendations.map((rec, index) => (
            <div key={rec.id} className="recommendation-card">
              <div className="recommendation-card-header">
                <div className="recommendation-rank">
                  <span className="rank-number">#{index + 1}</span>
                </div>
                <div className="recommendation-info">
                  <h3 className="recommendation-name">{rec.name}</h3>
                  <p className="recommendation-location">{rec.city}</p>
                </div>
                <div className="recommendation-score">
                  <span className={`score-large score-${getScoreColor(rec.score)}`}>
                    {rec.score}
                  </span>
                  <span className="score-label">Suitability Score</span>
                </div>
              </div>
              
              <div className="recommendation-card-body">
                <div className="recommendation-section">
                  <div className="recommendation-section-header">
                    <CheckCircle size={18} className="section-icon-positive" />
                    <h4>Positive Factors</h4>
                  </div>
                  <ul className="factors-list">
                    {rec.positiveFactors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="recommendation-section">
                  <div className="recommendation-section-header">
                    <AlertTriangle size={18} className="section-icon-risk" />
                    <h4>Risks & Considerations</h4>
                  </div>
                  <ul className="risks-list">
                    {rec.risks.map((risk, idx) => (
                      <li key={idx}>{risk}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="recommendation-explanation">
                  <h4>AI Explanation</h4>
                  <p>{rec.explanation}</p>
                  {demoMode && (
                    <p className="demo-note">
                      <AlertCircle size={14} />
                      This explanation is generated from sample data, not from the AI engine.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AIRecommendations;
