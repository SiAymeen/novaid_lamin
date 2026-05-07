import React from 'react';
import { Settings as SettingsIcon, Type, Moon, Sun, Globe } from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import { usePreferences } from '../context/PreferencesContext';

const FONT_OPTIONS = [
  { value: 'base', label: 'Standard', size: 'text-sm' },
  { value: 'lg', label: 'Moyen', size: 'text-base' },
  { value: 'xl', label: 'Grand', size: 'text-lg' },
];

const FONT_WEIGHT_OPTIONS = [
  { value: 'normal', label: 'Normale', weight: 'font-normal' },
  { value: 'medium', label: 'Medium', weight: 'font-medium' },
  { value: 'bold', label: 'Gras', weight: 'font-bold' },
];

function Settings({ toggleTheme, isDark }) {
  const { fontSize, setFontSize, fontWeight, setFontWeight } = usePreferences();

  return (
    <div className="page-container">
      <AppNavbar activeRoute="settings" toggleTheme={toggleTheme} isDark={isDark} />
      
      <main className="page-main max-w-2xl">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="page-title flex items-center gap-3">
            <SettingsIcon size={32} style={{ color: 'var(--color-blue)' }} />
            Paramètres
          </h1>
          <p className="text-secondary">Personnalisez l'affichage de l'application</p>
        </div>

        {/* FONT SIZE SECTION */}
        <section className="card mb-6">
          <h2 className="text-lg font-semibold text-primary mb-1 flex items-center gap-2">
            <Type size={20} />
            Taille du Texte
          </h2>
          <p className="text-sm text-secondary mb-5">Choisissez une taille pour mieux lire.</p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {FONT_OPTIONS.map(({ value, label, size }) => {
              const isSelected = fontSize === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFontSize(value)}
                  className={`inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-muted bg-elevated text-secondary hover:border-blue-500/50'
                  }`}
                >
                  <span className={`${size}`}>{label}</span>
                </button>
              );
            })}
          </div>

          {/* PREVIEW */}
          <div className="p-5 rounded-lg border border-blue-500/20 bg-blue-500/5">
            <p className={`text-secondary italic transition-all ${
              fontSize === 'base' ? 'text-base' : fontSize === 'lg' ? 'text-lg' : 'text-xl'
            } ${
              fontWeight === 'normal' ? 'font-normal' : fontWeight === 'medium' ? 'font-medium' : 'font-bold'
            }`}>
              Aperçu: Voici comment le texte s'affichera dans l'application avec ces paramètres.
            </p>
          </div>
        </section>

        {/* FONT WEIGHT SECTION */}
        <section className="card mb-8">
          <h2 className="text-lg font-semibold text-primary mb-1 flex items-center gap-2">
            <Type size={20} />
            Épaisseur du Texte
          </h2>
          <p className="text-sm text-secondary mb-5">Augmentez pour un meilleur contraste.</p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {FONT_WEIGHT_OPTIONS.map(({ value, label, weight }) => {
              const isSelected = fontWeight === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFontWeight(value)}
                  className={`inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-muted bg-elevated text-secondary hover:border-blue-500/50'
                  }`}
                >
                  <span className={`${weight}`}>{label}</span>
                </button>
              );
            })}
          </div>

          {/* PREVIEW */}
          <div className="p-5 rounded-lg border border-blue-500/20 bg-blue-500/5">
            <p className={`text-secondary italic transition-all ${
              fontSize === 'base' ? 'text-base' : fontSize === 'lg' ? 'text-lg' : 'text-xl'
            } ${
              fontWeight === 'normal' ? 'font-normal' : fontWeight === 'medium' ? 'font-medium' : 'font-bold'
            }`}>
              Aperçu: Observez la différence de contraste avec l'option sélectionnée.
            </p>
          </div>
        </section>

        {/* APPEARANCE SECTION */}
        <section className="card mb-6">
          <h2 className="text-lg font-semibold text-primary mb-1 flex items-center gap-2">
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
            Apparence
          </h2>
          <p className="text-sm text-secondary mb-5">Choisissez le mode d'affichage clair ou sombre.</p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              type="button"
              onClick={() => { if (isDark) toggleTheme(); }}
              className={`inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                !isDark
                  ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                  : 'border-muted bg-elevated text-secondary hover:border-blue-500/50'
              }`}
            >
              <Sun size={18} className="mr-2" /> Mode Clair
            </button>
            <button
              type="button"
              onClick={() => { if (!isDark) toggleTheme(); }}
              className={`inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                isDark
                  ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                  : 'border-muted bg-elevated text-secondary hover:border-blue-500/50'
              }`}
            >
              <Moon size={18} className="mr-2" /> Mode Sombre
            </button>
          </div>
        </section>

        {/* LANGUAGE SECTION */}
        <section className="card mb-8">
          <h2 className="text-lg font-semibold text-primary mb-1 flex items-center gap-2">
            <Globe size={20} />
            Langue
          </h2>
          <p className="text-sm text-secondary mb-5">Choisissez la langue de l'interface.</p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {['Français', 'العربية', 'English'].map((lang, idx) => {
              const isSelected = idx === 0;
              return (
                <button
                  key={lang}
                  type="button"
                  className={`inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-muted bg-elevated text-secondary hover:border-blue-500/50'
                  }`}
                >
                  <span>{lang}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => { setFontSize('base'); setFontWeight('normal'); }}
            className="btn btn-outline"
          >
            Réinitialiser
          </button>
          <button 
            onClick={() => alert('Préférences sauvegardées !')}
            className="btn btn-primary"
          >
            Enregistrer
          </button>
        </div>
      </main>
    </div>
  );
}

export default Settings;
