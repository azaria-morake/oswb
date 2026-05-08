import React from 'react';
import { useCart } from '../CartContext';
import { Plus } from 'lucide-react';
import './DropProductGrid.css';

const products = [
  { id: 1, name: 'SILICON_MELT_HOODIE_01', price: 'ZAR 1,880', image: '/assets/hoodie2.png', spec: 'WEIGHT: 400GSM', stock: 8 },
  { id: 2, name: 'SPIKE_TSHIRT_01', price: 'ZAR 850', image: '/assets/tshirt1.png', spec: 'WEIGHT: 220GSM', stock: 3 },
  { id: 3, name: 'REFINED_STOCK_CAN', price: 'ZAR 150', image: '/assets/can.png', spec: 'COMP: ALUMINUM', stock: 15 },
  { id: 4, name: 'MALIAN_PATCHE_BEANIE', price: 'ZAR 450', image: '/assets/beanie.png', spec: 'COMP: ACRYLIC', stock: 0 }
];

const DropProductGrid = ({ status = 'active', onProductClick }) => {
  const isUpcoming = status === 'upcoming';
  const { addToCart } = useCart();

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product);
    }
  };

  return (
    <section className={`drop-grid-section ${status}`}>
      {isUpcoming && <div className="scanline"></div>}
      
      <div className="drop-grid">
        {products.map((product) => (
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
        ))}
      </div>
    </section>
  );
};

export default DropProductGrid;
