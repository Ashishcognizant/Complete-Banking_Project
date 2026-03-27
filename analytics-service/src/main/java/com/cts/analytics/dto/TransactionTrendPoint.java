package com.cts.analytics.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionTrendPoint {
    private LocalDate date;
    private Long count;
    private Double totalAmount;
    private Long deposits;
    private Long withdrawals;
    private Long transfers;
}
