package com.courier.tracking.feature.courier.api;

import com.courier.tracking.feature.courier.api.dto.CourierCreateDTO;
import com.courier.tracking.feature.courier.api.dto.CourierDTO;
import com.courier.tracking.feature.courier.api.dto.CourierDetailDTO;
import com.courier.tracking.feature.courier.domain.Courier;
import com.courier.tracking.feature.courier.domain.CourierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;


@RestController
@RequestMapping("/api/v1/couriers")
@RequiredArgsConstructor
@Tag(name = "Courier")
public class CourierController {

    private final CourierService courierService;

    @GetMapping
    public ResponseEntity<List<CourierDTO>> getAll() {
        return ResponseEntity.ok(courierService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourierDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(courierService.findById(id));
    }

    @PostMapping
    public ResponseEntity<CourierDTO> create(@Valid @RequestBody CourierCreateDTO dto) {
        return ResponseEntity.status(201).body(courierService.create(dto));
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<CourierDetailDTO> getDetail(@PathVariable String id) {
        return ResponseEntity.ok(courierService.findDetailById(id));
    }

    @GetMapping("/{id}/distance")
    public ResponseEntity<BigDecimal> getDistance(@PathVariable String id) {
        return ResponseEntity.ok(courierService.getTotalTravelDistance(id));
    }
}