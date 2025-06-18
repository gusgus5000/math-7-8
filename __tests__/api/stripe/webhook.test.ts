import { NextRequest } from 'next/server'
import { POST } from '@/app/api/stripe/webhook/route'
import { createMockStripeClient, createMockSupabaseClient, webhookEvents } from '../../fixtures/stripe'
import { createHmac } from 'crypto'

// Mock the Stripe module
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => createMockStripeClient())
})

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => createMockSupabaseClient()),
}))

describe('POST /api/stripe/webhook', () => {
  let mockStripe: any
  let mockSupabase: any
  const webhookSecret = 'whsec_test_secret'
  
  beforeEach(() => {
    jest.clearAllMocks()
    mockStripe = createMockStripeClient()
    mockSupabase = createMockSupabaseClient()
    process.env.STRIPE_WEBHOOK_SECRET = webhookSecret
  })
  
  // Helper to generate valid webhook signature
  function generateSignature(payload: string): string {
    const timestamp = Math.floor(Date.now() / 1000)
    const signedPayload = `${timestamp}.${payload}`
    const signature = createHmac('sha256', webhookSecret)
      .update(signedPayload)
      .digest('hex')
    return `t=${timestamp},v1=${signature}`
  }
  
  it('handles checkout.session.completed event', async () => {
    const event = webhookEvents.checkoutComplete
    const payload = JSON.stringify(event)
    const signature = generateSignature(payload)
    
    // Mock webhook construction
    mockStripe.webhooks.constructEvent.mockReturnValue(event)
    
    const request = new NextRequest('http://localhost:3005/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': signature,
        'Content-Type': 'application/json',
      },
      body: payload,
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
    
    // Verify profile update was called
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
    expect(mockSupabase.from().update).toHaveBeenCalledWith({
      stripe_customer_id: event.data.object.customer,
      subscription_status: 'active',
      subscription_id: event.data.object.subscription,
      updated_at: expect.any(String),
    })
  })
  
  it('handles customer.subscription.updated event', async () => {
    const event = webhookEvents.subscriptionUpdated
    const payload = JSON.stringify(event)
    const signature = generateSignature(payload)
    
    mockStripe.webhooks.constructEvent.mockReturnValue(event)
    
    // Mock customer retrieval
    mockStripe.customers.retrieve.mockResolvedValue({
      id: 'cus_test123',
      metadata: { userId: 'user_123' },
    })
    
    const request = new NextRequest('http://localhost:3005/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': signature,
        'Content-Type': 'application/json',
      },
      body: payload,
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
    
    // Verify subscription status update
    expect(mockSupabase.from().update).toHaveBeenCalledWith({
      subscription_status: 'past_due',
      subscription_end_date: expect.any(String),
      updated_at: expect.any(String),
    })
  })
  
  it('handles customer.subscription.deleted event', async () => {
    const event = webhookEvents.subscriptionDeleted
    const payload = JSON.stringify(event)
    const signature = generateSignature(payload)
    
    mockStripe.webhooks.constructEvent.mockReturnValue(event)
    
    // Mock customer retrieval
    mockStripe.customers.retrieve.mockResolvedValue({
      id: 'cus_test123',
      metadata: { userId: 'user_123' },
    })
    
    const request = new NextRequest('http://localhost:3005/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': signature,
        'Content-Type': 'application/json',
      },
      body: payload,
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
    
    // Verify subscription cancellation
    expect(mockSupabase.from().update).toHaveBeenCalledWith({
      subscription_status: 'canceled',
      subscription_end_date: expect.any(String),
      updated_at: expect.any(String),
    })
  })
  
  it('handles invoice.payment_failed event', async () => {
    const event = webhookEvents.paymentFailed
    const payload = JSON.stringify(event)
    const signature = generateSignature(payload)
    
    mockStripe.webhooks.constructEvent.mockReturnValue(event)
    
    // Mock customer retrieval
    mockStripe.customers.retrieve.mockResolvedValue({
      id: 'cus_test123',
      email: 'test@example.com',
      metadata: { userId: 'user_123' },
    })
    
    const request = new NextRequest('http://localhost:3005/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': signature,
        'Content-Type': 'application/json',
      },
      body: payload,
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
    expect(data.emailSent).toBe(true) // Should send payment failure email
    
    // Verify subscription status update
    expect(mockSupabase.from().update).toHaveBeenCalledWith({
      subscription_status: 'past_due',
      updated_at: expect.any(String),
    })
  })
  
  it('validates webhook signature', async () => {
    const event = webhookEvents.checkoutComplete
    const payload = JSON.stringify(event)
    
    // Invalid signature
    const request = new NextRequest('http://localhost:3005/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'invalid_signature',
        'Content-Type': 'application/json',
      },
      body: payload,
    })
    
    // Mock signature verification failure
    mockStripe.webhooks.constructEvent.mockImplementation(() => {
      throw new Error('Invalid signature')
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid signature')
    
    // Ensure no database updates occurred
    expect(mockSupabase.from).not.toHaveBeenCalled()
  })
  
  it('handles replay attacks', async () => {
    const event = webhookEvents.checkoutComplete
    const payload = JSON.stringify(event)
    
    // Create an old timestamp (6 minutes ago)
    const oldTimestamp = Math.floor(Date.now() / 1000) - 360
    const signedPayload = `${oldTimestamp}.${payload}`
    const signature = createHmac('sha256', webhookSecret)
      .update(signedPayload)
      .digest('hex')
    const oldSignature = `t=${oldTimestamp},v1=${signature}`
    
    const request = new NextRequest('http://localhost:3005/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': oldSignature,
        'Content-Type': 'application/json',
      },
      body: payload,
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toContain('timestamp')
  })
  
  it('processes events idempotently', async () => {
    const event = webhookEvents.checkoutComplete
    const payload = JSON.stringify(event)
    const signature = generateSignature(payload)
    
    mockStripe.webhooks.constructEvent.mockReturnValue(event)
    
    // First request
    const request1 = new NextRequest('http://localhost:3005/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': signature,
        'Content-Type': 'application/json',
      },
      body: payload,
    })
    
    const response1 = await POST(request1)
    expect(response1.status).toBe(200)
    
    // Second request with same event ID
    const request2 = new NextRequest('http://localhost:3005/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': signature,
        'Content-Type': 'application/json',
      },
      body: payload,
    })
    
    const response2 = await POST(request2)
    expect(response2.status).toBe(200)
    
    // Verify database was only updated once
    expect(mockSupabase.from).toHaveBeenCalledTimes(2) // Once for check, once for update
  })
  
  it('handles unknown event types gracefully', async () => {
    const unknownEvent = {
      id: 'evt_unknown',
      type: 'unknown.event.type',
      data: { object: {} },
    }
    const payload = JSON.stringify(unknownEvent)
    const signature = generateSignature(payload)
    
    mockStripe.webhooks.constructEvent.mockReturnValue(unknownEvent)
    
    const request = new NextRequest('http://localhost:3005/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': signature,
        'Content-Type': 'application/json',
      },
      body: payload,
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
    expect(data.message).toBe('Unhandled event type')
  })
  
  it('handles missing customer metadata gracefully', async () => {
    const event = webhookEvents.subscriptionCreated
    const payload = JSON.stringify(event)
    const signature = generateSignature(payload)
    
    mockStripe.webhooks.constructEvent.mockReturnValue(event)
    
    // Mock customer without userId metadata
    mockStripe.customers.retrieve.mockResolvedValue({
      id: 'cus_test123',
      email: 'test@example.com',
      metadata: {}, // No userId
    })
    
    const request = new NextRequest('http://localhost:3005/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': signature,
        'Content-Type': 'application/json',
      },
      body: payload,
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toBe('Customer missing userId metadata')
  })
  
  it('logs webhook processing errors', async () => {
    const event = webhookEvents.checkoutComplete
    const payload = JSON.stringify(event)
    const signature = generateSignature(payload)
    
    mockStripe.webhooks.constructEvent.mockReturnValue(event)
    
    // Mock database error
    mockSupabase.from.mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      }),
    })
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    const request = new NextRequest('http://localhost:3005/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': signature,
        'Content-Type': 'application/json',
      },
      body: payload,
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(500)
    expect(data.error).toBe('Webhook processing failed')
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Webhook error'),
      expect.any(Error)
    )
    
    consoleSpy.mockRestore()
  })
})