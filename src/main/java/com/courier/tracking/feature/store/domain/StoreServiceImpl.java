package com.courier.tracking.feature.store.domain;

import com.courier.tracking.feature.store.api.dto.StoreDTO;
import com.courier.tracking.feature.store.api.dto.StoreEntryLogDTO;
import com.courier.tracking.feature.store.infrastructure.StoreEntryLogMapper;
import com.courier.tracking.feature.store.infrastructure.StoreEntryLogRepository;
import com.courier.tracking.shared.domain.Coordinate;
import com.courier.tracking.shared.spatial.SpatialIndex;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {

    private static final double RADIUS_METERS = 100.0;
    private static final long COOLDOWN_MINUTES = 1;

    private static final String COOLDOWN_KEY_PREFIX = "cooldown:";

    private final List<Store> stores;
    private final StoreEntryLogRepository storeEntryLogRepository;
    private final StoreEntryLogMapper storeEntryLogMapper;
    private final SpatialIndex<Store> storeSpatialIndex;
    private final StringRedisTemplate redisTemplate;

    @Override
    public List<StoreDTO> getAllStores() {
        return stores.stream()
                .map(store -> StoreDTO.builder()
                        .name(store.getName())
                        .location(store.getLocation())
                        .build())
                .toList();
    }

    @Override
    public List<StoreEntryLogDTO> getLogs(String courierId, String storeName,
                                          Instant from, Instant to) {
        if (courierId != null && from != null && to != null) {
            return storeEntryLogRepository
                    .findByCourierIdAndEntryTimeBetween(courierId, from, to)
                    .stream()
                    .map(storeEntryLogMapper::toResponse)
                    .toList();
        }
        if (courierId != null) {
            return storeEntryLogRepository.findByCourierId(courierId)
                    .stream()
                    .map(storeEntryLogMapper::toResponse)
                    .toList();
        }
        if (storeName != null) {
            return storeEntryLogRepository.findByStoreName(storeName)
                    .stream()
                    .map(storeEntryLogMapper::toResponse)
                    .toList();
        }
        if (from != null && to != null) {
            return storeEntryLogRepository.findByEntryTimeBetween(from, to)
                    .stream()
                    .map(storeEntryLogMapper::toResponse)
                    .toList();
        }
        return storeEntryLogRepository.findAll()
                .stream()
                .map(storeEntryLogMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void checkAndLogStoreEntry(String courierId, Coordinate coordinate) {
        List<Store> nearbyStores = storeSpatialIndex.findWithinRadius(coordinate, RADIUS_METERS);

        nearbyStores.forEach(store -> {
            String cooldownKey = COOLDOWN_KEY_PREFIX + courierId + ":" + store.getName();

            if (isInCooldown(cooldownKey)) {
                return;
            }

            try {
                StoreEntryLog entryLog = StoreEntryLog.builder()
                        .courierId(courierId)
                        .storeName(store.getName())
                        .storeLocation(store.getLocation())
                        .entryTime(Instant.now())
                        .build();
                storeEntryLogRepository.save(entryLog);

                setCooldown(cooldownKey);

            } catch (DataIntegrityViolationException e) {
                log.debug("Duplicate store entry ignored: courier={}, store={}",
                        courierId, store.getName());
            }
        });
    }

    private boolean isInCooldown(String key) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            log.warn("Redis unavailable for cooldown check, falling back to DB", e);
            String[] parts = key.replace(COOLDOWN_KEY_PREFIX, "").split(":", 2);
            Instant cutoff = Instant.now().minus(COOLDOWN_MINUTES, ChronoUnit.MINUTES);
            return storeEntryLogRepository.existsByCourierIdAndStoreNameAndEntryTimeAfter(
                    parts[0], parts[1], cutoff);
        }
    }

    private void setCooldown(String key) {
        try {
            redisTemplate.opsForValue().set(key, "1", Duration.ofMinutes(COOLDOWN_MINUTES));
        } catch (Exception e) {
            log.warn("Redis unavailable for cooldown set: {}", key, e);
        }
    }
}