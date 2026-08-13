package com.coding.exercise.bankapp.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.coding.exercise.bankapp.model.Customer;

/**
 * Spring Data JPA repository providing persistence operations for {@link Customer} entities.
 *
 * <p>Extends {@link JpaRepository} to provide full JPA capabilities including pagination
 * and sorting. Adds custom finders for business-key lookup and free-text search across
 * customer name and email fields.</p>
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    /**
     * Retrieves a customer by their unique business customer number.
     *
     * @param customerNumber the externally visible customer identifier to search for
     * @return an Optional containing the matching customer, or empty if none exists
     */
    Optional<Customer> findByCustomerNumber(Long customerNumber);

    /**
     * Performs a case-insensitive partial match search across customer first name,
     * last name, and email address.
     *
     * <p>Useful for implementing typeahead or search-box functionality in the UI.
     * Results are returned as a paginated set to support large result sets efficiently.</p>
     *
     * @param search   the search term to match against name and email fields
     * @param pageable pagination and sorting parameters
     * @return a page of customers matching the search criteria
     */
    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.contactDetails.emailId) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Customer> searchCustomers(@Param("search") String search, Pageable pageable);

}
