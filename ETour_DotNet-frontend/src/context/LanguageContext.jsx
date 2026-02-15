import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSupportedLanguages } from '../api/i18nApi';
import enTranslations from '../locales/en.json';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [currentLocale, setCurrentLocale] = useState('en');
    const [translations, setTranslations] = useState({});
    const [languages, setLanguages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch supported languages on mount (Optional: Keep or remove if API is fully dead)
        // For now, we'll keep it but ignore errors
        getSupportedLanguages()
            .then(res => {
                setLanguages(res.data);
            })
            .catch(err => console.warn("Failed to load languages API", err));

        // Load default language translations
        loadTranslations('en');
    }, []);

    const loadTranslations = async (locale) => {
        setIsLoading(true);
        try {
            // Use local file instead of API
            if (locale === 'en') {
                setTranslations(enTranslations);
            } else {
                console.warn(`Locale ${locale} not found locally, falling back to EN`);
                setTranslations(enTranslations);
            }
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
