import React, { useState, useEffect } from 'react';

function AddStockModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Alimentaire');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pièces');
  const [minThreshold, setMinThreshold] = useState(5);
  const [error, setError] = useState('');

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setName(initialData.name || '');
      setCategory(initialData.category || 'Alimentaire');
      setQuantity(initialData.quantity ?? 1);
      setUnit(initialData.unit || 'pièces');
      setMinThreshold(initialData.minThreshold ?? 5);
    } else {
      setName('');
      setCategory('Alimentaire');
      setQuantity(1);
      setUnit('pièces');
      setMinThreshold(5);
    }
    setError('');
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !unit.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    const payload = {
      id: isEdit ? initialData.id : Date.now().toString(),
      name: name.trim(),
      category,
      quantity: Number(quantity),
      unit: unit.trim(),
      minThreshold: Number(minThreshold),
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
            {isEdit ? 'Modifier un article' : 'Ajouter un article'}
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
              <label htmlFor="stock-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom de l'article <span className="text-red-500">*</span></label>
              <input
                id="stock-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="ex: Eau minérale"
                className="w-full min-h-[44px] px-3 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="stock-category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Catégorie</label>
                <select
                  id="stock-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Alimentaire">Alimentaire</option>
                  <option value="Médical">Médical</option>
                  <option value="Vêtements">Vêtements</option>
                  <option value="Hygiène">Hygiène</option>
                  <option value="Scolaire">Scolaire</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label htmlFor="stock-unit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unité <span className="text-red-500">*</span></label>
                <input
                  id="stock-unit"
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                  placeholder="ex: boîtes"
                  className="w-full min-h-[44px] px-3 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="stock-quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantité</label>
                <input
                  id="stock-quantity"
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="w-full min-h-[44px] px-3 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="stock-threshold" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Seuil d'alerte</label>
                <input
                  id="stock-threshold"
                  type="number"
                  min="1"
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(e.target.value)}
                  required
                  className="w-full min-h-[44px] px-3 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
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

export default AddStockModal;
