package com.cts.analytics.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialReportResponse {
    private Long reportId;
    private Long totalTransactions;
    private Double totalAmount;
    private Long fraudAlerts;
    private String period;
    private String generatedAt;
}
