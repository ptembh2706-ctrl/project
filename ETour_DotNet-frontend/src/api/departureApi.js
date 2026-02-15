import apiClient from "./client";

export const getDepartureDatesByCategory = (catmasterId) => {
  return apiClient.get(`/departures/category/${catmasterId}`);
};
