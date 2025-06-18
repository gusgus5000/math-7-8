import { NextRequest } from 'next/server'
import { POST } from '@/app/api/stripe/create-portal-session/route'
import { createMockStripeClient, createMockSupabaseClient } from '../../fixtures/stripe'

// Mock the Stripe module
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => createMockStripeClient())
})

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => createMockSupabaseClient()),
}))

describe('POST /api/stripe/create-portal-session', () => {
  let mockStripe: any
  let mockSupabase: any
  
  beforeEach(() => {
    jest.clearAllMocks()
    mockStripe = createMockStripeClient()
    mockSupabase = createMockSupabaseClient()
    
    // Set up default auth response
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'user_123',
          email: 'test@example.com',
        },
      },
      error: null,
    })
  })
  
  it('creates portal session for existing customer', async () => {
    // Mock profile with Stripe customer ID
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              stripe_customer_id: 'cus_test123',
              subscription_status: 'active',
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: 'http://localhost:3005/settings',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('url')
    expect(mockStripe.billingPortal.sessions.create).toHaveBeenCalledWith({
      customer: 'cus_test123',
      return_url: 'http://localhost:3005/settings',
    })
  })
  
  it('requires authentication', async () => {
    // Mock unauthenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })
    
    const request = new NextRequest('http://localhost:3005/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: 'http://localhost:3005/settings',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
    expect(mockStripe.billingPortal.sessions.create).not.toHaveBeenCalled()
  })
  
  it('handles user without Stripe customer', async () => {
    // Mock profile without Stripe customer ID
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              stripe_customer_id: null,
              subscription_status: null,
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: 'http://localhost:3005/settings',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toBe('No Stripe customer found')
    expect(mockStripe.billingPortal.sessions.create).not.toHaveBeenCalled()
  })
  
  it('validates return URL', async () => {
    // Mock profile with Stripe customer ID
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              stripe_customer_id: 'cus_test123',
              subscription_status: 'active',
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Missing returnUrl
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toBe('Return URL is required')
  })
  
  it('handles Stripe API errors gracefully', async () => {
    // Mock profile with Stripe customer ID
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              stripe_customer_id: 'cus_test123',
              subscription_status: 'active',
            },
            error: null,
          }),
        }),
      }),
    })
    
    // Mock Stripe error
    const stripeError = new Error('Customer not found')
    stripeError.name = 'StripeInvalidRequestError'
    mockStripe.billingPortal.sessions.create.mockRejectedValue(stripeError)
    
    const request = new NextRequest('http://localhost:3005/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: 'http://localhost:3005/settings',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to create portal session')
  })
  
  it('includes configuration for specific flows', async () => {
    // Mock profile with Stripe customer ID
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              stripe_customer_id: 'cus_test123',
              subscription_status: 'active',
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: 'http://localhost:3005/settings',
        flow: 'subscription_cancel',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(mockStripe.billingPortal.sessions.create).toHaveBeenCalledWith({
      customer: 'cus_test123',
      return_url: 'http://localhost:3005/settings',
      flow_data: {
        type: 'subscription_cancel',
        subscription_cancel: {
          subscription: expect.any(String),
        },
      },
    })
  })
  
  it('handles database errors gracefully', async () => {
    // Mock database error
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: 'http://localhost:3005/settings',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to retrieve customer information')
    expect(mockStripe.billingPortal.sessions.create).not.toHaveBeenCalled()
  })
  
  it('allows access for users with canceled subscriptions', async () => {
    // Mock profile with canceled subscription
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              stripe_customer_id: 'cus_test123',
              subscription_status: 'canceled',
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: 'http://localhost:3005/settings',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('url')
    expect(mockStripe.billingPortal.sessions.create).toHaveBeenCalled()
  })
})