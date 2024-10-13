package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.model.Trip;
import com.chay.CarPooling.service.FareCalculationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import reactor.core.publisher.Mono;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@Service
public class FareCalculationServiceImpl implements FareCalculationService {


    private final WebClient webClient;

    @Value("${openrouteservice.api.key}")
    private String openRouteServiceApiKey;

    @Value("${openweathermap.api.key}")
    private String openWeatherApiKey;

    public FareCalculationServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Override
    public double calculateFare(Trip trip) {

        // real coordinates should be given in case ur testing
        String startLatitude = trip.getLeavingFrom().getLatitude();
//        String startLatitude = "48.856613";
        String startLongitude = trip.getLeavingFrom().getLongitude();
//        String startLongitude = "2.352222";
        String endLatitude = trip.getGoingTo().getLatitude();
//        String endLatitude = "51.507351";
        String endLongitude = trip.getGoingTo().getLongitude();
//        String endLongitude = "-0.127758";

        // Fetch distance and duration using OpenRouteService
        double[] distanceAndDuration = getDistanceAndDurationFromAPI(startLatitude, startLongitude, endLatitude, endLongitude);
        double distance = distanceAndDuration[0]; // Distance in kilometers
        System.out.println("distance:" + distance);
        double duration = distanceAndDuration[1]; // Duration in minutes
        System.out.println("duration: " + duration);

        // Get weather conditions for the trip origin
//        String weatherCondition = getWeatherConditions(startLatitude, startLongitude);

        int passengerCount = trip.getPassengers().size();

        // Base fare components
        double baseFare = 5.0;
        double costPerKm = 0.50;
        double costPerMinute = 0.10;

        // Apply a weather surcharge if it is raining
//        if (weatherCondition.equals("Rain")) {
//            costPerKm *= 1.1;
//        }

        // Calculate total fare
        double totalFare = baseFare + (costPerKm * distance) + (costPerMinute * duration);

        // Distribute fare among passengers
        if (passengerCount > 0) {
            totalFare /= (passengerCount + 1);
        }

        return totalFare;
    }

    public double[] getDistanceAndDurationFromAPI(String startLatitude, String startLongitude, String endLatitude, String endLongitude) {
        // Define the API URL
        String apiUrl = "https://api.openrouteservice.org/v2/directions/driving-car";

        // Create the request body with the coordinates
        String requestBody = String.format("{\"coordinates\":[[%s,%s],[%s,%s]]}", startLongitude, startLatitude, endLongitude, endLatitude);

        // Call the WebClient to make a POST request with the appropriate headers
        String response = webClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + openRouteServiceApiKey)  // Ensure that the API key is passed correctly
                .header("Content-Type", "application/json; charset=utf-8")
                .header("Accept", "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8")
                .bodyValue(requestBody) // Set the request body
                .retrieve()
                .bodyToMono(String.class)  // Retrieve the response as a String
                .block();  // Block to wait for the response

        // Parse the response to extract distance and duration
        return parseDistanceAndDuration(response);
    }



    private double[] parseDistanceAndDuration(String apiResponse) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(apiResponse);

            // Extract distance and duration from the first route summary
            JsonNode summaryNode = rootNode.path("routes").get(0).path("summary");

            double distanceInMeters = summaryNode.path("distance").asDouble();
            double durationInSeconds = summaryNode.path("duration").asDouble();

            // Convert distance to kilometers and duration to minutes
            double distanceInKm = distanceInMeters / 1000;
            double durationInMinutes = durationInSeconds / 60;

            return new double[]{distanceInKm, durationInMinutes};

        } catch (Exception e) {
            throw new RuntimeException("Error parsing distance and duration from OpenRouteService response", e);
        }
    }

    // todo: I need to find a good logic before using it
////    https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/47.5316,21.6273/2024-10-08T10:00:00?key=RQCVCKFRKSUSAYPMRR5EKVPAA&contentType=json
//    @Override
//    public String getWeatherConditions(String latitude, String longitude) {
//        String apiKey = openWeatherApiKey;
//        String weatherApiUrl = String.format("https://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&appid=%s",
//                latitude, longitude, apiKey);
//
//        String response = webClient.get()
//                .uri(weatherApiUrl)
//                .retrieve()
//                .bodyToMono(String.class)
//                .block();
//
//        return response.contains("rain") ? "Rain" : "Clear";
//    }
}
