import { useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import {
  Card,
  CardHeader,
  Typography,
  Skeleton,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@components/ui'
import { formatCurrency } from '@utils/format-currency'
import { formatDate } from '@utils/format-date'

/** Props for the {@link TransactionHistory} component. */
interface TransactionHistoryProps {
  /** The account identifier whose transactions should be fetched and displayed. */
  accountId: string
}

const PAGE_SIZE = 10

/**
 * Displays a paginated table of transactions for a given account, including date, description,
 * signed amount, and a computed running balance. Supports page navigation and handles
 * loading, error, and empty states gracefully.
 *
 * @returns A card containing a transaction table with pagination controls.
 */
export function TransactionHistory({ accountId }: TransactionHistoryProps) {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError, error, refetch } = useTransactions({
    accountId,
    page,
    size: PAGE_SIZE,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Transaction History" />
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} variant="rectangular" height={40} />
          ))}
        </div>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader title="Transaction History" />
        <div className="text-center py-6">
          <Typography variant="body" className="text-error mb-4">
            {error instanceof Error ? error.message : 'Failed to load transactions.'}
          </Typography>
          <Button variant="secondary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  if (!data || data.content.length === 0) {
    return (
      <Card>
        <CardHeader title="Transaction History" />
        <div className="py-6 text-center">
          <Typography variant="body" className="text-neutral-500">
            No transactions found for this period.
          </Typography>
        </div>
      </Card>
    )
  }

  let runningBalance = 0
  const rows = data.content.map((tx) => {
    const signed = tx.type === 'WITHDRAWAL' ? -tx.amount : tx.amount
    runningBalance += signed
    return { ...tx, runningBalance }
  })

  return (
    <Card padding="none" data-testid="transaction-history">
      <div className="p-6 pb-0">
        <CardHeader
          title="Transaction History"
          description={`Page ${data.number + 1} of ${data.totalPages}`}
        />
      </div>
      <Table aria-label="Transaction history">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Running Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((tx) => (
            <TableRow key={tx.id} data-testid={`transaction-row-${tx.id}`}>
              <TableCell>{formatDate(tx.createdAt)}</TableCell>
              <TableCell data-testid="transaction-description">{tx.description}</TableCell>
              <TableCell>
                <span className={tx.type === 'WITHDRAWAL' ? 'text-error' : 'text-green-700'}>
                  {tx.type === 'WITHDRAWAL' ? '-' : '+'}
                  {formatCurrency(tx.amount, tx.currency)}
                </span>
              </TableCell>
              <TableCell>{formatCurrency(tx.runningBalance, tx.currency)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between p-4 border-t border-neutral-200">
        <Button
          variant="secondary"
          size="sm"
          disabled={data.first}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <Typography variant="caption" className="text-neutral-500">
          {data.totalElements} total transactions
        </Typography>
        <Button
          variant="secondary"
          size="sm"
          disabled={data.last}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </Card>
  )
}
