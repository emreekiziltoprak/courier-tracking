package com.courier.tracking.feature.courier.api.dto;

import com.courier.tracking.feature.store.api.dto.StoreEntryLogDTO;
import com.courier.tracking.shared.domain.Coordinate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourierDetailDTO {
    private String id;
    private String name;
    private Coordinate lastLocation;
    private BigDecimal totalDistance;
    private Instant lastUpdated;
    private List<StoreEntryLogDTO> storeEntries;
}
