package com.courier.tracking.shared.service;

import com.courier.tracking.shared.domain.BaseEntity;
import com.courier.tracking.shared.mapper.EntityMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public abstract class AbstractBaseService<
        T extends BaseEntity,
        CreateDTO,
        ResponseDTO> implements BaseService<T, String, CreateDTO, ResponseDTO> {

    private final JpaRepository<T, String> repository;
    private final EntityMapper<T, CreateDTO, ResponseDTO> mapper;

    protected AbstractBaseService(
            JpaRepository<T, String> repository,
            EntityMapper<T, CreateDTO, ResponseDTO> mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public ResponseDTO create(CreateDTO dto) {
        return mapper.toResponse(repository.save(mapper.toEntity(dto)));
    }

    @Override
    public ResponseDTO findById(String id) {
       return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Entity not found with id: " + id
                ));
    }

    @Override
    public List<ResponseDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }
}
