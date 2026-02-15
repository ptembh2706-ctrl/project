import apiClient from "./client";

export const getSupportedLanguages = () => {
    return apiClient.get('/i18n/languages');
};

export const getTranslations = (locale) => {
    return apiClient.get(`/i18n/${locale}`);
};
