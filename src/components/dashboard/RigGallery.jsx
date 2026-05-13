import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { listenToUserLoadouts } from '../../firebase/api';
import RigCard from './RigCard';

const RigGallery = () => {
  const { user } = useAuth();
  const [loadouts, setLoadouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = listenToUserLoadouts(user.uid, (data) => {
      setLoadouts(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="drg-wrap">
      <div className="drg-header">
        <div>
          <h2 className="drg-title">THE RIG</h2>
          <p className="drg-sub">SAVED_LOADOUTS // {loadouts.length}_CONFIGURATIONS</p>
        </div>
      </div>

      {loading ? (
        <div className="drg-loading">LOADING_RIGS...</div>
      ) : loadouts.length === 0 ? (
        <div className="drg-empty">
          <div className="drg-empty-icon">◈</div>
          <div className="drg-empty-title">NO_RIGS_FOUND</div>
          <div className="drg-empty-sub">
            SYSTEM_EMPTY // USE_THE_FITTING_ROOM_TO_BUILD_YOUR_FIRST_RIG
          </div>
          <div className="drg-empty-hint">
            The Digital Fitting Room is coming in a future drop.
          </div>
        </div>
      ) : (
        <div className="drg-grid">
          {loadouts.map(rig => (
            <RigCard key={rig.id} rig={rig} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RigGallery;
