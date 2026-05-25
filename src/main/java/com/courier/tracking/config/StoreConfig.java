package com.courier.tracking.config;

import com.courier.tracking.feature.store.domain.Store;
import com.courier.tracking.shared.domain.Coordinate;
import com.courier.tracking.shared.spatial.RTreeSpatialIndex;
import com.courier.tracking.shared.spatial.SpatialIndex;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Configuration
public class StoreConfig {

    /*load stores as singleton bean*/
    @Bean
    public List<Store> stores(ObjectMapper objectMapper) {
        try {
            InputStream inputStream = new ClassPathResource("stores.json").getInputStream();
            List<StoreJson> storeJsonList = objectMapper.readValue(
                    inputStream,
                    new TypeReference<List<StoreJson>>() {}
            );
            List<Store> stores = storeJsonList.stream()
                    .map(s -> Store.builder()
                            .name(s.name)
                            .location(new Coordinate(
                                    BigDecimal.valueOf(s.lat),
                                    BigDecimal.valueOf(s.lng)
                            ))
                            .build())
                    .toList();
            log.info("{} stores loaded", stores.size());
            return stores;
        } catch (IOException e) {
            throw new RuntimeException("Failed to load stores.json", e);
        }
    }

    /*create singleton spatial index for stores as singleton bean*/
    @Bean
    public SpatialIndex<Store> storeSpatialIndex(List<Store> stores) {
        RTreeSpatialIndex<Store> index = new RTreeSpatialIndex<>();
        index.buildIndex(stores);
        return index;
    }

    private record StoreJson(String name, double lat, double lng) {}
}