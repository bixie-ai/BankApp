/**
 * Public API for the infrastructure/api module.
 *
 * Re-exports the configured HTTP client, the global auth store, and all
 * domain-specific service objects so consumers can import from a single path.
 */
export { apiClient } from './client'
export { useAuthStore } from './auth.store'
export { customerService } from './services/customer.service'
export { accountService } from './services/account.service'
