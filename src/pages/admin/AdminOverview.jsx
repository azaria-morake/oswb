import React from 'react';

const AdminOverview = () => {
  return (
    <div className="admin-view">
      <div className="workspace-header">
        <h2>[ SYSTEM_OVERVIEW ]</h2>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #1F1F1F', backgroundColor: '#050505' }}>
          <p style={{ color: '#888', margin: '0 0 10px 0', fontSize: '0.8rem' }}>ACTIVE_DROPS</p>
          <h3 style={{ margin: 0, fontSize: '2rem', color: '#FF5C00' }}>2</h3>
        </div>
        <div style={{ padding: '20px', border: '1px solid #1F1F1F', backgroundColor: '#050505' }}>
          <p style={{ color: '#888', margin: '0 0 10px 0', fontSize: '0.8rem' }}>TOTAL_INVENTORY_VALUE</p>
          <h3 style={{ margin: 0, fontSize: '2rem', color: '#FFF' }}>ZAR 45,200</h3>
        </div>
        <div style={{ padding: '20px', border: '1px solid #1F1F1F', backgroundColor: '#050505' }}>
          <p style={{ color: '#888', margin: '0 0 10px 0', fontSize: '0.8rem' }}>SYSTEM_STATUS</p>
          <h3 style={{ margin: 0, fontSize: '2rem', color: '#4CAF50' }}>OPTIMAL</h3>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
