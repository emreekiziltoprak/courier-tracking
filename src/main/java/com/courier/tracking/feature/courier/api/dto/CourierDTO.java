package com.courier.tracking.feature.courier.api.dto;

import com.courier.tracking.shared.domain.Coordinate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourierDTO {
    private String id;
    private String name;
    private Coordinate lastLocation;
    private BigDecimal totalDistance;
    private Instant lastUpdated;
}
