import React, { useState, useEffect } from 'react';
import { listenToHomepageConfig, listenToAllProducts } from '../firebase/api';
import { useCart } from '../CartContext';
import './FeaturedCollectibles.css';

const FeaturedCollectibles = ({ onProductClick }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    let currentConfig = null;
    let currentProducts = [];

    const processItems = () => {
      if (!currentConfig || currentProducts.length === 0) {
        setItems([]);
        if (currentConfig && currentProducts.length === 0) setLoading(false);
        return;
      }

      const featuredIds = currentConfig.featuredProductIds || [];
      const configuredItems = featuredIds
        .filter(id => id !== null)
        .map(id => currentProducts.find(p => p.id === id))
        .filter(p => p !== undefined)
        .map(p => ({
          id: p.id,
          name: p.name,
          price: `ZAR ${p.price.toLocaleString()}`,
          image: p.images && p.images.length > 0 ? p.images[0] : '/assets/placeholder.png',
          limited: p.isLimited ? (p.stock > 0 ? `LIMITED EDITION: ${p.stock} LEFT` : 'LIMITED EDITION: SOLD OUT') : null,
          selected: false,
          stock: p.stock
        }));

      setItems(configuredItems);
      setLoading(false);
    };

    const unsubConfig = listenToHomepageConfig((config) => {
      currentConfig = config;
      processItems();
    });

    const unsubProducts = listenToAllProducts((products) => {
      currentProducts = products;
      processItems();
    });

    return () => {
      unsubConfig();
      unsubProducts();
    };
  }, []);

  const handleQuickAdd = (e, item) => {
    e.stopPropagation();
    addToCart(item);
  };

  return (
    <section className="featured-section">
      <div className="featured-header">
        <h2 className="section-title">FEATURED COLLECTIBLES</h2>
        <div className="dynamic-inventory">
          DYNAMIC INVENTORY <span className="beta-tag">BETA<br />BETA</span>
        </div>
      </div>

      <div className="products-grid">
        {loading ? (
          <div className="loading-state" style={{ padding: '40px', color: 'var(--accent-orange)', fontFamily: 'var(--font-wide)' }}>INITIALIZING DATABANKS...</div>
        ) : items.length > 0 ? (
          items.map((item) => (
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

              <button
                className="quick-add-btn"
                onClick={(e) => handleQuickAdd(e, item)}
              >
                +
              </button>
            </div>

            <div className="product-info">
              <div className="product-meta">
                <span className="stock-status" style={{ color: item.stock > 0 ? '#4CAF50' : '#ff3333' }}>
                  {item.stock > 0 ? 'IN STOCK' : 'DEPLETED'}
                </span>
              </div>
              <h3>{item.name}</h3>
              <p className="price">{item.price}</p>
              {item.limited && <span className="limited-text">{item.limited}</span>}
            </div>

          </div>
        ))
        ) : (
          <div className="empty-state" style={{ padding: '40px', color: 'var(--text-muted)' }}>NO CONFIGURED INVENTORY</div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCollectibles;
