package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.model.Trip;
import com.chay.CarPooling.model.Vehicle;
import com.chay.CarPooling.service.FareCalculationService;
import com.fasterxml.jackson.databind.util.JSONPObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;

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

    @Value("${gasprice.api.key}")
    private String gasPriceApiKey;

    public FareCalculationServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

//    @Override
//    public double calculateFare(Trip trip) {
//
//        // real coordinates should be given in case ur testing
//        String startLatitude = trip.getLeavingFrom().getLatitude();
////        String startLatitude = "48.856613";
//        String startLongitude = trip.getLeavingFrom().getLongitude();
////        String startLongitude = "2.352222";
//        String endLatitude = trip.getGoingTo().getLatitude();
////        String endLatitude = "51.507351";
//        String endLongitude = trip.getGoingTo().getLongitude();
////        String endLongitude = "-0.127758";
//
//        // Fetch distance and duration using OpenRouteService
//        double[] distanceAndDuration = getDistanceAndDurationFromAPI(startLatitude, startLongitude, endLatitude, endLongitude);
//        double distance = distanceAndDuration[0]; // Distance in kilometers
//        System.out.println("distance:" + distance);
//        double duration = distanceAndDuration[1]; // Duration in minutes
//        System.out.println("duration: " + duration);
//
//        // Get weather conditions for the trip origin
////        String weatherCondition = getWeatherConditions(startLatitude, startLongitude);
//
//        int passengerCount = trip.getPassengers().size();
//
//        // Base fare components
//        double baseFare = 5.0;
//        double costPerKm = 0.50;
//        double costPerMinute = 0.10;
//
//        // Apply a weather surcharge if it is raining
////        if (weatherCondition.equals("Rain")) {
////            costPerKm *= 1.1;
////        }
//
//        // Calculate total fare
//        double totalFare = baseFare + (costPerKm * distance) + (costPerMinute * duration);
//
//        // Distribute fare among passengers
//        if (passengerCount > 0) {
//            totalFare /= (passengerCount + 1);
//        }
//
//        return totalFare;
//    }

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

//    @Override
//    public Double getGasPrice(String latitude, String longitude, String gasolineOrDiesel) {
//        String apiUrl = String.format("https://api.collectapi.com/gasPrice/fromCoordinates?lng=%s&lat=%s", longitude, latitude);
//        String response = webClient.post()
//                .uri(apiUrl)
//                .header("authorization", gasPriceApiKey)
//                .header("Content-Type", "application/json; charset=utf-8")
//                .retrieve()
//                .bodyToMono(String.class)
//                .block();
//
//        // Parse the response using Jackson
//        ObjectMapper objectMapper = new ObjectMapper();
//        try {
//            JsonNode jsonResponse = objectMapper.readTree(response);
//            JsonNode result = jsonResponse.get("result");
//
//            if ("gasoline".equalsIgnoreCase(gasolineOrDiesel)) {
//                return result.get("gasoline").asDouble();
//            } else if ("diesel".equalsIgnoreCase(gasolineOrDiesel)) {
//                return result.get("diesel").asDouble();
//            } else {
//                throw new IllegalArgumentException("Invalid fuel type. Please provide either 'gasoline' or 'diesel'.");
//            }
//        } catch (Exception e) {
//            throw new RuntimeException("Error parsing the gas price response: " + e.getMessage(), e);
//        }
//    }



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

//    // todo: I need to find a good logic before using it
//////    https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/47.5316,21.6273/2024-10-08T10:00:00?key=RQCVCKFRKSUSAYPMRR5EKVPAA&contentType=json
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



    @Override
    public BigDecimal calculateFare2(Trip trip) {
        String startLatitude = trip.getLeavingFrom().getLatitude();
        String startLongitude = trip.getLeavingFrom().getLongitude();
        String endLatitude = trip.getGoingTo().getLatitude();
        String endLongitude = trip.getGoingTo().getLongitude();

        double[] distanceAndDuration = getDistanceAndDurationFromAPI(startLatitude, startLongitude, endLatitude, endLongitude);

        BigDecimal distance = BigDecimal.valueOf(distanceAndDuration[0])
                .divide(BigDecimal.valueOf(1000), 2, RoundingMode.HALF_UP);
        LocalDateTime departureTime = trip.getLeavingFrom().getDepartureTime();

        // Convert duration from seconds to a Duration object
        Duration duration = Duration.ofSeconds((long) distanceAndDuration[1]);

        // Calculate the arrival time
        LocalDateTime arrivalTime = departureTime.plus(duration);
        trip.getGoingTo().setArrivalTime(arrivalTime);

        BigDecimal passengerCount = BigDecimal.valueOf(trip.getAvailableSeats());

        Vehicle vehicle = trip.getVehicle();
        if (vehicle == null || vehicle.getGasType() == null) {
            throw new IllegalArgumentException("No vehicle or gas type found for the driver");
        }
//        BigDecimal gasPrice = BigDecimal.valueOf(getGasPrice(startLatitude, endLongitude, trip.getVehicle().getGasType().name()));

        BigDecimal fuelEfficiency = new BigDecimal("8.0"); // Assume 8 liters per 100 km

        // Maintenance rate (cost per kilometer)
        BigDecimal maintenanceRate = new BigDecimal("0.05"); // $0.05 per kilometer for maintenance costs

        // Profit margin
        BigDecimal profitMargin = new BigDecimal("0.10"); // 10% profit margin

        // Step 1: Calculate fuel consumption
        BigDecimal fuelConsumption = distance.divide(new BigDecimal("100"), RoundingMode.HALF_UP)
                .multiply(fuelEfficiency);

        // Step 2: Calculate fuel cost
//        BigDecimal fuelCost = fuelConsumption.multiply(gasPrice);
        BigDecimal fuelCost = fuelConsumption.multiply(BigDecimal.ONE);
        // Step 3: Adjust for weather impact (commented out but can be adjusted as needed)
// BigDecimal adjustedFuelCost = fuelCost.multiply(weatherImpact);
// System.out.println("Adjusted Fuel Cost (after weather impact): " + adjustedFuelCost);
        BigDecimal adjustedFuelCost = fuelCost;

        // Step 4: Calculate maintenance cost
        BigDecimal maintenanceCost = distance.multiply(maintenanceRate);

        // Step 5: Calculate total cost
        BigDecimal totalCost = adjustedFuelCost.add(maintenanceCost);

        BigDecimal pricePerFare = totalCost.divide(passengerCount, RoundingMode.HALF_UP)
                .multiply(BigDecimal.ONE.add(profitMargin));


        BigDecimal finalFare = pricePerFare.setScale(2, RoundingMode.HALF_UP);
        return finalFare;

    }

}
