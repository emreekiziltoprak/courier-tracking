package com.courier.tracking.infrastructure.kafka.consumer;

import com.courier.tracking.infrastructure.kafka.dto.LocationEventDTO;


public interface LocationConsumer {
    void consume(LocationEventDTO event, int partition, long offset);
}