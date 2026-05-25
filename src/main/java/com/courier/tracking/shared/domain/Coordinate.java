package com.courier.tracking.shared.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coordinate {
    @Column(precision = 10, scale = 7)
    private BigDecimal lat;
    @Column(precision = 10, scale = 7)
    private BigDecimal lng;
}
