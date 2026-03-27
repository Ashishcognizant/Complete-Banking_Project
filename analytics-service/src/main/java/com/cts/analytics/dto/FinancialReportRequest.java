package com.cts.analytics.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialReportRequest {
    @NotNull
    private LocalDateTime from;
    
    @NotNull
    private LocalDateTime to;
    
    private Double fraudAmountThreshold;
}
