package com.courier.tracking.feature.sse.domain;

import com.courier.tracking.infrastructure.kafka.dto.LocationEventDTO;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface SseService {
    SseEmitter subscribe();
    void broadcast(LocationEventDTO event);
}