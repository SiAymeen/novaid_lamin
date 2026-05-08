import React, { useState } from 'react';
import { Search, Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppNavbar from '../components/AppNavbar';
import AddUserModal from '../components/AddUserModal';

// --- ROLE BADGE ---
function RoleBadge({ role }) {
  const { t } = useTranslation();
  let bgClass = '';
  let textClass = '';
  let borderClass = '';

  switch (role) {
    case 'ADMIN':
      bgClass = 'bg-purple-500/10 dark:bg-purple-500/20';
      textClass = 'text-purple-600 dark:text-purple-400';
      borderClass = 'border-purple-500/30';
      break;
    case 'COORDINATOR':
      bgClass = 'bg-amber-500/10 dark:bg-amber-500/20';
      textClass = 'text-amber-600 dark:text-amber-400';
      borderClass = 'border-amber-500/30';
      break;
    case 'VOLUNTEER':
    default:
      bgClass = 'bg-blue-500/10 dark:bg-blue-500/20';
      textClass = 'text-blue-600 dark:text-blue-400';
      borderClass = 'border-blue-500/30';
      break;
  }

  // Fall back to the raw role identifier if an unknown role slips through.
  const label = t(`users.role.${role}`, role);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgClass} ${textClass} ${borderClass}`}>
      {label}
    </span>
  );
}

// --- MOCK DATA ---
const initialUsers = [
  { _id: '1', name: 'Ahmed Ben Salah', email: 'ahmed@novaid.tn', role: 'ADMIN' },
  { _id: '2', name: 'Sarra Trabelsi', email: 'sarra@novaid.tn', role: 'COORDINATOR' },
  { _id: '3', name: 'Youssef Kallel', email: 'youssef@novaid.tn', role: 'VOLUNTEER' },
];

function Users({ toggleTheme, isDark }) {
  const { t } = useTranslation();
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const handleOpenAdd = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm(t('users.confirmDelete'))) {
      setUsers(prev => prev.filter(u => u._id !== userId));
    }
  };

  const handleSaveUser = (userData) => {
    setUsers(prev => {
      const exists = prev.find(u => u._id === userData._id);
      if (exists) {
        return prev.map(u => u._id === userData._id ? userData : u);
      }
      return [...prev, userData];
    });
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <div className="page-container">
      <AppNavbar activeRoute="users" toggleTheme={toggleTheme} isDark={isDark} />

      <main className="page-main">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title">{t('users.title')}</h1>
            <p className="text-secondary">{t('users.subtitle')}</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="btn btn-primary"
          >
            {t('users.addUser')}
          </button>
        </div>

        <AddUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          initialData={userToEdit}
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
                placeholder={t('users.searchPlaceholder')}
                className="search-input"
              />
            </div>

            {/* RESPONSIVE TABLE */}
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('users.table.name')}</th>
                    <th>{t('users.table.email')}</th>
                    <th>{t('users.table.role')}</th>
                    <th className="text-right">{t('users.table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="font-medium text-slate-800 dark:text-slate-200">
                          {user.name}
                        </td>
                        <td className="text-slate-600 dark:text-slate-400">
                          {user.email}
                        </td>
                        <td>
                          <RoleBadge role={user.role} />
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(user)}
                              className="action-button edit"
                              title={t('users.table.edit')}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="action-button delete"
                              title={t('users.table.delete')}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-muted">
                        {t('users.noResults')}
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

export default Users;
