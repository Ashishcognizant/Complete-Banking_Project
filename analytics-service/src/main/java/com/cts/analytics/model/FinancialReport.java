package com.cts.analytics.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;
    
    private Long totalTransactions;
    private Double totalAmount;
    private Long fraudAlerts;
    
    private LocalDateTime generatedDate;
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;
}
