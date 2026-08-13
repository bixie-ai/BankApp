package com.coding.exercise.bankapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coding.exercise.bankapp.domain.AccountInformation;
import com.coding.exercise.bankapp.domain.TransactionDetails;
import com.coding.exercise.bankapp.domain.TransferDetails;
import com.coding.exercise.bankapp.service.BankingServiceImpl;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST controller for account management and fund transfer operations.
 *
 * <p>Exposes endpoints under {@code /accounts} for account lookup, creation,
 * inter-account transfers, and transaction history retrieval. All endpoints
 * require HTTP Basic authentication.</p>
 */
@RestController
@RequestMapping("accounts")
@Tag(name = "Accounts and Transactions REST endpoints")
public class AccountController {

	@Autowired
	private BankingServiceImpl bankingService;

	/**
	 * Retrieves account details by the unique account number.
	 *
	 * @param accountNumber the numeric identifier assigned to the account
	 * @return HTTP 302 with account information, or HTTP 404 if the account does not exist
	 */
	@GetMapping(path = "/{accountNumber}")
	@Operation(summary = "Get account details", description = "Find account details by account number")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Success"),
			@ApiResponse(responseCode = "400", description = "Bad Request"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })

	public ResponseEntity<Object> getByAccountNumber(@PathVariable Long accountNumber) {

		return bankingService.findByAccountNumber(accountNumber);
	}

	/**
	 * Creates a new bank account and links it to an existing customer.
	 *
	 * <p>Pre-condition: the customer identified by {@code customerNumber} must already exist.
	 * The new account is persisted along with its bank information, and a cross-reference
	 * record is created to associate the account with the customer.</p>
	 *
	 * @param accountInformation the account details including type, balance, and bank info
	 * @param customerNumber     the owning customer's business identifier
	 * @return HTTP 201 on successful creation
	 */
	@PostMapping(path = "/add/{customerNumber}")
	@Operation(summary = "Add a new account", description = "Create an new account for existing customer.")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Success"),
			@ApiResponse(responseCode = "400", description = "Bad Request"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })

	public ResponseEntity<Object> addNewAccount(@RequestBody AccountInformation accountInformation,
			@PathVariable Long customerNumber) {

		return bankingService.addNewAccount(accountInformation, customerNumber);
	}

	/**
	 * Transfers funds between two accounts belonging to the specified customer.
	 *
	 * <p>Validates that both accounts exist and that the source account has sufficient
	 * balance. On success, debits the source, credits the destination, and records
	 * DEBIT/CREDIT transaction entries for both accounts atomically.</p>
	 *
	 * @param transferDetails contains source account, destination account, and transfer amount
	 * @param customerNumber  the customer initiating the transfer
	 * @return HTTP 200 on success, HTTP 400 for insufficient funds, or HTTP 404 if accounts not found
	 */
	@PutMapping(path = "/transfer/{customerNumber}")
	@Operation(summary = "Transfer funds between accounts", description = "Transfer funds between accounts.")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Success"),
			@ApiResponse(responseCode = "400", description = "Bad Request"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })

	public ResponseEntity<Object> transferDetails(@RequestBody TransferDetails transferDetails,
			@PathVariable Long customerNumber) {

		return bankingService.transferDetails(transferDetails, customerNumber);
	}

	/**
	 * Retrieves the complete transaction history for a given account.
	 *
	 * @param accountNumber the account whose transactions to fetch
	 * @return list of transaction details (empty list if the account has no transactions)
	 */
	@GetMapping(path = "/transactions/{accountNumber}")
	@Operation(summary = "Get all transactions", description = "Get all Transactions by account number")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Success"),
			@ApiResponse(responseCode = "400", description = "Bad Request"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })

	public List<TransactionDetails> getTransactionByAccountNumber(@PathVariable Long accountNumber) {

		return bankingService.findTransactionsByAccountNumber(accountNumber);
	}
}
