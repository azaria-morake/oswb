import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { Plus } from 'lucide-react';
import './DropProductGrid.css';

import { listenToActiveProducts } from '../firebase/api';

const DropProductGrid = ({ dropContainer = { name: null, status: 'active' }, onProductClick }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isUpcoming = dropContainer.status === 'upcoming';
  const { addToCart } = useCart();

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product);
    }
  };

  useEffect(() => {
    const unsubscribe = listenToActiveProducts((activeProducts) => {
      // Filter products that belong to the active drop container
      const filteredDrops = dropContainer.name 
        ? activeProducts.filter(p => p.dropName === dropContainer.name)
        : [];
        
      const formatted = filteredDrops.map(d => ({
        ...d,
        // Fallback to first image if grid image isn't explicitly set (though images[0] is the grid image)
        image: d.images?.[0] || d.image || '',
        price: `ZAR ${d.price.toLocaleString()}`,
        spec: `CAT: ${d.category || 'N/A'}`
      }));
      setProducts(formatted);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dropContainer.name]);

  return (
    <section className={`drop-grid-section ${dropContainer.status}`}>
      {isUpcoming && <div className="scanline"></div>}

      <div className="drop-grid">
        {loading ? (
          <div className="loading-state">INITIALIZING DATA...</div>
        ) : products.length > 0 ? (
          products.map((product) => (
          <div 
            key={product.id} 
            className="drop-card"
            onClick={() => onProductClick && onProductClick(product)}
          >
            <div className="drop-img-wrapper">
              <img src={product.image} alt={product.name} />
              
              {isUpcoming && (
                <div className="confidential-overlay">
                  <span className="confidential-text">CONFIDENTIAL</span>
                </div>
              )}
              
              {!isUpcoming && (
                <>
                  <div className={`status-badge ${product.stock > 0 ? 'in-stock' : 'depleted'}`}>
                    [{product.stock > 0 ? 'IN STOCK' : 'DEPLETED'}]
                  </div>
                  
                  {product.stock > 0 && product.stock < 10 && (
                    <div className="pips-container">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className={`pip ${i < product.stock ? 'active' : ''}`}></div>
                      ))}
                    </div>
                  )}

                  {product.stock > 0 && (
                    <button 
                      className="quick-add-btn"
                      onClick={(e) => handleQuickAdd(e, product)}
                      aria-label="Quick Add"
                    >
                      <Plus size={16} />
                    </button>
                  )}

                  <div className="tech-spec-overlay">
                    {product.spec}
                  </div>
                </>
              )}
            </div>
            
            <div className="drop-info">
              <h3>{product.name}</h3>
              <p className="price">{product.price}</p>
            </div>
          </div>
        ))
        ) : (
          <div className="empty-state">NO {dropContainer.status.toUpperCase()} DROPS FOUND</div>
        )}
      </div>
    </section>
  );
};

export default DropProductGrid;
