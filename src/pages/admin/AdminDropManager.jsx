import React, { useState, useEffect } from 'react';
import { listenToAllProducts, assignProductToDrop } from '../../firebase/api';
import { Plus } from 'lucide-react';

const AdminDropManager = () => {
  const [products, setProducts] = useState([]);
  const [dropName, setDropName] = useState('Drop_001');
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    const unsubscribe = listenToAllProducts((data) => {
      setProducts(data);
    });
    return () => unsubscribe();
  }, []);

  const handleAssignToDrop = async (product) => {
    if (!dropName.trim()) {
      alert("Please enter a valid drop name.");
      return;
    }
    
    setAssigningId(product.id);
    try {
      await assignProductToDrop(product, dropName);
      alert(`[ ${product.name} ] ASSIGNED TO [ ${dropName} ]`);
    } catch (error) {
      console.error(error);
      alert("Error assigning product to drop.");
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="admin-view">
      <div className="workspace-header">
        <h2>[ DROP_MANAGER ]</h2>
      </div>
      
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#050505', border: '1px solid #1F1F1F' }}>
        <h3 style={{ color: '#FF5C00', margin: '0 0 15px 0', fontSize: '1rem' }}>TARGET_DROP_CONTAINER</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            className="admin-input" 
            style={{ maxWidth: '300px' }}
            value={dropName}
            onChange={(e) => setDropName(e.target.value)}
            placeholder="e.g. Drop_001"
          />
          <span style={{ fontSize: '0.8rem', color: '#888' }}>
            {"<"} Edit name to assign items to a different collection.
          </span>
        </div>
      </div>

      <div className="vault-table-container">
        <h3 style={{ color: '#FFF', margin: '0 0 15px 0', fontSize: '1rem' }}>VAULT_INVENTORY</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>NAME</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{ width: '60px' }}>
                  <img 
                    src={p.images?.[0] || p.image} 
                    alt={p.name} 
                    style={{ width: '40px', height: '40px', objectFit: 'cover', border: '1px solid #1F1F1F' }} 
                  />
                </td>
                <td>{p.name}</td>
                <td>{p.category || 'N/A'}</td>
                <td>ZAR {p.price}</td>
                <td>
                  <button 
                    className="admin-btn"
                    style={{ 
                      padding: '8px 12px', 
                      fontSize: '0.75rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '5px',
                      opacity: assigningId === p.id ? 0.5 : 1
                    }}
                    onClick={() => handleAssignToDrop(p)}
                    disabled={assigningId === p.id}
                  >
                    <Plus size={14} />
                    {assigningId === p.id ? 'ASSIGNING...' : 'ASSIGN TO DROP'}
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#888', padding: '30px' }}>
                  NO ITEMS FOUND IN VAULT
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDropManager;
