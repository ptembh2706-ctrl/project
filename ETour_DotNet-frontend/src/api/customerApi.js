import apiClient from "./client";

export const registerCustomer = (customerData) => {
  return apiClient.post('/auth/register', customerData)
    .then(res => res.data);
};

export const loginCustomer = (loginData) => {
  return apiClient.post('/auth/login', loginData)
    .then(res => res.data);
};

export const getCustomerById = (id) => {
  return apiClient.get(`/customers/${id}`)
    .then(res => res.data);
};

export const updateCustomer = (id, customerData) => {
  return apiClient.put(`/customers/${id}`, customerData)
    .then(res => res.data);
};

export const forgotPassword = (email) => {
  return apiClient.post('/auth/forgot-password', { email });
};

export const resetPassword = (token, newPassword) => {
  return apiClient.post('/auth/reset-password', { token, newPassword });
};
