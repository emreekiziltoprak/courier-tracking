package com.courier.tracking.infrastructure.scheduler;

import com.courier.tracking.feature.courier.infrastructure.CourierLocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class LocationCleanupScheduler {

    private final CourierLocationRepository courierLocationRepository;

    @Value("${app.cleanup.retention-days:7}")
    private int retentionDays;

    @Scheduled(cron = "${app.cleanup.cron:0 0 3 * * *}")
    @Transactional
    public void cleanupOldLocations() {
        Instant cutoff = Instant.now().minus(retentionDays, ChronoUnit.DAYS);
        int deleted = courierLocationRepository.deleteOlderThan(cutoff);
        log.info("Cleaned up {} courier location records older than {} days", deleted, retentionDays);
    }
}
