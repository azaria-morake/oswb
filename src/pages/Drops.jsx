import React, { useState, useEffect } from 'react';
import { getDropContainers } from '../firebase/api';
import CampaignHero from '../components/CampaignHero';
import TechnicalTicker from '../components/TechnicalTicker';
import DropProductGrid from '../components/DropProductGrid';
import ProcessLookbook from '../components/ProcessLookbook';
import './Drops.css';

const Drops = ({ onProductClick }) => {
  const [activeDrop, setActiveDrop] = useState({ name: null, status: 'active' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDropStatus = async () => {
      try {
        const containers = await getDropContainers();
        // Look for the first container that is either active or upcoming
        const targetDrop = containers.find(c => c.status === 'active' || c.status === 'upcoming');
        if (targetDrop) {
          setActiveDrop({ name: targetDrop.name, status: targetDrop.status });
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
      <DropProductGrid dropContainer={activeDrop} onProductClick={onProductClick} />
      <ProcessLookbook />
    </div>
  );
};

export default Drops;
