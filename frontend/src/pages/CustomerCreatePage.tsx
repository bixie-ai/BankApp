import { Container } from '@components/ui'
import { CustomerForm } from '@/components/customers/CustomerForm'

export function CustomerCreatePage() {
  return (
    <Container>
      <div className="py-8">
        <CustomerForm mode="create" />
      </div>
    </Container>
  )
}
