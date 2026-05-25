package com.courier.tracking.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConfig {

    public static final String LOCATION_TOPIC = "courier-location-topic";
    public static final String DLQ_TOPIC = "courier-location-topic.DLQ";

    //3 partition == 3 concurrent thread
    @Bean
    public NewTopic locationTopic() {
        return new NewTopic(LOCATION_TOPIC, 3, (short) 1);
    }

    @Bean
    public NewTopic dlqTopic() {
        return new NewTopic(DLQ_TOPIC, 1, (short) 1);
    }
}