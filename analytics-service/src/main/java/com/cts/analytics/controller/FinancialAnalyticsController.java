package com.cts.analytics.controller;

import com.cts.analytics.dto.*;
import com.cts.analytics.model.FinancialReport;
import com.cts.analytics.service.FinancialAnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class FinancialAnalyticsController {
    private final FinancialAnalyticsService analyticsService;

    @PostMapping("/reports/compliance")
    public ResponseEntity<?> generateCompliance(
            @Valid @RequestBody FinancialReportRequest req,
            HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "You are not authorized to access this resource"));
        }
        FinancialReport saved = analyticsService.generateCompliance(req);
        return ResponseEntity.ok(toResponse(saved));
    }

    @GetMapping("/reports")
    public ResponseEntity<?> listReports(HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        if (!"ADMIN".equals(role) && !"OFFICER".equals(role)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "You are not authorized to access this resource"));
        }
        List<FinancialReportResponse> list = analyticsService.listReports().stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<?> getById(
            @PathVariable Long id,
            HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        if (!"ADMIN".equals(role) && !"OFFICER".equals(role)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "You are not authorized to access this resource"));
        }
        FinancialReport rep = analyticsService.getReport(id);
        return ResponseEntity.ok(toResponse(rep));
    }

    @GetMapping("/trends")
    public ResponseEntity<?> trends(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        if (!"ADMIN".equals(role) && !"OFFICER".equals(role)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "You are not authorized to access this resource"));
        }
        return ResponseEntity.ok(analyticsService.getTrends(from, to));
    }

    private FinancialReportResponse toResponse(FinancialReport r) {
        return FinancialReportResponse.builder()
                .reportId(r.getReportId())
                .totalTransactions(r.getTotalTransactions())
                .totalAmount(r.getTotalAmount())
                .fraudAlerts(r.getFraudAlerts())
                .period(r.getPeriodStart() + " → " + r.getPeriodEnd())
                .generatedAt(String.valueOf(r.getGeneratedDate()))
                .build();
    }
}
