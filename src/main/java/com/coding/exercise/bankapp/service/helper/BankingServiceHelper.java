package com.coding.exercise.bankapp.service.helper;

import org.springframework.stereotype.Component;

import com.coding.exercise.bankapp.domain.AccountInformation;
import com.coding.exercise.bankapp.domain.AddressDetails;
import com.coding.exercise.bankapp.domain.BankInformation;
import com.coding.exercise.bankapp.domain.ContactDetails;
import com.coding.exercise.bankapp.domain.CustomerDetails;
import com.coding.exercise.bankapp.domain.TransactionDetails;
import com.coding.exercise.bankapp.domain.TransferDetails;
import com.coding.exercise.bankapp.model.Account;
import com.coding.exercise.bankapp.model.Address;
import com.coding.exercise.bankapp.model.BankInfo;
import com.coding.exercise.bankapp.model.Contact;
import com.coding.exercise.bankapp.model.Customer;
import com.coding.exercise.bankapp.model.Transaction;

/**
 * Helper component responsible for bidirectional conversion between JPA entity objects
 * and domain transfer objects (DTOs).
 *
 * <p>This class isolates the mapping logic from business service classes, ensuring that
 * the service layer remains focused on orchestration and business rules while this helper
 * handles the structural transformation between persistence and API representations.</p>
 *
 * <p>All conversions are stateless field-by-field mappings. Nested objects (address, contact,
 * bank information) are recursively converted using the corresponding helper methods.</p>
 */
@Component
public class BankingServiceHelper {

	/**
	 * Converts a Customer JPA entity into its corresponding domain transfer object.
	 *
	 * <p>Recursively converts nested contact and address entities into their
	 * domain representations.</p>
	 *
	 * @param customer the persisted customer entity; must not be null and should
	 *                 have non-null contact and address associations
	 * @return a fully populated CustomerDetails DTO suitable for API responses
	 */
	public CustomerDetails convertToCustomerDomain(Customer customer) {

		return CustomerDetails.builder()
				.firstName(customer.getFirstName())
				.middleName(customer.getMiddleName())
				.lastName(customer.getLastName())
				.customerNumber(customer.getCustomerNumber())
				.status(customer.getStatus())
				.contactDetails(convertToContactDomain(customer.getContactDetails()))
				.customerAddress(convertToAddressDomain(customer.getCustomerAddress()))
				.build();
	}

	/**
	 * Converts a CustomerDetails domain object into a JPA entity ready for persistence.
	 *
	 * <p>Recursively converts nested contact and address domain objects into their
	 * entity representations. The returned entity does not have an ID set, making it
	 * suitable for new inserts; for updates, the ID should be set separately.</p>
	 *
	 * @param customerDetails the domain transfer object containing customer data;
	 *                        must not be null
	 * @return a Customer entity with all fields mapped from the DTO
	 */
	public Customer convertToCustomerEntity(CustomerDetails customerDetails) {

		return Customer.builder()
				.firstName(customerDetails.getFirstName())
				.middleName(customerDetails.getMiddleName())
				.lastName(customerDetails.getLastName())
				.customerNumber(customerDetails.getCustomerNumber())
				.status(customerDetails.getStatus())
				.contactDetails(convertToContactEntity(customerDetails.getContactDetails()))
				.customerAddress(convertToAddressEntity(customerDetails.getCustomerAddress()))
				.build();
	}

	/**
	 * Converts an Account JPA entity into its corresponding domain transfer object.
	 *
	 * <p>Includes recursive conversion of the associated bank information entity.</p>
	 *
	 * @param account the persisted account entity; must not be null and should
	 *                have a non-null bankInformation association
	 * @return a fully populated AccountInformation DTO suitable for API responses
	 */
	public AccountInformation convertToAccountDomain(Account account) {

		return AccountInformation.builder()
				.accountType(account.getAccountType())
				.accountBalance(account.getAccountBalance())
				.accountNumber(account.getAccountNumber())
				.accountStatus(account.getAccountStatus())
				.bankInformation(convertToBankInfoDomain(account.getBankInformation()))
				.build();
	}

	/**
	 * Converts an AccountInformation domain object into a JPA entity ready for persistence.
	 *
	 * <p>Includes recursive conversion of nested bank information. The returned entity
	 * does not have an ID set, making it suitable for new inserts.</p>
	 *
	 * @param accInfo the domain transfer object containing account data; must not be null
	 * @return an Account entity with all fields mapped from the DTO
	 */
	public Account convertToAccountEntity(AccountInformation accInfo) {

		return Account.builder()
				.accountType(accInfo.getAccountType())
				.accountBalance(accInfo.getAccountBalance())
				.accountNumber(accInfo.getAccountNumber())
				.accountStatus(accInfo.getAccountStatus())
				.bankInformation(convertToBankInfoEntity(accInfo.getBankInformation()))
				.build();
	}

	/**
	 * Converts an Address JPA entity into its corresponding domain transfer object.
	 *
	 * @param address the persisted address entity; must not be null
	 * @return an AddressDetails DTO with all address fields mapped
	 */
	public AddressDetails convertToAddressDomain(Address address) {

		return AddressDetails.builder().address1(address.getAddress1())
				.address2(address.getAddress2())
				.city(address.getCity())
				.state(address.getState())
				.zip(address.getZip())
				.country(address.getCountry())
				.build();
	}

