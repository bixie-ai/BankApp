package com.coding.exercise.bankapp.service;

import java.lang.reflect.Field;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.coding.exercise.bankapp.domain.AccountInformation;
import com.coding.exercise.bankapp.domain.BankInformation;
import com.coding.exercise.bankapp.domain.CustomerDetails;
import com.coding.exercise.bankapp.domain.TransactionDetails;
import com.coding.exercise.bankapp.domain.TransferDetails;
import com.coding.exercise.bankapp.model.Account;
import com.coding.exercise.bankapp.model.Address;
import com.coding.exercise.bankapp.model.BankInfo;
import com.coding.exercise.bankapp.model.Contact;
import com.coding.exercise.bankapp.model.Customer;
import com.coding.exercise.bankapp.model.CustomerAccountXRef;
import com.coding.exercise.bankapp.model.Transaction;
import com.coding.exercise.bankapp.repository.AccountRepository;
import com.coding.exercise.bankapp.repository.CustomerAccountXRefRepository;
import com.coding.exercise.bankapp.repository.CustomerRepository;
import com.coding.exercise.bankapp.repository.TransactionRepository;
import com.coding.exercise.bankapp.service.helper.BankingServiceHelper;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class BankingServiceImplTest {

    private CustomerRepository customerRepository;
    private AccountRepository accountRepository;
    private TransactionRepository transactionRepository;
    private CustomerAccountXRefRepository custAccXRefRepository;
    private BankingServiceHelper bankingServiceHelper;

    private BankingServiceImpl bankingService;

    private Customer testCustomer;
    private Account fromAccount;
    private Account toAccount;

    @BeforeEach
    void setUp() throws Exception {
        customerRepository = mock(CustomerRepository.class);
        accountRepository = mock(AccountRepository.class);
        transactionRepository = mock(TransactionRepository.class);
        custAccXRefRepository = mock(CustomerAccountXRefRepository.class);
        bankingServiceHelper = mock(BankingServiceHelper.class);

        bankingService = new BankingServiceImpl(customerRepository);
        setField(bankingService, "accountRepository", accountRepository);
        setField(bankingService, "transactionRepository", transactionRepository);
        setField(bankingService, "custAccXRefRepository", custAccXRefRepository);
        setField(bankingService, "bankingServiceHelper", bankingServiceHelper);

        testCustomer = Customer.builder()
                .id(UUID.randomUUID())
                .customerNumber(1001L)
                .firstName("John")
                .lastName("Doe")
                .status("ACTIVE")
                .contactDetails(Contact.builder().emailId("john@test.com").build())
                .customerAddress(Address.builder().address1("123 Main St").city("NY").state("NY").zip("10001").country("US").build())
                .createDateTime(Instant.now())
                .build();

        fromAccount = Account.builder()
                .id(UUID.randomUUID())
                .accountNumber(5001L)
                .accountBalance(1000.0)
                .accountStatus("ACTIVE")
                .accountType("SAVINGS")
                .bankInformation(BankInfo.builder().branchCode(1).branchName("Main").routingNumber(12345)
                        .branchAddress(Address.builder().address1("1 Bank St").city("NY").state("NY").zip("10001").country("US").build()).build())
                .createDateTime(Instant.now())
                .build();

        toAccount = Account.builder()
                .id(UUID.randomUUID())
                .accountNumber(5002L)
                .accountBalance(500.0)
                .accountStatus("ACTIVE")
                .accountType("SAVINGS")
                .bankInformation(BankInfo.builder().branchCode(1).branchName("Main").routingNumber(12345)
                        .branchAddress(Address.builder().address1("1 Bank St").city("NY").state("NY").zip("10001").country("US").build()).build())
                .createDateTime(Instant.now())
                .build();
    }

    @Test
    void transferDetails_insufficientFunds_returnsBadRequest() {
        TransferDetails transfer = new TransferDetails();
        transfer.setFromAccountNumber(5001L);
        transfer.setToAccountNumber(5002L);
        transfer.setTransferAmount(1500.0);

        when(customerRepository.findByCustomerNumber(1001L)).thenReturn(Optional.of(testCustomer));
        when(accountRepository.findByAccountNumber(5001L)).thenReturn(Optional.of(fromAccount));
        when(accountRepository.findByAccountNumber(5002L)).thenReturn(Optional.of(toAccount));

        ResponseEntity<Object> response = bankingService.transferDetails(transfer, 1001L);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Insufficient Funds.", response.getBody());
        assertEquals(1000.0, fromAccount.getAccountBalance());
        assertEquals(500.0, toAccount.getAccountBalance());
        verify(accountRepository, never()).saveAll(any());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void transferDetails_exactBalance_succeeds() {
        TransferDetails transfer = new TransferDetails();
        transfer.setFromAccountNumber(5001L);
        transfer.setToAccountNumber(5002L);
        transfer.setTransferAmount(1000.0);

        when(customerRepository.findByCustomerNumber(1001L)).thenReturn(Optional.of(testCustomer));
        when(accountRepository.findByAccountNumber(5001L)).thenReturn(Optional.of(fromAccount));
        when(accountRepository.findByAccountNumber(5002L)).thenReturn(Optional.of(toAccount));
        when(bankingServiceHelper.createTransaction(any(), anyLong(), any()))
                .thenReturn(Transaction.builder().txAmount(1000.0).txType("DEBIT").accountNumber(5001L).txDateTime(Instant.now()).build())
                .thenReturn(Transaction.builder().txAmount(1000.0).txType("CREDIT").accountNumber(5002L).txDateTime(Instant.now()).build());

        ResponseEntity<Object> response = bankingService.transferDetails(transfer, 1001L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0.0, fromAccount.getAccountBalance());
        assertEquals(1500.0, toAccount.getAccountBalance());
        verify(accountRepository).saveAll(any());
        verify(transactionRepository, times(2)).save(any());
    }

    @Test
    void transferDetails_successfulTransfer_updatesBalancesAndCreatesTransactions() {
        TransferDetails transfer = new TransferDetails();
        transfer.setFromAccountNumber(5001L);
        transfer.setToAccountNumber(5002L);
        transfer.setTransferAmount(200.0);

        when(customerRepository.findByCustomerNumber(1001L)).thenReturn(Optional.of(testCustomer));
        when(accountRepository.findByAccountNumber(5001L)).thenReturn(Optional.of(fromAccount));
        when(accountRepository.findByAccountNumber(5002L)).thenReturn(Optional.of(toAccount));
        when(bankingServiceHelper.createTransaction(any(), eq(5001L), eq("DEBIT")))
                .thenReturn(Transaction.builder().txAmount(200.0).txType("DEBIT").accountNumber(5001L).txDateTime(Instant.now()).build());
        when(bankingServiceHelper.createTransaction(any(), eq(5002L), eq("CREDIT")))
                .thenReturn(Transaction.builder().txAmount(200.0).txType("CREDIT").accountNumber(5002L).txDateTime(Instant.now()).build());

        ResponseEntity<Object> response = bankingService.transferDetails(transfer, 1001L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(800.0, fromAccount.getAccountBalance());
        assertEquals(700.0, toAccount.getAccountBalance());
        verify(accountRepository).saveAll(any());
        verify(transactionRepository, times(2)).save(any());
        verify(bankingServiceHelper).createTransaction(transfer, 5001L, "DEBIT");
        verify(bankingServiceHelper).createTransaction(transfer, 5002L, "CREDIT");
    }

    @Test
    void transferDetails_customerNotFound_returnsNotFound() {
        TransferDetails transfer = new TransferDetails();
        transfer.setFromAccountNumber(5001L);
        transfer.setToAccountNumber(5002L);
        transfer.setTransferAmount(100.0);

        when(customerRepository.findByCustomerNumber(9999L)).thenReturn(Optional.empty());

        ResponseEntity<Object> response = bankingService.transferDetails(transfer, 9999L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Customer Number 9999 not found.", response.getBody());
    }

    @Test
    void transferDetails_fromAccountNotFound_returnsNotFound() {
        TransferDetails transfer = new TransferDetails();
        transfer.setFromAccountNumber(9999L);
        transfer.setToAccountNumber(5002L);
        transfer.setTransferAmount(100.0);

        when(customerRepository.findByCustomerNumber(1001L)).thenReturn(Optional.of(testCustomer));
        when(accountRepository.findByAccountNumber(9999L)).thenReturn(Optional.empty());

        ResponseEntity<Object> response = bankingService.transferDetails(transfer, 1001L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("From Account Number 9999 not found.", response.getBody());
    }

    @Test
    void transferDetails_toAccountNotFound_returnsNotFound() {
        TransferDetails transfer = new TransferDetails();
        transfer.setFromAccountNumber(5001L);
        transfer.setToAccountNumber(9999L);
        transfer.setTransferAmount(100.0);

        when(customerRepository.findByCustomerNumber(1001L)).thenReturn(Optional.of(testCustomer));
        when(accountRepository.findByAccountNumber(5001L)).thenReturn(Optional.of(fromAccount));
        when(accountRepository.findByAccountNumber(9999L)).thenReturn(Optional.empty());

        ResponseEntity<Object> response = bankingService.transferDetails(transfer, 1001L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("To Account Number 9999 not found.", response.getBody());
    }

    @Test
    void transferDetails_concurrentAccess_maintainsConsistency() throws Exception {
        fromAccount.setAccountBalance(1000.0);

        TransferDetails transfer = new TransferDetails();
        transfer.setFromAccountNumber(5001L);
        transfer.setToAccountNumber(5002L);
        transfer.setTransferAmount(100.0);

        when(customerRepository.findByCustomerNumber(1001L)).thenReturn(Optional.of(testCustomer));
        when(accountRepository.findByAccountNumber(5001L)).thenReturn(Optional.of(fromAccount));
        when(accountRepository.findByAccountNumber(5002L)).thenReturn(Optional.of(toAccount));
        when(bankingServiceHelper.createTransaction(any(), anyLong(), any()))
                .thenReturn(Transaction.builder().txAmount(100.0).txType("DEBIT").accountNumber(5001L).txDateTime(Instant.now()).build());

        int threadCount = 5;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threadCount);
        List<ResponseEntity<Object>> responses = Collections.synchronizedList(new ArrayList<>());

        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                try {
                    startLatch.await();
                    ResponseEntity<Object> response = bankingService.transferDetails(transfer, 1001L);
                    responses.add(response);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        startLatch.countDown();
        doneLatch.await();
        executor.shutdown();

        assertEquals(threadCount, responses.size());
        double expectedFromBalance = 1000.0 - (threadCount * 100.0);
        double expectedToBalance = 500.0 + (threadCount * 100.0);
        assertEquals(expectedFromBalance, fromAccount.getAccountBalance(), 0.01);
        assertEquals(expectedToBalance, toAccount.getAccountBalance(), 0.01);
    }

    @Test
    void transferDetails_zeroAmount_succeeds() {
        TransferDetails transfer = new TransferDetails();
        transfer.setFromAccountNumber(5001L);
        transfer.setToAccountNumber(5002L);
        transfer.setTransferAmount(0.0);

        when(customerRepository.findByCustomerNumber(1001L)).thenReturn(Optional.of(testCustomer));
        when(accountRepository.findByAccountNumber(5001L)).thenReturn(Optional.of(fromAccount));
        when(accountRepository.findByAccountNumber(5002L)).thenReturn(Optional.of(toAccount));
        when(bankingServiceHelper.createTransaction(any(), anyLong(), any()))
                .thenReturn(Transaction.builder().txAmount(0.0).txType("DEBIT").accountNumber(5001L).txDateTime(Instant.now()).build());

        ResponseEntity<Object> response = bankingService.transferDetails(transfer, 1001L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1000.0, fromAccount.getAccountBalance());
        assertEquals(500.0, toAccount.getAccountBalance());
    }

    @Test
    void addNewAccount_customerExists_createsAccountAndXRef() {
        AccountInformation accountInfo = AccountInformation.builder()
                .accountNumber(6001L)
                .accountBalance(0.0)
                .accountStatus("ACTIVE")
                .accountType("CHECKING")
                .bankInformation(BankInformation.builder().branchCode(1).branchName("Main").routingNumber(12345).build())
                .build();

        Account accountEntity = Account.builder()
                .accountNumber(6001L)
                .accountBalance(0.0)
                .accountStatus("ACTIVE")
                .accountType("CHECKING")
                .build();

        when(customerRepository.findByCustomerNumber(1001L)).thenReturn(Optional.of(testCustomer));
        when(bankingServiceHelper.convertToAccountEntity(accountInfo)).thenReturn(accountEntity);

        ResponseEntity<Object> response = bankingService.addNewAccount(accountInfo, 1001L);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(accountRepository).save(accountEntity);
        verify(custAccXRefRepository).save(any(CustomerAccountXRef.class));
    }

    @Test
    void addNewAccount_customerNotFound_stillReturnsCreated() {
        AccountInformation accountInfo = AccountInformation.builder()
                .accountNumber(6001L)
                .accountBalance(0.0)
                .accountStatus("ACTIVE")
                .accountType("CHECKING")
                .build();

        when(customerRepository.findByCustomerNumber(9999L)).thenReturn(Optional.empty());

        ResponseEntity<Object> response = bankingService.addNewAccount(accountInfo, 9999L);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(accountRepository, never()).save(any());
        verify(custAccXRefRepository, never()).save(any());
    }

    @Test
    void findAll_returnsAllCustomers() {
        Customer customer2 = Customer.builder()
                .customerNumber(1002L)
                .firstName("Jane")
                .lastName("Doe")
                .status("ACTIVE")
                .contactDetails(Contact.builder().emailId("jane@test.com").build())
                .customerAddress(Address.builder().address1("456 Oak Ave").city("LA").state("CA").zip("90001").country("US").build())
                .build();

        List<Customer> customers = List.of(testCustomer, customer2);
        when(customerRepository.findAll()).thenReturn(customers);

        CustomerDetails details1 = CustomerDetails.builder().firstName("John").lastName("Doe").customerNumber(1001L).build();
        CustomerDetails details2 = CustomerDetails.builder().firstName("Jane").lastName("Doe").customerNumber(1002L).build();
        when(bankingServiceHelper.convertToCustomerDomain(testCustomer)).thenReturn(details1);
        when(bankingServiceHelper.convertToCustomerDomain(customer2)).thenReturn(details2);

        List<CustomerDetails> result = bankingService.findAll();

        assertEquals(2, result.size());
        assertEquals("John", result.get(0).getFirstName());
        assertEquals("Jane", result.get(1).getFirstName());
    }

    @Test
    void findAll_emptyRepository_returnsEmptyList() {
        when(customerRepository.findAll()).thenReturn(Collections.emptyList());

        List<CustomerDetails> result = bankingService.findAll();

        assertTrue(result.isEmpty());
    }

    @Test
    void addCustomer_savesAndReturnsCreated() {
        CustomerDetails customerDetails = CustomerDetails.builder()
                .firstName("Alice")
                .lastName("Smith")
                .customerNumber(2001L)
                .status("ACTIVE")
                .build();

        Customer customerEntity = Customer.builder()
                .firstName("Alice")
                .lastName("Smith")
                .customerNumber(2001L)
                .status("ACTIVE")
                .build();

        when(bankingServiceHelper.convertToCustomerEntity(customerDetails)).thenReturn(customerEntity);

        ResponseEntity<Object> response = bankingService.addCustomer(customerDetails);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("New Customer created successfully.", response.getBody());
        verify(customerRepository).save(customerEntity);
    }

    @Test
    void findByCustomerNumber_exists_returnsDetails() {
        CustomerDetails expected = CustomerDetails.builder()
                .firstName("John").lastName("Doe").customerNumber(1001L).build();

        when(customerRepository.findByCustomerNumber(1001L)).thenReturn(Optional.of(testCustomer));
        when(bankingServiceHelper.convertToCustomerDomain(testCustomer)).thenReturn(expected);

        CustomerDetails result = bankingService.findByCustomerNumber(1001L);

        assertNotNull(result);
        assertEquals("John", result.getFirstName());
        assertEquals(1001L, result.getCustomerNumber());
    }

    @Test
    void findByCustomerNumber_notExists_returnsNull() {
        when(customerRepository.findByCustomerNumber(9999L)).thenReturn(Optional.empty());

        CustomerDetails result = bankingService.findByCustomerNumber(9999L);

        assertNull(result);
    }

    @Test
    void updateCustomer_exists_updatesAndReturnsOk() {
        CustomerDetails updateDetails = CustomerDetails.builder()
                .firstName("Johnny")
                .lastName("Doe")
                .middleName("M")
                .status("ACTIVE")
                .build();

        Customer unmanagedEntity = Customer.builder()
                .firstName("Johnny")
                .lastName("Doe")
                .middleName("M")
                .status("ACTIVE")
                .build();

        when(customerRepository.findByCustomerNumber(1001L)).thenReturn(Optional.of(testCustomer));
        when(bankingServiceHelper.convertToCustomerEntity(updateDetails)).thenReturn(unmanagedEntity);

        ResponseEntity<Object> response = bankingService.updateCustomer(updateDetails, 1001L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Success: Customer updated.", response.getBody());
        verify(customerRepository).save(testCustomer);
        assertEquals("Johnny", testCustomer.getFirstName());
    }

    @Test
    void updateCustomer_notExists_returnsNotFound() {
        CustomerDetails updateDetails = CustomerDetails.builder()
                .firstName("Johnny").build();

        Customer unmanagedEntity = Customer.builder().firstName("Johnny").build();
        when(customerRepository.findByCustomerNumber(9999L)).thenReturn(Optional.empty());
        when(bankingServiceHelper.convertToCustomerEntity(updateDetails)).thenReturn(unmanagedEntity);

        ResponseEntity<Object> response = bankingService.updateCustomer(updateDetails, 9999L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Customer Number 9999 not found.", response.getBody());
    }

    @Test
    void deleteCustomer_exists_deletesAndReturnsNoContent() {
        when(customerRepository.findByCustomerNumber(1001L)).thenReturn(Optional.of(testCustomer));

        ResponseEntity<Object> response = bankingService.deleteCustomer(1001L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(customerRepository).delete(testCustomer);
    }

    @Test
    void deleteCustomer_notExists_returnsNotFound() {
        when(customerRepository.findByCustomerNumber(9999L)).thenReturn(Optional.empty());

        ResponseEntity<Object> response = bankingService.deleteCustomer(9999L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Customer Number 9999 not found.", response.getBody());
        verify(customerRepository, never()).delete(any());
    }

    @Test
    void findByAccountNumber_exists_returnsFound() {
        AccountInformation accountDomain = AccountInformation.builder()
                .accountNumber(5001L)
                .accountBalance(1000.0)
                .build();

        when(accountRepository.findByAccountNumber(5001L)).thenReturn(Optional.of(fromAccount));
        when(bankingServiceHelper.convertToAccountDomain(fromAccount)).thenReturn(accountDomain);

        ResponseEntity<Object> response = bankingService.findByAccountNumber(5001L);

        assertEquals(HttpStatus.FOUND, response.getStatusCode());
        assertEquals(accountDomain, response.getBody());
    }

    @Test
    void findByAccountNumber_notExists_returnsNotFound() {
        when(accountRepository.findByAccountNumber(9999L)).thenReturn(Optional.empty());

        ResponseEntity<Object> response = bankingService.findByAccountNumber(9999L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Account Number 9999 not found.", response.getBody());
    }

    @Test
    void findTransactionsByAccountNumber_existsWithTransactions_returnsList() {
        Transaction tx1 = Transaction.builder().accountNumber(5001L).txAmount(100.0).txType("CREDIT").txDateTime(Instant.now()).build();
        Transaction tx2 = Transaction.builder().accountNumber(5001L).txAmount(50.0).txType("DEBIT").txDateTime(Instant.now()).build();

        TransactionDetails td1 = TransactionDetails.builder().accountNumber(5001L).txAmount(100.0).txType("CREDIT").build();
        TransactionDetails td2 = TransactionDetails.builder().accountNumber(5001L).txAmount(50.0).txType("DEBIT").build();

        when(accountRepository.findByAccountNumber(5001L)).thenReturn(Optional.of(fromAccount));
        when(transactionRepository.findByAccountNumber(5001L)).thenReturn(Optional.of(List.of(tx1, tx2)));
        when(bankingServiceHelper.convertToTransactionDomain(tx1)).thenReturn(td1);
        when(bankingServiceHelper.convertToTransactionDomain(tx2)).thenReturn(td2);

        List<TransactionDetails> result = bankingService.findTransactionsByAccountNumber(5001L);

        assertEquals(2, result.size());
        assertEquals(100.0, result.get(0).getTxAmount());
        assertEquals(50.0, result.get(1).getTxAmount());
    }

    @Test
    void findTransactionsByAccountNumber_accountNotExists_returnsEmptyList() {
        when(accountRepository.findByAccountNumber(9999L)).thenReturn(Optional.empty());

        List<TransactionDetails> result = bankingService.findTransactionsByAccountNumber(9999L);

        assertTrue(result.isEmpty());
    }

    @Test
    void findTransactionsByAccountNumber_noTransactions_returnsEmptyList() {
        when(accountRepository.findByAccountNumber(5001L)).thenReturn(Optional.of(fromAccount));
        when(transactionRepository.findByAccountNumber(5001L)).thenReturn(Optional.empty());

        List<TransactionDetails> result = bankingService.findTransactionsByAccountNumber(5001L);

        assertTrue(result.isEmpty());
    }

    @Test
    void transferDetails_rollbackIntegrity_noPartialStateOnInsufficientFunds() {
        double originalFromBalance = fromAccount.getAccountBalance();
        double originalToBalance = toAccount.getAccountBalance();

        TransferDetails transfer = new TransferDetails();
        transfer.setFromAccountNumber(5001L);
        transfer.setToAccountNumber(5002L);
        transfer.setTransferAmount(2000.0);

        when(customerRepository.findByCustomerNumber(1001L)).thenReturn(Optional.of(testCustomer));
        when(accountRepository.findByAccountNumber(5001L)).thenReturn(Optional.of(fromAccount));
        when(accountRepository.findByAccountNumber(5002L)).thenReturn(Optional.of(toAccount));

        bankingService.transferDetails(transfer, 1001L);

        assertEquals(originalFromBalance, fromAccount.getAccountBalance());
        assertEquals(originalToBalance, toAccount.getAccountBalance());
        verify(accountRepository, never()).saveAll(any());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void updateCustomer_withContactDetails_updatesContactFields() {
        Contact existingContact = Contact.builder().emailId("old@test.com").homePhone("111").workPhone("222").build();
        testCustomer.setContactDetails(existingContact);

        Contact newContact = Contact.builder().emailId("new@test.com").homePhone("333").workPhone("444").build();
        Customer unmanagedEntity = Customer.builder()
                .firstName("John")
                .lastName("Doe")
                .status("ACTIVE")
                .contactDetails(newContact)
                .build();

        CustomerDetails updateDetails = CustomerDetails.builder().firstName("John").lastName("Doe").status("ACTIVE").build();

        when(customerRepository.findByCustomerNumber(1001L)).thenReturn(Optional.of(testCustomer));
        when(bankingServiceHelper.convertToCustomerEntity(updateDetails)).thenReturn(unmanagedEntity);

        ResponseEntity<Object> response = bankingService.updateCustomer(updateDetails, 1001L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("new@test.com", testCustomer.getContactDetails().getEmailId());
        assertEquals("333", testCustomer.getContactDetails().getHomePhone());
        assertEquals("444", testCustomer.getContactDetails().getWorkPhone());
    }

    @Test
    void updateCustomer_withAddressDetails_updatesAddressFields() {
        Address existingAddress = Address.builder().address1("Old St").city("OldCity").state("OS").zip("00000").country("US").build();
        testCustomer.setCustomerAddress(existingAddress);

        Address newAddress = Address.builder().address1("New St").address2("Apt 2").city("NewCity").state("NS").zip("11111").country("CA").build();
        Customer unmanagedEntity = Customer.builder()
                .firstName("John")
                .lastName("Doe")
                .status("ACTIVE")
                .customerAddress(newAddress)
                .build();

        CustomerDetails updateDetails = CustomerDetails.builder().firstName("John").lastName("Doe").status("ACTIVE").build();

        when(customerRepository.findByCustomerNumber(1001L)).thenReturn(Optional.of(testCustomer));
        when(bankingServiceHelper.convertToCustomerEntity(updateDetails)).thenReturn(unmanagedEntity);

        ResponseEntity<Object> response = bankingService.updateCustomer(updateDetails, 1001L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("New St", testCustomer.getCustomerAddress().getAddress1());
        assertEquals("Apt 2", testCustomer.getCustomerAddress().getAddress2());
        assertEquals("NewCity", testCustomer.getCustomerAddress().getCity());
        assertEquals("NS", testCustomer.getCustomerAddress().getState());
        assertEquals("11111", testCustomer.getCustomerAddress().getZip());
        assertEquals("CA", testCustomer.getCustomerAddress().getCountry());
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }
}
