package com.courier.tracking.util.distance;

import com.courier.tracking.shared.domain.Coordinate;

import java.math.BigDecimal;

public interface DistanceCalculator {
    BigDecimal calculateInMeters(Coordinate from, Coordinate to);
}