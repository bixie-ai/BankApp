import type { ReactNode } from 'react'

/** Props for the {@link StoreProvider} component. */
interface StoreProviderProps {
  children: ReactNode
}

/**
 * Placeholder provider for global application state.
 * Currently renders children directly; intended as the integration point
 * for a future state management solution (e.g., Zustand store context).
 *
 * @returns The children unchanged.
 */
export function StoreProvider({ children }: StoreProviderProps) {
  return <>{children}</>
}
