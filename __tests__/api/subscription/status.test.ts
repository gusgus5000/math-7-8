import { NextRequest } from 'next/server'
import { GET } from '@/app/api/subscription/status/route'
import { createMockSupabaseClient } from '../../fixtures/stripe'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => createMockSupabaseClient()),
}))

describe('GET /api/subscription/status', () => {
  let mockSupabase: any
  
  beforeEach(() => {
    jest.clearAllMocks()
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
  
  it('returns free tier for user without subscription', async () => {
    // Mock profile without subscription
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              subscription_status: null,
              subscription_end_date: null,
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/subscription/status')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toEqual({
      tier: 'free',
      status: 'active',
      isActive: true,
      canAccessPremium: false,
    })
  })
  
  it('returns premium tier for active subscription', async () => {
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    
    // Mock profile with active subscription
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              subscription_status: 'active',
              subscription_end_date: endDate.toISOString(),
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/subscription/status')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toEqual({
      tier: 'premium',
      status: 'active',
      isActive: true,
      canAccessPremium: true,
      endDate: endDate.toISOString(),
    })
  })
  
  it('returns trial tier with days remaining', async () => {
    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    
    // Mock profile with trial subscription
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              subscription_status: 'trialing',
              subscription_end_date: endDate.toISOString(),
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/subscription/status')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toEqual({
      tier: 'trial',
      status: 'trialing',
      isActive: true,
      canAccessPremium: true,
      endDate: endDate.toISOString(),
      trialDaysRemaining: 7,
    })
  })
  
  it('requires authentication', async () => {
    // Mock unauthenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })
    
    const request = new NextRequest('http://localhost:3005/api/subscription/status')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })
  
  it('handles past_due subscriptions', async () => {
    const endDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days grace period
    
    // Mock profile with past_due subscription
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              subscription_status: 'past_due',
              subscription_end_date: endDate.toISOString(),
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/subscription/status')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toEqual({
      tier: 'premium',
      status: 'past_due',
      isActive: false,
      canAccessPremium: true, // Grace period
      endDate: endDate.toISOString(),
      requiresPaymentUpdate: true,
    })
  })
  
  it('handles canceled subscriptions with remaining time', async () => {
    const endDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days left
    
    // Mock profile with canceled subscription
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              subscription_status: 'canceled',
              subscription_end_date: endDate.toISOString(),
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/subscription/status')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toEqual({
      tier: 'premium',
      status: 'canceled',
      isActive: false,
      canAccessPremium: true, // Until end date
      endDate: endDate.toISOString(),
      daysRemaining: 15,
    })
  })
  
  it('handles expired subscriptions', async () => {
    const endDate = new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    
    // Mock profile with expired subscription
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              subscription_status: 'canceled',
              subscription_end_date: endDate.toISOString(),
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/subscription/status')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toEqual({
      tier: 'free',
      status: 'expired',
      isActive: false,
      canAccessPremium: false,
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
    
    const request = new NextRequest('http://localhost:3005/api/subscription/status')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(500)
    expect(data).toEqual({
      tier: 'free',
      status: 'error',
      isActive: false,
      canAccessPremium: false,
      error: 'Failed to check subscription status',
    })
  })
  
  it('caches subscription status', async () => {
    // Mock profile with active subscription
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              subscription_status: 'active',
              subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/subscription/status')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    
    // Check cache headers
    expect(response.headers.get('Cache-Control')).toBe('private, max-age=60')
  })
  
  it('includes feature access information', async () => {
    // Mock profile with premium subscription
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              subscription_status: 'active',
              subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
            error: null,
          }),
        }),
      }),
    })
    
    const request = new NextRequest('http://localhost:3005/api/subscription/status', {
      headers: {
        'X-Include-Features': 'true',
      },
    })
    
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('features')
    expect(data.features).toEqual({
      practiceProblems: true,
      practiceLimit: null,
      solutionSteps: true,
      progressTracking: true,
      downloadWorksheets: true,
      customDifficulty: true,
      unlimitedPractice: true,
      advancedAnalytics: true,
      prioritySupport: true,
    })
  })
})