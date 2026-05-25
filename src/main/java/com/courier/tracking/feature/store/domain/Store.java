package com.courier.tracking.feature.store.domain;

import com.courier.tracking.shared.domain.Coordinate;
import com.courier.tracking.shared.spatial.SpatialIndexable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Store implements SpatialIndexable {
    private String name;

    @Embedded
    private Coordinate location;

    @Override
    public String getId(){
        return name;
    }
}
