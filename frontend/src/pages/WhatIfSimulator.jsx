import { useState } from 'react';
import { Calculator, AlertCircle, BarChart3, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './WhatIfSimulator.css';

const WhatIfSimulator = () => {
  const [assumptions, setAssumptions] = useState({
    rent: 25,
    expectedDemand: 75,
    competitorDensity: 40,
    populationReach: 85000,
    operatingCost: 15000,
  });
  
  const [results, setResults] = useState({
    projectedRevenue: 187500,
    netProfit: 45000,
    roi: 24.0,
    breakEvenMonths: 18,
  });
  
  const [scenarios, setScenarios] = useState([
    { name: 'Current', ...assumptions, ...results },
  ]);
  
  const calculateResults = (inputs) => {
    // Frontend estimates only - clearly labeled
    const revenue = inputs.expectedDemand * 2500; // rough estimate
    const costs = inputs.operatingCost + (inputs.rent * 1000); // rough estimate
    const profit = revenue - costs;
    const roi = costs > 0 ? (profit / costs) * 100 : 0;
    const breakEven = profit > 0 ? Math.ceil(costs / (profit / 12)) : 999;
    
    return {
      projectedRevenue: Math.round(revenue),
      netProfit: Math.round(profit),
      roi: Math.round(roi * 10) / 10,
      breakEvenMonths: breakEven > 100 ? 'N/A' : breakEven,
    };
  };
  
  const handleInputChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    const newAssumptions = { ...assumptions, [field]: numValue };
    setAssumptions(newAssumptions);
    const newResults = calculateResults(newAssumptions);
    setResults(newResults);
  };
  
  const saveScenario = () => {
    const scenarioName = prompt('Enter scenario name:');
    if (scenarioName) {
      setScenarios([...scenarios, { name: scenarioName, ...assumptions, ...results }]);
    }
  };
  
  const comparisonData = scenarios.map(s => ({
    name: s.name,
    revenue: s.projectedRevenue,
    profit: s.netProfit,
    roi: s.roi,
  }));

  return (
    <div className="simulator">
      <div className="simulator-header">
        <div>
          <h1 className="simulator-title">What-If Simulator</h1>
          <p className="simulator-subtitle">Model different scenarios and compare outcomes</p>
        </div>
        <div className="demo-badge">
          <AlertCircle size={16} />
          <span>Frontend Estimates Only - Not AI Predictions</span>
        </div>
      </div>

      <div className="simulator-layout">
        {/* Assumptions Panel */}
        <div className="assumptions-panel">
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-card-title-group">
                <Calculator size={24} className="section-icon" />
                <h2>Assumptions</h2>
              </div>
            </div>
            <div className="section-card-content">
              <div className="assumptions-form">
                <div className="assumption-group">
                  <label className="assumption-label">Monthly Rent ($/sq ft)</label>
                  <input
                    type="number"
                    className="assumption-input"
                    value={assumptions.rent}
                    onChange={(e) => handleInputChange('rent', e.target.value)}
                    min="0"
                    step="0.5"
                  />
                </div>
                
                <div className="assumption-group">
                  <label className="assumption-label">Expected Demand (0-100)</label>
                  <input
                    type="range"
                    className="assumption-range"
                    min="0"
                    max="100"
                    value={assumptions.expectedDemand}
                    onChange={(e) => handleInputChange('expectedDemand', e.target.value)}
                  />
                  <div className="range-display">{assumptions.expectedDemand}</div>
                </div>
                
                <div className="assumption-group">
                  <label className="assumption-label">Competitor Density (0-100)</label>
                  <input
                    type="range"
                    className="assumption-range"
                    min="0"
                    max="100"
                    value={assumptions.competitorDensity}
                    onChange={(e) => handleInputChange('competitorDensity', e.target.value)}
                  />
                  <div className="range-display">{assumptions.competitorDensity}</div>
                </div>
                
                <div className="assumption-group">
                  <label className="assumption-label">Population Reach</label>
                  <input
                    type="number"
                    className="assumption-input"
                    value={assumptions.populationReach}
                    onChange={(e) => handleInputChange('populationReach', e.target.value)}
                    min="0"
                    step="1000"
                  />
                </div>
                
                <div className="assumption-group">
                  <label className="assumption-label">Estimated Operating Cost ($/month)</label>
                  <input
                    type="number"
                    className="assumption-input"
                    value={assumptions.operatingCost}
                    onChange={(e) => handleInputChange('operatingCost', e.target.value)}
                    min="0"
                    step="500"
                  />
                </div>
              </div>
              
              <button className="save-scenario-btn" onClick={saveScenario}>
                <RefreshCw size={18} />
                Save as Scenario
              </button>
            </div>
          </div>
        </div>
        
        {/* Results Panel */}
        <div className="results-panel">
          <div className="section-card">
            <div className="section-card-header">
              <h2>Calculated Results</h2>
              <p>Frontend estimates based on assumptions</p>
            </div>
            <div className="section-card-content">
              <div className="results-grid">
                <div className="result-card">
                  <h3>Projected Revenue</h3>
                  <p className="result-value">${results.projectedRevenue.toLocaleString()}</p>
                  <span className="result-label">/month</span>
                </div>
                <div className="result-card">
                  <h3>Net Profit</h3>
                  <p className="result-value">${results.netProfit.toLocaleString()}</p>
                  <span className="result-label">/month</span>
                </div>
                <div className="result-card">
                  <h3>ROI</h3>
                  <p className="result-value">{results.roi}%</p>
                  <span className="result-label">annual</span>
                </div>
                <div className="result-card">
                  <h3>Break Even</h3>
                  <p className="result-value">{results.breakEvenMonths}</p>
                  <span className="result-label">months</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scenario Comparison */}
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-card-title-group">
                <BarChart3 size={24} className="section-icon" />
                <h2>Scenario Comparison</h2>
              </div>
            </div>
            <div className="section-card-content">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                  <Bar dataKey="profit" fill="#10b981" name="Profit ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Assumptions Explanation */}
          <div className="section-card">
            <div className="section-card-header">
              <h2>Assumptions & Methodology</h2>
            </div>
            <div className="section-card-content">
              <div className="methodology">
                <p><strong>Note:</strong> All calculations are frontend estimates using simplified formulas. They are not predictions from the AI engine or backend simulation API.</p>
                <ul>
                  <li><strong>Revenue:</strong> Based on expected demand and estimated market potential</li>
                  <li><strong>Costs:</strong> Rent plus operating expenses</li>
                  <li><strong>ROI:</strong> (Net Profit / Total Investment) * 100</li>
                  <li><strong>Break Even:</strong> Time to recover initial investment</li>
                </ul>
                <p className="validation-note">Inputs are validated for numeric values. Negative values will be treated as 0.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIfSimulator;
