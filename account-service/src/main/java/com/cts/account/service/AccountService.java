package com.cts.account.service;

import com.cts.account.client.NotificationClient;
import com.cts.account.client.NotificationRequest;
import com.cts.account.client.UserClient;
import com.cts.account.exception.DuplicateAccountException;
import com.cts.account.model.Account;
import com.cts.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final NotificationClient notificationClient;
    private final UserClient userClient;

    public Account createAccount(Account account) {
        if (account.getUserID() != null) {
            try {
                userClient.getUserById(account.getUserID());
            } catch (Exception e) {
                throw new RuntimeException("User not found with ID: " + account.getUserID());
            }
        }

        if (account.getUserID() != null && account.getAccountType() != null) {
            if (accountRepository.existsByUserIDAndAccountType(account.getUserID(), account.getAccountType())) {
                throw new DuplicateAccountException(
                        "User already has a " + account.getAccountType() + " account. Each user can have only one " + account.getAccountType() + " account.");
            }
        }

        if (account.getStatus() == null || account.getStatus().isBlank()) {
            account.setStatus("Active");
        }
        if (account.getBalance() == null) {
            account.setBalance(0.0);
        }
        Account saved = accountRepository.save(account);

        if (saved.getUserID() != null) {
            String msg = String.format(
                    "New account created: #%d (Type: %s). Status: %s. Opening balance: ₹%.2f",
                    saved.getAccountID(),
                    saved.getAccountType() != null ? saved.getAccountType().name() : "N/A",
                    saved.getStatus(),
                    saved.getBalance());
            try {
                notificationClient.createNotification(new NotificationRequest(saved.getUserID(), msg));
            } catch (Exception e) {
            }
        }
        return saved;
    }

    public Account getAccount(Long id) {
        Optional<Account> account = accountRepository.findById(id);
        if (account.isEmpty()) {
            throw new RuntimeException("Account not found with ID: " + id);
        }
        return account.get();
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public List<Account> getAccountsByUserId(Long userId) {
        return accountRepository.findByUserID(userId);
    }

    public Account updateAccountStatus(Long id, String status) {
        Optional<Account> accountOpt = accountRepository.findById(id);
        if (accountOpt.isEmpty()) {
            throw new RuntimeException("Account not found with ID: " + id);
        }
        Account account = accountOpt.get();
        account.setStatus(status);
        Account saved = accountRepository.save(account);

        if (saved.getUserID() != null) {
            String msg = String.format(
                    "Account #%d status changed to: %s",
                    saved.getAccountID(), saved.getStatus());
            try {
                notificationClient.createNotification(new NotificationRequest(saved.getUserID(), msg));
            } catch (Exception e) {
            }
        }
        return saved;
    }

    public Double getBalance(Long id) {
        Optional<Account> accountOpt = accountRepository.findById(id);
        if (accountOpt.isEmpty()) {
            throw new RuntimeException("Account not found with ID: " + id);
        }
        return accountOpt.get().getBalance();
    }

    public void updateBalance(Long id, Double balance) {
        Optional<Account> accountOpt = accountRepository.findById(id);
        if (accountOpt.isEmpty()) {
            throw new RuntimeException("Account not found with ID: " + id);
        }
        Account account = accountOpt.get();

        if ("Closed".equalsIgnoreCase(account.getStatus())) {
            throw new IllegalStateException("Cannot update balance: Account is closed");
        }

        account.setBalance(balance);
        accountRepository.save(account);
    }
}
