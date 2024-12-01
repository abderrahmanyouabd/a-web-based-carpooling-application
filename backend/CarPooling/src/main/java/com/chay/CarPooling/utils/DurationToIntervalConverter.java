package com.chay.CarPooling.utils;

import jakarta.persistence.AttributeConverter;

import java.time.Duration;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
public class DurationToIntervalConverter implements AttributeConverter<Duration, String> {

    @Override
    public String convertToDatabaseColumn(Duration duration) {
        if (duration == null) return null;
        long seconds = duration.getSeconds();
        long absSeconds = Math.abs(seconds);
        long hours = absSeconds / 3600;
        long minutes = (absSeconds % 3600) / 60;
        long secs = absSeconds % 60;
        return String.format("%s%02d:%02d:%02d",
                (seconds < 0 ? "-" : ""),
                hours, minutes, secs);
    }


    @Override
    public Duration convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        String[] parts = dbData.split(":");
        long hours = Long.parseLong(parts[0]);
        long minutes = Long.parseLong(parts[1]);
        long seconds = Long.parseLong(parts[2]);
        return Duration.ofSeconds(hours * 3600 + minutes * 60 + seconds);
    }
}
