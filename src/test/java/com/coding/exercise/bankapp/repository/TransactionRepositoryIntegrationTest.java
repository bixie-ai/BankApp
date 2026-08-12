package com.coding.exercise.bankapp.repository;

import com.coding.exercise.bankapp.model.Transaction;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class TransactionRepositoryIntegrationTest {

    @Autowired
    private TransactionRepository transactionRepository;

    @Test
    void save_persistsTransactionAndGeneratesId() {
        Transaction transaction = Transaction.builder()
                .accountNumber(3001L)
                .txType("CREDIT")
                .txAmount(250.0)
                .build();

        Transaction saved = transactionRepository.save(transaction);

        assertNotNull(saved.getId());
        assertEquals(3001L, saved.getAccountNumber());
        assertEquals("CREDIT", saved.getTxType());
        assertEquals(250.0, saved.getTxAmount());
    }

    @Test
    void findById_existingTransaction_returnsTransaction() {
        Transaction transaction = Transaction.builder()
                .accountNumber(3002L)
                .txType("DEBIT")
                .txAmount(100.0)
                .build();

        Transaction saved = transactionRepository.save(transaction);
        Optional<Transaction> found = transactionRepository.findById(saved.getId());

        assertTrue(found.isPresent());
        assertEquals(saved.getId(), found.get().getId());
        assertEquals(3002L, found.get().getAccountNumber());
    }

    @Test
    void findById_nonExistent_returnsEmpty() {
        Optional<Transaction> found = transactionRepository.findById(UUID.randomUUID());

        assertFalse(found.isPresent());
    }

    @Test
    void deleteById_removesTransaction() {
        Transaction transaction = Transaction.builder()
                .accountNumber(3003L)
                .txType("CREDIT")
                .txAmount(75.0)
                .build();

        Transaction saved = transactionRepository.save(transaction);
        UUID id = saved.getId();

        transactionRepository.deleteById(id);

        assertFalse(transactionRepository.findById(id).isPresent());
    }

    @Test
    void save_prePersistSetsTxDateTime() {
        Transaction transaction = Transaction.builder()
                .accountNumber(3004L)
                .txType("CREDIT")
                .txAmount(500.0)
                .build();

        assertNull(transaction.getTxDateTime());

        Transaction saved = transactionRepository.save(transaction);

        assertNotNull(saved.getTxDateTime());
    }

    @Test
    void save_prePersistDoesNotOverrideExistingTxDateTime() {
        java.time.Instant specificTime = java.time.Instant.parse("2024-01-15T10:30:00Z");
        Transaction transaction = Transaction.builder()
                .accountNumber(3005L)
                .txType("DEBIT")
                .txAmount(300.0)
                .txDateTime(specificTime)
                .build();

        Transaction saved = transactionRepository.save(transaction);

        assertEquals(specificTime, saved.getTxDateTime());
    }
}
