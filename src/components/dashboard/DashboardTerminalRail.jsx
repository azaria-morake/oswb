import React from 'react';
import { useAuth } from '../../AuthContext';

const TIERS = [
  { name: 'RECRUIT', min: 0, max: 1000 },
  { name: 'OPERATOR', min: 1000, max: 3000 },
  { name: 'VETERAN', min: 3000, max: 5000 },
  { name: 'ELITE', min: 5000, max: Infinity }
];

const navItems = [
  { id: 'vault', label: 'VAULT', sub: 'ORDER_HISTORY', icon: '▣' },
  { id: 'rigs', label: 'THE RIG', sub: 'LOADOUTS', icon: '◈' },
  { id: 'config', label: 'CONFIG', sub: 'SETTINGS', icon: '⚙' },
];

const DashboardTerminalRail = ({ activeModule, setActiveModule, orders }) => {
  const { user, logout } = useAuth();

  const totalSpend = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const currentTier = TIERS.find((t, i) => totalSpend >= t.min && (totalSpend < t.max || i === TIERS.length - 1));
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const tierProgress = nextTier
    ? ((totalSpend - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  const initials = (user?.displayName || user?.email || 'OO')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      {/* ── DESKTOP RAIL — hidden on mobile via CSS ── */}
      <aside className="dtr-rail">
        <div className="dtr-user-banner">
          <div className="dtr-avatar">
            {user?.photoURL
              ? <img src={user.photoURL} alt="avatar" />
              : <span>{initials}</span>
            }
          </div>
          <div className="dtr-user-info">
            <div className="dtr-uid">UID_{user?.uid?.slice(0, 8).toUpperCase()}</div>
            <div className="dtr-display-name">{user?.displayName || user?.email?.split('@')[0]}</div>
            <div className="dtr-tier-badge">{currentTier?.name} // LVL_{TIERS.indexOf(currentTier) + 1}</div>
          </div>
        </div>

        {nextTier && (
          <div className="dtr-tier-progress">
            <div className="dtr-tier-bar">
              <div className="dtr-tier-fill" style={{ width: `${tierProgress}%` }} />
            </div>
            <div className="dtr-tier-label">
              <span>R{Math.round(totalSpend)} SPENT</span>
              <span>→ {nextTier.name} @ R{nextTier.min}</span>
            </div>
          </div>
        )}

        <nav className="dtr-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`dtr-nav-item ${activeModule === item.id ? 'active' : ''}`}
              onClick={() => setActiveModule(item.id)}
            >
              <span className="dtr-nav-icon">{item.icon}</span>
              <div className="dtr-nav-text">
                <span className="dtr-nav-label">{item.label}</span>
                <span className="dtr-nav-sub">{item.sub}</span>
              </div>
              {activeModule === item.id && <div className="dtr-active-pip" />}
            </button>
          ))}
        </nav>

        <div className="dtr-rail-footer">
          <div className="dtr-sys-status">
            <span className="dtr-status-pip" />
            TERMINAL_ONLINE
          </div>
          <button className="dtr-signout-btn" onClick={logout}>
            SIGN_OUT →
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM TAB BAR — hidden on desktop via CSS ── */}
      <nav className="dtr-mobile-bar">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`dtr-mobile-tab ${activeModule === item.id ? 'active' : ''}`}
            onClick={() => setActiveModule(item.id)}
          >
            <span className="dtr-mobile-tab-icon">{item.icon}</span>
            <span className="dtr-mobile-tab-label">{item.label}</span>
          </button>
        ))}
        <button className="dtr-mobile-tab dtr-mobile-tab--out" onClick={logout}>
          <span className="dtr-mobile-tab-icon">⏻</span>
          <span className="dtr-mobile-tab-label">OUT</span>
        </button>
      </nav>
    </>
  );
};

export default DashboardTerminalRail;
