package com.coding.exercise.bankapp.domain;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
