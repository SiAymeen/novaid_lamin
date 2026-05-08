import React from 'react';
import { Settings as SettingsIcon, Type, Moon, Sun, Globe } from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import { usePreferences } from '../context/PreferencesContext';
import { useTranslation } from 'react-i18next';

const FONT_OPTIONS = [
  { value: 'base', labelKey: 'font.base', size: 'text-sm' },
  { value: 'lg', labelKey: 'font.medium', size: 'text-base' },
  { value: 'xl', labelKey: 'font.large', size: 'text-lg' },
];

const FONT_WEIGHT_OPTIONS = [
  { value: 'normal', labelKey: 'font.normal', weight: 'font-normal' },
  { value: 'medium', labelKey: 'font.medium', weight: 'font-medium' },
  { value: 'bold', labelKey: 'font.bold', weight: 'font-bold' },
];

function Settings({ toggleTheme, isDark }) {
  const { t, i18n } = useTranslation();
  const { fontSize, setFontSize, fontWeight, setFontWeight, currentLang, changeLanguage } = usePreferences();

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
  ];

  return (
    <div className="page-container">
      <AppNavbar activeRoute="settings" toggleTheme={toggleTheme} isDark={isDark} />
      
      <main className="page-main max-w-2xl">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="page-title flex items-center gap-3">
            <SettingsIcon size={32} style={{ color: 'var(--color-blue)' }} />
            {t('settings.title', 'Paramètres')}
          </h1>
          <p className="text-secondary">{t('settings.description', 'Personnalisez l\'affichage de l\'application')}</p>
        </div>

        {/* FONT SIZE SECTION */}
        <section className="card mb-6">
          <h2 className="text-lg font-semibold text-primary mb-1 flex items-center gap-2">
            <Type size={20} />
            {t('settings.fontSize', 'Taille du Texte')}
          </h2>
          <p className="text-sm text-secondary mb-5">{t('settings.fontSizeDesc', 'Choisissez une taille pour mieux lire.')}</p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {FONT_OPTIONS.map(({ value, labelKey, size }) => {
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
                  <span className={`${size}`}>{t(labelKey, value)}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* FONT WEIGHT SECTION */}
        <section className="card mb-8">
          <h2 className="text-lg font-semibold text-primary mb-1 flex items-center gap-2">
            <Type size={20} />
            {t('settings.fontWeight', 'Épaisseur du Texte')}
          </h2>
          <p className="text-sm text-secondary mb-5">{t('settings.fontWeightDesc', 'Augmentez pour un meilleur contraste.')}</p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {FONT_WEIGHT_OPTIONS.map(({ value, labelKey, weight }) => {
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
                  <span className={`${weight}`}>{t(labelKey, value)}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* APPEARANCE SECTION */}
        <section className="card mb-6">
          <h2 className="text-lg font-semibold text-primary mb-1 flex items-center gap-2">
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
            {t('settings.appearance', 'Apparence')}
          </h2>
          <p className="text-sm text-secondary mb-5">{t('settings.appearanceDesc', 'Choisissez le mode d\'affichage clair ou sombre.')}</p>
          
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
              <Sun size={18} className="mr-2" /> {t('settings.lightMode', 'Mode Clair')}
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
              <Moon size={18} className="mr-2" /> {t('settings.darkMode', 'Mode Sombre')}
            </button>
          </div>
        </section>

        {/* LANGUAGE SECTION - NOW FUNCTIONAL */}
        <section className="card mb-8">
          <h2 className="text-lg font-semibold text-primary mb-1 flex items-center gap-2">
            <Globe size={20} />
            {t('language.switch', 'Langue')}
          </h2>
          <p className="text-sm text-secondary mb-5">{t('settings.languageDesc', 'Choisissez la langue de l\'interface.')}</p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {languages.map(({ code, label }) => {
              const isSelected = currentLang === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => changeLanguage(code)}
                  className={`inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-muted bg-elevated text-secondary hover:border-blue-500/50'
                  }`}
                >
                  {label}
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
            {t('common.reset', 'Réinitialiser')}
          </button>
          <button 
            onClick={() => alert(t('common.saved', 'Préférences sauvegardées !'))}
            className="btn btn-primary"
          >
            {t('common.save', 'Enregistrer')}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Settings;