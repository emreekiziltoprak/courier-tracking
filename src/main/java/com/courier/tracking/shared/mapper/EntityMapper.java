package com.courier.tracking.shared.mapper;

import com.courier.tracking.shared.domain.BaseEntity;
import org.mapstruct.Mapping;

public interface EntityMapper<T extends BaseEntity, CreateDTO, ResponseDTO> {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt",  ignore = true)
    T toEntity(CreateDTO dto);

    ResponseDTO toResponse(T entity);

}
