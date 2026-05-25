package com.courier.tracking.infrastructure.observer;

import com.courier.tracking.infrastructure.kafka.dlq.DeadLetterQueueHandler;
import com.courier.tracking.infrastructure.kafka.dto.LocationEventDTO;
import com.courier.tracking.infrastructure.observer.listener.LocationEventListener;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@Component
@RequiredArgsConstructor
public class LocationEventPublisherImpl implements LocationEventPublisher {

    private final DeadLetterQueueHandler deadLetterQueueHandler;

    private final CopyOnWriteArrayList<LocationEventListener> listeners =
            new CopyOnWriteArrayList<>();

    private final ExecutorService listenerExecutor =
            Executors.newCachedThreadPool(Thread.ofVirtual().name("listener-", 0).factory());

    @Override
    public void publish(LocationEventDTO event) {
        log.debug("Publishing location event for courier: {}, listener count: {}",
                event.getCourierId(), listeners.size());

        CompletableFuture<?>[] futures = listeners.stream()
                .map(listener -> CompletableFuture.runAsync(() -> {
                    log.debug("Calling listener: {}", listener.getClass().getSimpleName());
                    try {
                        listener.onLocationEvent(event);
                    } catch (Exception e) {
                        log.error("Listener error: {} for courier: {}",
                                listener.getClass().getSimpleName(), event.getCourierId(), e);
                        deadLetterQueueHandler.sendToDlq(event.getCourierId(), event);
                    }
                }, listenerExecutor))
                .toArray(CompletableFuture[]::new);

        CompletableFuture.allOf(futures).join();
    }

    @Override
    public void subscribe(LocationEventListener listener) {
        listeners.addIfAbsent(listener);
    }

    @Override
    public void unsubscribe(LocationEventListener listener) {
        listeners.remove(listener);
    }
}