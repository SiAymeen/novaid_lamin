import React, { useState, useEffect } from 'react';

const ROLES = [
  { value: 'VOLUNTEER', label: 'Bénévole' },
  { value: 'COORDINATOR', label: 'Coordinateur' },
  { value: 'ADMIN', label: 'Administrateur' },
];

function AddUserModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('VOLUNTEER');
  const [error, setError] = useState('');
  
  const isEdit = Boolean(initialData?._id);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setPassword(''); // Never pre-fill password
      setRole(initialData.role || 'VOLUNTEER');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRole('VOLUNTEER');
    }
    setError('');
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || (!isEdit && !password.trim())) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    const payload = {
      _id: isEdit ? initialData._id : Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      role,
      // In real app, password would be handled securely
    };
    
    onSave?.(payload);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center safe-area-modal">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-md flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-600 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="shrink-0 border-b border-slate-200 dark:border-slate-600 px-6 py-4 bg-white dark:bg-slate-800 rounded-t-xl z-10">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {isEdit ? 'Modifier un utilisateur' : 'Créer un utilisateur'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="user-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom complet <span className="text-red-500">*</span></label>
              <input
                id="user-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full min-h-[44px] px-3 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="user-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adresse email <span className="text-red-500">*</span></label>
              <input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full min-h-[44px] px-3 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="user-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mot de passe {!isEdit && <span className="text-red-500">*</span>}
              </label>
              <input
                id="user-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isEdit}
                minLength={6}
                placeholder={isEdit ? "Laissez vide pour conserver" : ""}
                className="w-full min-h-[44px] px-3 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="user-role" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rôle</label>
              <select
                id="user-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full min-h-[44px] px-3 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="shrink-0 border-t border-slate-200 dark:border-slate-600 px-6 py-4 bg-white dark:bg-slate-800 rounded-b-xl">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[44px] px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[44px] px-4 py-3 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal;
