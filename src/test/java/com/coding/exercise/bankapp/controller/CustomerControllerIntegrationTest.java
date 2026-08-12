package com.coding.exercise.bankapp.controller;

import com.coding.exercise.bankapp.domain.AddressDetails;
import com.coding.exercise.bankapp.domain.ContactDetails;
import com.coding.exercise.bankapp.domain.CustomerDetails;
import com.coding.exercise.bankapp.model.Address;
import com.coding.exercise.bankapp.model.Contact;
import com.coding.exercise.bankapp.model.Customer;
import com.coding.exercise.bankapp.repository.CustomerRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CustomerControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CustomerRepository customerRepository;

    @BeforeEach
    void setUp() {
        customerRepository.deleteAll();
    }

    @Test
    void addCustomer_withValidPayload_returnsCreated() throws Exception {
        CustomerDetails customer = CustomerDetails.builder()
                .firstName("John")
                .lastName("Doe")
                .middleName("M")
                .customerNumber(3001L)
                .status("ACTIVE")
                .contactDetails(ContactDetails.builder()
                        .emailId("john.doe@example.com")
                        .homePhone("555-0100")
                        .workPhone("555-0101")
                        .build())
                .customerAddress(AddressDetails.builder()
                        .address1("123 Main St")
                        .address2("Apt 4")
                        .city("Springfield")
                        .state("IL")
                        .zip("62704")
                        .country("US")
                        .build())
                .build();

        mockMvc.perform(post("/customers/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customer)))
                .andExpect(status().isCreated())
                .andExpect(content().string("New Customer created successfully."));
    }

    @Test
    void getCustomer_afterCreation_returnsCustomerDetails() throws Exception {
        Customer entity = Customer.builder()
                .firstName("Jane")
                .lastName("Smith")
                .middleName("A")
                .customerNumber(3002L)
                .status("ACTIVE")
                .contactDetails(Contact.builder()
                        .emailId("jane@example.com")
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
                .createDateTime(new Date())
                .build();
        customerRepository.save(entity);

        mockMvc.perform(get("/customers/{customerNumber}", 3002L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Jane")))
                .andExpect(jsonPath("$.lastName", is("Smith")))
                .andExpect(jsonPath("$.customerNumber", is(3002)))
                .andExpect(jsonPath("$.status", is("ACTIVE")))
                .andExpect(jsonPath("$.contactDetails.emailId", is("jane@example.com")))
                .andExpect(jsonPath("$.customerAddress.city", is("Portland")));
    }

    @Test
    void getAllCustomers_multipleCustomers_returnsList() throws Exception {
        Customer c1 = Customer.builder()
                .firstName("Alice").lastName("One").customerNumber(3010L).status("ACTIVE")
                .contactDetails(Contact.builder().emailId("alice@test.com").homePhone("1").workPhone("2").build())
                .customerAddress(Address.builder().address1("A1").city("C1").state("S1").zip("00001").country("US").build())
                .createDateTime(new Date()).build();
        Customer c2 = Customer.builder()
                .firstName("Bob").lastName("Two").customerNumber(3011L).status("ACTIVE")
                .contactDetails(Contact.builder().emailId("bob@test.com").homePhone("3").workPhone("4").build())
                .customerAddress(Address.builder().address1("A2").city("C2").state("S2").zip("00002").country("US").build())
                .createDateTime(new Date()).build();
        customerRepository.save(c1);
        customerRepository.save(c2);

        mockMvc.perform(get("/customers/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].firstName", is("Alice")))
                .andExpect(jsonPath("$[1].firstName", is("Bob")));
    }

    @Test
    void getAllCustomers_emptyDatabase_returnsEmptyList() throws Exception {
        mockMvc.perform(get("/customers/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void updateCustomer_existingCustomer_returnsOk() throws Exception {
        Customer entity = Customer.builder()
                .firstName("Charlie").lastName("Brown").customerNumber(3003L).status("ACTIVE")
                .contactDetails(Contact.builder().emailId("charlie@test.com").homePhone("555").workPhone("666").build())
                .customerAddress(Address.builder().address1("789 Pine").city("Seattle").state("WA").zip("98101").country("US").build())
                .createDateTime(new Date()).build();
        customerRepository.save(entity);

        CustomerDetails updatePayload = CustomerDetails.builder()
                .firstName("Charles")
                .lastName("Brown")
                .middleName("B")
                .customerNumber(3003L)
                .status("ACTIVE")
                .contactDetails(ContactDetails.builder()
                        .emailId("charles@updated.com")
                        .homePhone("777")
                        .workPhone("888")
                        .build())
                .customerAddress(AddressDetails.builder()
                        .address1("Updated St")
                        .city("Updated City")
                        .state("UC")
                        .zip("99999")
                        .country("CA")
                        .build())
                .build();

        mockMvc.perform(put("/customers/{customerNumber}", 3003L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatePayload)))
                .andExpect(status().isOk())
                .andExpect(content().string("Success: Customer updated."));

        mockMvc.perform(get("/customers/{customerNumber}", 3003L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Charles")))
                .andExpect(jsonPath("$.contactDetails.emailId", is("charles@updated.com")))
                .andExpect(jsonPath("$.customerAddress.city", is("Updated City")));
    }

    @Test
    void updateCustomer_nonExistent_returnsNotFound() throws Exception {
        CustomerDetails updatePayload = CustomerDetails.builder()
                .firstName("Ghost").lastName("User").customerNumber(9999L).status("ACTIVE")
                .contactDetails(ContactDetails.builder().emailId("ghost@test.com").homePhone("1").workPhone("2").build())
                .customerAddress(AddressDetails.builder().address1("Nowhere").city("Void").state("XX").zip("00000").country("XX").build())
                .build();

        mockMvc.perform(put("/customers/{customerNumber}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatePayload)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Customer Number 9999 not found."));
    }

    @Test
    void deleteCustomer_existingCustomer_returnsOk() throws Exception {
        Customer entity = Customer.builder()
                .firstName("DeleteMe").lastName("User").customerNumber(3004L).status("ACTIVE")
                .contactDetails(Contact.builder().emailId("del@test.com").homePhone("1").workPhone("2").build())
                .customerAddress(Address.builder().address1("Del St").city("Del").state("DL").zip("00000").country("US").build())
                .createDateTime(new Date()).build();
        customerRepository.save(entity);

        mockMvc.perform(delete("/customers/{customerNumber}", 3004L))
                .andExpect(status().isOk())
                .andExpect(content().string("Success: Customer deleted."));

        mockMvc.perform(get("/customers/{customerNumber}", 3004L))
                .andExpect(status().isOk())
                .andExpect(content().string(""));
    }

    @Test
    void deleteCustomer_nonExistent_returnsBadRequest() throws Exception {
        mockMvc.perform(delete("/customers/{customerNumber}", 9999L))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Customer does not exist."));
    }

    @Test
    void addCustomer_jakartaCompliantJsonPayload_parsesCorrectly() throws Exception {
        String rawJson = """
                {
                    "firstName": "Jakarta",
                    "lastName": "Test",
                    "middleName": "EE",
                    "customerNumber": 3005,
                    "status": "ACTIVE",
                    "contactDetails": {
                        "emailId": "jakarta@test.com",
                        "homePhone": "111-222-3333",
                        "workPhone": "444-555-6666"
                    },
                    "customerAddress": {
                        "address1": "100 Jakarta Blvd",
                        "address2": "Suite 10",
                        "city": "TechCity",
                        "state": "TC",
                        "zip": "12345",
                        "country": "US"
                    }
                }
                """;

        mockMvc.perform(post("/customers/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawJson))
                .andExpect(status().isCreated())
                .andExpect(content().string("New Customer created successfully."));

        mockMvc.perform(get("/customers/{customerNumber}", 3005L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Jakarta")))
                .andExpect(jsonPath("$.contactDetails.emailId", is("jakarta@test.com")))
                .andExpect(jsonPath("$.customerAddress.address1", is("100 Jakarta Blvd")));
    }

    @Test
    void getCustomer_nonExistent_returnsNullBody() throws Exception {
        mockMvc.perform(get("/customers/{customerNumber}", 8888L))
                .andExpect(status().isOk())
                .andExpect(content().string(""));
    }
}
