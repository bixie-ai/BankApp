import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/useCustomers'
import { Input, Button, Typography } from '@components/ui'
import { useState } from 'react'

const customerFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().optional(),
})

type CustomerFormData = z.infer<typeof customerFormSchema>

interface CustomerFormProps {
  mode: 'create' | 'edit'
  customerNumber?: number
  initialData?: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
  }
}

export function CustomerForm({ mode, customerNumber, initialData }: CustomerFormProps) {
  const navigate = useNavigate()
  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()

  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: initialData?.firstName ?? '',
    lastName: initialData?.lastName ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    address: initialData?.address ?? '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        address: initialData.address,
      })
    }
  }, [initialData])

  function handleChange(field: keyof CustomerFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    const result = customerFormSchema.shape[field].safeParse(value)
    if (result.success) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    } else {
      setErrors((prev) => ({ ...prev, [field]: result.error.issues[0]?.message }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const result = customerFormSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CustomerFormData, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CustomerFormData
        fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      contactDetails: {
        emailId: formData.email,
        homePhone: formData.phone,
      },
      customerAddress: formData.address
        ? { address1: formData.address }
        : undefined,
    }

    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(payload)
        toast.success('Customer created successfully')
      } else {
        await updateMutation.mutateAsync({ customerNumber: customerNumber!, data: payload })
        toast.success('Customer updated successfully')
      }
      navigate('/customers')
    } catch {
      toast.error(mode === 'create' ? 'Failed to create customer' : 'Failed to update customer')
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg" data-testid="customer-form">
      <Typography variant="h2">
        {mode === 'create' ? 'Create Customer' : 'Edit Customer'}
      </Typography>

      <Input
        label="First Name"
        value={formData.firstName}
        onChange={(e) => handleChange('firstName', e.target.value)}
        error={errors.firstName}
        required
        data-testid="input-first-name"
      />

      <Input
        label="Last Name"
        value={formData.lastName}
        onChange={(e) => handleChange('lastName', e.target.value)}
        error={errors.lastName}
        required
        data-testid="input-last-name"
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        required
        data-testid="input-email"
      />

      <Input
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        error={errors.phone}
        required
        data-testid="input-phone"
      />

      <Input
        label="Address"
        value={formData.address ?? ''}
        onChange={(e) => handleChange('address', e.target.value)}
        error={errors.address}
        data-testid="input-address"
      />

      <div className="flex gap-3">
        <Button type="submit" variant="primary" loading={isSubmitting} data-testid="submit-customer">
          {mode === 'create' ? 'Create' : 'Save Changes'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate('/customers')} data-testid="cancel-customer">
          Cancel
        </Button>
      </div>
    </form>
  )
}
