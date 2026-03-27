package com.cts.transaction.repository;

import com.cts.transaction.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByDateBetween(LocalDateTime start, LocalDateTime end);
}
