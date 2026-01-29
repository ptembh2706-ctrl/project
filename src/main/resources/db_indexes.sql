-- Indexes for optimizing frequent lookups
CREATE INDEX idx_booking_customer ON booking_header(customer_id);
CREATE INDEX idx_booking_status ON booking_header(booking_status);
CREATE INDEX idx_payment_transaction ON payment(transaction_id);
CREATE INDEX idx_passenger_booking ON passenger_master(booking_id);
