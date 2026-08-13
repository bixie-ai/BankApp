package com.coding.exercise.bankapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.coding.exercise.bankapp.domain.CustomerDetails;
import com.coding.exercise.bankapp.service.BankingServiceImpl;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("customers")
@Tag(name = "Customer REST endpoints")
public class CustomerController {

	@Autowired
	private BankingServiceImpl bankingService;

	@GetMapping(path = "/all")
	@Operation(summary = "Find all customers", description = "Gets details of all the customers with pagination and search support")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Success"),
			@ApiResponse(responseCode = "400", description = "Bad Request"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })

	public ResponseEntity<Page<CustomerDetails>> getAllCustomers(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(required = false) String search) {

		Pageable pageable = PageRequest.of(page, size, Sort.by("createDateTime").descending());
		Page<CustomerDetails> customers = bankingService.findAllPaginated(search, pageable);
		return ResponseEntity.ok(customers);
	}

	@PostMapping(path = "/add")
	@Operation(summary = "Add a Customer", description = "Add customer and create an account")
	@ApiResponses(value = { @ApiResponse(responseCode = "201", description = "Created"),
			@ApiResponse(responseCode = "400", description = "Bad Request"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })

	public ResponseEntity<Object> addCustomer(@RequestBody CustomerDetails customer) {
		if (customer.getFirstName() == null || customer.getFirstName().isBlank()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("First name is required.");
		}
		if (customer.getLastName() == null || customer.getLastName().isBlank()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Last name is required.");
		}
		if (customer.getContactDetails() == null || customer.getContactDetails().getEmailId() == null
				|| customer.getContactDetails().getEmailId().isBlank()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required.");
		}
		return bankingService.addCustomer(customer);
	}

	@GetMapping(path = "/{customerNumber}")
	@Operation(summary = "Get customer details", description = "Get Customer details by customer number.")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Success"),
			@ApiResponse(responseCode = "404", description = "Not Found"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })

	public ResponseEntity<Object> getCustomer(@PathVariable Long customerNumber) {
		CustomerDetails customer = bankingService.findByCustomerNumber(customerNumber);
		if (customer == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer Number " + customerNumber + " not found.");
		}
		return ResponseEntity.ok(customer);
	}

	@PutMapping(path = "/{customerNumber}")
	@Operation(summary = "Update customer", description = "Update customer and any other account information associated with him.")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Success"),
			@ApiResponse(responseCode = "400", description = "Bad Request"),
			@ApiResponse(responseCode = "404", description = "Not Found"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })

	public ResponseEntity<Object> updateCustomer(@RequestBody CustomerDetails customerDetails,
			@PathVariable Long customerNumber) {
		if (customerDetails.getFirstName() == null || customerDetails.getFirstName().isBlank()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("First name is required.");
		}
		if (customerDetails.getLastName() == null || customerDetails.getLastName().isBlank()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Last name is required.");
		}
		return bankingService.updateCustomer(customerDetails, customerNumber);
	}

	@DeleteMapping(path = "/{customerNumber}")
	@Operation(summary = "Delete customer and related accounts", description = "Delete customer and all accounts associated with him.")
	@ApiResponses(value = { @ApiResponse(responseCode = "204", description = "No Content"),
			@ApiResponse(responseCode = "404", description = "Not Found"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })

	public ResponseEntity<Object> deleteCustomer(@PathVariable Long customerNumber) {
		return bankingService.deleteCustomer(customerNumber);
	}

}
