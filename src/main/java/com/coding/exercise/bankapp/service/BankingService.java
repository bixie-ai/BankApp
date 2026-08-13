package com.coding.exercise.bankapp.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.coding.exercise.bankapp.domain.AccountInformation;
import com.coding.exercise.bankapp.domain.CustomerDetails;
import com.coding.exercise.bankapp.domain.TransactionDetails;
import com.coding.exercise.bankapp.domain.TransferDetails;

/**
 * Service contract defining all banking business operations.
 *
 * <p>Implementations coordinate customer management, account lifecycle, fund transfers,
 * and transaction queries. Each method operates within a transactional boundary.</p>
 */
public interface BankingService {

    /**
     * Retrieves all customers in the system without pagination.
     *
     * @return complete list of customer details
     */
    public List<CustomerDetails> findAll();

    /**
     * Retrieves customers with server-side pagination and optional search filtering.
     *
     * @param search   optional text to match against name or email (null for no filter)
     * @param pageable pagination and sorting parameters
     * @return a page of matching customer details
     */
    public Page<CustomerDetails> findAllPaginated(String search, Pageable pageable);

    /**
     * Persists a new customer record to the database.
     *
     * @param customerDetails the customer information to persist
     * @return HTTP 201 response on successful creation
     */
    public ResponseEntity<Object> addCustomer(CustomerDetails customerDetails);

    /**
     * Looks up a customer by their unique business identifier.
     *
     * @param customerNumber the customer's assigned number
     * @return customer details if found, or {@code null} if no match exists
     */
    public CustomerDetails findByCustomerNumber(Long customerNumber);

    /**
     * Updates an existing customer's mutable fields (name, contact, address).
     *
     * @param customerDetails the new field values to apply
     * @param customerNumber  identifies which customer to update
     * @return HTTP 200 on success, or HTTP 404 if the customer does not exist
     */
    public ResponseEntity<Object> updateCustomer(CustomerDetails customerDetails, Long customerNumber);

    /**
     * Removes a customer and cascades deletion to associated entities.
     *
     * @param customerNumber identifies the customer to delete
     * @return HTTP 204 on success, or HTTP 404 if the customer does not exist
     */
    public ResponseEntity<Object> deleteCustomer(Long customerNumber) ;

    /**
     * Retrieves account details by account number.
     *
     * @param accountNumber the unique account identifier
     * @return HTTP 302 with account info, or HTTP 404 if not found
     */
    public ResponseEntity<Object> findByAccountNumber(Long accountNumber);

    /**
     * Creates a new account and associates it with the specified customer.
     *
     * @param accountInformation account details including type, balance, and bank info
     * @param customerNumber     the owning customer's identifier
     * @return HTTP 201 on successful creation
     */
    public ResponseEntity<Object> addNewAccount(AccountInformation accountInformation, Long customerNumber);

    /**
     * Executes a fund transfer between two accounts owned by the customer.
     *
     * <p>Validates sufficient balance in the source account before executing.
     * Both account balances are updated and corresponding transaction records created.</p>
     *
     * @param transferDetails source account, destination account, and amount
     * @param customerNumber  the customer initiating the transfer
     * @return HTTP 200 on success, HTTP 400 for insufficient funds, or HTTP 404 if not found
     */
    public ResponseEntity<Object> transferDetails(TransferDetails transferDetails, Long customerNumber);

    /**
     * Retrieves all transactions recorded against an account.
     *
     * @param accountNumber the account to query
     * @return list of transactions (empty if none exist or account not found)
     */
    public List<TransactionDetails> findTransactionsByAccountNumber(Long accountNumber);

}
