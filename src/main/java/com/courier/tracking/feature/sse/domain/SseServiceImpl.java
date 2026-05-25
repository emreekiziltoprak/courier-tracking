package com.courier.tracking.feature.sse.domain;

import com.courier.tracking.infrastructure.kafka.dto.LocationEventDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@Service
public class SseServiceImpl implements SseService {

    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @Override
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));

        emitters.add(emitter);
        log.info("New SSE subscriber, total: {}", emitters.size());
        return emitter;
    }

    @Async
    @Override
    public void broadcast(LocationEventDTO event) {
        List<SseEmitter> deadEmitters = new ArrayList<>();

        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                        .name("location")
                        .data(event));
            } catch (IOException e) {
                log.error("SSE send failed, removing emitter", e);
                deadEmitters.add(emitter);
            }
        });

        emitters.removeAll(deadEmitters);
    }
}