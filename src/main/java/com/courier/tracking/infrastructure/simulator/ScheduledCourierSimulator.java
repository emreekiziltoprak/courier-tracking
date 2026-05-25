package com.courier.tracking.infrastructure.simulator;

import com.courier.tracking.feature.courier.api.dto.CourierCreateDTO;
import com.courier.tracking.feature.courier.api.dto.CourierDTO;
import com.courier.tracking.feature.courier.domain.CourierService;
import com.courier.tracking.feature.courier.infrastructure.CourierLocationRepository;
import com.courier.tracking.feature.courier.infrastructure.CourierRepository;
import com.courier.tracking.feature.store.infrastructure.StoreEntryLogRepository;
import com.courier.tracking.infrastructure.kafka.dto.LocationEventDTO;
import com.courier.tracking.infrastructure.kafka.producer.LocationProducer;
import com.courier.tracking.shared.domain.Coordinate;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class ScheduledCourierSimulator implements CourierSimulator {

    private final CourierService courierService;
    private final LocationProducer locationProducer;
    private final CourierLocationRepository courierLocationRepository;
    private final CourierRepository courierRepository;
    private final StoreEntryLogRepository storeEntryLogRepository;

    @Value("${app.simulator.courier-count:5}")
    private int courierCount;

    @Value("${app.simulator.enabled:true}")
    private boolean enabled;

    private final Map<String, SimulatorState> states = new ConcurrentHashMap<>();
    private final Random random = new Random();

    private static final double BASE_LAT = 40.9923307;
    private static final double BASE_LNG = 29.1244229;

    @PostConstruct
    @Transactional
    public void init() {
        if (!enabled) return;

        log.info("Cleaning up previous simulation data...");
        storeEntryLogRepository.deleteAll();
        courierLocationRepository.deleteAll();
        courierRepository.deleteAll();
        log.info("Previous simulation data cleaned.");

        for (int i = 1; i <= courierCount; i++) {
            log.info("Starting courier simulator #{}", i);
            CourierDTO courier = courierService.create(CourierCreateDTO.builder()
                    .name("Courier-" + i)
                    .lastLocation(new Coordinate(
                            BigDecimal.valueOf(BASE_LAT + (random.nextDouble() - 0.5) * 0.01),
                            BigDecimal.valueOf(BASE_LNG + (random.nextDouble() - 0.5) * 0.01)
                    ))
                    .build());

            states.put(courier.getId(), new SimulatorState(
                    courier.getLastLocation().getLat().doubleValue(),
                    courier.getLastLocation().getLng().doubleValue(),
                    random.nextDouble() * 360,
                    10 + random.nextDouble() * 20
            ));

            log.info("Courier created: {}", courier.getName());
        }
    }

    @Scheduled(fixedDelayString = "${app.simulator.interval-ms:2000}")
    @Override
    public void start() {
        if (!enabled || states.isEmpty()) return;

        states.forEach((courierId, state) -> {
            double[] newPos = calculateNewPosition(state);

            state.lat = newPos[0];
            state.lng = newPos[1];
            state.course = (state.course + (random.nextDouble() - 0.5) * 20) % 360;
            state.speed = Math.max(30, Math.min(80, state.speed + (random.nextDouble() - 0.5) * 2));

            locationProducer.send(LocationEventDTO.builder()
                    .courierId(courierId)
                    .coordinate(new Coordinate(
                            BigDecimal.valueOf(state.lat),
                            BigDecimal.valueOf(state.lng)
                    ))
                    .timestamp(Instant.now())
                    .build());
        });
    }

    @Override
    public void stop() {
        states.clear();
    }

    private double[] calculateNewPosition(SimulatorState state) {
        double timeInHours = 2.0 / 3600.0;
        double distance = state.speed * timeInHours;
        double courseRad = Math.toRadians(state.course);
        double R = 6371.0;

        double lat1 = Math.toRadians(state.lat);
        double lon1 = Math.toRadians(state.lng);

        double lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance / R)
                + Math.cos(lat1) * Math.sin(distance / R) * Math.cos(courseRad));

        double lon2 = lon1 + Math.atan2(
                Math.sin(courseRad) * Math.sin(distance / R) * Math.cos(lat1),
                Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
        );

        return new double[]{Math.toDegrees(lat2), Math.toDegrees(lon2)};
    }

    static class SimulatorState {
        double lat;
        double lng;
        double course;
        double speed;

        SimulatorState(double lat, double lng, double course, double speed) {
            this.lat = lat;
            this.lng = lng;
            this.course = course;
            this.speed = speed;
        }
    }
}