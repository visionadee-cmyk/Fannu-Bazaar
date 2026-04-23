import { Globe } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'dv' : 'en';
    setLanguage(newLang);
    // Set document direction for RTL support
    document.documentElement.dir = newLang === 'dv' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span>{language === 'en' ? 'English' : 'ދިވެހި'}</span>
    </button>
  );
}
