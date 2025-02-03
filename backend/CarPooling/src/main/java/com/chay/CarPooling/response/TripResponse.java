package com.chay.CarPooling.response;

import com.chay.CarPooling.model.Station;
import com.chay.CarPooling.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripResponse {
    private Long id;
    private Station leavingFrom;
    private Station goingTo;
    private BigDecimal farePerSeat;
    private User driver;
    private Set<User> passengers;
    private List<String> preferences;
}
