package com.coding.exercise.bankapp.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object representing bank branch information exchanged between the
 * controller and service layers.
 *
 * <p>Contains identifiers (branch code, routing number), the branch name, and the
 * branch address. This DTO is nested within {@link AccountInformation} to describe
 * which branch holds a particular account.</p>
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BankInformation {

	private String branchName;
	
	private Integer branchCode;
	
	private AddressDetails branchAddress;
	
	private Integer routingNumber;
}
