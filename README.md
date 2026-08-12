# BankApp

RESTful API simulating core banking operations — customer management, account lifecycle, deposits, withdrawals, and internal fund transfers.

Built with Spring Boot 3.4, Spring Security, Spring Data JPA, and an H2 in-memory database.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Java 25 |
| Framework | Spring Boot 3.4.13 |
| Security | Spring Security (HTTP Basic) |
| Persistence | Spring Data JPA + H2 (in-memory) |
| Documentation | SpringDoc OpenAPI (Swagger UI) |
| Build | Maven |
| Other | Lombok, Virtual Threads, Spring Boot Actuator |

## Prerequisites

- **Java 25** (JDK)
- **Maven 3.9+**

## Getting Started

### Build

```bash
mvn clean install
```

### Run

```bash
mvn spring-boot:run
```

The application starts on **port 8989** with context path `/bank-api`.

Base URL: `http://localhost:8989/bank-api`

### Default Credentials

The API is secured with HTTP Basic authentication.

| Username | Password |
|----------|----------|
| `bankapp` | `changeit` |

## H2 Console

Access the in-memory database console (no authentication required):

```
http://localhost:8989/bank-api/h2-console/
```

| Setting | Value |
|---------|-------|
| JDBC URL | `jdbc:h2:mem:testdb` |
| Username | `sa` |
| Password | *(empty)* |

## Swagger UI

Interactive API documentation (no authentication required):

```
http://localhost:8989/bank-api/swagger-ui/index.html
```

OpenAPI JSON spec:

```
http://localhost:8989/bank-api/v3/api-docs
```

## API Reference

All endpoints are relative to the base URL `http://localhost:8989/bank-api`.

### Public Endpoints

These endpoints are accessible without authentication:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/swagger-ui/**` | Swagger UI |
| GET | `/v3/api-docs/**` | OpenAPI specification |
| GET | `/h2-console/**` | H2 database console |

### Protected Endpoints — Customers

All customer endpoints require HTTP Basic authentication.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/customers/all` | List all customers |
| GET | `/customers/{customerNumber}` | Get customer by number |
| POST | `/customers/add` | Create a customer and initial account |
| PUT | `/customers/{customerNumber}` | Update customer details |
| DELETE | `/customers/{customerNumber}` | Delete customer and associated accounts |

### Protected Endpoints — Accounts & Transactions

All account endpoints require HTTP Basic authentication.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/accounts/{accountNumber}` | Get account details |
| POST | `/accounts/add/{customerNumber}` | Create a new account for an existing customer |
| PUT | `/accounts/transfer/{customerNumber}` | Transfer funds between customer accounts |
| GET | `/accounts/transactions/{accountNumber}` | List all transactions for an account |

## Running Tests

```bash
mvn test
```

## Project Structure

```
src/main/java/com/coding/exercise/bankapp/
├── config/             # Security and OpenAPI configuration
├── controller/         # REST controllers (Customer, Account)
├── domain/             # DTOs / request-response objects
├── model/              # JPA entities
├── repository/         # Spring Data JPA repositories
└── service/            # Business logic layer
```
