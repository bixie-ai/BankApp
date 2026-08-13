export interface ContactDetails {
  emailId?: string | null
  homePhone?: string | null
  workPhone?: string | null
}

export interface AddressDetails {
  address1?: string | null
  address2?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country?: string | null
}

export interface Customer {
  firstName?: string | null
  lastName?: string | null
  middleName?: string | null
  customerNumber?: number | null
  status?: string | null
  contactDetails?: ContactDetails | null
  customerAddress?: AddressDetails | null
}
