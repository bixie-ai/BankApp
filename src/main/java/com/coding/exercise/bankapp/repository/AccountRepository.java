package com.coding.exercise.bankapp.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.coding.exercise.bankapp.model.Account;

@Repository
public interface AccountRepository extends CrudRepository<Account, UUID> {

	Optional<Account> findByAccountNumber(Long accountNumber);
}
