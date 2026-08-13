package com.coding.exercise.bankapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the BankApp Spring Boot application.
 *
 * <p>Bootstraps the Spring context with auto-configuration, component scanning,
 * and virtual thread support for handling concurrent banking operations.</p>
 */
@SpringBootApplication
public class BankingApplication {

	/**
	 * Launches the embedded server and initializes all Spring-managed beans.
	 *
	 * @param args command-line arguments forwarded to the Spring environment
	 */
	public static void main(String[] args) {
		SpringApplication.run(BankingApplication.class, args);
	}

}
