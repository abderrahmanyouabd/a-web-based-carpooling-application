package com.chay.CarPooling.repository;

import com.chay.CarPooling.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Repository
public interface SchemaRepository extends JpaRepository<Trip, Long> {


    @Query(value = "SELECT column_name || ' | ' || data_type || ' | ' || COALESCE(character_maximum_length::TEXT, 'NULL') || ' | ' || is_nullable " +
            "FROM information_schema.columns " +
            "WHERE table_name = :tableName", nativeQuery = true)
    List<String> getSchemaDetails(String tableName);
}
