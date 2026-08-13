import { Container, Typography } from '@components/ui'
import { CustomerList } from '@/components/customers/CustomerList'

/**
 * Page displaying the searchable, paginated list of all customers.
 * Serves as the main entry point for customer browsing and navigation.
 *
 * @returns The customer list with a page heading inside a standard container.
 */
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
