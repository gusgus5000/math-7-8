// Stripe test fixtures for consistent test data

export const mockCustomer = {
  id: 'cus_test123',
  object: 'customer',
  email: 'test@example.com',
  created: 1234567890,
  metadata: {
    userId: 'user_123',
  },
}

export const mockSubscription = {
  id: 'sub_test123',
  object: 'subscription',
  customer: 'cus_test123',
  status: 'active',
  current_period_start: 1234567890,
  current_period_end: 1237159890,
  created: 1234567890,
  items: {
    object: 'list',
    data: [{
      id: 'si_test123',
      object: 'subscription_item',
      price: {
        id: 'price_monthly',
        object: 'price',
        active: true,
        currency: 'usd',
        product: 'prod_test123',
        unit_amount: 999,
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
      },
      quantity: 1,
    }],
  },
}

export const mockPrices = {
  monthly: {
    id: 'price_monthly',
    object: 'price',
    active: true,
    currency: 'usd',
    product: 'prod_test123',
    unit_amount: 999,
    recurring: {
      interval: 'month',
      interval_count: 1,
    },
  },
  annual: {
    id: 'price_annual',
    object: 'price',
    active: true,
    currency: 'usd',
    product: 'prod_test123',
    unit_amount: 9900,
    recurring: {
      interval: 'year',
      interval_count: 1,
    },
  },
}

export const mockCheckoutSession = {
  id: 'cs_test_123',
  object: 'checkout.session',
  customer: 'cus_test123',
  customer_email: 'test@example.com',
  payment_status: 'paid',
  status: 'complete',
  subscription: 'sub_test123',
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel',
  metadata: {
    userId: 'user_123',
  },
}

export const mockInvoice = {
  id: 'in_test123',
  object: 'invoice',
  customer: 'cus_test123',
  subscription: 'sub_test123',
  status: 'paid',
  total: 999,
  currency: 'usd',
  period_start: 1234567890,
  period_end: 1237159890,
  lines: {
    object: 'list',
    data: [{
      id: 'il_test123',
      object: 'line_item',
      amount: 999,
      currency: 'usd',
      description: 'MathMinds Premium Monthly',
      price: mockPrices.monthly,
    }],
  },
}

// Webhook event fixtures
export const webhookEvents = {
  checkoutComplete: {
    id: 'evt_test_checkout_complete',
    object: 'event',
    type: 'checkout.session.completed',
    created: 1234567890,
    data: {
      object: mockCheckoutSession,
    },
  },
  
  subscriptionCreated: {
    id: 'evt_test_sub_created',
    object: 'event',
    type: 'customer.subscription.created',
    created: 1234567890,
    data: {
      object: mockSubscription,
    },
  },
  
  subscriptionUpdated: {
    id: 'evt_test_sub_updated',
    object: 'event',
    type: 'customer.subscription.updated',
    created: 1234567890,
    data: {
      object: {
        ...mockSubscription,
        status: 'past_due',
      },
      previous_attributes: {
        status: 'active',
      },
    },
  },
  
  subscriptionDeleted: {
    id: 'evt_test_sub_deleted',
    object: 'event',
    type: 'customer.subscription.deleted',
    created: 1234567890,
    data: {
      object: {
        ...mockSubscription,
        status: 'canceled',
      },
    },
  },
  
  paymentFailed: {
    id: 'evt_test_payment_failed',
    object: 'event',
    type: 'invoice.payment_failed',
    created: 1234567890,
    data: {
      object: {
        ...mockInvoice,
        status: 'open',
        payment_intent: {
          id: 'pi_test123',
          status: 'requires_payment_method',
          last_payment_error: {
            code: 'card_declined',
            message: 'Your card was declined.',
          },
        },
      },
    },
  },
  
  customerUpdated: {
    id: 'evt_test_customer_updated',
    object: 'event',
    type: 'customer.updated',
    created: 1234567890,
    data: {
      object: {
        ...mockCustomer,
        email: 'newemail@example.com',
      },
      previous_attributes: {
        email: 'test@example.com',
      },
    },
  },
}

