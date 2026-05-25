package com.courier.tracking.infrastructure.observer.listener;

import com.courier.tracking.infrastructure.kafka.dto.LocationEventDTO;

public interface LocationEventListener {
    void onLocationEvent(LocationEventDTO event);
}