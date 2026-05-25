package com.courier.tracking.feature.courier.infrastructure;

import com.courier.tracking.feature.courier.domain.CourierLocation;
import com.courier.tracking.shared.repository.BaseRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface CourierLocationRepository extends BaseRepository<CourierLocation> {
    List<CourierLocation> findByCourierIdOrderByTimestampAsc(String courierId);

    @Modifying
    @Query("DELETE FROM CourierLocation cl WHERE cl.timestamp < :cutoff")
    int deleteOlderThan(@Param("cutoff") Instant cutoff);
}