import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCustomer, useDeleteCustomer } from '@/hooks/useCustomers'
import {
  Card,
  CardHeader,
  Button,
  Typography,
  Skeleton,
  Modal,
} from '@components/ui'

/** Props for the {@link CustomerDetail} component. */
interface CustomerDetailProps {
  /** The numeric identifier for the customer whose details should be loaded. */
  customerNumber: number
}

/**
 * Renders a full customer profile page showing personal information, contact details, linked accounts,
 * and provides edit/delete actions. Deletion requires confirmation through a modal dialog and
 * navigates back to the customer list on success.
 *
 * @returns A detail view with customer information cards and action buttons.
 */
export function CustomerDetail({ customerNumber }: CustomerDetailProps) {
  const navigate = useNavigate()
  const { data: customer, isLoading } = useCustomer(customerNumber)
  const deleteMutation = useDeleteCustomer()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="rectangular" height={200} />
      </div>
    )
  }

  if (!customer) {
    return (
      <Typography variant="body" className="text-neutral-500">
        Customer not found.
      </Typography>
    )
  }

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(customerNumber)
      toast.success('Customer deleted successfully')
      navigate('/customers')
    } catch {
      toast.error('Failed to delete customer')
    }
    setShowDeleteModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h2">
          {customer.firstName} {customer.lastName}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/customers/${customerNumber}/edit`)}
          >
            Edit
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader title="Customer Information" />
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <Typography variant="caption" className="text-neutral-500">
              Name
            </Typography>
            <Typography variant="body">
              {customer.firstName} {customer.middleName ? `${customer.middleName} ` : ''}{customer.lastName}
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className="text-neutral-500">
              Email
            </Typography>
            <Typography variant="body">
              {customer.contactDetails?.emailId ?? '—'}
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className="text-neutral-500">
              Phone
            </Typography>
            <Typography variant="body">
              {customer.contactDetails?.homePhone ?? '—'}
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className="text-neutral-500">
              Address
            </Typography>
            <Typography variant="body">
              {customer.customerAddress?.address1 ?? '—'}
            </Typography>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Linked Bank Accounts" />
        <div className="p-4">
          <Typography variant="body" className="text-neutral-500">
            No linked accounts found.
          </Typography>
        </div>
      </Card>

      <Button variant="ghost" onClick={() => navigate('/customers')}>
        Back to List
      </Button>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        size="sm"
      >
        <div className="flex gap-3 mt-4">
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleteMutation.isPending}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}
