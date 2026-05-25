package com.courier.tracking.feature.store.infrastructure;

import com.courier.tracking.feature.store.domain.StoreEntryLog;
import com.courier.tracking.shared.repository.BaseRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface StoreEntryLogRepository extends BaseRepository<StoreEntryLog> {

    Optional<StoreEntryLog> findTopByCourierIdAndStoreNameOrderByEntryTimeDesc(
            String courierId,
            String storeName
    );

    List<StoreEntryLog> findByCourierId(String courierId);

    List<StoreEntryLog> findByStoreName(String storeName);

    List<StoreEntryLog> findByEntryTimeBetween(Instant from, Instant to);

    List<StoreEntryLog> findByCourierIdAndEntryTimeBetween(
            String courierId,
            Instant from,
            Instant to
    );

    boolean existsByCourierIdAndStoreNameAndEntryTimeAfter(
            String courierId,
            String storeName,
            Instant after
    );
}