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
 * JPA entity representing a postal address in the persistence layer.
 *
 * <p>Used as a shared, reusable address record referenced by both {@link Customer}
 * (via many-to-one) and {@link BankInfo} (via one-to-one). Contains standard
 * address fields: street lines, city, state, zip code, and country.</p>
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
public class Address {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="ADDR_ID")
	private UUID id;
	
	private String address1;
	private String address2;
	private String city;
	private String state;
	private String zip;
	private String country;

}
