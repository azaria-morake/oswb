import React, { useState, useEffect } from 'react';
import { getActiveProducts } from '../firebase/api';
import { useCart } from '../CartContext';
import './FeaturedCollectibles.css';

const mockItems = [
  { id: 1, name: 'Silicon Melt Hoodie', price: '$18.80', image: '/assets/hoodie1.png', limited: 'LIMITED EDITION: 4 LEFT' },
  { id: 2, name: 'Silicon Melt Hoodie', price: '$78.00', image: '/assets/hoodie2.png', limited: 'LIMITED EDITION: 4 LEFT', selected: true },
  { id: 3, name: 'Refined Stock', price: '$15.80', image: '/assets/can.png' },
  { id: 4, name: 'Malian & Patche', price: '$13.00', image: '/assets/beanie.png' }
];

const FeaturedCollectibles = ({ onProductClick }) => {
  const [items, setItems] = useState(mockItems);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getActiveProducts();
        if (products && products.length > 0) {
          // Map backend price and handle images array
          const formattedProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            price: `ZAR ${p.price}`,
            image: p.images && p.images.length > 0 ? p.images[0] : '/assets/hoodie1.png',
            limited: p.isLimited ? 'LIMITED EDITION' : null,
            selected: false,
          }));
          setItems(formattedProducts);
        }
      } catch (error) {
        console.warn("Using mock data. Firebase fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

              <button
                className="quick-add-btn"
                onClick={(e) => handleQuickAdd(e, item)}
              >
                +
              </button>
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
