import { http, HttpResponse } from 'msw'
import { mockCustomer, mockSubscription, mockCheckoutSession, mockPrices } from '../fixtures/stripe'

// Base URL for API routes
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005'

export const handlers = [
  // Stripe checkout session creation
  http.post(`${baseUrl}/api/stripe/create-checkout-session`, async ({ request }) => {
    const body = await request.json() as any
    
    // Validate request
    if (!body.priceId || !body.userId) {
      return HttpResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check for test scenarios
    if (body.priceId === 'price_error') {
      return HttpResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      )
    }
    
    // Return mock checkout session
    return HttpResponse.json({
      sessionId: mockCheckoutSession.id,
      url: mockCheckoutSession.success_url,
    })
  }),
  
  // Customer portal session
  http.post(`${baseUrl}/api/stripe/create-portal-session`, async ({ request }) => {
    const body = await request.json() as any
    
    if (!body.customerId) {
      return HttpResponse.json(
        { error: 'Customer ID required' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      url: 'https://billing.stripe.com/session/test_123',
    })
  }),
  
  // Webhook endpoint
  http.post(`${baseUrl}/api/stripe/webhook`, async ({ request }) => {
    const signature = request.headers.get('stripe-signature')
    
    if (!signature || signature.includes('invalid')) {
      return HttpResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }
    
    // Process webhook based on event type
    const body = await request.json() as any
    
    switch (body.type) {
      case 'checkout.session.completed':
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        return HttpResponse.json({ received: true })
        
      case 'invoice.payment_failed':
        // Simulate notification sent
        return HttpResponse.json({ 
          received: true,
          notificationSent: true,
        })
        
      default:
        return HttpResponse.json(
          { error: 'Unhandled event type' },
          { status: 400 }
        )
    }
  }),
  
  // Subscription status check
  http.get(`${baseUrl}/api/subscription/status`, async ({ request }) => {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      return HttpResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }
    
    // Mock different subscription states based on userId
    if (userId === 'user_premium') {
      return HttpResponse.json({
        tier: 'premium',
        status: 'active',
        isActive: true,
        canAccessPremium: true,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }
    
    if (userId === 'user_trial') {
      return HttpResponse.json({
        tier: 'trial',
        status: 'trialing',
        isActive: true,
        canAccessPremium: true,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        trialDaysRemaining: 7,
      })
    }
    
    if (userId === 'user_expired') {
      return HttpResponse.json({
        tier: 'free',
        status: 'expired',
        isActive: false,
        canAccessPremium: false,
      })
    }
    
    // Default to free tier
    return HttpResponse.json({
      tier: 'free',
      status: 'active',
      isActive: true,
      canAccessPremium: false,
    })
  }),
  
  // Price list endpoint
  http.get(`${baseUrl}/api/stripe/prices`, async () => {
    return HttpResponse.json({
      prices: [
        {
          id: mockPrices.monthly.id,
          name: 'Monthly',
          amount: mockPrices.monthly.unit_amount,
          currency: mockPrices.monthly.currency,
          interval: mockPrices.monthly.recurring.interval,
        },
        {
          id: mockPrices.annual.id,
          name: 'Annual',
          amount: mockPrices.annual.unit_amount,
          currency: mockPrices.annual.currency,
          interval: mockPrices.annual.recurring.interval,
        },
      ],
    })
  }),
  
  // Account deletion
  http.delete(`${baseUrl}/api/account/delete`, async () => {
    // Simulate account deletion
    return HttpResponse.json({
      success: true,
      message: 'Account deleted successfully',
    })
  }),
  
  // Auth signout
  http.post(`${baseUrl}/api/auth/signout`, async () => {
    return HttpResponse.json({
      success: true,
    })
  }),
]

// Error handlers for testing error scenarios
export const errorHandlers = [
  http.post(`${baseUrl}/api/stripe/create-checkout-session`, () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }),
  
  http.post(`${baseUrl}/api/stripe/webhook`, () => {
    return HttpResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }),
  
  http.get(`${baseUrl}/api/subscription/status`, () => {
    return HttpResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    )
  }),
]