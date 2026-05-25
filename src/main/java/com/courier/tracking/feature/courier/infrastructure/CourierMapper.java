package com.courier.tracking.feature.courier.infrastructure;

import com.courier.tracking.feature.courier.api.dto.CourierCreateDTO;
import com.courier.tracking.feature.courier.api.dto.CourierDTO;
import com.courier.tracking.feature.courier.api.dto.CourierDetailDTO;
import com.courier.tracking.feature.courier.domain.Courier;
import com.courier.tracking.feature.store.api.dto.StoreEntryLogDTO;
import com.courier.tracking.feature.store.domain.StoreEntryLog;
import com.courier.tracking.shared.mapper.BaseMapperConfig;
import com.courier.tracking.shared.mapper.EntityMapper;
import org.springframework.stereotype.Component;
import org.mapstruct.*;

import java.util.List;

@Mapper(config = BaseMapperConfig.class)
public interface CourierMapper extends EntityMapper<Courier, CourierCreateDTO, CourierDTO> {

    @Override
    @Mapping(target = "totalDistance", expression = "java(java.math.BigDecimal.ZERO)")
    @Mapping(target = "lastUpdated", expression = "java(java.time.Instant.now())")
    Courier toEntity(CourierCreateDTO courierCreateDTO);

    @Mapping(target = "storeEntries", source = "logs")
    CourierDetailDTO toDetailResponse(Courier entity, List<StoreEntryLogDTO> logs);

    StoreEntryLogDTO toStoreEntryLogDTO(StoreEntryLog storeEntryLogDTO);
}