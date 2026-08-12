package com.coding.exercise.bankapp.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Account {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "ACCT_ID")
	private UUID id;

	private Long accountNumber;

	@OneToOne(cascade = CascadeType.ALL)
	private BankInfo bankInformation;

	private String accountStatus;

	private String accountType;

	private Double accountBalance;

	private Instant createDateTime;

	private Instant updateDateTime;

	@PrePersist
	protected void onCreate() {
		createDateTime = Instant.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updateDateTime = Instant.now();
	}
}
