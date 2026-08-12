package com.coding.exercise.bankapp.repository;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.coding.exercise.bankapp.model.CustomerAccountXRef;

@Repository
public interface CustomerAccountXRefRepository extends CrudRepository<CustomerAccountXRef, UUID> {

}
