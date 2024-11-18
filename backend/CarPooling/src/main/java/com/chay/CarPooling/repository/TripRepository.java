package com.chay.CarPooling.repository;

import com.chay.CarPooling.model.Trip;
import com.chay.CarPooling.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
public interface TripRepository extends JpaRepository<Trip, Long> {



    @Query(value = "SELECT * FROM trip t " +
            "WHERE (:goingTo IS NULL OR " +
            "      regexp_replace(TRIM(t.going_to_name), '[^a-zA-Z0-9]', '', 'g') ILIKE '%' || regexp_replace(TRIM(:goingTo), '[^a-zA-Z0-9]', '', 'g') || '%') " +
            "AND (:leavingFrom IS NULL OR " +
            "      regexp_replace(TRIM(t.leaving_from_name), '[^a-zA-Z0-9]', '', 'g') ILIKE '%' || regexp_replace(TRIM(:leavingFrom), '[^a-zA-Z0-9]', '', 'g') || '%') " +
            "AND (:date IS NULL OR t.date = :date) " +
            "AND (:availableSeats IS NULL OR t.available_seats >= :availableSeats)",
            nativeQuery = true)
    List<Trip> searchTrips(@Param("goingTo") String goingTo,
                           @Param("leavingFrom") String leavingFrom,
                           @Param("date") String date,
                           @Param("availableSeats") Integer availableSeats);


    @Query("SELECT t FROM Trip t LEFT JOIN t.passengers p WHERE t.driver = :passenger OR p = :passenger")
    List<Trip> findByPassenger(@Param("passenger") User passenger);

    List<Trip> findByPassengers_Id(Long userId);
    List<Trip> findByDriver_Id(Long userId);
}
