import { Container, Typography, Card, CardHeader, Button, Grid } from '@components/ui'

function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 py-4">
        <Container>
          <div className="flex items-center justify-between">
            <Typography variant="h3" className="text-primary-600">
              BankApp
            </Typography>
            <Button variant="primary" size="sm">
              Sign In
            </Button>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          <Typography variant="h1" className="mb-6">
            Welcome to BankApp
          </Typography>
          <Typography variant="body" className="mb-8 text-neutral-600">
            Manage your accounts, transfers, and transactions securely.
          </Typography>

          <Grid cols={3} gap="md">
            <Card>
              <CardHeader
                title="Accounts"
                description="View and manage your bank accounts"
              />
              <Button variant="secondary" size="sm">
                View Accounts
              </Button>
            </Card>
            <Card>
              <CardHeader
                title="Transfers"
                description="Send money between accounts"
              />
              <Button variant="secondary" size="sm">
                New Transfer
              </Button>
            </Card>
            <Card>
              <CardHeader
                title="Transactions"
                description="Review your recent transactions"
              />
              <Button variant="secondary" size="sm">
                View History
              </Button>
            </Card>
          </Grid>
        </Container>
      </main>
    </div>
  )
}

export default App
