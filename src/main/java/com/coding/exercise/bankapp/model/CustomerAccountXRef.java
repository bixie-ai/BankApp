package com.coding.exercise.bankapp.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * JPA entity representing the cross-reference (join table) between customers and accounts.
 *
 * <p>Enables a many-to-many relationship between {@link Customer} and {@link Account}
 * by storing pairs of customer numbers and account numbers. This design allows a
 * single customer to own multiple accounts and, potentially, multiple customers to
 * share access to the same account.</p>
 */
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CustomerAccountXRef {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "CUST_ACC_XREF_ID")
	private UUID id;
	
	private Long accountNumber;
	
	private Long customerNumber;
	
}
