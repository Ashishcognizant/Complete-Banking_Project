package com.cts.account.controller;

import com.cts.account.exception.UnauthorizedException;
import com.cts.account.model.Account;
import com.cts.account.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/my")
    public List<Account> getMyAccounts(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UnauthorizedException("Unable to identify user. Please log in again.");
        }
        return accountService.getAccountsByUserId(userId);
    }

    @PostMapping
    public Account createAccount(@RequestBody Account account, HttpServletRequest request) {
        checkAdmin((String) request.getAttribute("userRole"));
        return accountService.createAccount(account);
    }

    @GetMapping("/{id}")
    public Account getAccount(@PathVariable Long id, HttpServletRequest request) {
        checkAdmin((String) request.getAttribute("userRole"));
        return accountService.getAccount(id);
    }

    @GetMapping
    public List<Account> getAllAccounts(HttpServletRequest request) {
        checkAdmin((String) request.getAttribute("userRole"));
        return accountService.getAllAccounts();
    }

    @PutMapping("/{id}/status")
    public Account updateStatus(@PathVariable Long id, @RequestParam String status, HttpServletRequest request) {
        checkAdmin((String) request.getAttribute("userRole"));
        return accountService.updateAccountStatus(id, status);
    }

    @GetMapping("/{id}/balance")
    public Double getBalance(@PathVariable Long id, HttpServletRequest request) {
        checkAdmin((String) request.getAttribute("userRole"));
        return accountService.getBalance(id);
    }

    @PutMapping("/{id}/balance")
    public Map<String, String> updateBalance(@PathVariable Long id, @RequestParam Double balance,
            HttpServletRequest request) {
        checkAdmin((String) request.getAttribute("userRole"));
        accountService.updateBalance(id, balance);
        return Map.of("message", "Balance updated successfully", "newBalance", balance.toString());
    }

    @GetMapping("/internal/{id}")
    public Account getAccountInternal(@PathVariable Long id) {
        return accountService.getAccount(id);
    }

    @PutMapping("/internal/{id}/balance")
    public Map<String, String> updateBalanceInternal(@PathVariable Long id, @RequestParam Double balance) {
        accountService.updateBalance(id, balance);
        return Map.of("message", "Balance updated successfully", "newBalance", balance.toString());
    }

    private void checkAdmin(String role) {
        if (role == null || !"ADMIN".equals(role)) {
            throw new UnauthorizedException("Access denied");
        }
    }
}
