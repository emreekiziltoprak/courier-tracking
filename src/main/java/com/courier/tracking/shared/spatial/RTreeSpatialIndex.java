package com.courier.tracking.shared.spatial;

import com.courier.tracking.shared.domain.Coordinate;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Envelope;
import org.locationtech.jts.index.strtree.STRtree;

import java.util.List;

@Slf4j
public class RTreeSpatialIndex<T extends SpatialIndexable>
        implements SpatialIndex<T> {

    private static final double EARTH_RADIUS_METERS = 6_371_000.0;

    private STRtree rtree;

    public RTreeSpatialIndex() {
        this.rtree = new STRtree();
    }

    @Override
    public void buildIndex(List<T> items) {
        this.rtree = new STRtree();
        items.forEach(this::insert);
        rtree.build();
        log.info("R-Tree spatial index built with {} items", items.size());
    }

    @Override
    public void insert(T item) {
        Envelope envelope = createEnvelope(item);
        rtree.insert(envelope, item);
    }

    @Override
    public void delete(T item) {
        Envelope envelope = createEnvelope(item);
        rtree.remove(envelope, item);
    }


    @Override
    @SuppressWarnings("unchecked")
    public List<T> findWithinRadius(Coordinate coordinate, double radiusMeters) {

        //get courier coordinates
        double lat = coordinate.getLat().doubleValue();
        double lng = coordinate.getLng().doubleValue();

        //get radius converted as degrees
        double latDegreeDelta  = metersToDegreesLat(radiusMeters);
        double lngDegreeDelta = metersToDegreesLng(radiusMeters, lat);

        //create a envelope for searching possible stores
        Envelope searchEnvelope = new Envelope(
                lng - lngDegreeDelta, lng + lngDegreeDelta,
                lat - latDegreeDelta, lat + latDegreeDelta
        );

        //find candidate stores from envelope via rtree
        List<T> candidates = rtree.query(searchEnvelope);

        //control if courier is present in store's 100m radius circle
        return candidates.stream()
                .filter(item -> {
                    double distance = haversine(
                            lat, lng,
                            item.getLocation().getLat().doubleValue(),
                            item.getLocation().getLng().doubleValue()
                    );
                    return distance <= radiusMeters;
                })
                .toList();
    }

    private Envelope createEnvelope(T item) {
        double lat = item.getLocation().getLat().doubleValue();
        double lng = item.getLocation().getLng().doubleValue();

        double buffer = metersToDegreesLat(1.0);
        return new Envelope(
                lng - buffer, lng + buffer,
                lat - buffer, lat + buffer
        );
    }

    /**
     * Haversine formula — calculates distance between two coordinates in meters.
     * Accounts for the spherical shape of the Earth.
     */
    private double haversine(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_METERS * c;
    }

    /**
     * Converts meters to degrees in the latitude direction.
     * 1 degree of latitude ≈ 111,320m (constant).
     */
    private double metersToDegreesLat(double meters) {
        return meters / 111_320.0;
    }

    /**
     * Converts meters to degrees in the longitude direction.
     * 1 degree of longitude = 111,320m × cos(lat).
     * At Istanbul (41°N), cos(41°) ≈ 0.755 → 1° ≈ 84,000m.
     * Without this correction, the search envelope becomes too narrow
     * at higher latitudes, causing nearby stores to be missed.
     */
    private double metersToDegreesLng(double meters, double latitude) {
        return meters / (111_320.0 * Math.cos(Math.toRadians(latitude)));
    }
}