// Error scenarios
export const stripeErrors = {
  cardDeclined: {
    type: 'StripeCardError',
    code: 'card_declined',
    message: 'Your card was declined.',
    decline_code: 'generic_decline',
  },
  
  insufficientFunds: {
    type: 'StripeCardError',
    code: 'card_declined',
    message: 'Your card has insufficient funds.',
    decline_code: 'insufficient_funds',
  },
  
  expiredCard: {
    type: 'StripeCardError',
    code: 'expired_card',
    message: 'Your card has expired.',
  },
  
  invalidApiKey: {
    type: 'StripeAuthenticationError',
    message: 'Invalid API Key provided',
  },
  
  rateLimitError: {
    type: 'StripeRateLimitError',
    message: 'Too many requests made to the API too quickly',
  },
  
  networkError: {
    type: 'StripeConnectionError',
    message: 'Network communication with Stripe failed',
  },
}

// Helper functions for tests
export function createMockStripeClient() {
  return {
    customers: {
      create: jest.fn().mockResolvedValue(mockCustomer),
      retrieve: jest.fn().mockResolvedValue(mockCustomer),
      update: jest.fn().mockResolvedValue(mockCustomer),
      del: jest.fn().mockResolvedValue({ deleted: true }),
    },
    
    subscriptions: {
      create: jest.fn().mockResolvedValue(mockSubscription),
      retrieve: jest.fn().mockResolvedValue(mockSubscription),
      update: jest.fn().mockResolvedValue(mockSubscription),
      cancel: jest.fn().mockResolvedValue({ ...mockSubscription, status: 'canceled' }),
    },
    
    prices: {
      list: jest.fn().mockResolvedValue({
        data: [mockPrices.monthly, mockPrices.annual],
      }),
      retrieve: jest.fn((id) => {
        if (id === 'price_monthly') return Promise.resolve(mockPrices.monthly)
        if (id === 'price_annual') return Promise.resolve(mockPrices.annual)
        return Promise.reject(new Error('Price not found'))
      }),
    },
    
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue(mockCheckoutSession),
        retrieve: jest.fn().mockResolvedValue(mockCheckoutSession),
      },
    },
    
    billingPortal: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          id: 'bps_test123',
          object: 'billing_portal.session',
          url: 'https://billing.stripe.com/session/test_123',
        }),
      },
    },
    
    webhookEndpoints: {
      create: jest.fn(),
      del: jest.fn(),
    },
    
    // Helper for webhook signature verification
    webhooks: {
      constructEvent: jest.fn((payload, signature, secret) => {
        // Simulate signature verification
        if (signature.includes('invalid')) {
          throw new Error('Invalid signature')
        }
        return JSON.parse(payload)
      }),
    },
  }
}

// Mock Supabase client for subscription tests
export function createMockSupabaseClient() {
  return {
    from: jest.fn((table) => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        })),
      })),
      insert: jest.fn(() => ({
        single: jest.fn().mockResolvedValue({
          data: { id: 'test_id' },
          error: null,
        }),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: { id: 'test_id' },
            error: null,
          }),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        })),
      })),
    })),
    
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: {
          user: {
            id: 'user_123',
            email: 'test@example.com',
          },
        },
        error: null,
      }),
    },
  }
}

// Test data generators
export function generateCheckoutSession(overrides = {}) {
  return {
    ...mockCheckoutSession,
    id: `cs_test_${Date.now()}`,
    ...overrides,
  }
}

export function generateSubscription(overrides = {}) {
  return {
    ...mockSubscription,
    id: `sub_test_${Date.now()}`,
    ...overrides,
  }
}

export function generateWebhookEvent(type: string, data: any) {
  return {
    id: `evt_test_${Date.now()}`,
    object: 'event',
    type,
    created: Math.floor(Date.now() / 1000),
    data: {
      object: data,
    },
  }
}