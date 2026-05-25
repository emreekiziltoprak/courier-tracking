package com.courier.tracking.config;

import com.courier.tracking.infrastructure.observer.LocationEventPublisher;
import com.courier.tracking.infrastructure.observer.listener.DistanceUpdateListener;
import com.courier.tracking.infrastructure.observer.listener.ProximityCheckListener;
import com.courier.tracking.infrastructure.observer.listener.SseBroadcastListener;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class ObserverConfig {

    private final LocationEventPublisher locationEventPublisher;
    private final DistanceUpdateListener distanceUpdateListener;
    private final ProximityCheckListener proximityCheckListener;
    private final SseBroadcastListener sseBroadcastListener;

    @EventListener(ContextRefreshedEvent.class)
    public void registerListeners() {
        log.info("Registering location event listeners...");
        locationEventPublisher.subscribe(distanceUpdateListener);
        locationEventPublisher.subscribe(proximityCheckListener);
        locationEventPublisher.subscribe(sseBroadcastListener);
        log.info("Listeners registered successfully");
    }
}
