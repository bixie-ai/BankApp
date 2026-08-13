import { useParams } from 'react-router-dom'
import { Container } from '@components/ui'
import { CustomerDetail } from '@/components/customers/CustomerDetail'

/**
 * Page displaying the full details of a single customer.
 * Reads the `customerNumber` route parameter and passes it to the CustomerDetail component.
 *
 * @returns The customer detail view within a standard page container.
 */
export function CustomerDetailPage() {
  const { customerNumber } = useParams<{ customerNumber: string }>()

  return (
    <Container>
      <div className="py-8">
        <CustomerDetail customerNumber={Number(customerNumber)} />
      </div>
    </Container>
  )
}
