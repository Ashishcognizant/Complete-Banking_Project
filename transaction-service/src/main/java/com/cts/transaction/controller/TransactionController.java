package com.cts.transaction.controller;

import com.cts.transaction.dto.*;
import com.cts.transaction.model.Transaction;
import com.cts.transaction.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(@RequestBody TransactionRequest request) {
        TransactionResponse resp = transactionService.deposit(request);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(@RequestBody TransactionRequest request) {
        TransactionResponse resp = transactionService.withdraw(request);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(@RequestBody TransactionRequest request) {
        TransactionResponse resp = transactionService.transfer(request);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/internal/range")
    public List<TransactionDTO> getTransactionsByDateRange(
            @RequestParam LocalDateTime from,
            @RequestParam LocalDateTime to) {
        return transactionService.getTransactionsByDateRange(from, to)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private TransactionDTO toDTO(Transaction t) {
        TransactionDTO dto = new TransactionDTO();
        dto.setTransactionId(t.getTransactionId());
        dto.setAccountId(t.getAccountId());
        dto.setType(t.getType());
        dto.setAmount(t.getAmount());
        dto.setDate(t.getDate());
        dto.setStatus(t.getStatus());
        return dto;
    }
}
