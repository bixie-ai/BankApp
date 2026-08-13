import { z } from 'zod'

export const ContactDetailsSchema = z.object({
  emailId: z.string().nullable().optional(),
  homePhone: z.string().nullable().optional(),
  workPhone: z.string().nullable().optional(),
})

export const AddressDetailsSchema = z.object({
  address1: z.string().nullable().optional(),
  address2: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  zip: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
})

export const CustomerSchema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  middleName: z.string().nullable().optional(),
  customerNumber: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
  contactDetails: ContactDetailsSchema.nullable().optional(),
  customerAddress: AddressDetailsSchema.nullable().optional(),
})

export type CustomerDto = z.infer<typeof CustomerSchema>
