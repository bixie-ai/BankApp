import { http, HttpResponse } from 'msw'

const BASE_URL = '/bank-api'

export const mockCustomers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    middleName: null,
    customerNumber: 1001,
    status: 'ACTIVE',
    contactDetails: {
      emailId: 'john.doe@example.com',
      homePhone: '+1-555-0101',
      workPhone: null,
    },
    customerAddress: {
      address1: '123 Main St',
      address2: null,
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
      country: 'US',
    },
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    middleName: 'Marie',
    customerNumber: 1002,
    status: 'ACTIVE',
    contactDetails: {
      emailId: 'jane.smith@example.com',
      homePhone: '+1-555-0102',
      workPhone: '+1-555-0200',
    },
    customerAddress: {
      address1: '456 Oak Ave',
      address2: 'Apt 2B',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
      country: 'US',
    },
  },
]

export const mockAccounts = [
  {
    id: 'acc-001',
    customerId: 'cust-1001',
    accountNumber: '9876543210',
    type: 'CHECKING' as const,
    status: 'ACTIVE' as const,
    balance: 5250.75,
    currency: 'USD',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-01T08:30:00Z',
  },
  {
    id: 'acc-002',
    customerId: 'cust-1001',
    accountNumber: '1234567890',
    type: 'SAVINGS' as const,
    status: 'ACTIVE' as const,
    balance: 12000.0,
    currency: 'USD',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-06-01T08:30:00Z',
  },
]

export const mockTransactions = [
  {
    id: 'tx-001',
    accountId: 'acc-001',
    type: 'DEPOSIT' as const,
    status: 'COMPLETED' as const,
    amount: 1500.0,
    currency: 'USD',
    description: 'Payroll deposit',
    referenceNumber: 'REF-001',
    createdAt: '2024-06-01T09:00:00Z',
  },
  {
    id: 'tx-002',
    accountId: 'acc-001',
    type: 'WITHDRAWAL' as const,
    status: 'COMPLETED' as const,
    amount: 200.0,
    currency: 'USD',
    description: 'ATM withdrawal',
    referenceNumber: 'REF-002',
    createdAt: '2024-06-02T14:30:00Z',
  },
  {
    id: 'tx-003',
    accountId: 'acc-001',
    type: 'TRANSFER' as const,
    status: 'COMPLETED' as const,
    amount: 500.0,
    currency: 'USD',
    description: 'Transfer to savings',
    referenceNumber: 'REF-003',
    createdAt: '2024-06-03T11:00:00Z',
  },
]

export const handlers = [
  http.get(`${BASE_URL}/customers/all`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    const page = Number(url.searchParams.get('page') ?? '0')
    const size = Number(url.searchParams.get('size') ?? '10')

    let filtered = mockCustomers
    if (search) {
      const lower = search.toLowerCase()
      filtered = mockCustomers.filter(
        (c) =>
          c.firstName.toLowerCase().includes(lower) ||
          c.lastName.toLowerCase().includes(lower) ||
          c.contactDetails.emailId?.toLowerCase().includes(lower),
      )
    }

    const start = page * size
    const content = filtered.slice(start, start + size)

    return HttpResponse.json({
      content,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size,
      first: page === 0,
      last: start + size >= filtered.length,
    })
  }),

  http.get(`${BASE_URL}/customers/:customerNumber`, ({ params }) => {
    const customerNumber = Number(params.customerNumber)
    const customer = mockCustomers.find((c) => c.customerNumber === customerNumber)
    if (!customer) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(customer)
  }),

  http.post(`${BASE_URL}/customers/add`, () => {
    return HttpResponse.json('New Customer created successfully.')
  }),

  http.put(`${BASE_URL}/customers/:customerNumber`, () => {
    return HttpResponse.json('Success: Customer updated.')
  }),

  http.delete(`${BASE_URL}/customers/:customerNumber`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(`${BASE_URL}/accounts/:accountId`, ({ params }) => {
    const account = mockAccounts.find((a) => a.id === params.accountId)
    if (!account) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json({
      success: true,
      data: account,
      message: 'OK',
      timestamp: '2024-06-01T00:00:00Z',
    })
  }),

  http.get(`${BASE_URL}/customers/:customerId/accounts`, () => {
    return HttpResponse.json({
      success: true,
      data: mockAccounts,
      message: 'OK',
      timestamp: '2024-06-01T00:00:00Z',
    })
  }),

  http.get(`${BASE_URL}/accounts/:accountId/transactions`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '0')
    const size = Number(url.searchParams.get('size') ?? '10')

    const start = page * size
    const content = mockTransactions.slice(start, start + size)

    return HttpResponse.json({
      content,
      totalElements: mockTransactions.length,
      totalPages: Math.ceil(mockTransactions.length / size),
      number: page,
      size,
      first: page === 0,
      last: start + size >= mockTransactions.length,
    })
  }),

  http.post(`${BASE_URL}/accounts/add/:customerNumber`, () => {
    const newAccount = {
      id: 'acc-new',
      customerId: 'cust-new',
      accountNumber: '5555555555',
      type: 'CHECKING' as const,
      status: 'ACTIVE' as const,
      balance: 0,
      currency: 'USD',
      createdAt: '2024-06-15T10:00:00Z',
      updatedAt: '2024-06-15T10:00:00Z',
    }
    return HttpResponse.json({
      success: true,
      data: newAccount,
      message: 'Account created',
      timestamp: '2024-06-15T10:00:00Z',
    })
  }),
]
