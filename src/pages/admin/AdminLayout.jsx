import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Package, Calendar, Activity, Settings, LogOut, X, Layout, Menu } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import './Admin.css';

const AdminLayout = () => {
  const { account, logout } = useAuth();
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="admin-console">
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <div className="admin-brand-mobile">
          <h1>SBC-v1.0</h1>
        </div>
        <button className="mobile-menu-btn" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
          {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${isMobileNavOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <h1>SBC-v1.0</h1>
          <span className="admin-status">LIVE_CONN</span>
        </div>

        <nav className="admin-nav" onClick={() => setIsMobileNavOpen(false)}>
          <NavLink to="/admin" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Activity size={18} />
            <span>[ OVERVIEW ]</span>
          </NavLink>
          <NavLink to="/admin/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Layout size={18} />
            <span>[ HOMEPAGE_CRUD ]</span>
          </NavLink>
          <NavLink to="/admin/drops" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Calendar size={18} />
            <span>[ DROP_MANAGER ]</span>
          </NavLink>
          <NavLink to="/admin/vault" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Package size={18} />
            <span>[ PRODUCT_VAULT ]</span>
          </NavLink>
          {/* Mock routes for aesthetic completeness */}
          <div className="nav-item disabled">
            <Settings size={18} />
            <span>[ SETTINGS ]</span>
          </div>
        </nav>

        <div className="admin-user">
          <div className="user-info">
            <span className="user-role">AUTH: {account?.role?.toUpperCase()}</span>
            <span className="user-id">{account?.uid?.substring(0, 8)}...</span>
          </div>
          <button className="btn-logout" onClick={logout}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="admin-workspace">
        <Outlet />
      </main>

      {/* System Console Overlay */}
      {isConsoleOpen && (
        <div className="system-console-overlay">
          <div className="console-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>SYSTEM_LOG</span>
            <button onClick={() => setIsConsoleOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
          <div className="console-feed">
            <p>{`> AUTH_GRANTED: ${account?.uid}`}</p>
            <p>{`> FIRESTORE_CONNECTION: ESTABLISHED`}</p>
            <p>{`> WAITING_FOR_INPUT...`}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
