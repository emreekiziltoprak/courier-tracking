package com.courier.tracking.shared.service;

import java.util.List;

public interface BaseService<T, ID, CreateDTO, ResponseDTO> {
    ResponseDTO create(CreateDTO dto);
    ResponseDTO findById(ID id);
    List<ResponseDTO> findAll();
    void deleteById(ID id);
}