	/**
	 * Converts an AddressDetails domain object into a JPA entity ready for persistence.
	 *
	 * @param addressDetails the domain transfer object containing address data; must not be null
	 * @return an Address entity with all fields mapped from the DTO
	 */
	public Address convertToAddressEntity(AddressDetails addressDetails) {

		return Address.builder().address1(addressDetails.getAddress1())
				.address2(addressDetails.getAddress2())
				.city(addressDetails.getCity())
				.state(addressDetails.getState())
				.zip(addressDetails.getZip())
				.country(addressDetails.getCountry())
				.build();
	}

	/**
	 * Converts a Contact JPA entity into its corresponding domain transfer object.
	 *
	 * @param contact the persisted contact entity; must not be null
	 * @return a ContactDetails DTO with all contact fields mapped
	 */
	public ContactDetails convertToContactDomain(Contact contact) {

		return ContactDetails.builder()
				.emailId(contact.getEmailId())
				.homePhone(contact.getHomePhone())
				.workPhone(contact.getWorkPhone())
				.build();
	}

	/**
	 * Converts a ContactDetails domain object into a JPA entity ready for persistence.
	 *
	 * @param contactDetails the domain transfer object containing contact data; must not be null
	 * @return a Contact entity with all fields mapped from the DTO
	 */
	public Contact convertToContactEntity(ContactDetails contactDetails) {

		return Contact.builder()
				.emailId(contactDetails.getEmailId())
				.homePhone(contactDetails.getHomePhone())
				.workPhone(contactDetails.getWorkPhone())
				.build();
	}

	/**
	 * Converts a BankInfo JPA entity into its corresponding domain transfer object.
	 *
	 * <p>Recursively converts the nested branch address entity.</p>
	 *
	 * @param bankInfo the persisted bank information entity; must not be null
	 * @return a BankInformation DTO with all fields including the branch address mapped
	 */
	public BankInformation convertToBankInfoDomain(BankInfo bankInfo) {

		return BankInformation.builder()
				.branchCode(bankInfo.getBranchCode())
				.branchName(bankInfo.getBranchName())
				.routingNumber(bankInfo.getRoutingNumber())
				.branchAddress(convertToAddressDomain(bankInfo.getBranchAddress()))
				.build();
	}

	/**
	 * Converts a BankInformation domain object into a JPA entity ready for persistence.
	 *
	 * <p>Recursively converts the nested branch address domain object.</p>
	 *
	 * @param bankInformation the domain transfer object containing bank data; must not be null
	 * @return a BankInfo entity with all fields mapped from the DTO
	 */
	public BankInfo convertToBankInfoEntity(BankInformation bankInformation) {

		return BankInfo.builder()
				.branchCode(bankInformation.getBranchCode())
				.branchName(bankInformation.getBranchName())
				.routingNumber(bankInformation.getRoutingNumber())
				.branchAddress(convertToAddressEntity(bankInformation.getBranchAddress()))
				.build();
	}

	/**
	 * Converts a Transaction JPA entity into its corresponding domain transfer object.
	 *
	 * @param transaction the persisted transaction entity; must not be null
	 * @return a TransactionDetails DTO with all transaction fields mapped
	 */
	public TransactionDetails convertToTransactionDomain(Transaction transaction) {

		return TransactionDetails.builder()
									.txAmount(transaction.getTxAmount())
									.txDateTime(transaction.getTxDateTime())
									.txType(transaction.getTxType())
									.accountNumber(transaction.getAccountNumber())
									.build();
	}

	/**
	 * Converts a TransactionDetails domain object into a JPA entity ready for persistence.
	 *
	 * @param transactionDetails the domain transfer object containing transaction data;
	 *                           must not be null
	 * @return a Transaction entity with all fields mapped from the DTO
	 */
	public Transaction convertToTransactionEntity(TransactionDetails transactionDetails) {

		return Transaction.builder()
							.txAmount(transactionDetails.getTxAmount())
							.txDateTime(transactionDetails.getTxDateTime())
							.txType(transactionDetails.getTxType())
							.accountNumber(transactionDetails.getAccountNumber())
							.build();
	}

	/**
	 * Creates a new Transaction entity from transfer details, representing one side of
	 * a fund transfer operation.
	 *
	 * <p>This factory method is used during account-to-account transfers to create
	 * the debit or credit transaction record for a specific account. The transaction
	 * timestamp will be set automatically by the entity's {@code @PrePersist} lifecycle hook.</p>
	 *
	 * @param transferDetails the transfer request containing the amount; must not be null
	 * @param accountNumber   the account number to associate the transaction with
	 * @param txType          the transaction type indicator (e.g., "debit" or "credit")
	 * @return a new Transaction entity ready to be persisted
	 */
	public Transaction createTransaction(TransferDetails transferDetails, Long accountNumber, String txType) {

		return Transaction.builder()
							.accountNumber(accountNumber)
							.txAmount(transferDetails.getTransferAmount())
							.txType(txType)
							.build();
	}
}
