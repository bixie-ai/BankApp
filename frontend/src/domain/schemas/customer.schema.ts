import { z } from 'zod'

export const CustomerSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  dateOfBirth: z.string().date(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type CustomerDto = z.infer<typeof CustomerSchema>
