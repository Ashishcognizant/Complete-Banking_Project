package com.cts.transaction.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private String message;
    private Double updatedBalance;
    private Long accountId;
}
