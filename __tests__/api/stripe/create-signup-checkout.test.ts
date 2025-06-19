import { NextRequest } from 'next/server'
import { POST } from '@/app/api/stripe/create-signup-checkout/route'

// Mock Stripe
const mockCheckoutSessionCreate = jest.fn()
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: mockCheckoutSessionCreate,
      },
    },
  }))
})

describe('POST /api/stripe/create-signup-checkout', () => {
  const mockOrigin = 'http://localhost:3005'
  
  beforeEach(() => {
    jest.clearAllMocks()
    // Set up default successful response
    mockCheckoutSessionCreate.mockResolvedValue({
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/pay/cs_test_123',
    })
  })

  it('creates checkout session with monthly plan by default', async () => {
    const request = new NextRequest(`${mockOrigin}/api/stripe/create-signup-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        fullName: 'Test User',
        gradeLevel: '7',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('sessionId', 'cs_test_123')
    expect(data).toHaveProperty('url')
    
    expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY,
          quantity: 1,
        }],
      })
    )
  })

  it('creates checkout session with annual plan when specified', async () => {
    const request = new NextRequest(`${mockOrigin}/api/stripe/create-signup-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        fullName: 'Test User',
        gradeLevel: '8',
        planType: 'annual',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('sessionId')
    
    expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL,
          quantity: 1,
        }],
      })
    )
  })

  it('validates required fields', async () => {
    const request = new NextRequest(`${mockOrigin}/api/stripe/create-signup-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        // Missing fullName and gradeLevel
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing required fields')
    expect(mockCheckoutSessionCreate).not.toHaveBeenCalled()
  })

  it('rejects invalid plan types', async () => {
    const request = new NextRequest(`${mockOrigin}/api/stripe/create-signup-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        fullName: 'Test User',
        gradeLevel: '7',
        planType: 'invalid',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid plan type. Must be "monthly" or "annual"')
    expect(mockCheckoutSessionCreate).not.toHaveBeenCalled()
  })

  it('handles missing price ID configuration', async () => {
    // Temporarily unset the env var
    const originalMonthlyPrice = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
    delete process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY

    const request = new NextRequest(`${mockOrigin}/api/stripe/create-signup-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        fullName: 'Test User',
        gradeLevel: '7',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Payment configuration error. Price ID not found.')
    expect(mockCheckoutSessionCreate).not.toHaveBeenCalled()

    // Restore env var
    process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY = originalMonthlyPrice
  })

  it('handles Stripe API errors gracefully', async () => {
    mockCheckoutSessionCreate.mockRejectedValue(new Error('Stripe API error'))

    const request = new NextRequest(`${mockOrigin}/api/stripe/create-signup-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        fullName: 'Test User',
        gradeLevel: '7',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to create checkout session')
  })

  it('includes all metadata in checkout session', async () => {
    const request = new NextRequest(`${mockOrigin}/api/stripe/create-signup-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        fullName: 'Test User',
        gradeLevel: '7',
        planType: 'monthly',
      }),
    })

    await POST(request)

    expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_email: 'test@example.com',
        metadata: {
          email: 'test@example.com',
          fullName: 'Test User',
          gradeLevel: '7',
          isSignup: 'true',
        },
        subscription_data: {
          metadata: {
            email: 'test@example.com',
            fullName: 'Test User',
            gradeLevel: '7',
          },
        },
      })
    )
  })
})