package com.cts.analytics.client;

import java.time.LocalDateTime;

public class TransactionDTO {
    public Long transactionId;
    public Long accountId;
    public String type;
    public Double amount;
    public LocalDateTime date;
    public String status;

    public LocalDateTime getDate() {
        return date;
    }
}
