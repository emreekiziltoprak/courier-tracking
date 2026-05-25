package com.courier.tracking.feature.courier.domain;

import com.courier.tracking.shared.domain.BaseEntity;
import com.courier.tracking.shared.domain.Coordinate;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Courier extends BaseEntity {
    private String name;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "lat", column = @Column(name = "last_lat")),
            @AttributeOverride(name = "lng", column = @Column(name = "last_lng"))
    })
    private Coordinate lastLocation;

    @Column(precision = 15, scale = 2)
    private BigDecimal totalDistance;

    private Instant lastUpdated;
}
