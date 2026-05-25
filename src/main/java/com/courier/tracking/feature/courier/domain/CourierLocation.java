package com.courier.tracking.feature.courier.domain;

import com.courier.tracking.shared.domain.BaseEntity;
import com.courier.tracking.shared.domain.Coordinate;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(indexes = {
        @Index(name = "idx_courier_location_courier_id", columnList = "courierId"),
        @Index(name = "idx_courier_location_timestamp", columnList = "courierId, timestamp")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CourierLocation extends BaseEntity {

    private String courierId;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "lat", column = @Column(name = "loc_lat")),
            @AttributeOverride(name = "lng", column = @Column(name = "loc_lng"))
    })
    private Coordinate coordinate;

    private Instant timestamp;
}
