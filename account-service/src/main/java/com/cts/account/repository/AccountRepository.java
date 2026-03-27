package com.cts.account.repository;

import com.cts.account.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import com.cts.account.model.AccountType;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUserID(Long userID);
    List<Account> findByStatus(String status);

    boolean existsByUserID(Long userID);
    boolean existsByUserIDAndAccountType(Long userID, AccountType accountType);
}
