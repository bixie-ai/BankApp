package com.coding.exercise.bankapp.model;

import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * JPA entity representing bank branch information in the persistence layer.
 *
 * <p>Stores branch identification (name, code, routing number) and maintains a
 * cascading one-to-one relationship with the branch {@link Address}. This entity
 * is owned by the {@link Account} entity and is persisted/removed with it via
 * cascade operations.</p>
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
public class BankInfo {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="BANK_ID")
	private UUID id;
	
	private String branchName;
	
	private Integer branchCode;
	
	@OneToOne(cascade=CascadeType.ALL)
	private Address branchAddress;
	
	private Integer routingNumber;
	
}
