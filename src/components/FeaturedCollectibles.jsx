import React from 'react';
import './FeaturedCollectibles.css';

const items = [
  { id: 1, name: 'Silicon Melt Hoodie', price: '$18.80', image: '/assets/hoodie1.png', limited: 'LIMITED EDITION: 4 LEFT' },
  { id: 2, name: 'Silicon Melt Hoodie', price: '$78.00', image: '/assets/hoodie2.png', limited: 'LIMITED EDITION: 4 LEFT', selected: true },
  { id: 3, name: 'Refined Stock', price: '$15.80', image: '/assets/can.png' },
  { id: 4, name: 'Malian & Patche', price: '$13.00', image: '/assets/beanie.png' }
];

const FeaturedCollectibles = ({ onProductClick }) => {
  return (
    <section className="featured-section">
      <div className="featured-header">
        <h2 className="section-title">FEATURED COLLECTIBLES</h2>
        <div className="dynamic-inventory">
          DYNAMIC INVENTORY <span className="beta-tag">BETA<br/>BETA</span>
        </div>
      </div>

      <div className="products-grid">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`product-card ${item.selected ? 'selected' : ''}`}
            onClick={() => onProductClick(item)}
          >
            <div className="product-image-container">
              <div className="tech-scanline"></div>
              <div className="tech-corner tl"></div>
              <div className="tech-corner tr"></div>
              <div className="tech-corner bl"></div>
              <div className="tech-corner br"></div>
              
              {item.limited && <div className="limited-badge">{item.limited}</div>}
              <img src={item.image} alt={item.name} />
              
              {item.selected && <button className="quick-add-btn">QUICK ADD</button>}
            </div>
            
            <div className="product-info">
              <div className="product-meta">
                <span className="stock-status">IN STOCK</span>
              </div>
              <h3>{item.name}</h3>
              <p className="price">{item.price}</p>
              {item.limited && <span className="limited-text">{item.limited}</span>}
            </div>

          </div>
        ))}
      </div>


    </section>
  );
};

export default FeaturedCollectibles;
