import { Container, Typography } from '@components/ui'
import { CustomerList } from '@/components/customers/CustomerList'

export function CustomerListPage() {
  return (
    <Container>
      <div className="py-8">
        <Typography variant="h1" className="mb-6">
          Customers
        </Typography>
        <CustomerList />
      </div>
    </Container>
  )
}
