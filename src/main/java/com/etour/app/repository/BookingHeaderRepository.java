package com.etour.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.etour.app.entity.BookingHeader;

public interface BookingHeaderRepository
		extends JpaRepository<BookingHeader, Integer> {
	@Query(value = "SELECT * FROM booking_header WHERE customer_id = :customerId", nativeQuery = true)
	List<BookingHeader> getBookingsByCustomerId(@Param("customerId") Integer customerId);

	@Query(value = """
			SELECT
			    bh.booking_id,
			    bh.booking_date,
			    bh.booking_status,
			    bh.total_passengers,

			    bh.tour_amount,
			    bh.tax_amount,
			    bh.total_amount,

			    c.customer_id,
			    c.name,
			    c.email,
			    c.mobile_number,

			    t.tour_id,
			    t.description,

			    d.departure_date,
			    d.end_date,
			    d.number_of_days,

			    pmt.payment_mode,
			    pmt.payment_status,
			    pmt.transaction_id,
			    pmt.payment_date,

			    ps.passenger_name,
			    ps.passenger_type,
			    ps.passenger_amount

			FROM booking_header bh
			JOIN payment pmt
			    ON bh.booking_id = pmt.booking_id
			JOIN customer_master c
			    ON bh.customer_id = c.customer_id
			JOIN tour_master t
			    ON bh.tour_id = t.tour_id
			JOIN departure_date_master d
			    ON bh.departure_date_id = d.departure_date_id
			LEFT JOIN passenger_master ps
			    ON bh.booking_id = ps.booking_id

			WHERE bh.booking_id = :bookingId
			  AND bh.booking_status = 'CONFIRMED'
			  AND pmt.payment_status = 'SUCCESS'
			""", nativeQuery = true)
	List<Object[]> fetchInvoiceData(@Param("bookingId") Long bookingId);

	@Query("SELECT b FROM BookingHeader b " +
			"LEFT JOIN FETCH b.customer " +
			"LEFT JOIN FETCH b.tour " +
			"LEFT JOIN FETCH b.departureDate " +
			"WHERE b.id = :id")
	java.util.Optional<BookingHeader> findByIdWithDetails(@Param("id") Integer id);
}
