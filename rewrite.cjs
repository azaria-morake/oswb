const fs = require('fs');

const path = '/home/rootz/ux-giants/oswb/src/pages/admin/AdminProductVault.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Imports
content = content.replace(
  'deleteDropContainer\n} from \'../../firebase/api\';',
  'deleteDropContainer,\n  deleteAdminAsset\n} from \'../../firebase/api\';'
);
content = content.replace(
  'import { UploadCloud, Plus, X, Pencil, Trash2, Layers } from \'lucide-react\';',
  'import { UploadCloud, Plus, X, Pencil, Trash2, Layers, ChevronLeft, ChevronRight } from \'lucide-react\';'
);

// 2. States
content = content.replace(
  'const [existingFittingRoomUrls, setExistingFittingRoomUrls] = useState([]);',
  'const [existingFittingRoomUrls, setExistingFittingRoomUrls] = useState([]);\n  const [assetsToDelete, setAssetsToDelete] = useState([]);'
);

// 3. Reset state in modals
content = content.replace(
  'setExistingFittingRoomUrls([]);\n    setIsCreatorOpen(true);',
  'setExistingFittingRoomUrls([]);\n    setAssetsToDelete([]);\n    setIsCreatorOpen(true);'
);
content = content.replace(
  'setExistingFittingRoomUrls(fittingUrlsArray);\n    setIsCreatorOpen(true);',
  'setExistingFittingRoomUrls(fittingUrlsArray);\n    setAssetsToDelete([]);\n    setIsCreatorOpen(true);'
);

// 4. Update existing removals to push to assetsToDelete
content = content.replace(
  'const removeExistingFittingRoomUrl = (index) => {\n    setExistingFittingRoomUrls(prev => prev.filter((_, i) => i !== index));\n  };',
  `const removeExistingFittingRoomUrl = (index) => {
    setExistingFittingRoomUrls(prev => {
      const current = [...prev];
      setAssetsToDelete(del => [...del, current[index].url]);
      return current.filter((_, i) => i !== index);
    });
  };`
);

// 5. Add gallery existing image functions & reorder functions
const galleryFunctions = `  const moveGalleryImage = (index, direction) => {
    setGalleryImages(prev => {
      if (!prev) return prev;
      const current = Array.from(prev);
      if (direction === -1 && index > 0) {
        [current[index - 1], current[index]] = [current[index], current[index - 1]];
      } else if (direction === 1 && index < current.length - 1) {
        [current[index + 1], current[index]] = [current[index], current[index + 1]];
      }
      return current;
    });
  };

  const moveExistingGalleryImage = (index, direction) => {
    setExistingImages(prev => {
      const current = [...prev];
      if (direction === -1 && index > 1) {
        [current[index - 1], current[index]] = [current[index], current[index - 1]];
      } else if (direction === 1 && index < current.length - 1) {
        [current[index + 1], current[index]] = [current[index], current[index + 1]];
      }
      return current;
    });
  };

  const removeExistingGalleryImage = (index) => {
    setExistingImages(prev => {
      const current = [...prev];
      setAssetsToDelete(del => [...del, current[index]]);
      current.splice(index, 1);
      return current;
    });
  };
`;

content = content.replace(
  'const handleFittingRoomSelect = (e) => {',
  galleryFunctions + '\n  const handleFittingRoomSelect = (e) => {'
);

// 6. handleSaveProduct - add existingImages[0] to delete if gridImage
content = content.replace(
  'let finalImages = [...existingImages];\n      if (gridImage) {\n         finalImages[0] = gridUrl; // replace primary\n      }',
  `let finalImages = [...existingImages];
      if (gridImage) {
         if (existingImages[0]) {
           setAssetsToDelete(prev => [...prev, existingImages[0]]);
         }
         finalImages[0] = gridUrl; // replace primary
      }`
);

// handleSaveProduct - process assetsToDelete after success
content = content.replace(
  'setIsCreatorOpen(false);\n    } catch (error) {',
  `setIsCreatorOpen(false);
      
      // Clean up deleted assets
      for (const url of assetsToDelete) {
        if (url) await deleteAdminAsset(url);
      }
      setAssetsToDelete([]);
    } catch (error) {`
);

// 7. handleDeleteProduct
content = content.replace(
  'await deleteProduct(productId);\n        showSnackbar(`Deleted ${productName}`);',
  `const product = products.find(p => p.id === productId);
        if (product) {
          if (product.images) {
            for (const img of product.images) {
              if (img) await deleteAdminAsset(img);
            }
          }
          if (product.fittingRoomData && product.fittingRoomData.urls) {
             for (const item of product.fittingRoomData.urls) {
               if (item.url) await deleteAdminAsset(item.url);
             }
          }
        }
        await deleteProduct(productId);
        showSnackbar(\`Deleted \${productName}\`);`
);

// 8. Update Gallery UI
const existingGalleryUI = `                {existingImages.length > 1 && (!galleryImages || galleryImages.length === 0) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px', textAlign: 'left' }}>
                    {existingImages.slice(1).map((url, idx) => {
                      const actualIndex = idx + 1;
                      return (
                        <div key={\`exist-gal-\${idx}\`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0A0A0A', border: '1px solid #1F1F1F', padding: '8px 12px', borderRadius: '4px', fontSize: '0.75rem', color: '#FFF' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '10px', color: '#4CAF50' }}>{url.split('/').pop().split('?')[0].substring(0,20)}...</span>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button type="button" onClick={() => moveExistingGalleryImage(actualIndex, -1)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><ChevronLeft size={14}/></button>
                            <button type="button" onClick={() => moveExistingGalleryImage(actualIndex, 1)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><ChevronRight size={14}/></button>
                            <button type="button" onClick={() => removeExistingGalleryImage(actualIndex)} style={{ background: 'none', border: 'none', color: '#FF5C00', cursor: 'pointer', marginLeft: '5px' }}><X size={14}/></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}`;

const newGalleryUI = `                {galleryImages && galleryImages.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px', textAlign: 'left' }}>
                    {Array.from(galleryImages).map((file, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0A0A0A', border: '1px solid #1F1F1F', padding: '8px 12px', borderRadius: '4px', fontSize: '0.75rem', color: '#FFF' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '10px', color: '#AAA' }}>{file.name}</span>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button type="button" onClick={() => moveGalleryImage(index, -1)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><ChevronLeft size={14}/></button>
                          <button type="button" onClick={() => moveGalleryImage(index, 1)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><ChevronRight size={14}/></button>
                          <button type="button" onClick={() => removeGalleryImage(index)} style={{ background: 'none', border: 'none', color: '#FF5C00', cursor: 'pointer', marginLeft: '5px' }}><X size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}`;

content = content.replace(
  /{existingImages.length > 1 && \(!galleryImages \|\| galleryImages.length === 0\) && \([\s\S]*?<\/span>\n                  \)}/m,
  existingGalleryUI
);

content = content.replace(
  /{galleryImages && galleryImages.length > 0 && \([\s\S]*?<\/div>\n                \)}/m,
  newGalleryUI
);


fs.writeFileSync(path, content, 'utf8');
console.log('AdminProductVault.jsx rewritten');
