package com.courier.tracking.feature.store.api;

import com.courier.tracking.feature.store.api.dto.StoreDTO;
import com.courier.tracking.feature.store.api.dto.StoreEntryLogDTO;
import com.courier.tracking.feature.store.domain.StoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/stores")
@RequiredArgsConstructor
@Tag(name = "Store", description = "Store management endpoints")
public class StoreController {

    private final StoreService storeService;

    @GetMapping
    @Operation(summary = "Get all stores")
    public ResponseEntity<List<StoreDTO>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/logs")
    @Operation(summary = "Get all store entry logs")
    public ResponseEntity<List<StoreEntryLogDTO>> getLogs(
            @RequestParam(required = false) String courierId,
            @RequestParam(required = false) String storeName,
            @RequestParam(required = false) Instant from,
            @RequestParam(required = false) Instant to) {
        return ResponseEntity.ok(storeService.getLogs(courierId, storeName, from, to));
    }
}