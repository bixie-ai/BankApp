import { useParams } from 'react-router-dom'
import { Container } from '@components/ui'
import { CustomerDetail } from '@/components/customers/CustomerDetail'

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
