import { NextRequest } from 'next/server'
import { POST } from '@/app/api/stripe/create-checkout-session/route'
import { createMockStripeClient, createMockSupabaseClient } from '../../fixtures/stripe'

// Mock the Stripe module
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => createMockStripeClient())
})

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => createMockSupabaseClient()),
}))

describe('POST /api/stripe/create-checkout-session', () => {
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
  
  it('creates checkout session for monthly plan', async () => {
    const request = new NextRequest('http://localhost:3005/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'price_monthly',
        successUrl: 'http://localhost:3005/payment/success',
        cancelUrl: 'http://localhost:3005/payment/cancel',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('sessionId')
    expect(data).toHaveProperty('url')
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: 'price_monthly',
        quantity: 1,
      }],
      success_url: 'http://localhost:3005/payment/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3005/payment/cancel',
      customer_email: 'test@example.com',
      metadata: {
        userId: 'user_123',
      },
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          userId: 'user_123',
        },
      },
      allow_promotion_codes: true,
    })
  })
  
  it('creates checkout session for annual plan', async () => {
    const request = new NextRequest('http://localhost:3005/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'price_annual',
        successUrl: 'http://localhost:3005/payment/success',
        cancelUrl: 'http://localhost:3005/payment/cancel',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('sessionId')
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{
          price: 'price_annual',
          quantity: 1,
        }],
      })
    )
  })
  
  it('requires authentication', async () => {
    // Mock unauthenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })
    
    const request = new NextRequest('http://localhost:3005/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'price_monthly',
        successUrl: 'http://localhost:3005/payment/success',
        cancelUrl: 'http://localhost:3005/payment/cancel',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
    expect(mockStripe.checkout.sessions.create).not.toHaveBeenCalled()
  })
  
  it('validates required fields', async () => {
    const request = new NextRequest('http://localhost:3005/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Missing priceId
        successUrl: 'http://localhost:3005/payment/success',
        cancelUrl: 'http://localhost:3005/payment/cancel',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing required fields')
    expect(mockStripe.checkout.sessions.create).not.toHaveBeenCalled()
  })
  
  it('validates price ID', async () => {
    const request = new NextRequest('http://localhost:3005/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'invalid_price_id',
        successUrl: 'http://localhost:3005/payment/success',
        cancelUrl: 'http://localhost:3005/payment/cancel',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid price ID')
  })
  
  it('prevents duplicate active subscriptions', async () => {
    // Mock existing active subscription
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              subscription_status: 'active',
              subscription_end_date: new Date(Date.now() + 86400000).toISOString(),
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'price_monthly',
        successUrl: 'http://localhost:3005/payment/success',
        cancelUrl: 'http://localhost:3005/payment/cancel',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toBe('User already has an active subscription')
    expect(mockStripe.checkout.sessions.create).not.toHaveBeenCalled()
  })
  
  it('handles Stripe API errors gracefully', async () => {
    const stripeError = new Error('Invalid API key')
    stripeError.name = 'StripeAuthenticationError'
    mockStripe.checkout.sessions.create.mockRejectedValue(stripeError)
    
    const request = new NextRequest('http://localhost:3005/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'price_monthly',
        successUrl: 'http://localhost:3005/payment/success',
        cancelUrl: 'http://localhost:3005/payment/cancel',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to create checkout session')
  })
  
  it('applies coupon code if provided', async () => {
    const request = new NextRequest('http://localhost:3005/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'price_monthly',
        successUrl: 'http://localhost:3005/payment/success',
        cancelUrl: 'http://localhost:3005/payment/cancel',
        couponCode: 'SAVE20',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        discounts: [{
          coupon: 'SAVE20',
        }],
      })
    )
  })
  
  it('handles existing Stripe customer', async () => {
    // Mock profile with Stripe customer ID
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              stripe_customer_id: 'cus_existing123',
              subscription_status: null,
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'price_monthly',
        successUrl: 'http://localhost:3005/payment/success',
        cancelUrl: 'http://localhost:3005/payment/cancel',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: 'cus_existing123',
        customer_email: undefined, // Don't pass email when customer exists
      })
    )
  })
  
  it('includes referral tracking in metadata', async () => {
    const request = new NextRequest('http://localhost:3005/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'price_monthly',
        successUrl: 'http://localhost:3005/payment/success',
        cancelUrl: 'http://localhost:3005/payment/cancel',
        referralCode: 'REF123',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: {
          userId: 'user_123',
          referralCode: 'REF123',
        },
      })
    )
  })
})