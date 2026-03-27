package com.cts.transaction.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@FeignClient(name = "account-service", url = "http://localhost:8082")
public interface AccountClient {
    @GetMapping("/api/accounts/internal/{id}")
    AccountDTO getAccount(@PathVariable Long id);

    @PutMapping("/api/accounts/internal/{id}/balance")
    Map<String, String> updateBalance(@PathVariable Long id, @RequestParam Double balance);
}
