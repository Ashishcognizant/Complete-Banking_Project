package com.cts.transaction.service;

import com.cts.transaction.client.*;
import com.cts.transaction.dto.*;
import com.cts.transaction.model.Transaction;
import com.cts.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountClient accountClient;
    private final NotificationClient notificationClient;

    @Transactional
    public TransactionResponse deposit(TransactionRequest request) {
        AccountDTO account = accountClient.getAccount(request.getAccountId());
        ensureActive(account);

        double amt = safeAmount(request.getAmount());
        double newBalance = safeBalance(account.balance) + amt;

        Transaction transaction = Transaction.builder()
                .accountId(account.accountID)
                .type("DEPOSIT")
                .amount(amt)
                .date(LocalDateTime.now())
                .status("SUCCESS")
                .build();

        transactionRepository.save(transaction);
        accountClient.updateBalance(account.accountID, newBalance);

        if (account.userID != null) {
            String msg = String.format("Deposit of ₹%.2f to Account #%d successful. New balance: ₹%.2f",
                    amt, account.accountID, newBalance);
            try {
                notificationClient.createNotification(new NotificationRequest(account.userID, msg));
            } catch (Exception e) {}
        }

        return new TransactionResponse("Deposit Successful", newBalance, account.accountID);
    }

    @Transactional
    public TransactionResponse withdraw(TransactionRequest request) {
        AccountDTO account = accountClient.getAccount(request.getAccountId());
        ensureActive(account);

        double amt = safeAmount(request.getAmount());
        double current = safeBalance(account.balance);

        if (current < amt) {
            throw new RuntimeException(String.format("Insufficient Balance: available ₹%.2f, requested ₹%.2f", current, amt));
        }

        double newBalance = current - amt;

        Transaction transaction = Transaction.builder()
                .accountId(account.accountID)
                .type("WITHDRAWAL")
                .amount(amt)
                .date(LocalDateTime.now())
                .status("SUCCESS")
                .build();

        transactionRepository.save(transaction);
        accountClient.updateBalance(account.accountID, newBalance);

        if (account.userID != null) {
            String msg = String.format("Withdrawal of ₹%.2f from Account #%d successful. New balance: ₹%.2f",
                    amt, account.accountID, newBalance);
            try {
                notificationClient.createNotification(new NotificationRequest(account.userID, msg));
            } catch (Exception e) {}
        }

        return new TransactionResponse("Withdrawal Successful", newBalance, account.accountID);
    }

    @Transactional
    public TransactionResponse transfer(TransactionRequest request) {
        AccountDTO fromAccount = accountClient.getAccount(request.getAccountId());
        AccountDTO toAccount = accountClient.getAccount(request.getToAccountId());

        ensureActive(fromAccount);
        ensureActive(toAccount);

        double amt = safeAmount(request.getAmount());
        double fromBal = safeBalance(fromAccount.balance);

        if (fromBal < amt) {
            throw new RuntimeException(String.format("Insufficient Balance: available ₹%.2f, requested ₹%.2f", fromBal, amt));
        }

        double newFromBalance = fromBal - amt;
        double newToBalance = safeBalance(toAccount.balance) + amt;

        Transaction transaction = Transaction.builder()
                .accountId(fromAccount.accountID)
                .type("TRANSFER")
                .amount(amt)
                .date(LocalDateTime.now())
                .status("SUCCESS")
                .build();

        transactionRepository.save(transaction);
        accountClient.updateBalance(fromAccount.accountID, newFromBalance);
        accountClient.updateBalance(toAccount.accountID, newToBalance);

        if (fromAccount.userID != null) {
            String msg = String.format("Transfer of ₹%.2f from Account #%d to Account #%d successful. New balance: ₹%.2f",
                    amt, fromAccount.accountID, toAccount.accountID, newFromBalance);
            try {
                notificationClient.createNotification(new NotificationRequest(fromAccount.userID, msg));
            } catch (Exception e) {}
        }

        if (toAccount.userID != null) {
            String msg = String.format("You received ₹%.2f in Account #%d from Account #%d. New balance: ₹%.2f",
                    amt, toAccount.accountID, fromAccount.accountID, newToBalance);
            try {
                notificationClient.createNotification(new NotificationRequest(toAccount.userID, msg));
            } catch (Exception e) {}
        }

        return new TransactionResponse("Transfer Successful", newFromBalance, fromAccount.accountID);
    }

    private void ensureActive(AccountDTO account) {
        if ("Closed".equalsIgnoreCase(account.status)) {
            throw new IllegalStateException("Account #" + account.accountID + " is closed and cannot be used for transactions");
        }
        if (!"Active".equalsIgnoreCase(account.status)) {
            throw new IllegalStateException("Account #" + account.accountID + " is not Active (status: " + account.status + ")");
        }
    }

    private double safeAmount(Double amount) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("amount must be > 0");
        }
        return amount;
    }

    private double safeBalance(Double balance) {
        return balance == null ? 0.0 : balance;
    }

    public List<Transaction> getTransactionsByDateRange(LocalDateTime from, LocalDateTime to) {
        return transactionRepository.findByDateBetween(from, to);
    }
}
