import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Edit2, Trash2 } from 'lucide-react';
import AddFamilyModal from '../components/AddFamilyModal';
import AppNavbar from '../components/AppNavbar';

// --- STATUS BADGE WITH NEW DESIGN ---
function StatusBadge({ status }) {
  const isUrgent = status === 'URGENT';
  
  return (
    <div className={`badge badge-${isUrgent ? 'urgent' : 'stable'}`}>
      <span className={`badge-dot ${isUrgent ? 'pulse' : ''}`} />
      {status}
    </div>
  );
}

// --- MOCK DATA ---
const initialFamilies = [
  { _id: '1', name: 'Famille Ben Salah', address: 'Sousse, Khzema', status: 'STABLE', needs: ['Alimentaire', 'Médical'] },
  { _id: '2', name: 'Famille Ayadi', address: 'Sfax, Menzel Chaker', status: 'URGENT', needs: ['Médical', 'Alimentaire'] },
  { _id: '3', name: 'Famille Belghith', address: 'Tunis, Mrezga', status: 'URGENT', needs: ['Médical', 'Scolaire'] },
];

function FamilyManagement({ toggleTheme, isDark }) {
  const [families, setFamilies] = useState(initialFamilies);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [familyToEdit, setFamilyToEdit] = useState(null);

  const handleOpenAdd = () => {
    setFamilyToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (family) => {
    setFamilyToEdit(family);
    setIsModalOpen(true);
  };

  const handleDeleteFamily = (familyId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette famille ?")) {
      setFamilies(prev => prev.filter(f => f._id !== familyId));
    }
  };

  const handleSaveFamily = (familyData) => {
    setFamilies(prev => {
      const exists = prev.find(f => f._id === familyData._id);
      if (exists) {
        return prev.map(f => f._id === familyData._id ? familyData : f);
      }
      return [...prev, familyData];
    });
  };

  const filteredFamilies = families.filter((f) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const name = (f.name || '').toLowerCase();
    const address = (f.address || '').toLowerCase();
    return name.includes(q) || address.includes(q);
  });

  return (
    <div className="page-container">
      <AppNavbar activeRoute="families" toggleTheme={toggleTheme} isDark={isDark} />
      
      <main className="page-main">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title">Gestion des Familles</h1>
            <p className="text-secondary">Annuaire et suivi des familles</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="btn btn-primary"
          >
            + Ajouter une famille
          </button>
        </div>

        <AddFamilyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveFamily}
          initialData={familyToEdit}
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
                placeholder="Rechercher une famille..."
                className="search-input"
              />
            </div>

            {/* RESPONSIVE TABLE */}
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Adresse</th>
                    <th>Statut</th>
                    <th>Besoins</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFamilies.length > 0 ? (
                    filteredFamilies.map((family) => (
                      <tr key={family._id}>
                        <td>
                          <Link to={`/family/${family._id}`} className="link-primary">
                            {family.name}
                          </Link>
                        </td>
                        <td>{family.address || '-'}</td>
                        <td>
                          <StatusBadge status={family.status} />
                        </td>
                        <td>
                          <div className="flex gap-1 flex-wrap">
                            {family.needs?.length > 0 ? (
                              family.needs.map((need, idx) => (
                                <span key={idx} className="need-pill need-pill-default">
                                  {need}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleOpenEdit(family)}
                              className="action-button edit"
                              title="Éditer"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteFamily(family._id)}
                              className="action-button delete"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-muted">
                        Aucune famille trouvée
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

export default FamilyManagement;
