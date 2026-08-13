package com.coding.exercise.bankapp.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.coding.exercise.bankapp.model.Transaction;

/**
 * Spring Data repository providing CRUD operations for {@link Transaction} entities.
 *
 * <p>Extends {@link CrudRepository} and adds a custom finder to retrieve all transactions
 * associated with a given account, enabling account statement and transaction history features.</p>
 */
@Repository
public interface TransactionRepository extends CrudRepository<Transaction, UUID> {

    /**
     * Retrieves all transactions associated with the specified account number.
     *
     * <p>Returns transactions in the order determined by the underlying data store.
     * An empty Optional indicates no transactions have been recorded for the account.</p>
     *
     * @param accountNumber the account number whose transaction history is requested
     * @return an Optional containing the list of transactions, or empty if none exist
     */
    public Optional<List<Transaction>> findByAccountNumber(Long accountNumber);

}
