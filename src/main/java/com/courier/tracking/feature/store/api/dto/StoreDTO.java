package com.courier.tracking.feature.store.api.dto;

import com.courier.tracking.shared.domain.Coordinate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreDTO {
    private String name;
    private Coordinate location;

}
