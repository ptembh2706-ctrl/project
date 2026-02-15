import apiClient from "./client";

export const addPassenger = (passenger) =>
  apiClient.post('/passengers/add', passenger);

export const getPassengersByBooking = (bookingId) =>
  apiClient.get(`/passengers/booking/${bookingId}`);
