package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.model.Trip;
import com.chay.CarPooling.service.FareCalculationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */


@Service
public class FareCalculationServiceImpl implements FareCalculationService {

    private final WebClient webClient;

    @Value("${google.maps.api.key}")
    private String googleMapsApiKey;

    @Value("${openweathermap.api.key}")
    private String openWeatherApiKey;

    public FareCalculationServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Override
    public double calculateFare(Trip trip) {

        String startLocation = trip.getLeavingFrom().getLocation();
        String endLocation = trip.getGoingTo().getLocation();


        double distance = getDistanceFromAPI(startLocation, endLocation);
        double duration = getDurationFromAPI(startLocation, endLocation);


        String weatherCondition = getWeatherConditions(trip.getLeavingFrom().getLatitude(), trip.getLeavingFrom().getLongitude());


        int passengerCount = trip.getPassengers().size();

        double baseFare = 5.0;
        double costPerKm = 0.50;
        double costPerMinute = 0.10;


        if (weatherCondition.equals("Rain")) {
            costPerKm *= 1.1;
        }


        double totalFare = baseFare + (costPerKm * distance) + (costPerMinute * duration);


        if (passengerCount > 0) {
            totalFare /= (passengerCount + 1);
        }

        return totalFare;
    }

    @Override
    public double getDistanceFromAPI(String startLocation, String endLocation) {
        String apiKey = googleMapsApiKey;
        String distanceApiUrl = String.format("https://maps.googleapis.com/maps/api/distancematrix/json?origins=%s&destinations=%s&key=%s",
                startLocation, endLocation, apiKey);

        String response = webClient.get()
                .uri(distanceApiUrl)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return parseDistance(response);
    }

    @Override
    public double getDurationFromAPI(String startLocation, String endLocation) {
        String apiKey = googleMapsApiKey;
        String durationApiUrl = String.format("https://maps.googleapis.com/maps/api/distancematrix/json?origins=%s&destinations=%s&key=%s",
                startLocation, endLocation, apiKey);


        String response = webClient.get()
                .uri(durationApiUrl)
                .retrieve()
                .bodyToMono(String.class)
                .block();


        return parseDuration(response);
    }

    @Override
    public String getWeatherConditions(String latitude, String longitude) {
        String apiKey = openWeatherApiKey;
        String weatherApiUrl = String.format("https://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&appid=%s",
                latitude, longitude, apiKey);

        String response = webClient.get()
                .uri(weatherApiUrl)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return response.contains("rain") ? "Rain" : "Clear";
    }



    // helper methods

    private double parseDistance(String apiResponse) {
        //todo: Parse the response JSON and extract the distance in kilometers (dummy value for now)
        return 20.0;
    }

    private double parseDuration(String apiResponse) {
        // todo: Parse the response JSON and extract the duration in minutes (dummy value for now)
        return 30.0;
    }
}