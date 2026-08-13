import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

/** Props for the {@link QueryProvider} component. */
interface QueryProviderProps {
  children: ReactNode
}

/**
 * Provides the TanStack React Query client to the component tree.
 * Configures default query behavior: 5-minute stale time and a single retry on failure.
 *
 * @returns The QueryClientProvider wrapper around child components.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
