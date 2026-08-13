import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryProvider } from '@application/providers'
import { StoreProvider } from '@application/providers'
import './index.css'
import App from './App.tsx'

/**
 * Application entry point that mounts the React tree into the DOM,
 * wrapping the App in StrictMode, QueryProvider, and StoreProvider.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </QueryProvider>
  </StrictMode>,
)
