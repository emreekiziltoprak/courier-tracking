package com.courier.tracking.util.distance;

import com.courier.tracking.shared.domain.Coordinate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

@Component
public class HaversineDistanceCalculator implements DistanceCalculator {

    private static final double EARTH_RADIUS_METERS = 6_371_000;
    private static final MathContext MC = new MathContext(10, RoundingMode.HALF_UP);

    @Override
    public BigDecimal calculateInMeters(Coordinate from, Coordinate to) {
        double lat1 = from.getLat().doubleValue();
        double lng1 = from.getLng().doubleValue();
        double lat2 = to.getLat().doubleValue();
        double lng2 = to.getLng().doubleValue();

        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return BigDecimal.valueOf(EARTH_RADIUS_METERS * c).round(MC);
    }
}