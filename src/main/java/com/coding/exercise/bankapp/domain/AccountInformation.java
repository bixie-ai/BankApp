package com.coding.exercise.bankapp.domain;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object representing account information exchanged between the
 * controller and service layers.
 *
 * <p>Carries the subset of account data relevant to API consumers, decoupling the
 * external contract from the internal JPA entity structure. Includes account
 * identification, status, balance, and associated bank branch details.</p>
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AccountInformation {

	private Long accountNumber;
	
	private BankInformation bankInformation;
	
	private String accountStatus;
	
	private String accountType;
	
	private Double accountBalance;
	
	private Date accountCreated;
}
