import React from 'react';
import './CampaignHero.css';

const CampaignHero = () => {
  return (
    <div className="campaign-hero">
      <div className="campaign-hero-visual">
        <img 
          src="/assets/hero_slide/hero_slide1.jpg" 
          alt="Campaign Visual" 
          className="campaign-hero-img" 
        />
        <div className="campaign-blueprint-overlay"></div>
      </div>
      
      <div className="campaign-hero-content">
        <h1 className="drop-label">DROP_001</h1>
        
        <table className="manifest-table">
          <tbody>
            <tr>
              <td>DROP_DATE</td>
              <td>MAY 15 2026</td>
            </tr>
            <tr>
              <td>LOCATION</td>
              <td>JHB_CENTRAL_SYSTEM</td>
            </tr>
            <tr>
              <td>BATCH_SIZE</td>
              <td>100 UNITS</td>
            </tr>
            <tr>
              <td>STATUS</td>
              <td>SYSTEM_ACTIVE</td>
            </tr>
          </tbody>
        </table>
        
        <button className="angled-cta">ACCESS COLLECTION</button>
      </div>
    </div>
  );
};

export default CampaignHero;
