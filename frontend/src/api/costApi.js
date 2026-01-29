import apiClient from "./client";

export const getCostsByCategory = (catmasterId) => {
  return apiClient.get(`/costs/category/${catmasterId}`);
};
