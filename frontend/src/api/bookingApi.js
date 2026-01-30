import apiClient from "./client";

// ========== BOOKING ENDPOINTS ==========

export const createBooking = (payload) => {
  return apiClient.post('/bookings/create', payload);
};

export const getBookingById = (bookingId) => {
  return apiClient.get(`/bookings/${bookingId}`);
};

export const getBookingsByCustomer = (customerId) => {
  return apiClient.get(`/bookings/customer/${customerId}`);
};

export const getAllBookings = () => {
  return apiClient.get('/bookings');
};

export const cancelBooking = (bookingId) => {
  return apiClient.delete(`/bookings/${bookingId}`);
};

export const updateBookingStatus = (bookingId, status) => {
  return apiClient.put(`/bookings/${bookingId}/status?status=${status}`);
};

// ========== PAYMENT ENDPOINTS ==========

export const createRazorpayOrder = (bookingId, amount) => {
  return apiClient.post('/razorpay/create-order', {
    bookingId: bookingId,
    amount: amount,
  });
};

export const verifyPayment = (paymentData) => {
  return apiClient.post('/razorpay/verify-payment', {
    bookingId: paymentData.bookingId,
    razorpayOrderId: paymentData.razorpay_order_id,
    razorpayPaymentId: paymentData.razorpay_payment_id,
    razorpaySignature: paymentData.razorpay_signature,
  });
};

// ========== INVOICE ENDPOINTS ==========

export const downloadInvoice = (bookingId) => {
  return apiClient.get(`/invoices/${bookingId}/download`, {
    responseType: "blob",
  });
};

export const resendInvoiceEmail = (bookingId) => {
  return apiClient.post(`/invoices/${bookingId}/resend-email`);
};
