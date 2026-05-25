package com.courier.tracking.infrastructure.observer.listener;


import com.courier.tracking.feature.sse.domain.SseService;
import com.courier.tracking.infrastructure.kafka.dto.LocationEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SseBroadcastListener implements LocationEventListener {

    private final SseService sseService;

    @Override
    public void onLocationEvent(LocationEventDTO event) {
        try {
            sseService.broadcast(event);
        } catch (Exception e) {
            log.error("SSE broadcast failed for courier: {}", event.getCourierId(), e);
        }
    }
}