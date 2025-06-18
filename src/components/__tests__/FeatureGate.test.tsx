import { render, screen } from '@testing-library/react'
import FeatureGate from '../FeatureGate'
import { useSubscription } from '@/contexts/SubscriptionContext'

// Mock the subscription hook
jest.mock('@/contexts/SubscriptionContext', () => ({
  useSubscription: jest.fn()
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
})

describe('FeatureGate', () => {
  const mockUseSubscription = useSubscription as jest.MockedFunction<typeof useSubscription>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when loading', () => {
    it('should show loading spinner', () => {
      mockUseSubscription.mockReturnValue({
        subscription: null,
        tier: 'free',
        canAccessPremium: false,
        isLoading: true,
        error: null,
        refresh: jest.fn(),
      })

      const { container } = render(
        <FeatureGate>
          <div>Premium Content</div>
        </FeatureGate>
      )

      expect(container.querySelector('.animate-spin')).toBeInTheDocument()
      expect(screen.queryByText('Premium Content')).not.toBeInTheDocument()
    })
  })

  describe('when user has premium access', () => {
    beforeEach(() => {
      mockUseSubscription.mockReturnValue({
        subscription: {
          tier: 'premium',
          status: 'active',
          isActive: true,
          canAccessPremium: true
        },
        tier: 'premium',
        canAccessPremium: true,
        isLoading: false,
        error: null,
        refresh: jest.fn(),
      })
    })

    it('should render children when user has access', () => {
      render(
        <FeatureGate>
          <div>Premium Content</div>
        </FeatureGate>
      )

      expect(screen.getByText('Premium Content')).toBeInTheDocument()
      expect(screen.queryByText('Premium Feature')).not.toBeInTheDocument()
    })
  })

  describe('when user does not have premium access', () => {
    beforeEach(() => {
      mockUseSubscription.mockReturnValue({
        subscription: null,
        tier: 'free',
        canAccessPremium: false,
        isLoading: false,
        error: null,
        refresh: jest.fn(),
      })
    })

    it('should show upgrade prompt by default', () => {
      render(
        <FeatureGate>
          <div>Premium Content</div>
        </FeatureGate>
      )

      expect(screen.queryByText('Premium Content')).not.toBeInTheDocument()
      expect(screen.getByText('Premium Feature')).toBeInTheDocument()
      expect(screen.getByText('This feature is only available for premium subscribers.')).toBeInTheDocument()
      expect(screen.getByText('Upgrade Now')).toBeInTheDocument()
      expect(screen.getByText('Upgrade Now')).toHaveAttribute('href', '/pricing')
    })

    it('should render fallback when provided', () => {
      render(
        <FeatureGate fallback={<div>Free tier content</div>}>
          <div>Premium Content</div>
        </FeatureGate>
      )

      expect(screen.getByText('Free tier content')).toBeInTheDocument()
      expect(screen.queryByText('Premium Content')).not.toBeInTheDocument()
      expect(screen.queryByText('Premium Feature')).not.toBeInTheDocument()
    })

    it('should render nothing when showUpgradePrompt is false', () => {
      const { container } = render(
        <FeatureGate showUpgradePrompt={false}>
          <div>Premium Content</div>
        </FeatureGate>
      )

      expect(container.firstChild).toBeNull()
      expect(screen.queryByText('Premium Content')).not.toBeInTheDocument()
      expect(screen.queryByText('Premium Feature')).not.toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    it('should handle when subscription context has error', () => {
      mockUseSubscription.mockReturnValue({
        subscription: null,
        tier: 'free',
        canAccessPremium: false,
        isLoading: false,
        error: 'Failed to load subscription',
        refresh: jest.fn(),
      })

      render(
        <FeatureGate>
          <div>Premium Content</div>
        </FeatureGate>
      )

      // When there's an error, it should default to not having access
      expect(screen.queryByText('Premium Content')).not.toBeInTheDocument()
      expect(screen.getByText('Premium Feature')).toBeInTheDocument()
    })
  })

  describe('feature prop', () => {
    it('should default to premium feature', () => {
      mockUseSubscription.mockReturnValue({
        subscription: null,
        tier: 'free',
        canAccessPremium: false,
        isLoading: false,
        error: null,
        refresh: jest.fn(),
      })

      render(
        <FeatureGate>
          <div>Content</div>
        </FeatureGate>
      )

      // Currently the component only supports 'premium' feature
      expect(screen.getByText('Premium Feature')).toBeInTheDocument()
    })
  })
})