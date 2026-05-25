package com.courier.tracking.feature.courier.infrastructure;


import com.courier.tracking.feature.courier.domain.Courier;
import com.courier.tracking.shared.repository.BaseRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourierRepository extends BaseRepository<Courier> {
    Optional<Courier> findByName(String name);
}