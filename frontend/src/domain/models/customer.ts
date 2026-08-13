/** Communication channels for reaching a customer. */
export interface ContactDetails {
  /** Primary email address. */
  emailId?: string | null
  /** Residential phone number. */
  homePhone?: string | null
  /** Business phone number. */
  workPhone?: string | null
}

/** Physical mailing address for a customer. */
export interface AddressDetails {
  /** Street address line 1. */
  address1?: string | null
  /** Street address line 2 (apartment, suite, etc.). */
  address2?: string | null
  /** City or locality name. */
  city?: string | null
  /** State or province code. */
  state?: string | null
  /** Postal / ZIP code. */
  zip?: string | null
  /** ISO country code or full country name. */
  country?: string | null
}

/** Core customer profile containing identity, status, and contact information. */
export interface Customer {
  /** Customer's given name. */
  firstName?: string | null
  /** Customer's family name. */
  lastName?: string | null
  /** Customer's middle name or initial. */
  middleName?: string | null
  /** System-assigned numeric identifier for the customer. */
  customerNumber?: number | null
  /** Current enrollment status (e.g., "ACTIVE", "SUSPENDED"). */
  status?: string | null
  /** Phone and email contact information. */
  contactDetails?: ContactDetails | null
  /** Physical mailing address on file. */
  customerAddress?: AddressDetails | null
}
