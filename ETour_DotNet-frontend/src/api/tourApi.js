import apiClient from "./client";

export const getTourDetails = (catmasterId) => {
  return apiClient.get(`/tours/details/${catmasterId}`);
};
