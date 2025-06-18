import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SubscriptionManager } from '../SubscriptionManager'
import { useSubscription } from '@/hooks/useSubscription'

// Mock the subscription hook
jest.mock('@/hooks/useSubscription', () => ({
  useSubscription: jest.fn()
}))

// Mock fetch
global.fetch = jest.fn()

describe('SubscriptionManager', () => {
  const mockUseSubscription = useSubscription as jest.MockedFunction<typeof useSubscription>
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>

  // Store original location
  const originalLocation = window.location

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock window.location.href
    delete (window as any).location
    ;(window as any).location = {
      href: 'http://localhost:3000/dashboard'
    }
  })

  afterEach(() => {
    // Restore original location
    window.location = originalLocation
  })

  describe('when loading', () => {
    it('should show loading skeleton', () => {
      mockUseSubscription.mockReturnValue({
        subscription: null,
        isLoading: true,
        error: null,
        refresh: jest.fn()
      } as any)

      const { container } = render(<SubscriptionManager />)

      // Check for the loading animation
      const loadingContainer = container.querySelector('.animate-pulse')
      expect(loadingContainer).toBeInTheDocument()
      expect(screen.queryByText('Subscription')).not.toBeInTheDocument()
    })
  })

  describe('when there is an error', () => {
    it('should display error message', () => {
      mockUseSubscription.mockReturnValue({
        subscription: null,
        isLoading: false,
        error: 'Failed to load subscription',
        refresh: jest.fn()
      } as any)

      render(<SubscriptionManager />)

      expect(screen.getByText('Error loading subscription: Failed to load subscription')).toBeInTheDocument()
      expect(screen.getByText('Try again')).toBeInTheDocument()
    })

    it('should call refresh when clicking try again', () => {
      const mockRefresh = jest.fn()
      mockUseSubscription.mockReturnValue({
        subscription: null,
        isLoading: false,
        error: 'Network error',
        refresh: mockRefresh
      } as any)

      render(<SubscriptionManager />)

      fireEvent.click(screen.getByText('Try again'))

      expect(mockRefresh).toHaveBeenCalledTimes(1)
    })

    it('should have proper error styling', () => {
      mockUseSubscription.mockReturnValue({
        subscription: null,
        isLoading: false,
        error: 'Something went wrong',
        refresh: jest.fn()
      } as any)

      render(<SubscriptionManager />)

      const errorContainer = screen.getByText('Error loading subscription: Something went wrong').parentElement
      expect(errorContainer).toHaveClass('bg-red-50', 'border-red-200')
    })
  })

  describe('when subscription is null', () => {
    it('should render nothing', () => {
      mockUseSubscription.mockReturnValue({
        subscription: null,
        isLoading: false,
        error: null,
        refresh: jest.fn()
      } as any)

      const { container } = render(<SubscriptionManager />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('with free tier subscription', () => {
    it('should show free tier info and upgrade button', () => {
      mockUseSubscription.mockReturnValue({
        subscription: {
          tier: 'free',
          status: 'active',
          isActive: true,
          canAccessPremium: false
        },
        isLoading: false,
        error: null,
        refresh: jest.fn()
      } as any)

      render(<SubscriptionManager />)

      expect(screen.getByText('Subscription')).toBeInTheDocument()
      expect(screen.getByText('Current Plan')).toBeInTheDocument()
      expect(screen.getByText('Free')).toBeInTheDocument()
      expect(screen.getByText('Upgrade to Premium')).toBeInTheDocument()
      expect(screen.getByText('Upgrade to Premium')).toHaveAttribute('href', '/pricing')
    })
  })

  describe('with premium subscription', () => {
    it('should show premium info and manage button', () => {
      mockUseSubscription.mockReturnValue({
        subscription: {
          tier: 'premium',
          status: 'active',
          isActive: true,
          canAccessPremium: true
        },
        isLoading: false,
        error: null,
        refresh: jest.fn()
      } as any)

      render(<SubscriptionManager />)

      expect(screen.getByText('Premium')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText('Manage Subscription')).toBeInTheDocument()
    })

    it('should handle manage subscription click', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: 'https://billing.stripe.com/portal' })
      } as Response)

      mockUseSubscription.mockReturnValue({
        subscription: {
          tier: 'premium',
          status: 'active',
          isActive: true,
          canAccessPremium: true
        },
        isLoading: false,
        error: null,
        refresh: jest.fn()
      } as any)

      render(<SubscriptionManager />)

      fireEvent.click(screen.getByText('Manage Subscription'))

      expect(screen.getByText('Loading...')).toBeInTheDocument()

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/stripe/create-portal-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            returnUrl: window.location.href,
          }),
        })
      })

      // Note: window.location.href assignment doesn't actually navigate in jsdom
      // The important thing is that the API was called correctly
    })

    it('should handle portal session creation error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Portal creation failed' })
      } as Response)

      // Mock window.alert
      window.alert = jest.fn()

      mockUseSubscription.mockReturnValue({
        subscription: {
          tier: 'premium',
          status: 'active',
          isActive: true,
          canAccessPremium: true
        },
        isLoading: false,
        error: null,
        refresh: jest.fn()
      } as any)

      render(<SubscriptionManager />)

      fireEvent.click(screen.getByText('Manage Subscription'))

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Portal creation failed')
      })
    })

    it('should show canceled status correctly', () => {
      mockUseSubscription.mockReturnValue({
        subscription: {
          tier: 'premium',
          status: 'canceled',
          isActive: false,
          canAccessPremium: true,
          endDate: new Date('2024-12-31'),
          daysRemaining: 15
        },
        isLoading: false,
        error: null,
        refresh: jest.fn()
      } as any)

      render(<SubscriptionManager />)

      expect(screen.getByText('Canceled')).toBeInTheDocument()
      expect(screen.getByText('Access Until')).toBeInTheDocument()
      expect(screen.getByText(/15 days remaining/)).toBeInTheDocument()
    })

    it('should show payment update required warning', () => {
      mockUseSubscription.mockReturnValue({
        subscription: {
          tier: 'premium',
          status: 'past_due',
          isActive: true,
          canAccessPremium: true,
          requiresPaymentUpdate: true
        },
        isLoading: false,
        error: null,
        refresh: jest.fn()
      } as any)

      render(<SubscriptionManager />)

      expect(screen.getByText('Past Due')).toBeInTheDocument()
      expect(screen.getByText('Payment update required')).toBeInTheDocument()
    })
  })

  describe('premium features display', () => {
    it('should show premium features when user can access premium', () => {
      mockUseSubscription.mockReturnValue({
        subscription: {
          tier: 'premium',
          status: 'active',
          isActive: true,
          canAccessPremium: true
        },
        isLoading: false,
        error: null,
        refresh: jest.fn()
      } as any)

      render(<SubscriptionManager />)

      expect(screen.getByText('Premium Features')).toBeInTheDocument()
      expect(screen.getByText('✓ Unlimited practice problems')).toBeInTheDocument()
      expect(screen.getByText('✓ Step-by-step solutions')).toBeInTheDocument()
      expect(screen.getByText('✓ Full progress tracking')).toBeInTheDocument()
      expect(screen.getByText('✓ Download worksheets')).toBeInTheDocument()
      expect(screen.getByText('✓ Priority support')).toBeInTheDocument()
    })

    it('should not show priority support for non-premium tiers with access', () => {
      mockUseSubscription.mockReturnValue({
        subscription: {
          tier: 'trial',
          status: 'active',
          isActive: true,
          canAccessPremium: true
        },
        isLoading: false,
        error: null,
        refresh: jest.fn()
      } as any)

      render(<SubscriptionManager />)

      expect(screen.getByText('✓ Unlimited practice problems')).toBeInTheDocument()
      expect(screen.queryByText('✓ Priority support')).not.toBeInTheDocument()
    })
  })
})