package com.courier.tracking.infrastructure.kafka.dto;

import com.courier.tracking.shared.domain.Coordinate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationEventDTO {
    private String courierId;
    private Coordinate coordinate;
    private Instant timestamp;
}
