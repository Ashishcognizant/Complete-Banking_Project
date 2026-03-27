package com.cts.transaction.service;

import com.cts.transaction.client.AccountClient;
import com.cts.transaction.client.AccountDTO;
import com.cts.transaction.client.NotificationClient;
import com.cts.transaction.dto.TransactionRequest;
import com.cts.transaction.dto.TransactionResponse;
import com.cts.transaction.model.Transaction;
import com.cts.transaction.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private AccountClient accountClient;

    @Mock
    private NotificationClient notificationClient;

    @InjectMocks
    private TransactionService transactionService;

    private AccountDTO activeAccount;

    @BeforeEach
    void setUp() {
        activeAccount = new AccountDTO();
        activeAccount.accountID = 1L;
        activeAccount.userID = 100L;
        activeAccount.accountType = "SAVINGS";
        activeAccount.balance = 5000.0;
        activeAccount.status = "Active";
    }

    // ─── DEPOSIT TESTS ───────────────────────────────────────────

    @Test
    @DisplayName("Deposit should add money to account and return updated balance")
    void deposit_shouldAddMoneyAndReturnUpdatedBalance() {
        // Arrange
        when(accountClient.getAccount(1L)).thenReturn(activeAccount);
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TransactionRequest request = new TransactionRequest(1L, null, 2000.0);

        // Act
        TransactionResponse response = transactionService.deposit(request);

        // Assert
        assertEquals(7000.0, response.getUpdatedBalance());
        assertEquals("Deposit Successful", response.getMessage());
        assertEquals(1L, response.getAccountId());

        // Verify balance was updated on account-service
        verify(accountClient).updateBalance(1L, 7000.0);
    }

    @Test
    @DisplayName("Deposit should save transaction record with correct details")
    void deposit_shouldSaveTransactionRecord() {
        // Arrange
        when(accountClient.getAccount(1L)).thenReturn(activeAccount);
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TransactionRequest request = new TransactionRequest(1L, null, 3000.0);

        // Act
        transactionService.deposit(request);

        // Assert - capture the saved transaction
        ArgumentCaptor<Transaction> captor = ArgumentCaptor.forClass(Transaction.class);
        verify(transactionRepository).save(captor.capture());

        Transaction saved = captor.getValue();
        assertEquals(1L, saved.getAccountId());
        assertEquals("DEPOSIT", saved.getType());
        assertEquals(3000.0, saved.getAmount());
        assertEquals("SUCCESS", saved.getStatus());
        assertNotNull(saved.getDate());
    }

    @Test
    @DisplayName("Deposit on zero-balance account should set balance to deposit amount")
    void deposit_onZeroBalanceAccount_shouldSetBalanceToDepositAmount() {
        // Arrange - account with zero balance
        activeAccount.balance = 0.0;
        when(accountClient.getAccount(1L)).thenReturn(activeAccount);
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TransactionRequest request = new TransactionRequest(1L, null, 1500.0);

        // Act
        TransactionResponse response = transactionService.deposit(request);

        // Assert
        assertEquals(1500.0, response.getUpdatedBalance());
        verify(accountClient).updateBalance(1L, 1500.0);
    }

    @Test
    @DisplayName("Deposit should fail when account is Closed")
    void deposit_shouldFailWhenAccountIsClosed() {
        // Arrange
        activeAccount.status = "Closed";
        when(accountClient.getAccount(1L)).thenReturn(activeAccount);

        TransactionRequest request = new TransactionRequest(1L, null, 1000.0);

        // Act & Assert
        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> transactionService.deposit(request));
        assertTrue(ex.getMessage().contains("closed"));

        // Verify no balance update or transaction save happened
        verify(accountClient, never()).updateBalance(anyLong(), anyDouble());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deposit should fail when amount is zero or negative")
    void deposit_shouldFailWhenAmountIsInvalid() {
        // Arrange
        when(accountClient.getAccount(1L)).thenReturn(activeAccount);

        TransactionRequest zeroRequest = new TransactionRequest(1L, null, 0.0);
        TransactionRequest negativeRequest = new TransactionRequest(1L, null, -500.0);

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> transactionService.deposit(zeroRequest));
        assertThrows(IllegalArgumentException.class,
                () -> transactionService.deposit(negativeRequest));
    }

    // ─── WITHDRAW TESTS ──────────────────────────────────────────

    @Test
    @DisplayName("Withdraw should deduct money from account")
    void withdraw_shouldDeductMoneyFromAccount() {
        // Arrange
        when(accountClient.getAccount(1L)).thenReturn(activeAccount);
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TransactionRequest request = new TransactionRequest(1L, null, 2000.0);

        // Act
        TransactionResponse response = transactionService.withdraw(request);

        // Assert
        assertEquals(3000.0, response.getUpdatedBalance());
        assertEquals("Withdrawal Successful", response.getMessage());
        verify(accountClient).updateBalance(1L, 3000.0);
    }

    @Test
    @DisplayName("Withdraw should fail when balance is insufficient")
    void withdraw_shouldFailWhenInsufficientBalance() {
        // Arrange
        when(accountClient.getAccount(1L)).thenReturn(activeAccount);

        TransactionRequest request = new TransactionRequest(1L, null, 10000.0);

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> transactionService.withdraw(request));
        assertTrue(ex.getMessage().contains("Insufficient Balance"));

        verify(accountClient, never()).updateBalance(anyLong(), anyDouble());
    }

    // ─── TRANSFER TESTS ──────────────────────────────────────────

    @Test
    @DisplayName("Transfer should move money between two accounts")
    void transfer_shouldMoveMoney() {
        // Arrange
        AccountDTO toAccount = new AccountDTO();
        toAccount.accountID = 2L;
        toAccount.userID = 200L;
        toAccount.balance = 1000.0;
        toAccount.status = "Active";

        when(accountClient.getAccount(1L)).thenReturn(activeAccount);
        when(accountClient.getAccount(2L)).thenReturn(toAccount);
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TransactionRequest request = new TransactionRequest(1L, 2L, 2000.0);

        // Act
        TransactionResponse response = transactionService.transfer(request);

        // Assert
        assertEquals(3000.0, response.getUpdatedBalance()); // 5000 - 2000
        assertEquals("Transfer Successful", response.getMessage());
        verify(accountClient).updateBalance(1L, 3000.0); // from account
        verify(accountClient).updateBalance(2L, 3000.0); // to account (1000 + 2000)
    }
}
