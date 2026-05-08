import React, { useRef, useEffect } from 'react';
import './ProcessLookbook.css';

const ProcessLookbook = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const images = scrollRef.current.querySelectorAll('.parallax-img');
      images.forEach((img, i) => {
        const rect = img.getBoundingClientRect();
        const speed = 0.1 + (i % 3) * 0.05;
        const offset = (window.innerHeight - rect.top) * speed;
        img.style.transform = `translateY(${offset - 100}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const items = [
    { src: '/assets/hero_slide/hero_slide2.jpg', label: 'MATERIAL_MANIFEST_V01' },
    { src: '/assets/hero_slide/hero_slide3.jpg', label: 'THREAD_STRUCTURE_X_OVERLOCK' },
    { src: '/assets/hero_slide/hero_slide4.jpg', label: 'TENSION_TEST_SYSTEM_LOG' },
    { src: '/assets/hero_slide/hero_slide5.jpg', label: 'PIGMENT_BONDING_PROCESS' }
  ];

  return (
    <section className="process-lookbook">
      <div className="process-header">
        <h2>PROCESS_INSIGHTS</h2>
      </div>
      
      <div className="lookbook-strip" ref={scrollRef}>
        {items.map((item, i) => (
          <div key={i} className="lookbook-item">
            <img 
              src={item.src} 
              alt={item.label} 
              className="parallax-img"
            />
            <div className="lookbook-caption">
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessLookbook;
