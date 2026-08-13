package com.coding.exercise.bankapp.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object representing customer information exchanged between the
 * controller and service layers.
 *
 * <p>Encapsulates personal identification fields, status, and nested address and
 * contact details. This DTO shields API consumers from persistence concerns such
 * as entity IDs and audit timestamps present on the underlying JPA entity.</p>
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CustomerDetails {

    private String firstName;
    
    private String lastName;
    
    private String middleName;
    
    private Long customerNumber;
    
    private String status;
    
    private AddressDetails customerAddress;
    
    private ContactDetails contactDetails;
    
}
