import React, { useState } from 'react';

const RigCard = ({ rig }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/rig/${rig.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="drc-card">
      <div className="drc-thumb">
        {rig.thumbnailUrl
          ? <img src={rig.thumbnailUrl} alt={rig.name} />
          : (
            <div className="drc-thumb-placeholder">
              <span>◈</span>
            </div>
          )
        }
      </div>
      <div className="drc-info">
        <div className="drc-name">{rig.name || 'UNNAMED_RIG'}</div>
        <div className="drc-slots">{rig.slots?.length || 0}_SLOTS_CONFIGURED</div>
      </div>
      <div className="drc-actions">
        <button className="drc-btn-deploy">
          DEPLOY_TO_FITTING_ROOM
        </button>
        <button className="drc-btn-share" onClick={handleShare}>
          {copied ? 'LINK_COPIED ✓' : 'SHARE_LINK'}
        </button>
      </div>
    </div>
  );
};

export default RigCard;
