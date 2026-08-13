import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCustomers } from '@/hooks/useCustomers'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Input,
  Button,
  Skeleton,
  Typography,
} from '@components/ui'

export function CustomerList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(0)
  const size = 10

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(0)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data, isLoading } = useCustomers({
    page,
    size,
    search: debouncedSearch || undefined,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="rectangular" height={40} />
        <Skeleton variant="rectangular" height={300} />
      </div>
    )
  }

  const customers = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  return (
    <div className="space-y-4" data-testid="customer-list">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
          aria-label="Search customers"
          data-testid="customer-search-input"
        />
        <Button variant="primary" onClick={() => navigate('/customers/new')} data-testid="add-customer-button">
          Add Customer
        </Button>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-12">
          <Typography variant="body" className="text-neutral-500">
            No customers found.
          </Typography>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow
                key={customer.customerNumber}
                className="cursor-pointer"
                onClick={() => navigate(`/customers/${customer.customerNumber}`)}
                data-testid={`customer-row-${customer.customerNumber}`}
              >
                <TableCell data-testid="customer-name">
                  {customer.firstName} {customer.lastName}
                </TableCell>
                <TableCell data-testid="customer-email">{customer.contactDetails?.emailId ?? '—'}</TableCell>
                <TableCell data-testid="customer-phone">{customer.contactDetails?.homePhone ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2" data-testid="customer-pagination">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            data-testid="pagination-prev"
          >
            Previous
          </Button>
          <Typography variant="caption" className="text-neutral-600">
            Page {page + 1} of {totalPages}
          </Typography>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            data-testid="pagination-next"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
