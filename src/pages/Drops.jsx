import React, { useState, useEffect } from 'react';
import { getDrops } from '../firebase/api';
import CampaignHero from '../components/CampaignHero';
import TechnicalTicker from '../components/TechnicalTicker';
import DropProductGrid from '../components/DropProductGrid';
import ProcessLookbook from '../components/ProcessLookbook';
import './Drops.css';

const Drops = ({ onProductClick }) => {
  const [dropStatus, setDropStatus] = useState('active'); // Default to active for demo
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDropStatus = async () => {
      try {
        const drops = await getDrops();
        if (drops && drops.length > 0) {
          // Use the first active or upcoming drop
          setDropStatus(drops[0].status);
        }
      } catch (error) {
        console.warn("Using default active status. Firebase fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDropStatus();
  }, []);

  return (
    <div className="drops-page">
      <CampaignHero />
      <TechnicalTicker />
      <DropProductGrid status={dropStatus} onProductClick={onProductClick} />
      <ProcessLookbook />
    </div>
  );
};

export default Drops;
