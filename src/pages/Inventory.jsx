import React, { useState } from 'react';
import { Package, Plus, Minus, Search, Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppNavbar from '../components/AppNavbar';
import AddStockModal from '../components/AddStockModal';

// --- STATUS BADGE ---
function StatusBadge({ isLow }) {
  const { t } = useTranslation();
  const statusBadge = isLow ? 'urgent' : 'stable';
  const label = isLow ? t('inventory.status.low') : t('inventory.status.ok');

  return (
    <div className={`badge badge-${statusBadge}`}>
      <span className={`badge-dot ${isLow ? 'pulse' : ''}`} />
      {label}
    </div>
  );
}

function Inventory({ toggleTheme, isDark }) {
  const { t } = useTranslation();

  // Mock data: `category` and `unit` are i18n keys, resolved via t() at render.
  const [items, setItems] = useState([
    { id: '1', name: 'Lait infantile', category: 'food', quantity: 5, unit: 'box', minThreshold: 10 },
    { id: '2', name: 'Doliprane 1000', category: 'medical', quantity: 45, unit: 'box', minThreshold: 20 },
    { id: '3', name: 'Couvertures', category: 'other', quantity: 2, unit: 'piece', minThreshold: 5 },
    { id: '4', name: 'Cahiers scolaires', category: 'school', quantity: 120, unit: 'piece', minThreshold: 50 },
    { id: '5', name: 'Pâtes', category: 'food', quantity: 25, unit: 'kg', minThreshold: 30 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const handleOpenAdd = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm(t('inventory.confirmDelete'))) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleSaveItem = (itemData) => {
    setItems((prev) => {
      const exists = prev.find(i => i.id === itemData.id);
      if (exists) {
        return prev.map(i => i.id === itemData.id ? itemData : i);
      }
      return [...prev, itemData];
    });
  };

  const handleAddQty = (id) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  };

  const handleRemoveQty = (id) => {
    setItems((prev) => prev.map((i) => i.id === id && i.quantity > 0 ? { ...i, quantity: i.quantity - 1 } : i));
  };

  const filteredItems = items.filter((i) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const name = (i.name || '').toLowerCase();
    // search both raw category key and translated label
    const categoryRaw = (i.category || '').toLowerCase();
    const categoryLabel = t(`inventory.category.${i.category}`, i.category).toLowerCase();
    return name.includes(q) || categoryRaw.includes(q) || categoryLabel.includes(q);
  });

  return (
    <div className="page-container">
      <AppNavbar activeRoute="inventory" toggleTheme={toggleTheme} isDark={isDark} />

      <main className="page-main">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title flex items-center gap-3">
              <Package size={32} style={{ color: 'var(--color-blue)' }} />
              {t('inventory.title')}
            </h1>
            <p className="text-secondary">{t('inventory.subtitle')}</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="btn btn-primary"
          >
            {t('inventory.addItem')}
          </button>
        </div>

        <AddStockModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
          initialData={itemToEdit}
        />

        {/* SEARCH AND TABLE SECTION */}
        <div className="mb-6">
          <div className="table-wrapper">
            <div className="table-search">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('inventory.searchPlaceholder')}
                className="search-input"
              />
            </div>

            {/* RESPONSIVE TABLE */}
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('inventory.table.name')}</th>
                    <th>{t('inventory.table.category')}</th>
                    <th>{t('inventory.table.status')}</th>
                    <th>{t('inventory.table.quantity')}</th>
                    <th className="text-right">{t('inventory.table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => {
                      const isLow = item.quantity < item.minThreshold;
                      return (
                        <tr key={item.id} className={isLow ? 'urgent' : ''}>
                          <td className="font-medium text-slate-800 dark:text-slate-200">
                            {item.name}
                          </td>
                          <td className="text-slate-600 dark:text-slate-400">
                            {t(`inventory.category.${item.category}`, item.category)}
                          </td>
                          <td>
                            <StatusBadge isLow={isLow} />
                          </td>
                          <td>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleRemoveQty(item.id)}
                                disabled={item.quantity <= 0}
                                className="control-btn control-btn-minus"
                                style={{width: '28px', height: '28px'}}
                                title={t('inventory.table.removeQty')}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-medium min-w-[3rem] text-center">
                                {item.quantity} <span className="text-xs text-muted">{t(`inventory.unit.${item.unit}`, item.unit)}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddQty(item.id)}
                                className="control-btn control-btn-plus"
                                style={{width: '28px', height: '28px'}}
                                title={t('inventory.table.addQty')}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="action-button edit"
                                title={t('inventory.table.edit')}
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="action-button delete"
                                title={t('inventory.table.delete')}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-muted">
                        {t('inventory.noResults')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Inventory;
