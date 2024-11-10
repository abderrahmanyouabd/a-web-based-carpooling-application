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

    @Query("SELECT t FROM Trip t " +
            "WHERE (:goingTo IS NULL OR t.goingTo.name LIKE LOWER(CONCAT('%', :goingTo, '%'))) " +
            "AND (:leavingFrom IS NULL OR LOWER(t.leavingFrom.name) LIKE LOWER(CONCAT('%', :leavingFrom, '%'))) " +
            "AND (:date IS NULL OR t.date = :date) " +
            "AND (:availableSeats IS NULL OR t.availableSeats >= :availableSeats)")
    List<Trip> searchTrips(@Param("goingTo") String goingTo,
                           @Param("leavingFrom") String leavingFrom,
                           @Param("date") String date,
                           @Param("availableSeats") Integer availableSeats);


    @Query("SELECT t FROM Trip t LEFT JOIN t.passengers p WHERE t.driver = :passenger OR p = :passenger")
    List<Trip> findByPassenger(@Param("passenger") User passenger);
}
