package com.chay.CarPooling.dto;

import com.chay.CarPooling.exception.InvalidRatingException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

public class RatingDeserializer extends JsonDeserializer<Integer> {
    @Override
    public Integer deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        double value = p.getDoubleValue();
        
        if (value != Math.floor(value)) {
            throw new InvalidRatingException("Rating must be a whole number");
        }
        
        int rating = (int) value;
        if (rating < 1 || rating > 5) {
            throw new InvalidRatingException("Rating must be between 1 and 5");
        }
        
        return rating;
    }
} 