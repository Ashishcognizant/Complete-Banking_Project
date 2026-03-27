package com.cts.transaction.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {
    private Long accountId;
    private Long toAccountId;
    private Double amount;
}
