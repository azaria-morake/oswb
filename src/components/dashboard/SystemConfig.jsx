import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { updateShippingAddress } from '../../firebase/api';

const TIERS = [
  { name: 'RECRUIT', min: 0, max: 1000, perk: 'Base access to all drops.' },
  { name: 'OPERATOR', min: 1000, max: 3000, perk: '48-hour early access to new drops.' },
  { name: 'VETERAN', min: 3000, max: 5000, perk: 'Exclusive colourways + priority shipping.' },
  { name: 'ELITE', min: 5000, max: Infinity, perk: 'Lifetime early access + private Discord channel.' },
];

const SystemConfig = ({ totalSpend }) => {
  const { user, account, logout } = useAuth();
  const [address, setAddress] = useState({
    street: account?.shippingAddress?.street || '',
    city: account?.shippingAddress?.city || '',
    province: account?.shippingAddress?.province || '',
    zipCode: account?.shippingAddress?.zipCode || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentTierIndex = TIERS.findIndex((t, i) =>
    totalSpend >= t.min && (totalSpend < t.max || i === TIERS.length - 1)
  );
  const currentTier = TIERS[currentTierIndex];
  const nextTier = TIERS[currentTierIndex + 1];

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateShippingAddress(user.uid, address);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="dsc-wrap">
      <div className="dsc-header">
        <h2 className="dsc-title">SYS_CONFIG</h2>
        <p className="dsc-sub">ACCOUNT_SETTINGS // IDENTITY_MANAGEMENT</p>
      </div>

      {/* Identity */}
      <section className="dsc-section">
        <div className="dsc-section-header">
          <span className="dsc-bracket">[</span> OPERATIVE_IDENTITY <span className="dsc-bracket">]</span>
        </div>
        <div className="dsc-identity-grid">
          <div className="dsc-field">
            <label>UID</label>
            <div className="dsc-value">{user?.uid?.slice(0, 16).toUpperCase()}...</div>
          </div>
          <div className="dsc-field">
            <label>COMMS_CHANNEL</label>
            <div className="dsc-value">{user?.email}</div>
          </div>
          <div className="dsc-field">
            <label>AUTH_PROVIDER</label>
            <div className="dsc-value dsc-value--green">GOOGLE_OAUTH_2.0 // LINKED ✓</div>
          </div>
          <div className="dsc-field">
            <label>MEMBER_TIER</label>
            <div className="dsc-value" style={{ color: '#FF6B35' }}>{currentTier?.name}</div>
          </div>
        </div>
      </section>

      {/* Tier Progress */}
      <section className="dsc-section">
        <div className="dsc-section-header">
          <span className="dsc-bracket">[</span> EXCLUSIVITY_TIERS <span className="dsc-bracket">]</span>
        </div>
        <div className="dsc-tiers">
          {TIERS.map((tier, i) => {
            const isActive = i === currentTierIndex;
            const isUnlocked = i <= currentTierIndex;
            return (
              <div key={tier.name} className={`dsc-tier ${isActive ? 'active' : ''} ${isUnlocked ? 'unlocked' : ''}`}>
                <div className="dsc-tier-header">
                  <span className="dsc-tier-name">{tier.name}</span>
                  <span className="dsc-tier-req">
                    {tier.max === Infinity ? `R${tier.min}+` : `R${tier.min}–R${tier.max}`}
                  </span>
                  {isUnlocked && <span className="dsc-tier-check">✓</span>}
                </div>
                <div className="dsc-tier-perk">{tier.perk}</div>
              </div>
            );
          })}
        </div>

        {nextTier && (
          <div className="dsc-tier-progress-bar">
            <div className="dsc-tier-progress-fill" style={{
              width: `${Math.min(((totalSpend - currentTier.min) / (nextTier.min - currentTier.min)) * 100, 100)}%`
            }} />
            <div className="dsc-tier-progress-label">
              R{Math.round(totalSpend)} / R{nextTier.min} to reach {nextTier.name}
            </div>
          </div>
        )}
      </section>

      {/* Shipping Hub */}
      <section className="dsc-section">
        <div className="dsc-section-header">
          <span className="dsc-bracket">[</span> DROP_COORDINATES <span className="dsc-bracket">]</span>
        </div>
        <form className="dsc-address-form" onSubmit={handleSaveAddress}>
          <div className="dsc-form-grid">
            <div className="dsc-input-group dsc-full">
              <label>STREET_ADDRESS</label>
              <input
                type="text"
                value={address.street}
                onChange={e => setAddress({ ...address, street: e.target.value })}
                placeholder="e.g. 42 Industrial Park Rd"
              />
            </div>
            <div className="dsc-input-group">
              <label>SECTOR (CITY)</label>
              <input
                type="text"
                value={address.city}
                onChange={e => setAddress({ ...address, city: e.target.value })}
                placeholder="e.g. Johannesburg"
              />
            </div>
            <div className="dsc-input-group">
              <label>PROVINCE</label>
              <input
                type="text"
                value={address.province}
                onChange={e => setAddress({ ...address, province: e.target.value })}
                placeholder="e.g. Gauteng"
              />
            </div>
            <div className="dsc-input-group">
              <label>SECTOR_CODE (ZIP)</label>
              <input
                type="text"
                value={address.zipCode}
                onChange={e => setAddress({ ...address, zipCode: e.target.value })}
                placeholder="0000"
              />
            </div>
          </div>
          <button type="submit" className="dsc-save-btn" disabled={saving}>
            {saving ? 'SAVING...' : saved ? 'COORDINATES_SAVED ✓' : 'SAVE_COORDINATES'}
          </button>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="dsc-section dsc-section--danger">
        <div className="dsc-section-header">
          <span className="dsc-bracket" style={{ color: '#da3333' }}>[</span>
          SYSTEM_EXIT
          <span className="dsc-bracket" style={{ color: '#da3333' }}>]</span>
        </div>
        <button className="dsc-logout-btn" onClick={logout}>
          TERMINATE_SESSION →
        </button>
      </section>
    </div>
  );
};

export default SystemConfig;
