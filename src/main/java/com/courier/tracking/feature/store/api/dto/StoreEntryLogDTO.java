package com.courier.tracking.feature.store.api.dto;

import com.courier.tracking.shared.domain.Coordinate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreEntryLogDTO {
    private String id;
    private String courierId;
    private String storeName;
    private Coordinate storeLocation;
    private Instant entryTime;
}