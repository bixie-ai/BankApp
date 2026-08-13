import { useState } from 'react'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useCreateAccount } from '@/hooks/useCreateAccount'
import { Input, Select, Button, Typography } from '@components/ui'

const createAccountSchema = z.object({
  customerNumber: z.string().min(1, 'Customer number is required').regex(/^\d+$/, 'Must be a valid number'),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT'], { required_error: 'Account type is required' }),
  currency: z.string().min(1, 'Currency is required'),
})

type CreateAccountFormData = z.infer<typeof createAccountSchema>

/** Props for the {@link CreateAccountForm} component. */
interface CreateAccountFormProps {
  /** Optional callback invoked after an account is successfully created, useful for closing modals or refreshing lists. */
  onSuccess?: () => void
}

const accountTypeOptions = [
  { value: 'CHECKING', label: 'Checking' },
  { value: 'SAVINGS', label: 'Savings' },
  { value: 'CREDIT', label: 'Credit' },
]

const currencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
]

/**
 * Renders a form for creating a new bank account, with fields for customer number, account type, and currency.
 * Validates input with Zod on change and on submit, and displays toast notifications for success or failure.
 *
 * @returns A validated form that submits a new account creation request to the API.
 */
export function CreateAccountForm({ onSuccess }: CreateAccountFormProps) {
  const createMutation = useCreateAccount()

  const [formData, setFormData] = useState<CreateAccountFormData>({
    customerNumber: '',
    type: 'CHECKING',
    currency: 'USD',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CreateAccountFormData, string>>>({})

  function handleChange(field: keyof CreateAccountFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    const schema = createAccountSchema.shape[field]
    const result = schema.safeParse(value)
    if (result.success) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    } else {
      setErrors((prev) => ({ ...prev, [field]: result.error.issues[0]?.message }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const result = createAccountSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CreateAccountFormData, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateAccountFormData
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    try {
      await createMutation.mutateAsync({
        customerNumber: Number(result.data.customerNumber),
        type: result.data.type,
        currency: result.data.currency,
      })
      toast.success('Account created successfully')
      setFormData({ customerNumber: '', type: 'CHECKING', currency: 'USD' })
      setErrors({})
      onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create account'
      toast.error(message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg" noValidate data-testid="create-account-form">
      <Typography variant="h2">Create New Account</Typography>

      <Input
        label="Customer Number"
        value={formData.customerNumber}
        onChange={(e) => handleChange('customerNumber', e.target.value)}
        error={errors.customerNumber}
        placeholder="Enter customer number"
        required
        data-testid="input-customer-number"
      />

      <Select
        label="Account Type"
        options={accountTypeOptions}
        value={formData.type}
        onChange={(e) => handleChange('type', e.target.value)}
        error={errors.type}
        required
        data-testid="select-account-type"
      />

      <Select
        label="Currency"
        options={currencyOptions}
        value={formData.currency}
        onChange={(e) => handleChange('currency', e.target.value)}
        error={errors.currency}
        required
        data-testid="select-currency"
      />

      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          loading={createMutation.isPending}
          disabled={createMutation.isPending}
          data-testid="submit-create-account"
        >
          Create Account
        </Button>
      </div>
    </form>
  )
}
