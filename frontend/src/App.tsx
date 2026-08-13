import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Container, Typography, Button } from '@components/ui'
import { CustomerListPage } from '@/pages/CustomerListPage'
import { CustomerDetailPage } from '@/pages/CustomerDetailPage'
import { CustomerCreatePage } from '@/pages/CustomerCreatePage'
import { CustomerEditPage } from '@/pages/CustomerEditPage'
import { AccountPage } from '@/pages/AccountPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-50">
        <header className="bg-white border-b border-neutral-200 py-4">
          <Container>
            <div className="flex items-center justify-between">
              <Link to="/">
                <Typography variant="h3" className="text-primary-600">
                  BankApp
                </Typography>
              </Link>
              <nav className="flex items-center gap-4">
                <Link to="/customers">
                  <Button variant="ghost" size="sm">
                    Customers
                  </Button>
                </Link>
                <Link to="/accounts">
                  <Button variant="ghost" size="sm">
                    Accounts
                  </Button>
                </Link>
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </nav>
            </div>
          </Container>
        </header>

        <main>
          <Routes>
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/customers/new" element={<CustomerCreatePage />} />
            <Route path="/customers/:customerNumber" element={<CustomerDetailPage />} />
            <Route path="/customers/:customerNumber/edit" element={<CustomerEditPage />} />
            <Route path="/accounts" element={<AccountPage />} />
            <Route path="/accounts/:accountId" element={<AccountPage />} />
            <Route
              path="/"
              element={
                <Container>
                  <div className="py-8">
                    <Typography variant="h1" className="mb-6">
                      Welcome to BankApp
                    </Typography>
                    <Typography variant="body" className="mb-8 text-neutral-600">
                      Manage your accounts, transfers, and transactions securely.
                    </Typography>
                  </div>
                </Container>
              }
            />
          </Routes>
        </main>

        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  )
}

export default App
