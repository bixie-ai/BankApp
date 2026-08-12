package com.coding.exercise.bankapp.repository;

import com.coding.exercise.bankapp.model.CustomerAccountXRef;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class CustomerAccountXRefRepositoryIntegrationTest {

    @Autowired
    private CustomerAccountXRefRepository xrefRepository;

    @Test
    void save_persistsXRefAndGeneratesId() {
        CustomerAccountXRef xref = CustomerAccountXRef.builder()
                .accountNumber(4001L)
                .customerNumber(5001L)
                .build();

        CustomerAccountXRef saved = xrefRepository.save(xref);

        assertNotNull(saved.getId());
        assertEquals(4001L, saved.getAccountNumber());
        assertEquals(5001L, saved.getCustomerNumber());
    }

    @Test
    void findById_existingXRef_returnsXRef() {
        CustomerAccountXRef xref = CustomerAccountXRef.builder()
                .accountNumber(4002L)
                .customerNumber(5002L)
                .build();

        CustomerAccountXRef saved = xrefRepository.save(xref);
        Optional<CustomerAccountXRef> found = xrefRepository.findById(saved.getId());

        assertTrue(found.isPresent());
        assertEquals(saved.getId(), found.get().getId());
        assertEquals(4002L, found.get().getAccountNumber());
    }

    @Test
    void findById_nonExistent_returnsEmpty() {
        Optional<CustomerAccountXRef> found = xrefRepository.findById(UUID.randomUUID());

        assertFalse(found.isPresent());
    }

    @Test
    void deleteById_removesXRef() {
        CustomerAccountXRef xref = CustomerAccountXRef.builder()
                .accountNumber(4003L)
                .customerNumber(5003L)
                .build();

        CustomerAccountXRef saved = xrefRepository.save(xref);
        UUID id = saved.getId();

        xrefRepository.deleteById(id);

        assertFalse(xrefRepository.findById(id).isPresent());
    }
}
