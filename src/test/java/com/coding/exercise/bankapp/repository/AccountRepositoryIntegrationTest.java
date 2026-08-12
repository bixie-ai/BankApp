package com.coding.exercise.bankapp.repository;

import com.coding.exercise.bankapp.model.Account;
import com.coding.exercise.bankapp.model.Address;
import com.coding.exercise.bankapp.model.BankInfo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class AccountRepositoryIntegrationTest {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void save_persistsAccountAndGeneratesId() {
        Account account = Account.builder()
                .accountNumber(1001L)
                .accountBalance(500.0)
                .accountStatus("ACTIVE")
                .accountType("SAVINGS")
                .bankInformation(BankInfo.builder()
                        .branchCode(1)
                        .branchName("Main")
                        .routingNumber(12345)
                        .branchAddress(Address.builder()
                                .address1("1 Bank St")
                                .city("NY")
                                .state("NY")
                                .zip("10001")
                                .country("US")
                                .build())
                        .build())
                .build();

        Account saved = accountRepository.save(account);

        assertNotNull(saved.getId());
        assertEquals(1001L, saved.getAccountNumber());
        assertEquals(500.0, saved.getAccountBalance());
    }

    @Test
    void findById_existingAccount_returnsAccount() {
        Account account = Account.builder()
                .accountNumber(1002L)
                .accountBalance(1000.0)
                .accountStatus("ACTIVE")
                .accountType("CHECKING")
                .bankInformation(BankInfo.builder()
                        .branchCode(2)
                        .branchName("Branch")
                        .routingNumber(67890)
                        .branchAddress(Address.builder()
                                .address1("2 Bank Ave")
                                .city("LA")
                                .state("CA")
                                .zip("90001")
                                .country("US")
                                .build())
                        .build())
                .build();

        Account saved = accountRepository.save(account);
        Optional<Account> found = accountRepository.findById(saved.getId());

        assertTrue(found.isPresent());
        assertEquals(saved.getId(), found.get().getId());
        assertEquals(1002L, found.get().getAccountNumber());
    }

    @Test
    void findById_nonExistent_returnsEmpty() {
        Optional<Account> found = accountRepository.findById(UUID.randomUUID());

        assertFalse(found.isPresent());
    }

    @Test
    void deleteById_removesAccount() {
        Account account = Account.builder()
                .accountNumber(1003L)
                .accountBalance(200.0)
                .accountStatus("ACTIVE")
                .accountType("SAVINGS")
                .bankInformation(BankInfo.builder()
                        .branchCode(1)
                        .branchName("Main")
                        .routingNumber(12345)
                        .branchAddress(Address.builder()
                                .address1("1 Bank St")
                                .city("NY")
                                .state("NY")
                                .zip("10001")
                                .country("US")
                                .build())
                        .build())
                .build();

        Account saved = accountRepository.save(account);
        UUID id = saved.getId();

        accountRepository.deleteById(id);

        assertFalse(accountRepository.findById(id).isPresent());
    }

    @Test
    void save_prePersistSetsCreateDateTime() {
        Account account = Account.builder()
                .accountNumber(1004L)
                .accountBalance(0.0)
                .accountStatus("ACTIVE")
                .accountType("SAVINGS")
                .bankInformation(BankInfo.builder()
                        .branchCode(1)
                        .branchName("Main")
                        .routingNumber(12345)
                        .branchAddress(Address.builder()
                                .address1("1 Bank St")
                                .city("NY")
                                .state("NY")
                                .zip("10001")
                                .country("US")
                                .build())
                        .build())
                .build();

        assertNull(account.getCreateDateTime());

        Account saved = accountRepository.save(account);

        assertNotNull(saved.getCreateDateTime());
    }

    @Test
    void save_preUpdateSetsUpdateDateTime() {
        Account account = Account.builder()
                .accountNumber(1005L)
                .accountBalance(100.0)
                .accountStatus("ACTIVE")
                .accountType("SAVINGS")
                .bankInformation(BankInfo.builder()
                        .branchCode(1)
                        .branchName("Main")
                        .routingNumber(12345)
                        .branchAddress(Address.builder()
                                .address1("1 Bank St")
                                .city("NY")
                                .state("NY")
                                .zip("10001")
                                .country("US")
                                .build())
                        .build())
                .build();

        Account saved = accountRepository.save(account);
        assertNull(saved.getUpdateDateTime());

        saved.setAccountBalance(200.0);
        accountRepository.save(saved);
        entityManager.flush();

        assertNotNull(saved.getUpdateDateTime());
    }
}
