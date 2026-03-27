package com.cts.account.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Account")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountID;

    private Long userID;

    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    private Double balance;

    private String status;
}
