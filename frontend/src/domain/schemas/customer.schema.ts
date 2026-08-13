import { z } from 'zod'

/**
 * Validates customer contact information (email, phone numbers).
 * All fields are nullable/optional because contact details may be partially populated.
 */
export const ContactDetailsSchema = z.object({
  emailId: z.string().nullable().optional(),
  homePhone: z.string().nullable().optional(),
  workPhone: z.string().nullable().optional(),
})

/**
 * Validates a customer's mailing address.
 * All fields are nullable/optional to accommodate incomplete address records from legacy systems.
 */
export const AddressDetailsSchema = z.object({
  address1: z.string().nullable().optional(),
  address2: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  zip: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
})

/**
 * Validates the customer profile data shape returned by the customer API.
 * Fields are nullable/optional because customer records may be partially complete,
 * particularly when sourced from external or legacy systems.
 */
export const CustomerSchema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  middleName: z.string().nullable().optional(),
  customerNumber: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
  contactDetails: ContactDetailsSchema.nullable().optional(),
  customerAddress: AddressDetailsSchema.nullable().optional(),
})

/** Inferred TypeScript type representing a validated customer profile. */
export type CustomerDto = z.infer<typeof CustomerSchema>
