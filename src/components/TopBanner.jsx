import React from 'react';

const TopBanner = () => {
  return (
    <div style={{
      backgroundColor: '#111111',
      color: 'var(--text-muted-dark)',
      textAlign: 'center',
      padding: '10px 20px',
      fontSize: '0.75rem',
      fontWeight: '700',
      letterSpacing: '1px',
      fontFamily: 'var(--font-hero)',
      textTransform: 'uppercase'
    }}>
      DROP 001: PROCESSED FOR THE STREETS – <span style={{ color: 'var(--accent-orange)' }}>00:22:15</span>
    </div>
  );
};

export default TopBanner;
