package com.cts.transaction.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long transactionId;
    private Long accountId;
    private String type;
    private Double amount;
    private LocalDateTime date;
    private String status;
}
