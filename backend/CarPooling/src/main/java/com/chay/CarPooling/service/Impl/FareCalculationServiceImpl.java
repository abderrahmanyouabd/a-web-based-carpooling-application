package com.chay.CarPooling.service.Impl;

import ai.onnxruntime.OnnxTensor;
import ai.onnxruntime.OrtEnvironment;
import ai.onnxruntime.OrtException;
import ai.onnxruntime.OrtSession;
import com.chay.CarPooling.model.Trip;
import com.chay.CarPooling.service.FareCalculationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collections;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@Service
@Slf4j
public class FareCalculationServiceImpl implements FareCalculationService {


    private final WebClient webClient;

    @Value("${gasprice.api.key}")
    private String gasPriceApiKey;

    private OrtEnvironment env;
    private OrtSession session;

    @Value("${onnx.model.path}")
    private String MODEL_PATH;

    public FareCalculationServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
        CompletableFuture.runAsync(() -> {
            try {
                log.info("Initializing ONNX Runtime session asynchronously...");
                this.env = OrtEnvironment.getEnvironment();
                this.session = env.createSession(MODEL_PATH);
                log.info("ONNX Runtime session initialized successfully.");
            } catch (OrtException e) {
                throw new RuntimeException("Failed to initialize ONNX Runtime session", e);
            }
        });
    }


//    @Override
    private Double getGasPrice(String latitude, String longitude, String gasolineOrDiesel) {
//        String apiUrl = String.format("https://api.collectapi.com/gasPrice/fromCoordinates?lng=%s&lat=%s", longitude, latitude);
//        String response = webClient.post()
//                .uri(apiUrl)
//                .header("authorization", gasPriceApiKey)
//                .header("Content-Type", "application/json; charset=utf-8")
//                .retrieve()
//                .bodyToMono(String.class)
//                .block();

        // Parse the response using Jackson
        ObjectMapper objectMapper = new ObjectMapper();
        try {
//            JsonNode jsonResponse = objectMapper.readTree(response);
//            JsonNode result = jsonResponse.get("result");

            if ("gasoline".equalsIgnoreCase(gasolineOrDiesel)) {
                return 42.4;
            } else if ("diesel".equalsIgnoreCase(gasolineOrDiesel)) {
                return 53.1;
            } else {
                throw new IllegalArgumentException("Invalid fuel type. Please provide either 'gasoline' or 'diesel'.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error parsing the gas price response: " + e.getMessage(), e);
        }
    }


    @Override
    public BigDecimal calculateFareOnxx(Trip trip) {
        double fuelEfficiency = 8.0;
        double fuelPrice = 42.0;
                // getGasPrice(trip.getLeavingFrom().getLatitude(), trip.getLeavingFrom().getLongitude(), trip.getVehicle().getGasType().name());
        double distance = trip.getDistance();

        try {
            float[][] inputData = {{(float) distance, (float) fuelPrice, (float) fuelEfficiency}};
            try (OnnxTensor tensor = OnnxTensor.createTensor(env, inputData)) {
                Map<String, OnnxTensor> inputs = Collections.singletonMap("float_input", tensor);

                OrtSession.Result result = session.run(inputs);

                Object output = result.get(0).getValue();
                if (output instanceof float[][] outputArray) {
                    if (outputArray.length > 0 && outputArray[0].length > 0) {
                        float predictedCost = outputArray[0][0];
                        System.out.println("Extracted value: " + predictedCost);
                        return BigDecimal.valueOf(predictedCost).setScale(2, RoundingMode.HALF_UP);
                    } else {
                        throw new RuntimeException("ONNX model output is empty or malformed.");
                    }
                } else {
                    throw new RuntimeException("Unexpected output type from ONNX model: " + output.getClass());
                }
            }
        } catch (OrtException e) {
            throw new RuntimeException("Error during ONNX model inference: " + e.getMessage(), e);
        }
    }


}
