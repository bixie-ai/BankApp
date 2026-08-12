package com.coding.exercise.bankapp.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "CUST_ID")
    private UUID id;

    private String firstName;

    private String lastName;

    private String middleName;

    private Long customerNumber;

    private String status;

    @ManyToOne(cascade = CascadeType.ALL)
    private Address customerAddress;

    @OneToOne(cascade = CascadeType.ALL)
    private Contact contactDetails;

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
