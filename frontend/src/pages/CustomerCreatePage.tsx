import { Container } from '@components/ui'
import { CustomerForm } from '@/components/customers/CustomerForm'

/**
 * Page for creating a new customer record.
 * Renders the shared CustomerForm in "create" mode within a standard page container.
 *
 * @returns The customer creation form wrapped in page layout.
 */
export function CustomerCreatePage() {
  return (
    <Container>
      <div className="py-8">
        <CustomerForm mode="create" />
      </div>
    </Container>
  )
}
