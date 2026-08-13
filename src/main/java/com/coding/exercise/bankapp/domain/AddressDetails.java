package com.coding.exercise.bankapp.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object representing a postal address exchanged between the
 * controller and service layers.
 *
 * <p>Used as a nested component within both {@link CustomerDetails} (customer address)
 * and {@link BankInformation} (branch address) to convey location data without
 * exposing the internal JPA entity identifier.</p>
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AddressDetails {

	private String address1;
	private String address2;
	private String city;
	private String state;
	private String zip;
	private String country;
	
}
