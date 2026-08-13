import type { ReactNode } from 'react'
import { useAuthStore } from '@infrastructure/api/auth.store'

/** Props for the {@link AuthGuard} component. */
interface AuthGuardProps {
  /** Content rendered when the user is authenticated. */
  children: ReactNode
  /** Content rendered when the user is not authenticated (e.g., a login page). */
  fallback: ReactNode
}

/**
 * Conditionally renders its children based on authentication state.
 * When the user is not authenticated, the fallback UI (typically a login page)
 * is displayed instead. Uses the auth store to determine current auth status.
 *
 * @returns Either the protected children or the unauthenticated fallback.
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
