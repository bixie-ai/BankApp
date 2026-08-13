package com.coding.exercise.bankapp.repository;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.coding.exercise.bankapp.model.CustomerAccountXRef;

/**
 * Spring Data repository providing CRUD operations for {@link CustomerAccountXRef} entities.
 *
 * <p>Manages the cross-reference (join) records that associate customers with their accounts,
 * enabling the many-to-many relationship between customers and accounts to be traversed
 * in both directions.</p>
 */
@Repository
public interface CustomerAccountXRefRepository extends CrudRepository<CustomerAccountXRef, UUID> {

}
