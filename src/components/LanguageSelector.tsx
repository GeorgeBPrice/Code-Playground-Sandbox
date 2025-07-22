import React from 'react';
import { Language, LanguageConfig } from '../types';
import { languageConfigs } from '../config/languages';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  const languages: LanguageConfig[] = Object.values(languageConfigs);

  return (
    <div className="card">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onLanguageChange(lang.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedLanguage === lang.id
                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                : 'border-dark-600 bg-dark-700 hover:border-dark-500 hover:bg-dark-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{lang.icon}</span>
              <div className="text-left">
                <div className="font-semibold">{lang.name}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector; 