import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { SubscriptionProvider, useSubscription } from '../SubscriptionContext'
import { User } from '@supabase/supabase-js'
import { getSubscriptionStatus } from '@/lib/subscription'

// Mock the dependencies
jest.mock('@/lib/subscription', () => ({
  getSubscriptionStatus: jest.fn()
}))

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis()
    })),
    removeChannel: jest.fn()
  }))
}))

// Test component that uses the subscription context
function TestComponent() {
  const { subscription, tier, canAccessPremium, isLoading, error, refresh } = useSubscription()
  
  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <div data-testid="tier">{tier}</div>
      <div data-testid="can-access-premium">{canAccessPremium.toString()}</div>
      <div data-testid="subscription">{subscription ? 'has-subscription' : 'no-subscription'}</div>
      <button onClick={refresh}>Refresh</button>
    </div>
  )
}

describe('SubscriptionContext', () => {
  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01'
  }

  const mockGetSubscriptionStatus = getSubscriptionStatus as jest.MockedFunction<typeof getSubscriptionStatus>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when user is not authenticated', () => {
    it('should have default values with no error', () => {
      render(
        <SubscriptionProvider user={null}>
          <TestComponent />
        </SubscriptionProvider>
      )

      expect(screen.getByTestId('loading')).toHaveTextContent('false')
      expect(screen.getByTestId('error')).toHaveTextContent('no-error')
      expect(screen.getByTestId('tier')).toHaveTextContent('free')
      expect(screen.getByTestId('can-access-premium')).toHaveTextContent('false')
      expect(screen.getByTestId('subscription')).toHaveTextContent('no-subscription')
    })
  })

  describe('when fetching subscription succeeds', () => {
    it('should load subscription data without error', async () => {
      mockGetSubscriptionStatus.mockResolvedValueOnce({
        subscription: {
          id: 'sub_123',
          user_id: 'test-user-id',
          stripe_subscription_id: 'stripe_123',
          stripe_customer_id: 'cus_123',
          status: 'active',
          current_period_end: new Date('2024-12-31'),
          subscription_tier: 'premium',
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01')
        },
        tier: 'premium',
        canAccessPremium: true
      })

      render(
        <SubscriptionProvider user={mockUser}>
          <TestComponent />
        </SubscriptionProvider>
      )

      expect(screen.getByTestId('loading')).toHaveTextContent('true')

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
      })

      expect(screen.getByTestId('error')).toHaveTextContent('no-error')
      expect(screen.getByTestId('tier')).toHaveTextContent('premium')
      expect(screen.getByTestId('can-access-premium')).toHaveTextContent('true')
      expect(screen.getByTestId('subscription')).toHaveTextContent('has-subscription')
    })
  })

  describe('when fetching subscription fails', () => {
    it('should set error state and default to free tier', async () => {
      mockGetSubscriptionStatus.mockRejectedValueOnce(new Error('Network error'))

      render(
        <SubscriptionProvider user={mockUser}>
          <TestComponent />
        </SubscriptionProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
      })

      expect(screen.getByTestId('error')).toHaveTextContent('Network error')
      expect(screen.getByTestId('tier')).toHaveTextContent('free')
      expect(screen.getByTestId('can-access-premium')).toHaveTextContent('false')
      expect(screen.getByTestId('subscription')).toHaveTextContent('no-subscription')
    })

    it('should handle non-Error exceptions', async () => {
      mockGetSubscriptionStatus.mockRejectedValueOnce('String error')

      render(
        <SubscriptionProvider user={mockUser}>
          <TestComponent />
        </SubscriptionProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
      })

      expect(screen.getByTestId('error')).toHaveTextContent('Failed to load subscription')
      expect(screen.getByTestId('tier')).toHaveTextContent('free')
    })
  })

  describe('refresh functionality', () => {
    it('should clear error on successful refresh', async () => {
      // First fail
      mockGetSubscriptionStatus.mockRejectedValueOnce(new Error('Initial error'))

      const { rerender } = render(
        <SubscriptionProvider user={mockUser}>
          <TestComponent />
        </SubscriptionProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Initial error')
      })

      // Then succeed on refresh
      mockGetSubscriptionStatus.mockResolvedValueOnce({
        subscription: null,
        tier: 'free',
        canAccessPremium: false
      })

      await act(async () => {
        screen.getByText('Refresh').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('no-error')
      })

      expect(screen.getByTestId('tier')).toHaveTextContent('free')
    })

    it('should set loading state during refresh', async () => {
      mockGetSubscriptionStatus.mockResolvedValue({
        subscription: null,
        tier: 'free',
        canAccessPremium: false
      })

      render(
        <SubscriptionProvider user={mockUser}>
          <TestComponent />
        </SubscriptionProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
      })

      // Mock a delayed response
      mockGetSubscriptionStatus.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          subscription: null,
          tier: 'free',
          canAccessPremium: false
        }), 100))
      )

      act(() => {
        screen.getByText('Refresh').click()
      })

      expect(screen.getByTestId('loading')).toHaveTextContent('true')

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
      })
    })
  })

  describe('context usage outside provider', () => {
    it('should use default values when used outside provider', () => {
      render(<TestComponent />)

      // Since we have a default context value, it won't throw
      // but will use the default values
      expect(screen.getByTestId('loading')).toHaveTextContent('true')
      expect(screen.getByTestId('error')).toHaveTextContent('no-error')
      expect(screen.getByTestId('tier')).toHaveTextContent('free')
      expect(screen.getByTestId('can-access-premium')).toHaveTextContent('false')
      expect(screen.getByTestId('subscription')).toHaveTextContent('no-subscription')
    })
  })
})