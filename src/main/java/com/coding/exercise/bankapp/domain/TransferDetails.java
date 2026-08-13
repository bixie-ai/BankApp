package com.coding.exercise.bankapp.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object representing an account-to-account fund transfer request
 * exchanged between the controller and service layers.
 *
 * <p>Carries the source account, destination account, and transfer amount. This DTO
 * serves as the input payload for the transfer endpoint and is consumed by the
 * service layer to create corresponding debit and credit transaction records.</p>
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TransferDetails {

	private Long fromAccountNumber;
	
	private Long toAccountNumber;
	
	private Double transferAmount;
}
