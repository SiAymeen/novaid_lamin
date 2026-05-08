import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PreferencesContext = createContext();

export const usePreferences = () => useContext(PreferencesContext);

export const PreferencesProvider = ({ children }) => {
  const { i18n } = useTranslation();
  
  const [fontSize, setFontSize] = useState('base');
  const [fontWeight, setFontWeight] = useState('normal');
  const [currentLang, setCurrentLang] = useState('fr');

  // Load saved language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'fr';
    changeLanguage(savedLang);
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
    localStorage.setItem('language', lang);

    // Force LTR for all languages (as you requested)
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lang;
  };

  return (
    <PreferencesContext.Provider value={{
      fontSize,
      setFontSize,
      fontWeight,
      setFontWeight,
      currentLang,
      changeLanguage,
    }}>
      {children}
    </PreferencesContext.Provider>
  );
};