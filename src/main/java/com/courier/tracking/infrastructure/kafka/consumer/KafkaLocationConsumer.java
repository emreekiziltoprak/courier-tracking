package com.courier.tracking.infrastructure.kafka.consumer;

import com.courier.tracking.config.KafkaConfig;
import com.courier.tracking.infrastructure.kafka.dto.LocationEventDTO;
import com.courier.tracking.infrastructure.observer.LocationEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaLocationConsumer implements LocationConsumer {

    private final LocationEventPublisher locationEventPublisher;

    @KafkaListener(
            topics = KafkaConfig.LOCATION_TOPIC,
            groupId = "courier-tracking-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    @Override
    public void consume(@Payload LocationEventDTO event,
                        @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                        @Header(KafkaHeaders.OFFSET) long offset) {
        log.debug("Received location event for courier: {}, partition: {}, offset: {}",
                event.getCourierId(), partition, offset);
        locationEventPublisher.publish(event);
    }
}