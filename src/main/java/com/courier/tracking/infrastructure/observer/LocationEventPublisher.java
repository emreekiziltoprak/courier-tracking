package com.courier.tracking.infrastructure.observer;

import com.courier.tracking.infrastructure.kafka.dto.LocationEventDTO;
import com.courier.tracking.infrastructure.observer.listener.LocationEventListener;

public interface LocationEventPublisher {
    void publish(LocationEventDTO event);
    void subscribe(LocationEventListener listener);
    void unsubscribe(LocationEventListener listener);
}