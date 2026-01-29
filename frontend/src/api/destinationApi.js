import apiClient from "./client";

export const getAllDestinations = () => {
    return apiClient.get('/destinations')
        .then(res => res.data);
};
