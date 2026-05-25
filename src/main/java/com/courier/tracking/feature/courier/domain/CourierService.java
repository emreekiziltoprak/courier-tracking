package com.courier.tracking.feature.courier.domain;

import com.courier.tracking.feature.courier.api.dto.CourierCreateDTO;
import com.courier.tracking.feature.courier.api.dto.CourierDTO;
import com.courier.tracking.feature.courier.api.dto.CourierDetailDTO;
import com.courier.tracking.shared.domain.Coordinate;
import com.courier.tracking.shared.service.BaseService;

import java.math.BigDecimal;

public interface CourierService extends BaseService<Courier, String, CourierCreateDTO, CourierDTO> {
    CourierDetailDTO findDetailById(String id);
    BigDecimal getTotalTravelDistance(String courierId);
    void processLocationUpdate(String courierId, Coordinate newLocation);
}