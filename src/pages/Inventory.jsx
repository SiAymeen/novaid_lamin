import React, { useState } from 'react';
import { Package, Plus, Minus, Search, Edit2, Trash2 } from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import AddStockModal from '../components/AddStockModal';

// --- STATUS BADGE ---
function StatusBadge({ isLow }) {
  const statusBadge = isLow ? 'urgent' : 'stable';
  const label = isLow ? 'Bas' : 'OK';

  return (
    <div className={`badge badge-${statusBadge}`}>
      <span className={`badge-dot ${isLow ? 'pulse' : ''}`} />
      {label}
    </div>
  );
}

function Inventory({ toggleTheme, isDark }) {
  const [items, setItems] = useState([
    { id: '1', name: 'Lait infantile', category: 'Alimentaire', quantity: 5, unit: 'boîtes', minThreshold: 10 },
    { id: '2', name: 'Doliprane 1000', category: 'Médical', quantity: 45, unit: 'boîtes', minThreshold: 20 },
    { id: '3', name: 'Couvertures', category: 'Autre', quantity: 2, unit: 'pièces', minThreshold: 5 },
    { id: '4', name: 'Cahiers scolaires', category: 'Scolaire', quantity: 120, unit: 'pièces', minThreshold: 50 },
    { id: '5', name: 'Pâtes', category: 'Alimentaire', quantity: 25, unit: 'kg', minThreshold: 30 },
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
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
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
    const category = (i.category || '').toLowerCase();
    return name.includes(q) || category.includes(q);
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
              Gestion des Stocks
            </h1>
            <p className="text-secondary">Gérez les stocks de votre association</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="btn btn-primary"
          >
            + Ajouter un article
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
                placeholder="Rechercher un article..."
                className="search-input"
              />
            </div>

            {/* RESPONSIVE TABLE */}
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nom de l'article</th>
                    <th>Catégorie</th>
                    <th>Statut</th>
                    <th>Quantité</th>
                    <th className="text-right">Actions</th>
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
                            {item.category}
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
                                title="Retirer"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-medium min-w-[3rem] text-center">
                                {item.quantity} <span className="text-xs text-muted">{item.unit}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddQty(item.id)}
                                className="control-btn control-btn-plus"
                                style={{width: '28px', height: '28px'}}
                                title="Ajouter"
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
                                title="Éditer"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(item.id)}
                                className="action-button delete"
                                title="Supprimer"
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
                        Aucun article trouvé
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
