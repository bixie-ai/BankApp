import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthGuard } from '@presentation/components/AuthGuard'
import { useAuthStore } from '@infrastructure/api/auth.store'

describe('AuthGuard', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, credentials: null })
  })

  it('should render fallback when not authenticated', () => {
    render(
      <AuthGuard fallback={<div>Login Page</div>}>
        <div>Protected Content</div>
      </AuthGuard>,
    )
    expect(screen.getByText('Login Page')).toBeDefined()
    expect(screen.queryByText('Protected Content')).toBeNull()
  })

  it('should render children when authenticated', () => {
    useAuthStore.setState({ isAuthenticated: true })
    render(
      <AuthGuard fallback={<div>Login Page</div>}>
        <div>Protected Content</div>
      </AuthGuard>,
    )
    expect(screen.getByText('Protected Content')).toBeDefined()
    expect(screen.queryByText('Login Page')).toBeNull()
  })
})
