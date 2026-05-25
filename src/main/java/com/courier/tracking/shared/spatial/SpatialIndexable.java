package com.courier.tracking.shared.spatial;

import com.courier.tracking.shared.domain.Coordinate;

public interface SpatialIndexable {
    Coordinate getLocation();
    String getId();
}