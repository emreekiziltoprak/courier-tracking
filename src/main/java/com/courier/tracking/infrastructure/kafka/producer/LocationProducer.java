package com.courier.tracking.infrastructure.kafka.producer;

import com.courier.tracking.infrastructure.kafka.dto.LocationEventDTO;

public interface LocationProducer {
    void send(LocationEventDTO event);
}