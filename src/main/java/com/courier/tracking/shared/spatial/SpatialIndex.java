package com.courier.tracking.shared.spatial;

import com.courier.tracking.shared.domain.Coordinate;
import java.util.List;

public interface SpatialIndex<T extends SpatialIndexable> {
    void buildIndex(List<T> items);
    void insert(T item);
    void delete(T item);
    List<T> findWithinRadius(Coordinate coordinate, double radiusMeters);
}