package com.courier.tracking.infrastructure.kafka.dlq;

import com.courier.tracking.config.KafkaConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DeadLetterQueueHandler {

    private final KafkaTemplate<String, Object> dlqKafkaTemplate;

    @KafkaListener(
            topics = KafkaConfig.DLQ_TOPIC,
            groupId = "courier-tracking-dlq-group"
    )
    public void handleDlq(Object message) {
        log.error("Dead letter received: {}", message);
    }

    public void sendToDlq(String courierId, Object failedMessage) {
        log.warn("Sending to DLQ for courier: {}", courierId);
        dlqKafkaTemplate.send(KafkaConfig.DLQ_TOPIC, courierId, failedMessage);
    }
}