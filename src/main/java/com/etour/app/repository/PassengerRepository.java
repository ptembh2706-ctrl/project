package com.etour.app.repository;

import com.etour.app.entity.PassengerMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PassengerRepository extends JpaRepository<PassengerMaster, Integer> {

    // ✅ Native query (no HQL parsing, so no ANTLR issue)
    @Query(value = "SELECT * FROM passenger_master WHERE booking_id = :bid", nativeQuery = true)
    List<PassengerMaster> findPassengersByBookingId(@Param("bid") int bookingId);

    List<PassengerMaster> findByPassengerType(String passengerType);
}
