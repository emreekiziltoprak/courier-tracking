package com.courier.tracking.infrastructure.observer.listener;

import com.courier.tracking.feature.store.domain.StoreService;
import com.courier.tracking.infrastructure.kafka.dto.LocationEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProximityCheckListener implements LocationEventListener {

    private final StoreService storeService;

    @Override
    public void onLocationEvent(LocationEventDTO event) {
        try {
            storeService.checkAndLogStoreEntry(
                    event.getCourierId(),
                    event.getCoordinate()
            );
        } catch (Exception e) {
            log.error("Proximity check failed for courier: {}", event.getCourierId(), e);
        }
    }
}