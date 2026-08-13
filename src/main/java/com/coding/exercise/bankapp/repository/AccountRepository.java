package com.coding.exercise.bankapp.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.coding.exercise.bankapp.model.Account;

/**
 * Spring Data repository providing CRUD operations for {@link Account} entities.
 *
 * <p>Extends {@link CrudRepository} to inherit standard persistence operations and adds
 * a custom finder method for business-key lookups by account number, which is the
 * primary identifier used across the service layer (as opposed to the internal UUID).</p>
 */
@Repository
public interface AccountRepository extends CrudRepository<Account, UUID> {

	/**
	 * Retrieves an account by its unique business account number.
	 *
	 * @param accountNumber the externally visible account number to search for
	 * @return an Optional containing the matching account, or empty if none exists
	 */
	Optional<Account> findByAccountNumber(Long accountNumber);
}
