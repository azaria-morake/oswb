import React, { useState, useEffect } from 'react';
import { 
  listenToHomepageConfig, 
  updateHomepageConfig, 
  listenToAllProducts,
  uploadAdminAsset,
  listenToDropContainers
} from '../../firebase/api';
import { UploadCloud, Image as ImageIcon, Plus, X } from 'lucide-react';
import AdminSnackbar from './AdminSnackbar';

const AdminHomeManager = () => {
  const [config, setConfig] = useState({ heroImage: '', featuredProductIds: new Array(8).fill(null) });
  const [products, setProducts] = useState([]);
  const [dropContainers, setDropContainers] = useState([]);
  
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);
  const [filterDrop, setFilterDrop] = useState('ALL');
  
  const [snackbar, setSnackbar] = useState({ message: '', type: '' });

  useEffect(() => {
    const unsubConfig = listenToHomepageConfig((data) => {
      // Ensure featuredProductIds always has 8 slots
      const ids = data.featuredProductIds || [];
      const paddedIds = [...ids];
      while (paddedIds.length < 8) paddedIds.push(null);
      setConfig({ heroImage: data.heroImage || '', featuredProductIds: paddedIds.slice(0, 8) });
    });
    
    const unsubProducts = listenToAllProducts(setProducts);
    const unsubDrops = listenToDropContainers(setDropContainers);
    
    return () => {
      unsubConfig();
      unsubProducts();
      unsubDrops();
    };
  }, []);

  const showSnackbar = (message, type = 'success') => setSnackbar({ message, type });

  const handleHeroUpload = async (e) => {
    e.preventDefault();
    if (!heroImageFile) return;
    
    setUploadingHero(true);
    try {
      const url = await uploadAdminAsset(heroImageFile, `homepage/hero_${Date.now()}_${heroImageFile.name}`);
      await updateHomepageConfig({ heroImage: url });
      setHeroImageFile(null);
      showSnackbar('Hero Image updated successfully');
    } catch (error) {
      showSnackbar('Error updating Hero Image', 'error');
    } finally {
      setUploadingHero(false);
    }
  };

  const openProductSelector = (index) => {
    setActiveSlot(index);
    setIsModalOpen(true);
  };

  const assignProductToSlot = async (productId) => {
    const newIds = [...config.featuredProductIds];
    newIds[activeSlot] = productId; // Allows null for unassigning
    
    try {
      await updateHomepageConfig({ featuredProductIds: newIds });
      setIsModalOpen(false);
      showSnackbar('Featured item updated');
    } catch (error) {
      showSnackbar('Error updating featured item', 'error');
    }
  };

  const getProductForSlot = (id) => {
    return products.find(p => p.id === id) || null;
  };

  const filteredProducts = products.filter(p => {
    if (filterDrop === 'ALL') return true;
    if (filterDrop === 'UNASSIGNED') return !p.dropName;
    return p.dropName === filterDrop;
  });

  return (
    <div className="admin-view relative">
      <AdminSnackbar message={snackbar.message} type={snackbar.type} onClose={() => setSnackbar({message:'', type:''})} />

      <div className="workspace-header">
        <h2>[ HOMEPAGE_MANAGER ]</h2>
      </div>

      {/* Hero Section */}
      <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#050505', border: '1px solid #1F1F1F' }}>
        <h3 style={{ color: '#FF5C00', margin: '0 0 15px 0', fontSize: '1rem' }}>HERO_IMAGE</h3>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            {config.heroImage ? (
              <img src={config.heroImage} alt="Current Hero" style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover', border: '1px solid #1F1F1F' }} />
            ) : (
              <div style={{ width: '100%', height: '150px', border: '1px dashed #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                NO HERO IMAGE SET
              </div>
            )}
          </div>
          <form onSubmit={handleHeroUpload} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <input type="file" accept="image/*" onChange={e => setHeroImageFile(e.target.files[0])} style={{ color: '#888' }} required />
            </div>
            <button type="submit" className="admin-btn" disabled={uploadingHero || !heroImageFile}>
              {uploadingHero ? 'UPLOADING...' : 'DEPLOY HERO IMAGE'}
            </button>
          </form>
        </div>
      </div>

      {/* Featured Collectibles Section */}
      <div style={{ padding: '20px', backgroundColor: '#050505', border: '1px solid #1F1F1F' }}>
        <h3 style={{ color: '#FF5C00', margin: '0 0 15px 0', fontSize: '1rem' }}>FEATURED_COLLECTIBLES (STRICTLY 8 SLOTS)</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
          {config.featuredProductIds.map((id, index) => {
            const product = getProductForSlot(id);
            return (
              <div key={index} style={{ border: '1px solid #1F1F1F', backgroundColor: '#0A0A0A', position: 'relative', aspectRatio: '1/1', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, padding: '5px', backgroundColor: '#1F1F1F', color: '#888', fontSize: '0.6rem' }}>SLOT 0{index + 1}</div>
                
                {product ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px', paddingTop: '25px', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <img src={product.images?.[0] || '/assets/placeholder.png'} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', marginBottom: '10px', borderRadius: '4px' }} />
                    <span style={{ fontSize: '0.7rem', color: '#FFF' }}>{product.name}</span>
                    <button className="action-btn" style={{ position: 'absolute', top: '5px', right: '5px', color: '#FF5C00' }} onClick={() => openProductSelector(index)} title="Replace">
                      <ImageIcon size={14} />
                    </button>
                    <button className="action-btn delete" style={{ position: 'absolute', bottom: '5px', right: '5px' }} onClick={() => assignProductToSlot(null)} title="Clear Slot">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => openProductSelector(index)}>
                    <div style={{ color: '#333', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#FF5C00'} onMouseLeave={e => e.currentTarget.style.color = '#333'}>
                      <Plus size={32} />
                      <span style={{ fontSize: '0.7rem' }}>ASSIGN ITEM</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Selection Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(5,5,5,0.95)', zIndex: 2000, 
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="admin-modal-content" style={{
            backgroundColor: '#0A0A0A', border: '1px solid #FF5C00', padding: '30px', maxHeight: '90vh', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1F1F1F', paddingBottom: '15px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#FF5C00' }}>SELECT_FEATURED_ITEM // SLOT 0{activeSlot + 1}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div className="filter-bar" style={{ marginBottom: '15px' }}>
              <div className="filter-group">
                <label>FILTER_BY_DROP:</label>
                <select className="admin-input" style={{ width: 'auto', padding: '8px', fontSize: '0.8rem' }} value={filterDrop} onChange={e => setFilterDrop(e.target.value)}>
                  <option value="ALL">ALL_ITEMS</option>
                  <option value="UNASSIGNED">UNASSIGNED</option>
                  {dropContainers.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #1F1F1F' }}>
               <table className="admin-table">
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => assignProductToSlot(p.id)}>
                      <td style={{ width: '50px' }}><img src={p.images?.[0] || '/assets/placeholder.png'} alt="" style={{ width: '30px', height: '30px', objectFit: 'cover' }} /></td>
                      <td style={{ width: '60%' }}>{p.name}</td>
                      <td style={{ color: '#888', fontSize: '0.8rem' }}>{p.dropName || '---'}</td>
                      <td style={{ textAlign: 'right', color: '#FF5C00' }}>[ SELECT ]</td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>NO_ITEMS_FOUND</td></tr>
                  )}
                </tbody>
               </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminHomeManager;
