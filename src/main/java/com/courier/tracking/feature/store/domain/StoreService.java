package com.courier.tracking.feature.store.domain;

import com.courier.tracking.feature.store.api.dto.StoreDTO;
import com.courier.tracking.feature.store.api.dto.StoreEntryLogDTO;

import java.util.List;

import com.courier.tracking.shared.domain.Coordinate;

import java.time.Instant;

public interface StoreService {
    List<StoreDTO> getAllStores();
    List<StoreEntryLogDTO> getLogs(String courierId, String storeName, Instant from, Instant to);
    void checkAndLogStoreEntry(String courierId, Coordinate coordinate);
}