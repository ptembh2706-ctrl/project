import apiClient from "./client";

export const getItineraryByCategory = (catmasterId) => {
  return apiClient.get(`/itineraries/category/${catmasterId}`);
};
