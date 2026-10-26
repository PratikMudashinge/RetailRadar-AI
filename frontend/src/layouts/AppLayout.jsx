import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Brain, 
  TrendingUp, 
  Calculator, 
  GitCompare, 
  FileText, 
  Database,
  Menu,
  X,
  Activity
} from 'lucide-react';
import './AppLayout.css';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Location Explorer', href: '/explorer', icon: Map },
  { name: 'AI Recommendations', href: '/recommendations', icon: Brain },
  { name: 'Market Gap Analysis', href: '/market-gap', icon: TrendingUp },
  { name: 'What-If Simulator', href: '/simulator', icon: Calculator },
  { name: 'Site Comparison', href: '/comparison', icon: GitCompare },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Data Management', href: '/data', icon: Database },
];

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Activity className="logo-icon" />
            <div className="logo-text">
              <h1>RetailRadar</h1>
              <span className="logo-subtitle">AI</span>
            </div>
          </div>
          <button 
            className="sidebar-close-btn lg-hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => 
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} className="nav-icon" />
              <span className="nav-text">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <div className="sidebar-tagline">
            <p className="tagline-text">Find the Right Location.</p>
            <p className="tagline-text">Grow with Confidence.</p>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="main-content">
        <header className="top-header">
          <button 
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          
          <div className="header-brand mobile-only">
            <Activity className="header-logo-icon" />
            <span className="header-brand-text">RetailRadar AI</span>
          </div>
          
          <div className="header-spacer"></div>
          
          <div className="header-status">
            <span className="status-indicator"></span>
            <span className="status-text">Demo Mode</span>
          </div>
        </header>
        
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
