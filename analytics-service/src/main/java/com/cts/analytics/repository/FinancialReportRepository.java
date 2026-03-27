package com.cts.analytics.repository;

import com.cts.analytics.model.FinancialReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinancialReportRepository extends JpaRepository<FinancialReport, Long> {
}
