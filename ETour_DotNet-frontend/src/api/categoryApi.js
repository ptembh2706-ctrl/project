import apiClient from "./client";

export const getMainCategories = () => {
  return apiClient.get('/categories');
};

export const handleCategoryClick = (categoryId) => {
  return apiClient.get(`/categories/${categoryId}`);
};

export const searchCategories = (params) => {
  return apiClient.get('/categories/search', { params });
};
