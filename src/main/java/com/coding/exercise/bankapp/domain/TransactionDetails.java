package com.coding.exercise.bankapp.domain;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object representing a single financial transaction exchanged between
 * the controller and service layers.
 *
 * <p>Contains the essential transaction attributes (account, type, amount, timestamp)
 * needed for recording transactions and displaying transaction history to API consumers.</p>
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TransactionDetails {

	private Long accountNumber;

	private Instant txDateTime;

	private String txType;

	private Double txAmount;
}
