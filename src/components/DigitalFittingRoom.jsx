import React from 'react';
import { useInteraction } from '../InteractionContext';
import './DigitalFittingRoom.css';

const DigitalFittingRoom = () => {
  const { triggerNotYetAlert } = useInteraction();

  return (
    <section className="fitting-room-section">
      <div className="fitting-header">
        <h2>SOFFNAKS |<br/>THE MAIZE COLLECTION</h2>
      </div>
      <div className="fitting-room-content">
        <div className="fitting-images">
          <div className="tech-corner tl"></div>
          <div className="tech-corner tr"></div>
          <div className="tech-corner bl"></div>
          <div className="tech-corner br"></div>
          
          <img src="/assets/hoodie1.png" alt="Soffnaks Hoodie 1" className="hoodie-front" />
          <img src="/assets/hoodie2.png" alt="Soffnaks Hoodie 2" className="hoodie-back" />
          
          <div className="patch-graphic">
            <img src="/assets/beanie.png" alt="S.tv patch detail" />
          </div>
        </div>
      </div>
      <div className="btn-orange-wrapper fitting-btn-wrapper">
        <div className="btn-orange-inner">
          <button className="btn-orange fitting-btn" onClick={triggerNotYetAlert}>
            DIGITAL FITTING ROOM
          </button>
        </div>
      </div>
    </section>
  );
};

export default DigitalFittingRoom;
