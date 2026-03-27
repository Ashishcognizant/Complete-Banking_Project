package com.cts.analytics.service;

import com.cts.analytics.client.TransactionClient;
import com.cts.analytics.client.TransactionDTO;
import com.cts.analytics.dto.*;
import com.cts.analytics.model.FinancialReport;
import com.cts.analytics.repository.FinancialReportRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinancialAnalyticsService {
    private final FinancialReportRepository financialReportRepository;
    private final TransactionClient transactionClient;
    
    private static final double DEFAULT_FRAUD_THRESHOLD = 100000.0;

    @Transactional
    public FinancialReport generateCompliance(FinancialReportRequest req) {
        LocalDateTime from = req.getFrom();
        LocalDateTime to = req.getTo();
        
        double threshold = (req.getFraudAmountThreshold() != null)
                ? req.getFraudAmountThreshold()
                : DEFAULT_FRAUD_THRESHOLD;

        List<TransactionDTO> txns = transactionClient.getTransactionsByDateRange(from, to);

        long totalTransactions = txns.size();
        double totalAmount = txns.stream()
                .map(t -> t.amount)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .sum();

        long fraudAlerts = txns.stream()
                .filter(t -> t.amount != null && t.amount >= threshold)
                .count();

        FinancialReport report = FinancialReport.builder()
                .totalTransactions(totalTransactions)
                .totalAmount(totalAmount)
                .fraudAlerts(fraudAlerts)
                .generatedDate(LocalDateTime.now())
                .periodStart(from)
                .periodEnd(to)
                .build();

        return financialReportRepository.save(report);
    }

    public List<FinancialReport> listReports() {
        return financialReportRepository.findAll();
    }

    public FinancialReport getReport(Long id) {
        return financialReportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Report not found with ID: " + id));
    }

    public List<TransactionTrendPoint> getTrends(LocalDate from, LocalDate to) {
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.atTime(LocalTime.MAX);

        List<TransactionDTO> txns = transactionClient.getTransactionsByDateRange(start, end);

        Map<LocalDate, List<TransactionDTO>> grouped = txns.stream()
                .collect(Collectors.groupingBy(t -> t.date.toLocalDate()));

        return grouped.entrySet().stream()
                .map(e -> {
                    LocalDate day = e.getKey();
                    List<TransactionDTO> list = e.getValue();

                    long count = list.size();
                    double totalAmount = list.stream()
                            .map(t -> t.amount)
                            .filter(Objects::nonNull)
                            .mapToDouble(Double::doubleValue)
                            .sum();

                    long deposits = list.stream().filter(t -> "DEPOSIT".equalsIgnoreCase(t.type)).count();
                    long withdrawals = list.stream().filter(t -> "WITHDRAWAL".equalsIgnoreCase(t.type)).count();
                    long transfers = list.stream().filter(t -> "TRANSFER".equalsIgnoreCase(t.type)).count();

                    return TransactionTrendPoint.builder()
                            .date(day)
                            .count(count)
                            .totalAmount(totalAmount)
                            .deposits(deposits)
                            .withdrawals(withdrawals)
                            .transfers(transfers)
                            .build();
                })
                .sorted(Comparator.comparing(TransactionTrendPoint::getDate))
                .toList();
    }
}
