import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Typography, Button } from '@components/ui'
import { AccountDetail } from '@/components/accounts/AccountDetail'
import { TransactionHistory } from '@/components/accounts/TransactionHistory'
import { CreateAccountForm } from '@/components/accounts/CreateAccountForm'

type ActiveView = 'details' | 'create'

export function AccountPage() {
  const { accountId } = useParams<{ accountId: string }>()
  const [activeView, setActiveView] = useState<ActiveView>(accountId ? 'details' : 'create')

  return (
    <Container>
      <div className="py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Typography variant="h1">Account Management</Typography>
          <div className="flex gap-2">
            {accountId && (
              <Button
                variant={activeView === 'details' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveView('details')}
              >
                Account Details
              </Button>
            )}
            <Button
              variant={activeView === 'create' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveView('create')}
            >
              New Account
            </Button>
          </div>
        </div>

        {activeView === 'details' && accountId && (
          <div className="space-y-6">
            <AccountDetail accountId={accountId} />
            <TransactionHistory accountId={accountId} />
          </div>
        )}

        {activeView === 'create' && (
          <CreateAccountForm onSuccess={() => setActiveView('details')} />
        )}
      </div>
    </Container>
  )
}
