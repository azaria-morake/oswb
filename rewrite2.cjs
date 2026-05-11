const fs = require('fs');

const path = '/home/rootz/ux-giants/oswb/src/pages/admin/AdminProductVault.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Imports
content = content.replace(
  'deleteAdminAsset\n} from \'../../firebase/api\';',
  'deleteAdminAsset,\n  updateDropContainerStatus\n} from \'../../firebase/api\';'
);

// 2. handleUpdateDropStatus
const handleUpdateDropStatus = `
  const handleUpdateDropStatus = async (dropId, newStatus) => {
    try {
      await updateDropContainerStatus(dropId, newStatus);
      showSnackbar('Drop status updated');
    } catch (error) {
      showSnackbar('Error updating drop status', 'error');
    }
  };

  const handleDeleteDrop = async (dropId) => {`;

content = content.replace(
  'const handleDeleteDrop = async (dropId) => {',
  handleUpdateDropStatus
);

// 3. Drop Management Table
const dropTableHTML = `<td style={{ padding: '12px 15px', color: '#FFF', fontSize: '0.85rem' }}>{d.name}</td>
                        <td style={{ padding: '12px 15px' }}>
                          <select 
                            className="admin-input" 
                            style={{ padding: '4px 8px', fontSize: '0.75rem', margin: 0, width: 'auto' }}
                            value={d.status || 'draft'}
                            onChange={e => handleUpdateDropStatus(d.id, e.target.value)}
                          >
                            <option value="draft">DRAFT</option>
                            <option value="upcoming">UPCOMING</option>
                            <option value="active">ACTIVE</option>
                            <option value="archived">ARCHIVED</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px 15px', textAlign: 'right' }}>`;

content = content.replace(
  '<td style={{ padding: \'12px 15px\', color: \'#FFF\', fontSize: \'0.85rem\' }}>{d.name}</td>\n                        <td style={{ padding: \'12px 15px\', textAlign: \'right\' }}>',
  dropTableHTML
);

fs.writeFileSync(path, content, 'utf8');
console.log('AdminProductVault.jsx rewritten for drops');
