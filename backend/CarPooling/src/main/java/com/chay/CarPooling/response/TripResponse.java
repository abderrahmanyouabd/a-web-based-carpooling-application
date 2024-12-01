package com.chay.CarPooling.response;

import com.chay.CarPooling.model.Station;
import com.chay.CarPooling.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

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
}
