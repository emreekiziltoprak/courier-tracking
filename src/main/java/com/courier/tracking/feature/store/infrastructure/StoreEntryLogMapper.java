package com.courier.tracking.feature.store.infrastructure;

import com.courier.tracking.feature.store.api.dto.StoreEntryLogDTO;
import com.courier.tracking.feature.store.domain.StoreEntryLog;
import com.courier.tracking.shared.mapper.BaseMapperConfig;
import org.mapstruct.Mapper;

@Mapper(config = BaseMapperConfig.class)
public interface StoreEntryLogMapper {

    StoreEntryLogDTO toResponse(StoreEntryLog entity);
}
