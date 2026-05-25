package com.courier.tracking.infrastructure.kafka.producer;

import com.courier.tracking.config.KafkaConfig;
import com.courier.tracking.infrastructure.kafka.dto.LocationEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaLocationProducer implements LocationProducer {

    private final KafkaTemplate<String, LocationEventDTO> kafkaTemplate;

    @Override
    public void send(LocationEventDTO event) {
        kafkaTemplate.send(KafkaConfig.LOCATION_TOPIC, event.getCourierId(), event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to send location event for courier: {}",
                                event.getCourierId(), ex);
                    } else {
                        log.debug("Location event sent for courier: {}",
                                event.getCourierId());
                    }
                });
    }
}