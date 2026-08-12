package com.coding.exercise.bankapp.repository;

import com.coding.exercise.bankapp.model.Address;
import com.coding.exercise.bankapp.model.Contact;
import com.coding.exercise.bankapp.model.Customer;
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
class CustomerRepositoryIntegrationTest {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void save_persistsCustomerAndGeneratesId() {
        Customer customer = Customer.builder()
                .firstName("John")
                .lastName("Doe")
                .customerNumber(2001L)
                .status("ACTIVE")
                .contactDetails(Contact.builder()
                        .emailId("john@test.com")
                        .homePhone("555-0100")
                        .workPhone("555-0101")
                        .build())
                .customerAddress(Address.builder()
                        .address1("123 Main St")
                        .city("Springfield")
                        .state("IL")
                        .zip("62704")
                        .country("US")
                        .build())
                .build();

        Customer saved = customerRepository.save(customer);

        assertNotNull(saved.getId());
        assertEquals("John", saved.getFirstName());
        assertEquals(2001L, saved.getCustomerNumber());
    }

    @Test
    void findById_existingCustomer_returnsCustomer() {
        Customer customer = Customer.builder()
                .firstName("Jane")
                .lastName("Smith")
                .customerNumber(2002L)
                .status("ACTIVE")
                .contactDetails(Contact.builder()
                        .emailId("jane@test.com")
                        .homePhone("555-0200")
                        .workPhone("555-0201")
                        .build())
                .customerAddress(Address.builder()
                        .address1("456 Oak Ave")
                        .city("Portland")
                        .state("OR")
                        .zip("97201")
                        .country("US")
                        .build())
                .build();

        Customer saved = customerRepository.save(customer);
        Optional<Customer> found = customerRepository.findById(saved.getId());

        assertTrue(found.isPresent());
        assertEquals(saved.getId(), found.get().getId());
        assertEquals("Jane", found.get().getFirstName());
    }

    @Test
    void findById_nonExistent_returnsEmpty() {
        Optional<Customer> found = customerRepository.findById(UUID.randomUUID());

        assertFalse(found.isPresent());
    }

    @Test
    void deleteById_removesCustomer() {
        Customer customer = Customer.builder()
                .firstName("Delete")
                .lastName("Me")
                .customerNumber(2003L)
                .status("ACTIVE")
                .contactDetails(Contact.builder()
                        .emailId("del@test.com")
                        .homePhone("555-0300")
                        .workPhone("555-0301")
                        .build())
                .customerAddress(Address.builder()
                        .address1("789 Pine St")
                        .city("Seattle")
                        .state("WA")
                        .zip("98101")
                        .country("US")
                        .build())
                .build();

        Customer saved = customerRepository.save(customer);
        UUID id = saved.getId();

        customerRepository.deleteById(id);

        assertFalse(customerRepository.findById(id).isPresent());
    }

    @Test
    void save_prePersistSetsCreateDateTime() {
        Customer customer = Customer.builder()
                .firstName("PrePersist")
                .lastName("Test")
                .customerNumber(2004L)
                .status("ACTIVE")
                .contactDetails(Contact.builder()
                        .emailId("pp@test.com")
                        .homePhone("555-0400")
                        .workPhone("555-0401")
                        .build())
                .customerAddress(Address.builder()
                        .address1("100 Test St")
                        .city("Test")
                        .state("TS")
                        .zip("00000")
                        .country("US")
                        .build())
                .build();

        assertNull(customer.getCreateDateTime());

        Customer saved = customerRepository.save(customer);

        assertNotNull(saved.getCreateDateTime());
    }

    @Test
    void save_preUpdateSetsUpdateDateTime() {
        Customer customer = Customer.builder()
                .firstName("PreUpdate")
                .lastName("Test")
                .customerNumber(2005L)
                .status("ACTIVE")
                .contactDetails(Contact.builder()
                        .emailId("pu@test.com")
                        .homePhone("555-0500")
                        .workPhone("555-0501")
                        .build())
                .customerAddress(Address.builder()
                        .address1("200 Test St")
                        .city("Test")
                        .state("TS")
                        .zip("00000")
                        .country("US")
                        .build())
                .build();

        Customer saved = customerRepository.save(customer);
        assertNull(saved.getUpdateDateTime());

        saved.setFirstName("Updated");
        customerRepository.save(saved);
        entityManager.flush();

        assertNotNull(saved.getUpdateDateTime());
    }
}
