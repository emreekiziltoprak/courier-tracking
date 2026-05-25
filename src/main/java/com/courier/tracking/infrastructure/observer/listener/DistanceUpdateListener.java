package com.courier.tracking.infrastructure.observer.listener;

import com.courier.tracking.feature.courier.domain.CourierService;
import com.courier.tracking.infrastructure.kafka.dto.LocationEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DistanceUpdateListener implements LocationEventListener {

    private final CourierService courierService;

    @Override
    public void onLocationEvent(LocationEventDTO event) {
        try {
            courierService.processLocationUpdate(
                    event.getCourierId(),
                    event.getCoordinate()
            );
        } catch (Exception e) {
            log.error("Distance update failed for courier: {}", event.getCourierId(), e);
        }

    }
}