import React from 'react';
import './TechnicalTicker.css';

const TechnicalTicker = () => {
  const specs = [
    { label: 'FABRIC', value: '400GSM_HEAVY_COTTON' },
    { label: 'CONSTRUCTION', value: 'OVERLOCK_STITCHING' },
    { label: 'ORIGIN', value: 'JHB_SYSTEM_CORE' },
    { label: 'FINISH', value: 'ANTI_STATIC_COATING' },
    { label: 'HARDWARE', value: 'YKK_INDUSTRIAL_ZIPS' },
    { label: 'BATCH', value: 'B001_PROCESS_LOG' }
  ];

  return (
    <div className="tech-ticker">
      <div className="tech-ticker-track">
        {[...specs, ...specs].map((spec, i) => (
          <div key={i} className="tech-ticker-item">
            {spec.label}: <span>{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalTicker;
