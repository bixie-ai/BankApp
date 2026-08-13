import type { ReactNode } from 'react'
import { useAuthStore } from '@infrastructure/api/auth.store'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
