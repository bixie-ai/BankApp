package com.coding.exercise.bankapp.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "TX_ID")
	private UUID id;

	private Long accountNumber;

	private Instant txDateTime;

	private String txType;

	private Double txAmount;

	@PrePersist
	protected void onCreate() {
		if (txDateTime == null) {
			txDateTime = Instant.now();
		}
	}
}
