import apiClient from "./client";

export const searchByPeriod = (from, to) => {
    return apiClient.get('/search/period', {
        params: { from, to }
    });
};

export const searchByDuration = (min, max) => {
    return apiClient.get('/search/duration', {
        params: { min, max }
    });
};

export const searchByCost = (min, max) => {
    return apiClient.get('/search/cost', {
        params: { min, max }
    });
};
