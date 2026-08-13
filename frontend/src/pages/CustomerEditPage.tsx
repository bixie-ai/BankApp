import { useParams } from 'react-router-dom'
import { Container, Skeleton } from '@components/ui'
import { CustomerForm } from '@/components/customers/CustomerForm'
import { useCustomer } from '@/hooks/useCustomers'

/**
 * Page for editing an existing customer's information.
 * Fetches the customer by the `customerNumber` route parameter, shows a loading
 * skeleton while data is in flight, then renders the CustomerForm pre-filled
 * with the customer's current data.
 *
 * @returns A loading skeleton or the pre-populated customer edit form.
 */
export function CustomerEditPage() {
  const { customerNumber } = useParams<{ customerNumber: string }>()
  const num = Number(customerNumber)
  const { data: customer, isLoading } = useCustomer(num)

  if (isLoading) {
    return (
      <Container>
        <div className="py-8">
          <Skeleton variant="rectangular" height={400} />
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-8">
        <CustomerForm
          mode="edit"
          customerNumber={num}
          initialData={
            customer
              ? {
                  firstName: customer.firstName ?? '',
                  lastName: customer.lastName ?? '',
                  email: customer.contactDetails?.emailId ?? '',
                  phone: customer.contactDetails?.homePhone ?? '',
                  address: customer.customerAddress?.address1 ?? '',
                }
              : undefined
          }
        />
      </div>
    </Container>
  )
}
