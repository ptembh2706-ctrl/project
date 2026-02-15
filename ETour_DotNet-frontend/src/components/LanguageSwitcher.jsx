import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
    const { languages, currentLocale, changeLanguage } = useLanguage();

    if (!languages || languages.length === 0) return null;

    return (
        <div className="relative group">
            <select
                value={currentLocale}
                onChange={(e) => changeLanguage(e.target.value)}
                className="appearance-none bg-white/10 text-white font-medium border border-white/20 rounded-full px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer hover:bg-white/20 transition backdrop-blur-sm"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="text-gray-900 bg-white">
                        {lang.nativeName} ({lang.name})
                    </option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-white/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
