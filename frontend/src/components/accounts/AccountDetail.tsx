import { useAccount } from '@/hooks/useAccount'
import { Card, CardHeader, Typography, Skeleton, Badge, Button } from '@components/ui'
import { formatCurrency } from '@utils/format-currency'

interface AccountDetailProps {
  accountId: string
}

export function AccountDetail({ accountId }: AccountDetailProps) {
  const { data, isLoading, isError, error, refetch } = useAccount(accountId)

  if (isLoading) {
    return (
      <Card>
        <div className="space-y-4">
          <Skeleton variant="text" width="40%" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton variant="rectangular" height={48} />
            <Skeleton variant="rectangular" height={48} />
            <Skeleton variant="rectangular" height={48} />
            <Skeleton variant="rectangular" height={48} />
          </div>
        </div>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <div className="text-center py-6">
          <Typography variant="body" className="text-error mb-4">
            {error instanceof Error ? error.message : 'Failed to load account details.'}
          </Typography>
          <Button variant="secondary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <Typography variant="body" className="text-neutral-500">
          Account not found.
        </Typography>
      </Card>
    )
  }

  const account = data.data

  return (
    <Card>
      <CardHeader
        title="Account Details"
        action={<StatusBadge status={account.status} />}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Typography variant="caption" className="text-neutral-500">
            Account Number
          </Typography>
          <Typography variant="body">{account.accountNumber}</Typography>
        </div>
        <div>
          <Typography variant="caption" className="text-neutral-500">
            Type
          </Typography>
          <Typography variant="body">{account.type}</Typography>
        </div>
        <div>
          <Typography variant="caption" className="text-neutral-500">
            Status
          </Typography>
          <Typography variant="body">{account.status}</Typography>
        </div>
        <div>
          <Typography variant="caption" className="text-neutral-500">
            Current Balance
          </Typography>
          <Typography variant="h3">
            {formatCurrency(account.balance, account.currency)}
          </Typography>
        </div>
      </div>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variant = status === 'ACTIVE' ? 'success' : status === 'CLOSED' ? 'error' : 'warning'
  return <Badge variant={variant}>{status}</Badge>
}
