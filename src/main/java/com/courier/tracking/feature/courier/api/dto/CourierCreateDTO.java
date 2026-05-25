package com.courier.tracking.feature.courier.api.dto;

import com.courier.tracking.shared.domain.Coordinate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourierCreateDTO {
    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Last location is required")
    private Coordinate lastLocation;
}
