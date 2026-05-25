package com.courier.tracking.feature.courier.domain;

import com.courier.tracking.feature.courier.api.dto.CourierCreateDTO;
import com.courier.tracking.feature.courier.api.dto.CourierDTO;
import com.courier.tracking.feature.courier.api.dto.CourierDetailDTO;
import com.courier.tracking.feature.courier.infrastructure.CourierLocationRepository;
import com.courier.tracking.feature.courier.infrastructure.CourierMapper;
import com.courier.tracking.feature.courier.infrastructure.CourierRepository;
import com.courier.tracking.feature.store.infrastructure.StoreEntryLogRepository;
import com.courier.tracking.shared.domain.Coordinate;
import com.courier.tracking.shared.service.AbstractBaseService;
import com.courier.tracking.util.distance.DistanceCalculator;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public class CourierServiceImpl
        extends AbstractBaseService<Courier, CourierCreateDTO, CourierDTO>
        implements CourierService {

    private final CourierRepository courierRepository;
    private final CourierLocationRepository courierLocationRepository;
    private final StoreEntryLogRepository storeEntryLogRepository;
    private final CourierMapper courierMapper;
    private final DistanceCalculator distanceCalculator;

    public CourierServiceImpl(
            CourierRepository courierRepository,
            CourierMapper courierMapper,
            CourierLocationRepository courierLocationRepository,
            StoreEntryLogRepository storeEntryLogRepository,
            DistanceCalculator distanceCalculator) {
        super(courierRepository, courierMapper);
        this.courierRepository = courierRepository;
        this.courierLocationRepository = courierLocationRepository;
        this.storeEntryLogRepository = storeEntryLogRepository;
        this.courierMapper = courierMapper;
        this.distanceCalculator = distanceCalculator;
    }

    @Override
    public CourierDetailDTO findDetailById(String id) {
        Courier courier = courierRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Courier not found with id: " + id
                ));
        var logs = storeEntryLogRepository.findByCourierId(id)
                .stream()
                .map(courierMapper::toStoreEntryLogDTO)
                .toList();
        return courierMapper.toDetailResponse(courier, logs);
    }

    @Override
    public BigDecimal getTotalTravelDistance(String courierId) {
        return courierRepository.findById(courierId)
                .map(Courier::getTotalDistance)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Courier not found with id: " + courierId
                ));
    }

    @Override
    @Transactional
    public void processLocationUpdate(String courierId, Coordinate newLocation) {
        Courier courier = courierRepository.findById(courierId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Courier not found with id: " + courierId
                ));

        if (courier.getLastLocation() != null) {
            BigDecimal distance = distanceCalculator.calculateInMeters(
                    courier.getLastLocation(), newLocation);
            BigDecimal current = courier.getTotalDistance() != null
                    ? courier.getTotalDistance()
                    : BigDecimal.ZERO;
            courier.setTotalDistance(current.add(distance));
        }

        courier.setLastLocation(newLocation);
        courier.setLastUpdated(Instant.now());

        courierRepository.save(courier);
        courierLocationRepository.save(CourierLocation.builder()
                .courierId(courierId)
                .coordinate(newLocation)
                .timestamp(Instant.now())
                .build());
    }
}