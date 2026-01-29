import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSupportedLanguages, getTranslations } from '../api/i18nApi';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [currentLocale, setCurrentLocale] = useState('en');
    const [translations, setTranslations] = useState({});
    const [languages, setLanguages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch supported languages on mount
        getSupportedLanguages()
            .then(res => {
                setLanguages(res.data);
            })
            .catch(err => console.error("Failed to load languages", err));

        // Load default language translations
        loadTranslations('en');
    }, []);

    const loadTranslations = async (locale) => {
        setIsLoading(true);
        try {
            const res = await getTranslations(locale);
            setTranslations(res.data);
            setCurrentLocale(locale);
        } catch (err) {
            console.error(`Failed to load translations for ${locale}`, err);
        } finally {
            setIsLoading(false);
        }
    };

    const changeLanguage = (locale) => {
        loadTranslations(locale);
    };

    // Helper to get translation or fallback to key
    const t = (key) => {
        return translations[key] || key;
    };

    return (
        <LanguageContext.Provider value={{
            currentLocale,
            languages,
            changeLanguage,
            t,
            isLoading
        }}>
            {children}
        </LanguageContext.Provider>
    );
};
