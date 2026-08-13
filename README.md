# BankApp

Full-stack banking application simulating core banking operations — customer management, account lifecycle, deposits, withdrawals, and internal fund transfers.

**Backend:** Spring Boot 3.4 REST API with Spring Security, JPA, and H2 in-memory database.
**Frontend:** React 19 SPA with TypeScript, TanStack Query, Zustand, and Tailwind CSS.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        React Frontend (Vite)                         │
│  Pages → Components → Hooks → Infrastructure/API → Axios HTTP Client│
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTP (port 5173 → proxy → 8989)
┌──────────────────────────────▼──────────────────────────────────────┐
│                     Spring Boot Backend                              │
│  Controllers → Services → Repositories → H2 In-Memory Database      │
└─────────────────────────────────────────────────────────────────────┘
```

### Backend Structure

```
src/main/java/com/coding/exercise/bankapp/
├── config/             # Security (HTTP Basic) and OpenAPI configuration
├── controller/         # REST controllers — Customer, Account
├── domain/             # DTOs / request-response objects
├── model/              # JPA entities (Account, Customer, Transaction, etc.)
├── repository/         # Spring Data JPA repositories
└── service/            # Business logic layer + helper mappers
```

### Frontend Structure

```
frontend/src/
├── application/        # Providers (QueryClient, Store)
├── components/
│   ├── accounts/       # AccountDetail, CreateAccountForm, TransactionHistory
│   ├── customers/      # CustomerDetail, CustomerForm, CustomerList
│   └── ui/             # Reusable design system (Button, Card, Modal, Table, etc.)
├── domain/
│   ├── models/         # TypeScript interfaces (Account, Customer, Transaction)
│   └── schemas/        # Zod validation schemas
├── hooks/              # React Query hooks (useAccount, useCustomers, etc.)
├── infrastructure/
│   └── api/            # Axios client, auth store, service modules
├── lib/                # Utility helpers (cn for classnames)
├── pages/              # Route-level page components
├── presentation/       # Cross-cutting UI logic (AuthGuard)
└── utils/              # Formatting utilities (currency, date)
```

---

## Tech Stack

| Layer | Backend | Frontend |
|-------|---------|----------|
| Language | Java 25 | TypeScript 6 |
| Framework | Spring Boot 3.4.13 | React 19 + Vite 8 |
| State Management | — | Zustand + TanStack Query |
| Styling | — | Tailwind CSS 4 |
| Validation | — | Zod 4 |
| HTTP Client | — | Axios |
| Security | Spring Security (HTTP Basic) | Auth store (Zustand) |
| Persistence | Spring Data JPA + H2 | — |
| API Docs | SpringDoc OpenAPI (Swagger UI) | — |
| Build | Maven | Vite |
| Testing | JUnit 5, Mockito, Spring Test | Vitest, Testing Library, MSW, Playwright |

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Java JDK | 25+ | Backend compilation and runtime |
| Maven | 3.9+ | Backend dependency management and build |
| Node.js | 20+ | Frontend toolchain |
| npm | 10+ | Frontend package management |

---

## Quick Start (Both Services)

```bash
# 1. Clone the repository
git clone <repository-url>
cd BankApp

# 2. Start the backend (terminal 1)
mvn clean install
mvn spring-boot:run

# 3. Start the frontend (terminal 2)
cd frontend
npm install
npm run dev
```

- **Backend API:** http://localhost:8989/bank-api
- **Frontend app:** http://localhost:5173
- **Swagger UI:** http://localhost:8989/bank-api/swagger-ui/index.html

---

## Backend Setup

### Environment Configuration

The backend uses `src/main/resources/application.yml` for configuration. Default values work out of the box for local development:

| Property | Default | Description |
|----------|---------|-------------|
| `server.port` | `8989` | HTTP server port |
| `server.servlet.context-path` | `/bank-api` | API base path |
| `spring.security.user.name` | `bankapp` | HTTP Basic auth username |
| `spring.security.user.password` | `changeit` | HTTP Basic auth password |
| `spring.h2.console.enabled` | `true` | Enable H2 database console |
| `spring.threads.virtual.enabled` | `true` | Enable virtual threads (Project Loom) |

### Build and Run

```bash
# Build (compiles + runs tests)
mvn clean install

# Run the application
mvn spring-boot:run

# Run tests only
mvn test

# Skip tests during build
mvn clean install -DskipTests
```

The application starts on **port 8989** with context path `/bank-api`.

### Default Credentials

| Username | Password |
|----------|----------|
| `bankapp` | `changeit` |

All protected endpoints require HTTP Basic authentication with these credentials.

### H2 Database Console

Access the in-memory database UI at:

```
http://localhost:8989/bank-api/h2-console/
```

| Setting | Value |
|---------|-------|
| JDBC URL | `jdbc:h2:mem:testdb` |
| Username | `sa` |
| Password | *(empty)* |

### Swagger UI / OpenAPI

Interactive API documentation:

```
http://localhost:8989/bank-api/swagger-ui/index.html
```

OpenAPI JSON spec:

```
http://localhost:8989/bank-api/v3/api-docs
```

---

## Frontend Setup

### Environment Configuration

Create a `.env` file in the `frontend/` directory (or copy from `.env.example`):

```bash
cd frontend
cp .env.example .env   # if .env.example exists, or create manually
```

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/bank-api` | Backend API base path for Axios client |

### Install and Run

```bash
cd frontend

# Install dependencies
npm install

# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server starts on **port 5173** and proxies API requests to the backend.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Lint source with ESLint |
| `npm run format` | Format source with Prettier |
| `npm test` | Run all Vitest tests |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests only |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:watch` | Run Vitest in watch mode |

---

## API Reference

All endpoints are relative to `http://localhost:8989/bank-api`.

### Public Endpoints (no authentication)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/swagger-ui/**` | Swagger UI |
| GET | `/v3/api-docs/**` | OpenAPI specification |
| GET | `/h2-console/**` | H2 database console |

### Customers (requires HTTP Basic auth)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/customers/all?page=0&size=10&search=` | List customers (paginated, searchable) |
| GET | `/customers/{customerNumber}` | Get customer by number |
| POST | `/customers/add` | Create customer |
| PUT | `/customers/{customerNumber}` | Update customer details |
| DELETE | `/customers/{customerNumber}` | Delete customer and associated accounts |

### Accounts & Transactions (requires HTTP Basic auth)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/accounts/{accountNumber}` | Get account details |
| POST | `/accounts/add/{customerNumber}` | Create account for existing customer |
| PUT | `/accounts/transfer/{customerNumber}` | Transfer funds between accounts |
| GET | `/accounts/transactions/{accountNumber}` | List transactions for account |

---

## Running Tests

### Backend Tests

```bash
# All tests (unit + integration)
mvn test

# Specific test class
mvn test -Dtest=BankingServiceImplTest

# With verbose output
mvn test -Dsurefire.useFile=false
```

### Frontend Tests

```bash
cd frontend

# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests (requires backend running)
npm run test:e2e

# Watch mode
npm run test:watch
```

---

## Development Workflow

1. Start the backend: `mvn spring-boot:run` (from project root)
2. Start the frontend: `npm run dev` (from `frontend/`)
3. Open http://localhost:5173 in your browser
4. The frontend proxies `/bank-api` requests to `localhost:8989`
5. Use Swagger UI at http://localhost:8989/bank-api/swagger-ui/index.html for API exploration

---

## License

See [LICENSE](./LICENSE) for details.
