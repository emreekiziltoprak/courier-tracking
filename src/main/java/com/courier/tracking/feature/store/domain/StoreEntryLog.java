package com.courier.tracking.feature.store.domain;

import com.courier.tracking.shared.domain.BaseEntity;
import com.courier.tracking.shared.domain.Coordinate;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(indexes = {
        @Index(name = "idx_store_entry_cooldown", columnList = "courierId, storeName, entryTime")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreEntryLog extends BaseEntity {

    private String courierId;
    private String storeName;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "lat", column = @Column(name = "store_lat")),
            @AttributeOverride(name = "lng", column = @Column(name = "store_lng"))
    })
    private Coordinate storeLocation;

    private Instant entryTime;
}
